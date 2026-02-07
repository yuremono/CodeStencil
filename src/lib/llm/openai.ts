// OpenAI LLM Provider Implementation

import OpenAI from 'openai'
import type { LLMProvider, GenerateOptions, StreamOptions, ChatMessage } from './types'

export class OpenAIProvider implements LLMProvider {
  private client: OpenAI
  private model: string

  constructor(apiKey: string, model: string = 'gpt-4o-mini') {
    this.client = new OpenAI({ apiKey })
    this.model = model
  }

  async generate(prompt: string, options?: GenerateOptions): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2048,
        top_p: options?.topP,
        frequency_penalty: options?.frequencyPenalty,
        presence_penalty: options?.presencePenalty,
      })

      return response.choices[0]?.message?.content ?? ''
    } catch (error) {
      throw new Error(`OpenAI generation failed: ${error}`)
    }
  }

  async *stream(prompt: string, options?: StreamOptions): AsyncIterable<string> {
    try {
      const stream = await this.client.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2048,
        stream: true,
      })

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content
        if (content) {
          options?.onChunk?.(content)
          yield content
        }
      }
    } catch (error) {
      throw new Error(`OpenAI streaming failed: ${error}`)
    }
  }

  getProviderName(): string {
    return 'openai'
  }

  async isAvailable(): Promise<boolean> {
    try {
      await this.client.models.list()
      return true
    } catch {
      return false
    }
  }
}

// OpenAI Chat Provider (for conversation-style interactions)
export class OpenAIChatProvider {
  private client: OpenAI
  private model: string

  constructor(apiKey: string, model: string = 'gpt-4o-mini') {
    this.client = new OpenAI({ apiKey })
    this.model = model
  }

  async chat(messages: ChatMessage[], options?: GenerateOptions): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2048,
        top_p: options?.topP,
        frequency_penalty: options?.frequencyPenalty,
        presence_penalty: options?.presencePenalty,
      })

      return response.choices[0]?.message?.content ?? ''
    } catch (error) {
      throw new Error(`OpenAI chat failed: ${error}`)
    }
  }
}
