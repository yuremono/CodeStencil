// LLM Provider Factory and Registry

import type { LLMProvider } from './types'
import { OpenAIProvider } from './openai'
import { OllamaProvider } from './ollama'
import { ZAIProvider } from './zai'

export type ProviderType = 'openai' | 'ollama' | 'zai'

export interface LLMConfig {
  type: ProviderType
  apiKey?: string
  model?: string
  baseUrl?: string
}

export class LLMFactory {
  private static providers = new Map<ProviderType, LLMProvider>()

  static create(config: LLMConfig): LLMProvider {
    switch (config.type) {
      case 'openai':
        if (!config.apiKey) {
          throw new Error('OpenAI API key is required')
        }
        return new OpenAIProvider(config.apiKey, config.model)

      case 'ollama':
        return new OllamaProvider(config.baseUrl, config.model)

      case 'zai':
        if (!config.apiKey) {
          throw new Error('ZAI API key is required')
        }
        return new ZAIProvider(config.apiKey, config.baseUrl)

      default:
        throw new Error(`Unknown provider type: ${config.type}`)
    }
  }

  static register(type: ProviderType, provider: LLMProvider): void {
    this.providers.set(type, provider)
  }

  static get(type: ProviderType): LLMProvider | undefined {
    return this.providers.get(type)
  }

  static async getAvailableProviders(): Promise<ProviderType[]> {
    const available: ProviderType[] = []

    // Check OpenAI
    if (process.env.OPENAI_API_KEY) {
      const openai = new OpenAIProvider(process.env.OPENAI_API_KEY)
      if (await openai.isAvailable()) {
        available.push('openai')
      }
    }

    // Check Ollama
    const ollama = new OllamaProvider()
    if (await ollama.isAvailable()) {
      available.push('ollama')
    }

    // Check ZAI
    if (process.env.ZAI_API_KEY) {
      const zai = new ZAIProvider(process.env.ZAI_API_KEY)
      if (await zai.isAvailable()) {
        available.push('zai')
      }
    }

    return available
  }
}

// Re-export types and classes
export * from './types'
export { OpenAIProvider, OpenAIChatProvider } from './openai'
export { OllamaProvider } from './ollama'
export { ZAIProvider } from './zai'
