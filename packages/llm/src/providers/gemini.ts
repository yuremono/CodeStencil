/**
 * Gemini LLM Provider
 * Google Gemini API using Google GenAI SDK
 */

import type { LLMProvider, LLMOptions, LLMResponse, StreamOptions } from '../types.js';

/**
 * Gemini プロバイダーオプション
 */
export interface GeminiProviderOptions extends LLMOptions {
  /** API キー */
  apiKey: string;
  /** モデル名（デフォルト: gemini-2.0-flash） */
  model?: 'gemini-2.0-flash' | 'gemini-2.5-pro' | 'gemini-1.5-flash' | 'gemini-1.5-pro';
  /** API のベース URL（オプション） */
  baseURL?: string;
  /** 温度パラメータ（0-2、デフォルト: 0.7） */
  temperature?: number;
  /** 最大出力トークン数（デフォルト: 4096） */
  maxTokens?: number;
  /** トップ_P サンプリング（デフォルト: 0.9） */
  topP?: number;
  /** トップ_K サンプリング（デフォルト: 40） */
  topK?: number;
}

/**
 * Gemini API のレスポンス型
 */
interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
    index: number;
  }>;
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

/**
 * Gemini API エラー型
 */
interface GeminiError {
  error: {
    code: number;
    message: string;
    status: string;
  };
}

/**
 * Gemini プロバイダークラス
 */
export class GeminiProvider implements LLMProvider {
  private apiKey: string;
  private model: string;
  private baseURL: string;
  private temperature: number;
  private maxTokens: number;
  private topP: number;
  private topK: number;

  constructor(options: GeminiProviderOptions) {
    this.apiKey = options.apiKey;
    this.model = options.model || 'gemini-2.0-flash';
    this.baseURL = options.baseURL || 'https://generativelanguage.googleapis.com/v1beta';
    this.temperature = options.temperature ?? 0.7;
    this.maxTokens = options.maxTokens ?? 4096;
    this.topP = options.topP ?? 0.9;
    this.topK = options.topK ?? 40;
  }

  /**
   * テキストを生成する
   */
  async generate(prompt: string, options?: Partial<LLMOptions>): Promise<LLMResponse> {
    const url = `${this.baseURL}/models/${this.model}:generateContent?key=${this.apiKey}`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: options?.temperature ?? this.temperature,
        maxOutputTokens: options?.maxTokens ?? this.maxTokens,
        topP: options?.topP ?? this.topP,
        topK: options?.topK ?? this.topK,
      },
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as GeminiError;
        throw new Error(
          `Gemini API error: ${errorData.error.message} (${errorData.error.status})`
        );
      }

      const data = (await response.json()) as GeminiResponse;

      const candidate = data.candidates[0];
      if (!candidate) {
        throw new Error('No candidates in Gemini API response');
      }

      const text = candidate.content.parts[0]?.text || '';
      const finishReason = candidate.finishReason;

      return {
        text,
        usage: {
          promptTokens: data.usageMetadata?.promptTokenCount || 0,
          completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: data.usageMetadata?.totalTokenCount || 0,
        },
        model: this.model,
        finishReason,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error in Gemini API call');
    }
  }

  /**
   * ストリーミングでテキストを生成する
   */
  async *stream(prompt: string, options?: Partial<LLMOptions>): AsyncIterable<string> {
    const url = `${this.baseURL}/models/${this.model}:streamGenerateContent?key=${this.apiKey}`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: options?.temperature ?? this.temperature,
        maxOutputTokens: options?.maxTokens ?? this.maxTokens,
        topP: options?.topP ?? this.topP,
        topK: options?.topK ?? this.topK,
      },
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as GeminiError;
        throw new Error(
          `Gemini API error: ${errorData.error.message} (${errorData.error.status})`
        );
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim() || !line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6);
          if (jsonStr === '[DONE]') continue;

          try {
            const data = JSON.parse(jsonStr) as GeminiResponse;
            const candidate = data.candidates[0];
            if (candidate?.content?.parts?.[0]?.text) {
              yield candidate.content.parts[0].text;
            }
          } catch {
            // JSONパースエラーを無視
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error in Gemini API streaming call');
    }
  }

  /**
   * マルチターン会話を生成する
   */
  async chat(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    options?: Partial<LLMOptions>
  ): Promise<LLMResponse> {
    // Gemini は履歴を contents 配列で受け取る
    const contents = messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const url = `${this.baseURL}/models/${this.model}:generateContent?key=${this.apiKey}`;

    const requestBody = {
      contents,
      generationConfig: {
        temperature: options?.temperature ?? this.temperature,
        maxOutputTokens: options?.maxTokens ?? this.maxTokens,
        topP: options?.topP ?? this.topP,
        topK: options?.topK ?? this.topK,
      },
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as GeminiError;
        throw new Error(
          `Gemini API error: ${errorData.error.message} (${errorData.error.status})`
        );
      }

      const data = (await response.json()) as GeminiResponse;

      const candidate = data.candidates[0];
      if (!candidate) {
        throw new Error('No candidates in Gemini API response');
      }

      const text = candidate.content.parts[0]?.text || '';

      return {
        text,
        usage: {
          promptTokens: data.usageMetadata?.promptTokenCount || 0,
          completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: data.usageMetadata?.totalTokenCount || 0,
        },
        model: this.model,
        finishReason: candidate.finishReason,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error in Gemini API chat call');
    }
  }

  /**
   * プロバイダー情報を取得
   */
  getInfo() {
    return {
      name: 'Gemini',
      model: this.model,
      baseURL: this.baseURL,
      supports: {
        streaming: true,
        chat: true,
        images: false, // 将来的に対応予定
      },
    };
  }
}

/**
 * デフォルトエクスポート
 */
export default GeminiProvider;
