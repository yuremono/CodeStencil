// Ollama LLM Provider Implementation (for local/private LLM)

import type { LLMProvider, GenerateOptions, StreamOptions } from './types'

interface OllamaGenerateResponse {
  model: string
  created_at: string
  response: string
  done: boolean
}

interface OllamaStreamChunk {
  model: string
  created_at: string
  response: string
  done: boolean
}

export class OllamaProvider implements LLMProvider {
  private baseUrl: string
  private model: string

  constructor(baseUrl: string = 'http://localhost:11434', model: string = 'llama3.1') {
    this.baseUrl = baseUrl
    this.model = model
  }

  async generate(prompt: string, options?: GenerateOptions): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: false,
          options: {
            temperature: options?.temperature ?? 0.7,
            num_predict: options?.maxTokens ?? 2048,
            top_p: options?.topP,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Ollama request failed: ${response.statusText}`)
      }

      const data: OllamaGenerateResponse = await response.json()
      return data.response
    } catch (error) {
      throw new Error(`Ollama generation failed: ${error}`)
    }
  }

  async *stream(prompt: string, options?: StreamOptions): AsyncIterable<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: true,
          options: {
            temperature: options?.temperature ?? 0.7,
            num_predict: options?.maxTokens ?? 2048,
            top_p: options?.topP,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Ollama request failed: ${response.statusText}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('Response body is not readable')
      }

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.trim()) continue
          try {
            const chunk: OllamaStreamChunk = JSON.parse(line)
            if (chunk.response) {
              options?.onChunk?.(chunk.response)
              yield chunk.response
            }
            if (chunk.done) return
          } catch {
            // Skip invalid JSON
          }
        }
      }
    } catch (error) {
      throw new Error(`Ollama streaming failed: ${error}`)
    }
  }

  getProviderName(): string {
    return 'ollama'
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`)
      return response.ok
    } catch {
      return false
    }
  }
}
