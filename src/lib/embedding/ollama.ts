// Ollama Embedding Provider Implementation (for local embeddings)

import type { EmbeddingProvider } from '../llm/types'

interface OllamaEmbedResponse {
  embedding: number[]
}

export class OllamaEmbeddingProvider implements EmbeddingProvider {
  private baseUrl: string
  private model: string
  private dimension: number

  constructor(
    baseUrl: string = 'http://localhost:11434',
    model: string = 'nomic-embed-text',
    dimension: number = 768
  ) {
    this.baseUrl = baseUrl
    this.model = model
    this.dimension = dimension
  }

  async embed(text: string): Promise<number[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/embeddings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt: text,
        }),
      })

      if (!response.ok) {
        throw new Error(`Ollama embedding request failed: ${response.statusText}`)
      }

      const data: OllamaEmbedResponse = await response.json()
      return data.embedding
    } catch (error) {
      throw new Error(`Ollama embedding failed: ${error}`)
    }
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    // Ollama doesn't support batch embedding, so we do it sequentially
    const results: number[][] = []
    for (const text of texts) {
      results.push(await this.embed(text))
    }
    return results
  }

  getDimension(): number {
    return this.dimension
  }

  async isAvailable(): Promise<boolean> {
    try {
      await this.embed('test')
      return true
    } catch {
      return false
    }
  }
}
