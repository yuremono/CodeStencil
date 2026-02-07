# データベース・LLM連携セットアップガイド

> **作成日**: 2026-02-07
> **担当**: @member3

---

## 概要

CodeStencilで使用するデータベース（PostgreSQL + pgvector）とLLM連携（OpenAI/Ollama）のセットアップ手順です。

---

## 1. データベースセットアップ

### 1.1 DockerでPostgreSQLを起動

```bash
# Docker ComposeでPostgreSQL + Redisを起動
pnpm docker:up

# ログを確認
pnpm docker:logs

# 停止する場合
pnpm docker:down
```

### 1.2 データベーススキーマの適用

```bash
# Prisma Clientを生成
pnpm db:generate

# スキーマをデータベースにプッシュ（開発環境）
pnpm db:push

# またはマイグレーションを作成（本番環境）
pnpm db:migrate
```

### 1.3 Prisma Studioでデータを確認

```bash
pnpm db:studio
```

ブラウザで `http://localhost:5555` にアクセスすると、データベースの内容を確認できます。

---

## 2. LLM連携セットアップ

### 2.1 OpenAI APIの設定

`.env` ファイルにOpenAI APIキーを設定します：

```bash
OPENAI_API_KEY="sk-..."
```

**推奨モデル**:
- テキスト生成: `gpt-4o-mini`（コストパフォーマンス良好）
- エンベディング: `text-embedding-3-small`（1536次元、低コスト）

### 2.2 Ollamaの設定（ローカルLLM）

プライベートなコードを扱う場合、Ollamaを使用してローカルでLLMを実行できます。

```bash
# Ollamaのインストール
curl -fsSL https://ollama.com/install.sh | sh

# モデルのプル
ollama pull llama3.1
ollama pull nomic-embed-text

# Ollamaサーバーの起動
ollama serve
```

`.env` ファイルにOllamaの設定を追加します：

```bash
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="llama3.1"
```

---

## 3. データベーススキーマ

### 3.1 主要テーブル

| テーブル | 説明 |
|---------|------|
| `users` | ユーザー情報 |
| `templates` | テンプレート |
| `template_files` | テンプレートファイル |
| `placeholders` | プレースホルダー変数 |
| `code_patterns` | コードパターン（RAG用） |
| `generations` | 生成履歴 |
| `projects` | プロジェクト情報 |

### 3.2 pgvectorによるベクトル検索

`code_patterns` テーブルには `embedding` カラム（pgvector型）があり、コードの意味的検索が可能です。

```sql
-- 類似検索の例（コサイン類似度）
SELECT id, name, code, 1 - (embedding <=> '[0.1, 0.2, ...]'::vector) AS similarity
FROM code_patterns
WHERE language = 'typescript'
ORDER BY embedding <=> '[0.1, 0.2, ...]'::vector
LIMIT 10;
```

---

## 4. RAG（Retrieval-Augmented Generation）の使用

### 4.1 コードパターンのインデックス

```typescript
import { indexCodePattern } from '@/lib/rag'

await indexCodePattern({
  name: 'React Custom Hook',
  description: 'Data fetching hook with loading state',
  language: 'typescript',
  code: `export function useFetch(url: string) { ... }`,
})
```

### 4.2 類似パターン検索

```typescript
import { searchSimilarPatterns } from '@/lib/db'

const embedding = await embedder.embed('create a data fetching hook')
const patterns = await searchSimilarPatterns(embedding, {
  language: 'typescript',
  limit: 5,
  threshold: 0.7,
})
```

### 4.3 RAGによるコード生成

```typescript
import { generateWithRAG } from '@/lib/rag'

const result = await generateWithRAG('Create a React hook for data fetching', {
  language: 'typescript',
  context: 'Using fetch API',
})

console.log(result.generatedCode)
console.log('Retrieved patterns:', result.retrievedPatterns)
```

---

## 5. LLMプロバイダーの切り替え

