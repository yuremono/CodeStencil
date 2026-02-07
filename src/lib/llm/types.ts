// LLM Provider Types and Interfaces

export interface GenerateOptions {
  temperature?: number
  maxTokens?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
}

export interface StreamOptions extends GenerateOptions {
  onChunk?: (chunk: string) => void
}

export interface LLMProvider {
  /**
   * Generate text completion
   */
  generate(prompt: string, options?: GenerateOptions): Promise<string>

  /**
   * Stream text completion
   */
  stream(prompt: string, options?: StreamOptions): AsyncIterable<string>

  /**
   * Get provider name
   */
  getProviderName(): string

  /**
   * Check if provider is available
   */
  isAvailable(): Promise<boolean>
}

export interface EmbeddingProvider {
  /**
   * Generate embedding for text
   */
  embed(text: string): Promise<number[]>

  /**
   * Generate embeddings for multiple texts (batch)
   */
  embedBatch(texts: string[]): Promise<number[][]>

  /**
   * Get embedding dimension
   */
  getDimension(): number

  /**
   * Check if provider is available
   */
  isAvailable(): Promise<boolean>
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatOptions extends GenerateOptions {
  messages: ChatMessage[]
}
