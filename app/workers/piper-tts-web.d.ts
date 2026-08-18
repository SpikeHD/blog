declare module 'piper-tts-web' {
  export class OnnxWebRuntime {
    constructor(options?: { numThreads?: number; basePath?: string })
  }

  export class PhonemizeWebRuntime {
    constructor(options?: { basePath?: string })
  }

  export interface GenerateResult {
    phonemeData: unknown
    file: Blob
    duration: number
  }

  export class PiperWebEngine {
    constructor(options?: {
      onnxRuntime?: OnnxWebRuntime
      phonemizeRuntime?: unknown
      expressionRuntime?: unknown
      voiceProvider?: unknown
    })
    generate(text: string, voice: string, speaker?: number): Promise<GenerateResult>
    destroy(): void
  }
}