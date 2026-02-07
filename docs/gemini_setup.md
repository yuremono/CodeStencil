# Gemini API セットアップガイド

> 作成日: 2026-02-07
> バージョン: 0.1.0

---

## 概要

CodeStencil は Google Gemini API をLLMプロバイダーとしてサポートしています。

---

## APIキーの取得

### 方法1: Google AI Studio（推奨・無料）

**メリット**:
- 無料で取得可能
- クレジットカード不要
- 数分で完了

**手順**:

1. [Google AI Studio](https://aistudio.google.com) にアクセス
2. Google アカウントでログイン
3. 利用規約に同意
4. 「Get API Key」→「Create API Key」をクリック
5. プロジェクト名を入力（新規の場合）
6. APIキーが生成される

**新規ユーザー特典**:
- 最初の90日間で **$300 相当の無料クレジット**

### 方法2: Google Cloud Platform

本番環境で高額の利用が必要な場合に使用します。

**注意点**:
- 国際クレジットカードが必要
- IPアドレス制限がある場合あり

---

## 環境設定

### 1. `.env` ファイルにAPIキーを追加

```bash
# .env
GEMINI_API_KEY="AIza..."
```

### 2. 利用可能なモデル

| モデル | 説明 |
|--------|------|
| `gemini-2.0-flash` | 高速・低コスト（推奨） |
| `gemini-2.5-pro` | 高品質・最新 |
| `gemini-1.5-flash` | 低速版フラッシュモデル |
| `gemini-1.5-pro` | 安定版プロモデル |

---

## コードでの使用例

### Gemini プロバイダーの使用

```typescript
import { GeminiProvider } from '@codestencil/llm';

const provider = new GeminiProvider({
  apiKey: process.env.GEMINI_API_KEY,
  model: 'gemini-2.0-flash',
});

const result = await provider.generate(
  'Reactコンポーネントのテンプレートを作成してください'
);

console.log(result.text);
```

### ストリーミング応答

```typescript
const stream = await provider.stream(
  'TypeScriptでユーザー認証機能を実装してください'
);

for await (const chunk of stream) {
  process.stdout.write(chunk);
}
```

---

## SDK情報

### 推奨ライブラリ（2026年）

Googleは **Google GenAI SDK** を公式ライブラリとして推奨しています。

**インストール**:
```bash
pnpm add @google/genai
```

**注意**: 旧版の `@google/generative-ai` は非推奨化されています。

---

## APIキーの管理

### セキュリティベストプラクティス

1. **`.env` ファイルは `.gitignore` に追加**
2. **APIキーをコードに直接記述しない**
3. **本番環境では環境変数またはシークレットマネージャーを使用**

### `.gitignore` 設定

```gitignore
# Environment variables
.env
.env.local
.env.*.local
```

---

## 参考リンク

- [Google AI Studio](https://aistudio.google.com) - APIキー取得
- [Gemini API 公式ドキュメント](https://ai.google.dev/gemini-api/docs/api-key)
- [Gemini API クイックスタート](https://ai.google.dev/gemini-api/docs/quickstart)
- [Google GenAI SDK (GitHub)](https://github.com/googleapis/js-genai)

---

## トラブルシューティング

### エラー: API key not valid

**原因**: APIキーが無効または期限切れ

**解決策**:
- Google AI Studio でAPIキーを再確認
- 新しいAPIキーを発行

### エラー: Quota exceeded

**原因**: 無料クレジットを使い切った

**解決策**:
- Google Cloud Console で課金を有効化
- または `gemini-2.0-flash` など安価なモデルを使用

### エラー: CORS error

**原因**: ブラウザからの直接API呼び出し

**解決策**:
- バックエンドサーバー経由でAPIを呼び出す
- CodeStencil API サーバーを使用

---

## コスト比較

| モデル | 入力 | 出力 | 備考 |
|--------|------|------|------|
| gemini-2.0-flash | $0.075/1M | $0.30/1M | 最も安価 |
| gemini-2.5-pro | $1.25/1M | $5.00/1M | 高品質 |
| gemini-1.5-flash | $0.075/1M | $0.30/1M | 安定版 |

（2026年2月時点の料金）

---

## サポートされている機能

- [x] テキスト生成
- [x] ストリーミング応答
- [x] マルチターン会話
- [ ] マルチモーダル（画像入力）- 将来的に追加予定
- [ ] 関数呼び出し（Function Calling）- 将来的に追加予定
