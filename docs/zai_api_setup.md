# ZAI API (GLM Coding Plan) 設定ガイド

## 概要

ZAI APIは、智譜AI（Zhipu AI）が提供するGLM-4シリーズのAPIサービスです。CodeStencilでは、ZAI APIを使用してコードテンプレートの生成を行います。

## APIキーの取得方法

1. **ZAI管理画面にアクセス**
   - URL: https://z.ai/manage-api-key/apikey-list

2. **APIキーを作成**
   - 「Create a new API key」または「Create API Key」ボタンをクリック
   - キーを識別するための名前を入力（例：「codeStencil-dev」など）

3. **キーを保存**
   - 表示されたAPIキーを安全な場所に保存
   - **重要**: キーは再表示されないため、必ずコピーしてください

## 詳細ガイド

- [GLM Coding Plan入門ガイド（Zenn）](https://zenn.dev/robustonian/articles/glm_coding_plan)
- [2026年版 GLM-4.7 API完全ガイド](https://apidog.com/jp/blog/glm-4.7-api-jp/)

## 環境変数の設定

`.env` ファイルに以下の設定を追加してください：

```bash
# ZAI API (GLM Coding Plan)
ZAI_API_KEY="your-api-key-here"
```

## API仕様

### エンドポイント

- **ベースURL**: `https://open.bigmodel.cn/api/paas/v4/`
- **モデル**: `glm-4-plus`（GLM-4.7 互換）

### サポートされている機能

- テキスト生成（`generate`）
- ストリーミング生成（`stream`）
- 可用性チェック（`isAvailable`）

### 使用例

```typescript
import { ZAIProvider } from '@/lib/llm/zai';

const provider = new ZAIProvider(process.env.ZAI_API_KEY);

// テキスト生成
const result = await provider.generate('Hello, world!');
console.log(result);

// ストリーミング生成
for await (const chunk of provider.stream('Hello, world!')) {
  process.stdout.write(chunk);
}
```

## 料金

- 詳細はZAIの公式ドキュメントを確認してください
- 新規ユーザーには無料枠が提供される場合があります

## 制限事項

- APIリクエストレート制限があります
- 1回のリクエストで処理できるトークン数に上限があります

## トラブルシューティング

### APIキーが無効な場合

- APIキーが正しく設定されているか確認してください
- APIキーが有効期限切れになっていないか確認してください

### 接続エラーが発生する場合

- インターネット接続を確認してください
- ZAI APIのサービス状態を確認してください

## 関連リンク

- [ZAI API管理ページ](https://z.ai/manage-api-key/apikey-list)
- [公式ドキュメント](https://open.bigmodel.cn/dev/api)
