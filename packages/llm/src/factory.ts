/**
 * LLM Provider Factory
 */

import type { LLMProvider, LLMOptions } from './types.js';
import { OpenAIProvider } from './providers/openai.js';
import { AnthropicProvider } from './providers/anthropic.js';
import { OllamaProvider } from './providers/ollama.js';
import { GeminiProvider } from './providers/gemini.js';
import { ZAIProvider } from './providers/zai.js';

/**
 * サポートされるLLMプロバイダー
 */
export type LLMProviderType = 'openai' | 'anthropic' | 'ollama' | 'gemini' | 'zai';

/**
 * LLMプロバイダーファクトリー
 */
export class LLMFactory {
  /**
   * プロバイダーを作成する
   */
  static create(type: LLMProviderType, options: LLMOptions): LLMProvider {
    switch (type) {
      case 'openai':
        return new OpenAIProvider(options as any);
      case 'anthropic':
        return new AnthropicProvider(options as any);
      case 'ollama':
        return new OllamaProvider(options as any);
      case 'gemini':
        return new GeminiProvider(options as any);
      case 'zai':
        return new ZAIProvider(options as any);
      default:
        throw new Error(`Unsupported LLM provider type: ${type}`);
    }
  }

  /**
   * 環境変数からプロバイダーを作成する
   */
  static fromEnv(type: LLMProviderType): LLMProvider {
    switch (type) {
      case 'openai':
        if (!process.env.OPENAI_API_KEY) {
          throw new Error('OPENAI_API_KEY environment variable is required');
        }
        return new OpenAIProvider({
          apiKey: process.env.OPENAI_API_KEY,
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        });

      case 'anthropic':
        if (!process.env.ANTHROPIC_API_KEY) {
          throw new Error('ANTHROPIC_API_KEY environment variable is required');
        }
        return new AnthropicProvider({
          apiKey: process.env.ANTHROPIC_API_KEY,
          model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
        });

      case 'ollama':
        return new OllamaProvider({
          baseURL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
          model: process.env.OLLAMA_MODEL || 'llama3.1',
        });

      case 'gemini':
        if (!process.env.GEMINI_API_KEY) {
          throw new Error('GEMINI_API_KEY environment variable is required');
        }
        return new GeminiProvider({
          apiKey: process.env.GEMINI_API_KEY,
          model: (process.env.GEMINI_MODEL as any) || 'gemini-2.0-flash',
        });

      case 'zai':
        if (!process.env.ZAI_API_KEY) {
          throw new Error('ZAI_API_KEY environment variable is required');
        }
        return new ZAIProvider({
          apiKey: process.env.ZAI_API_KEY,
          model: process.env.ZAI_MODEL || 'glm-4.7',
        });

      default:
        throw new Error(`Unsupported LLM provider type: ${type}`);
    }
  }

  /**
   * 利用可能なプロバイダータイプを取得
   */
  static getAvailableProviders(): LLMProviderType[] {
    const providers: LLMProviderType[] = [];

    if (process.env.OPENAI_API_KEY) providers.push('openai');
    if (process.env.ANTHROPIC_API_KEY) providers.push('anthropic');
    if (process.env.GEMINI_API_KEY) providers.push('gemini');
    if (process.env.ZAI_API_KEY) providers.push('zai');

    // Ollama はAPIキー不要
    providers.push('ollama');

    return providers;
  }
}

/**
 * デフォルトエクスポート
 */
export default LLMFactory;
