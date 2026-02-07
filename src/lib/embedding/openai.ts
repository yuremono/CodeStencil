// OpenAI Embedding Provider Implementation

import OpenAI from 'openai'
import type { EmbeddingProvider } from '../llm/types'

export class OpenAIEmbeddingProvider implements EmbeddingProvider {
  private client: OpenAI
  private model: string
  private dimension: number

  constructor(apiKey: string, model: string = 'text-embedding-3-small') {
    this.client = new OpenAI({ apiKey })
    this.model = model

    // Set dimension based on model
    if (model === 'text-embedding-3-small') {
      this.dimension = 1536
    } else if (model === 'text-embedding-3-large') {
      this.dimension = 3072
    } else if (model === 'text-embedding-ada-002') {
      this.dimension = 1536
    } else {
      this.dimension = 1536 // Default
    }
  }

  async embed(text: string): Promise<number[]> {
    try {
      const response = await this.client.embeddings.create({
        model: this.model,
        input: text,
      })

      return response.data[0].embedding
    } catch (error) {
      throw new Error(`OpenAI embedding failed: ${error}`)
    }
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    try {
      const response = await this.client.embeddings.create({
        model: this.model,
        input: texts,
      })

      return response.data.map(d => d.embedding)
    } catch (error) {
      throw new Error(`OpenAI batch embedding failed: ${error}`)
    }
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
