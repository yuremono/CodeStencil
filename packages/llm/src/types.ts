/**
 * LLM Provider Type Definitions
 */

/**
 * LLMレスポンス
 */
export interface LLMResponse {
  /** 生成されたテキスト */
  text: string;
  /** トークン使用量 */
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  /** 使用モデル */
  model: string;
  /** 終了理由 */
  finishReason?: string;
}

/**
 * LLMオプション
 */
export interface LLMOptions {
  /** 温度パラメータ（0-2） */
  temperature?: number;
  /** 最大出力トークン数 */
  maxTokens?: number;
  /** トップ_P サンプリング */
  topP?: number;
  /** トップ_K サンプリング */
  topK?: number;
  /** ストップシーケンス */
  stopSequences?: string[];
}

/**
 * ストリームオプション
 */
export interface StreamOptions extends LLMOptions {}

/**
 * LLMプロバイダーインターフェース
 */
export interface LLMProvider {
  /**
   * テキストを生成する
   */
  generate(prompt: string, options?: Partial<LLMOptions>): Promise<LLMResponse>;

  /**
   * ストリーミングでテキストを生成する
   */
  stream?(prompt: string, options?: Partial<StreamOptions>): AsyncIterable<string>;

  /**
   * マルチターン会話を生成する
   */
  chat?(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    options?: Partial<LLMOptions>
  ): Promise<LLMResponse>;

  /**
   * プロバイダー情報を取得
   */
  getInfo?(): {
    name: string;
    model: string;
    baseURL?: string;
    supports: {
      streaming: boolean;
      chat: boolean;
      images: boolean;
    };
  };
}
