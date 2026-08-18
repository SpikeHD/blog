import { OnnxWebRuntime, PhonemizeWebRuntime, PiperWebEngine } from 'piper-tts-web'

const VOICE = 'en_US-hfc_male-medium'
const SPEAKER = 0
const MAX_CHUNK_LENGTH = 400

interface Message {
  type: 'speak' | 'next'
  text?: string
}

interface AudioChunk {
  audio: Float32Array
  sampleRate: number
}

let tts: PiperWebEngine | null = null
let chunks: string[] = []
let nextIndex = 0
let pending: Promise<AudioChunk | null> | null = null

function decodeWav(buffer: ArrayBuffer): AudioChunk {
  const view = new DataView(buffer)
  const sampleRate = view.getUint32(24, true)
  const channels = view.getUint16(22, true)
  const bitsPerSample = view.getUint16(34, true)

  const dataOffset = 44
  const sampleCount = (buffer.byteLength - dataOffset) / (bitsPerSample / 8)
  const audio = new Float32Array(channels === 1 ? sampleCount : sampleCount / channels)

  const bytesPerSample = bitsPerSample / 8
  for (let i = 0, j = 0; i < sampleCount; i += channels, j++) {
    let sample: number
    if (bytesPerSample === 2) {
      sample = view.getInt16(dataOffset + i * bytesPerSample, true) / 32768
    } else {
      sample = view.getUint8(dataOffset + i * bytesPerSample) / 128 - 1
    }
    audio[j] = sample
  }

  return { audio, sampleRate }
}

function splitIntoChunks(text: string): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+["')\]]*|[^.!?]+$/g) ?? [text]
  const chunks: string[] = []
  let current = ''

  for (const sentence of sentences) {
    const trimmed = sentence.trim()
    if (!trimmed) continue

    if (current && (current + ' ' + trimmed).length > MAX_CHUNK_LENGTH) {
      chunks.push(current.trim())
      current = trimmed
    } else {
      current = current ? current + ' ' + trimmed : trimmed
    }
  }

  if (current.trim()) chunks.push(current.trim())
  return chunks
}

async function init() {
  if (tts) return

  const origin = self.location.origin

  tts = new PiperWebEngine({
    onnxRuntime: new OnnxWebRuntime({ numThreads: 1, basePath: `${origin}/onnx/` }),
    phonemizeRuntime: new PhonemizeWebRuntime({ basePath: `${origin}/piper/` }),
  })
}

async function generate(index: number): Promise<AudioChunk> {
  if (!tts) await init()
  const { file } = await tts!.generate(chunks[index], VOICE, SPEAKER)
  return decodeWav(await file.arrayBuffer())
}

// Start generating the next chunk so it's ready the moment the current one ends.
function prepareNext(): Promise<AudioChunk | null> | null {
  if (nextIndex >= chunks.length) return null
  const index = nextIndex++
  pending = generate(index)
  return pending
}

self.onmessage = async (evt) => {
  const { type, text }: Message = evt.data

  if (type === 'speak') {
    chunks = splitIntoChunks(text ?? '')
    nextIndex = 0
  }

  const result = await (pending ?? prepareNext())
  pending = null

  if (!result) {
    self.postMessage({ type: 'done' })
    return
  }

  self.postMessage({ type: 'audio', ...result })
  prepareNext() // pre-generate the following chunk while this one plays
}
