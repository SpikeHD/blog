"use client"

import { Readability } from "@mozilla/readability";
import { AudioLines } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Loader } from "./loader";
import Button from "./button";
import ReadAloudControls from "./read-aloud-controls";

type Status = 'loading' | 'ready' | 'speaking' | 'paused' | 'error'

interface AudioChunk {
  audio: Float32Array
  sampleRate: number
}

const IRRELEVANT_SELECTOR = [
  'pre', 'code', 'script', 'style', 'noscript', 'template', 'svg',
  'math', 'sup', 'sub', 'kbd', 'samp', 'var', 'object', 'embed',
  'iframe', 'canvas', 'form', 'select', 'input', 'textarea',
  '[hidden]', '[aria-hidden="true"]', '[role="presentation"]',
  '.sr-only', '.visually-hidden', '.footnotes',
].join(',')

export default function ReadAloud() {
  const workerRef = useRef<Worker | null>(null)
  const contextRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const currentBufferRef = useRef<AudioBuffer | null>(null)
  const playbackRateRef = useRef(1)
  const clockRef = useRef({ offset: 0, last: 0 })
  const pausedRef = useRef(false)
  const [status, setStatus] = useState<Status>('ready')
  const [speed, setSpeed] = useState(1)

  const getContext = () => {
    if (!contextRef.current) contextRef.current = new AudioContext()
    if (contextRef.current.state === 'suspended') contextRef.current.resume()
    return contextRef.current
  }

  const elapsed = () => {
    const context = contextRef.current
    const { offset, last } = clockRef.current
    return context ? offset + (context.currentTime - last) * playbackRateRef.current : offset
  }

  const playBuffer = (buffer: AudioBuffer, offset: number) => {
    const context = getContext()
    if (sourceRef.current) {
      sourceRef.current.onended = null
      sourceRef.current.stop()
    }

    const source = context.createBufferSource()
    source.buffer = buffer
    source.playbackRate.value = playbackRateRef.current
    source.connect(context.destination)
    sourceRef.current = source
    currentBufferRef.current = buffer
    clockRef.current = { offset, last: context.currentTime }
    source.onended = () => {
      sourceRef.current = null
      if (!pausedRef.current) workerRef.current?.postMessage({ type: 'next' })
    }
    source.start(0, offset)
    setStatus('speaking')
  }

  const playChunk = ({ audio, sampleRate }: AudioChunk) => {
    const context = getContext()
    const buffer = context.createBuffer(1, audio.length, sampleRate)
    buffer.copyToChannel(audio as Float32Array<ArrayBuffer>, 0)
    playBuffer(buffer, 0)
  }

  const reset = () => {
    if (sourceRef.current) {
      sourceRef.current.onended = null
      sourceRef.current.stop()
      sourceRef.current = null
    }
    currentBufferRef.current = null
    clockRef.current = { offset: 0, last: 0 }
    pausedRef.current = false
  }

  const stop = () => {
    reset()
    contextRef.current?.close()
    contextRef.current = null
    setStatus('ready')
  }

  const togglePlay = () => {
    if (pausedRef.current) {
      pausedRef.current = false
      if (currentBufferRef.current) playBuffer(currentBufferRef.current, clockRef.current.offset)
      setStatus('speaking')
    } else {
      if (!sourceRef.current) return
      clockRef.current = { ...clockRef.current, offset: elapsed() }
      sourceRef.current.onended = null
      sourceRef.current.stop()
      sourceRef.current = null
      pausedRef.current = true
      setStatus('paused')
    }
  }

  const changeSpeed = (newSpeed: number) => {
    setSpeed(newSpeed)
    playbackRateRef.current = newSpeed
    if (sourceRef.current) playBuffer(currentBufferRef.current!, elapsed())
  }

  useEffect(() => {
    const worker = new Worker(new URL('../workers/tts-worker.ts', import.meta.url))
    workerRef.current = worker

    worker.onmessage = (evt) => {
      const { type, audio, sampleRate, message } = evt.data

      switch (type) {
        case 'audio':
          playChunk({ audio, sampleRate })
          break
        case 'done':
          contextRef.current?.close()
          contextRef.current = null
          setStatus('ready')
          break
        case 'error':
          setStatus('error')
          console.error(message)
          break
      }
    }

    return () => {
      stop()
      worker.terminate()
      workerRef.current = null
    }
  }, [])

  const grabDocumentAndSpeak = () => {
    if (status === 'speaking' || status === 'paused') return
    if (!workerRef.current) return

    getContext() // create/resume the AudioContext within the user gesture

    const doc = document.cloneNode(true) as Document
    doc.querySelectorAll(IRRELEVANT_SELECTOR).forEach((el) => el.remove())
    const text = new Readability(doc).parse()?.textContent?.replace(/\s+/g, ' ').trim()
    if (!text) {
      setStatus('error')
      return
    }

    reset()
    setStatus('loading')
    workerRef.current.postMessage({ type: 'speak', text })
  }

  const icon =
    status === 'loading'
      ? <Loader className="text-foreground w-full h-full" />
      : <AudioLines className="text-foreground w-full h-full" />

  return (
    <div className="flex align-middle items-center h-8">
      {status === 'speaking' || status === 'paused' ? (
        <ReadAloudControls
          paused={status === 'paused'}
          speed={speed}
          onTogglePlay={togglePlay}
          onStop={stop}
          onSpeedChange={changeSpeed}
        />
      ) : (
        <Button onClick={grabDocumentAndSpeak} className="flex flex-row items-center align-middle gap-2">
          <div className="w-4 h-4">{icon}</div>
          <span>Listen to this</span>
        </Button>
      )}
    </div>
  )
}
