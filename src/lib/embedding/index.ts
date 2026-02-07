// Embedding Provider Factory

import type { EmbeddingProvider } from '../llm/types'
import { OpenAIEmbeddingProvider } from './openai'
import { OllamaEmbeddingProvider } from './ollama'

export type EmbeddingProviderType = 'openai' | 'ollama'

export interface EmbeddingConfig {
  type: EmbeddingProviderType
  apiKey?: string
  model?: string
  baseUrl?: string
  dimension?: number
}

export class EmbeddingFactory {
  static create(config: EmbeddingConfig): EmbeddingProvider {
    switch (config.type) {
      case 'openai':
        if (!config.apiKey) {
          throw new Error('OpenAI API key is required')
        }
        return new OpenAIEmbeddingProvider(config.apiKey, config.model)

      case 'ollama':
        return new OllamaEmbeddingProvider(
          config.baseUrl,
          config.model,
          config.dimension
        )

      default:
        throw new Error(`Unknown embedding provider type: ${config.type}`)
    }
  }

  static async getDefault(): Promise<EmbeddingProvider> {
    // Try OpenAI first, then fall back to Ollama
    if (process.env.OPENAI_API_KEY) {
      const openai = new OpenAIEmbeddingProvider(process.env.OPENAI_API_KEY)
      if (await openai.isAvailable()) {
        return openai
      }
    }

    // Fall back to Ollama
    const ollama = new OllamaEmbeddingProvider()
    if (await ollama.isAvailable()) {
      return ollama
    }

    throw new Error('No embedding provider available')
  }
}

export { OpenAIEmbeddingProvider } from './openai'
export { OllamaEmbeddingProvider } from './ollama'
