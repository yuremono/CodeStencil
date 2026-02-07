// ZAI API (GLM Coding Plan) Provider
// API Documentation: https://z.ai/manage-api-key/apikey-list
// Guide: https://zenn.dev/robustonian/articles/glm_coding_plan

import type { LLMProvider, GenerateOptions, StreamOptions } from './types';

const ZAI_API_BASE = 'https://open.bigmodel.cn/api/paas/v4/';
const ZAI_MODEL = 'glm-4-plus'; // GLM-4.7 互換モデル

export class ZAIProvider implements LLMProvider {
  private apiKey: string;
  private baseURL: string;

  constructor(apiKey: string, baseURL?: string) {
    this.apiKey = apiKey;
    this.baseURL = baseURL || ZAI_API_BASE;
  }

  async generate(prompt: string, options?: GenerateOptions): Promise<string> {
    const response = await fetch(`${this.baseURL}chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: ZAI_MODEL,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2000,
        top_p: options?.topP ?? 0.9,
        frequency_penalty: options?.frequencyPenalty ?? 0,
        presence_penalty: options?.presencePenalty ?? 0,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`ZAI API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content ?? '';
  }

  async *stream(prompt: string, options?: StreamOptions): AsyncIterable<string> {
    const response = await fetch(`${this.baseURL}chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: ZAI_MODEL,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2000,
        top_p: options?.topP ?? 0.9,
        frequency_penalty: options?.frequencyPenalty ?? 0,
        presence_penalty: options?.presencePenalty ?? 0,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`ZAI API error: ${response.status} - ${error}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content;
              if (content) {
                yield content;
                options?.onChunk?.(content);
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  getProviderName(): string {
    return 'ZAI (GLM Coding Plan)';
  }

  async isAvailable(): Promise<boolean> {
    try {
      const result = await this.generate('Hello', { maxTokens: 5 });
      return result.length > 0;
    } catch {
      return false;
    }
  }
}