### 5.1 OpenAIからOllamaに切り替え

```typescript
import { LLMFactory } from '@/lib/llm'

// OpenAI（デフォルト）
const openai = LLMFactory.create({
  type: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
})

// Ollama（ローカル）
const ollama = LLMFactory.create({
  type: 'ollama',
  baseUrl: 'http://localhost:11434',
  model: 'llama3.1',
})

// 自動選択（OpenAIが利用可能ならOpenAI、そうでなければOllama）
const available = await LLMFactory.getAvailableProviders()
const llm = LLMFactory.create({ type: available[0] })
```

---

## 6. エンベディングプロバイダー

### 6.1 OpenAIエンベディング

```typescript
import { OpenAIEmbeddingProvider } from '@/lib/embedding'

const embedder = new OpenAIEmbeddingProvider(process.env.OPENAI_API_KEY)
const embedding = await embedder.embed('sample text')
console.log(embedding.length) // 1536 (text-embedding-3-small)
```

### 6.2 Ollamaエンベディング

```typescript
import { OllamaEmbeddingProvider } from '@/lib/embedding'

const embedder = new OllamaEmbeddingProvider(
  'http://localhost:11434',
  'nomic-embed-text',
  768 // 次元数
)
const embedding = await embedder.embed('sample text')
console.log(embedding.length) // 768
```

---

## 7. トラブルシューティング

### 7.1 Dockerコンテナが起動しない

```bash
# ポートが使用されているか確認
lsof -i :5432

# 既存のコンテナを削除
docker-compose down -v

# 再度起動
pnpm docker:up
```

### 7.2 Prismaマイグレーションが失敗する

```bash
# データベースをリセット（開発環境のみ）
pnpm db:push --force-reset

# Prisma Clientを再生成
pnpm db:generate
```

### 7.3 OpenAI APIエラー

```bash
# APIキーが正しく設定されているか確認
echo $OPENAI_API_KEY

# クォータを確認
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### 7.4 Ollamaが利用できない

```bash
# Ollamaが実行中か確認
curl http://localhost:11434/api/tags

# モデルがダウンロードされているか確認
ollama list

# モデルを再ダウンロード
ollama pull llama3.1
```

---

## 8. パフォーマンスチューニング

### 8.1 ベクトル検索の最適化

```sql
-- インデックスの作成（必要な場合）
CREATE INDEX code_patterns_embedding_idx ON code_patterns
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- HNSWインデックス（より高速）
CREATE INDEX code_patterns_embedding_hnsw_idx ON code_patterns
  USING hnsw (embedding vector_cosine_ops);
```

### 8.2 エンベディングのキャッシュ

生成したエンベディングはデータベースに保存し、再利用してください。

```typescript
// 既存のエンベディングを確認
const existing = await prisma.codePattern.findFirst({
  where: { code: hash(code) },
})

if (existing) {
  return existing.embedding
}

// 新規エンベディングの生成
return await embedder.embed(code)
```

---

## 9. セキュリティ considerations

### 9.1 APIキーの管理

- `.env` ファイルは `.gitignore` に追加
- 本番環境では環境変数またはシークレットマネージャーを使用
- APIキーのローテーションを定期的に実施

### 9.2 プライベートリポジトリの扱い

プライベートなコードを扱う場合は、以下の対策を講じてください：

- Ollama等のローカルLLMを使用
- コードを外部APIに送信しない設定
- データベースの暗号化

---

## 10. 次のステップ

1. [ ] データベースのセットアップ完了
2. [ ] LLMプロバイダーの設定完了
3. [ ] サンプルコードパターンのインデックス
4. [ ] RAGによるコード生成のテスト

---

**参考リソース**:
- [Prisma Documentation](https://www.prisma.io/docs)
- [pgvector GitHub](https://github.com/pgvector/pgvector)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Ollama Documentation](https://ollama.com/docs)
