export {}

type PiperModule = typeof import('piper-tts-web')
type PiperWebEngine = InstanceType<PiperModule['PiperWebEngine']>

const VOICE = 'en_US-hfc_male-medium'
const SPEAKER = 0
const MAX_CHUNK_LENGTH = 400
const PIPER_MODULE_URL = '/vendor/piper-tts-web.js'

interface Message {
  type: 'speak' | 'next'
  text?: string
}

interface AudioChunk {
  audio: Float32Array
  sampleRate: number
}

let tts: PiperWebEngine | null = null
let piperModule: Promise<PiperModule> | null = null
let chunks: string[] = []
let nextIndex = 0
let pending: Promise<AudioChunk | null> | null = null

function loadPiper(): Promise<PiperModule> {
  if (!piperModule) {
    const url = PIPER_MODULE_URL
    piperModule = import(/* turbopackIgnore: true */ /* webpackIgnore: true */ url) as Promise<PiperModule>
  }
  return piperModule
}

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

  const { OnnxWebRuntime, PhonemizeWebRuntime, PiperWebEngine } = await loadPiper()
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
  const promise = generate(index)
  promise.catch(() => {})
  pending = promise
  return promise
}

function postError(error: unknown) {
  const message = error instanceof Error
    ? `${error.message}\n${error.stack ?? ''}`
    : String(error)
  self.postMessage({ type: 'error', message })
}

self.onmessage = async (evt) => {
  const { type, text }: Message = evt.data

  if (type === 'speak') {
    chunks = splitIntoChunks(text ?? '')
    nextIndex = 0
  }

  try {
    const result = await (pending ?? prepareNext())
    pending = null

    if (!result) {
      self.postMessage({ type: 'done' })
      return
    }

    self.postMessage({ type: 'audio', ...result })
    prepareNext() // pre-generate the following chunk while this one plays
  } catch (error) {
    pending = null
    postError(error)
  }
}
