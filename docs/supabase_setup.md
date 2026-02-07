# Supabase環境構築ガイド

> **作成日**: 2026-02-07
> **担当**: @member3

---

## 概要

CodeStencilで使用するSupabase（PostgreSQL + pgvector）環境の構築手順です。

---

## 1. Supabaseプロジェクトの作成

### 1.1 Supabaseアカウントの作成

1. [Supabase公式サイト](https://supabase.com)にアクセス
2. 「Start your project」をクリック
3. GitHubアカウントでログイン（またはメールアドレスで登録）

### 1.2 匿名プロジェクト（Anonymous Project）の作成

**匿名プロジェクトの特徴**:
- 無料で使用可能
- APIキーなしで接続できる
- `.env.local` で匿名キーを設定するだけ
- SQL Editorで拡張を有効化するだけですぐに使える

**手順**:
1. ダッシュボードで「New Project」をクリック
2. 以下の情報を入力：

| 項目 | 説明 | 例 |
|------|------|------|
| **Organization** | 組織名 | personal または組織名 |
| **Name** | プロジェクト名 | CodeStencil |
| **Database Password** | データベースパスワード | ランダム生成（安全な場所に保存） |
| **Region** | リージョン | Tokyo (ap-northeast-1) が推奨 |
| **Pricing Plan** | プライスプラン | Free (無料) |

3. 「Create new project」をクリック
4. プロジェクトの作成完了まで待機（約2分）

**重要**: 匿名プロジェクトでも、データベースパスワードは安全な場所に保存してください。接続には必要です。

---

## 2. pgvector拡張の有効化

### 2.1 SQL Editorで拡張を有効化

**SQL Editorの場所**:
1. Supabaseダッシュボードでプロジェクトを選択
2. 左サイドバーから「SQL Editor」をクリック
3. 「New Query」をクリック

**pgvector拡張の有効化**:
SQL Editorに以下のSQLを入力して実行：

```sql
-- pgvector拡張の有効化
CREATE EXTENSION IF NOT EXISTS vector;

-- 拡張の確認
SELECT * FROM pg_extension WHERE extname = 'vector';
```

**実行方法**:
- SQL入力欄の右下にある「Run」ボタンをクリック
- または `Ctrl/Cmd + Enter` で実行

**成功の確認**:
- 実行結果に `vector` が表示されれば成功です
- 「Success」メッセージが表示されます

**注意**: これは一度だけ実行すればOKです。拡張はプロジェクトで有効になり、再読み込み不要です。

---

## 3. PostgreSQLのベクトル検索機能

### 3.1 pgvectorとは

pgvectorはPostgreSQLでベクトル検索を行うための拡張機能です。

**主な機能**:
- ベクトル型のカラム定義
- 類似度計算（コサイン類似度、内積、L2距離）
- HNSW/IVFFlatインデックスによる高速検索

### 3.2 ベクトル型の使用方法

```sql
-- ベクトルカラムを持つテーブル作成
CREATE TABLE code_patterns (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  embedding vector(1536)  -- OpenAI text-embedding-3-smallの次元数
);

-- ベクトル値の挿入
INSERT INTO code_patterns (name, code, embedding)
VALUES ('Example', 'code here', '[0.1, 0.2, 0.3, ...]');

-- 類似検索（コサイン類似度）
SELECT
  id,
  name,
  code,
  1 - (embedding <=> '[0.1, 0.2, 0.3, ...]'::vector) AS similarity
FROM code_patterns
ORDER BY embedding <=> '[0.1, 0.2, 0.3, ...]'::vector
LIMIT 10;
```

### 3.3 演算子の説明

| 演算子 | 説明 | 戻り値 |
|--------|------|--------|
| `<=>` | コサイン距離 | 0（類似）〜 2（非類似） |
| `<#>` | 負の内積 | -∞ 〜 +∞ |
| `<->` | L2距離 | 0（同一） 〜 +∞ |

**コサイン類似度の計算**:
```sql
-- コサイン類似度 = 1 - コサイン距離
SELECT 1 - (embedding <=> query_vector) AS similarity
```

---

## 4. 環境変数の設定

### 4.1 Supabase接続情報の取得

1. Supabaseダッシュボードで「Settings」 → 「API」を選択
2. 以下の情報をコピー：

| 項目 | 説明 |
|------|------|
| **Project URL** | SupabaseプロジェクトのURL |
| **anon public** | パブリック匿名キー |
| **service_role** | サービスロールキー（サーバーサイドでのみ使用） |

### 4.2 .envファイルの設定（DATABASE_URLのみで接続）

**重要**: 匿名プロジェクトでは、`DATABASE_URL` だけで接続できます。追加のAPIキーは不要です。

`.env` または `.env.local` ファイルに以下の形式で設定します：

```bash
# Supabase Database (PostgreSQL + pgvector)
# これだけで接続できます
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

**DATABASE_URLの形式**:
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

- `[PASSWORD]`: プロジェクト作成時に設定したパスワード
- `[PROJECT-REF]`: Supabaseプロジェクトの参照ID（URLから確認可能）

**補足**: NextAuth等を使用する場合のみ、以下の追加設定が必要です：

```bash
# Supabase API (NextAuth等を使用する場合のみ)
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"
```

**OpenAI API（LLM機能を使用する場合）**:
```bash
OPENAI_API_KEY="sk-..."
```

**Ollama（ローカルLLM、オプション）**:
```bash
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="llama3.1"
```

---

## 5. Prismaスキーマの設定

### 5.1 スキーマの定義

`prisma/schema.prisma` でpgvectorを使用する設定：

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [pgvector(map: "vector")]
}

model CodePattern {
  id        String   @id @default(cuid())
  name      String
  code      String   @db.Text
  embedding Vector(1536) // pgvector型
  createdAt DateTime @default(now())
}
```

### 5.2 マイグレーションの実行

```bash
# Prisma Clientの生成
pnpm db:generate

# データベースにスキーマをプッシュ（開発環境）
pnpm db:push
```

---

## 6. ベクトル検索の実装

### 6.1 エンベディングの生成

```typescript
import { OpenAIEmbeddingProvider } from '@/lib/embedding'

const embedder = new OpenAIEmbeddingProvider(process.env.OPENAI_API_KEY!)
const embedding = await embedder.embed('Sample code for vector search')
// => [0.1, 0.2, 0.3, ...] (1536次元)
```

### 6.2 ベクトル検索の実行

```typescript
import { prisma } from '@/lib/db'

const queryEmbedding = await embedder.embed('react hook for data fetching')

// pgvectorによる類似検索
const results = await prisma.$queryRaw`
  SELECT
    id,
    name,
    code,
    1 - (embedding <=> ${queryEmbedding}::vector) AS similarity
  FROM code_patterns
  WHERE 1 - (embedding <=> ${queryEmbedding}::vector) > 0.7
  ORDER BY embedding <=> ${queryEmbedding}::vector
  LIMIT 10
`
```

---

## 7. インデックスの作成（オプション）

データ量が増えた場合、インデックスを作成することで検索速度を向上できます。

### 7.1 HNSWインデックス（推奨）

```sql
CREATE INDEX code_patterns_embedding_hnsw_idx
ON code_patterns
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);
```

### 7.2 IVFFlatインデックス

```sql
CREATE INDEX code_patterns_embedding_ivfflat_idx
ON code_patterns
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

---

## 8. ローカル開発環境の構築（Docker）

Supabaseを使用せず、ローカルでPostgreSQL + pgvectorを実行する場合：

### 8.1 Docker Composeの使用

```bash
# Docker ComposeでPostgreSQL起動
pnpm docker:up

# ログ確認
pnpm docker:logs

# 停止
pnpm docker:down
```

### 8.2 ローカル接続設定

```bash
# .env
DATABASE_URL="postgresql://codestencil:codestencil_dev_password@localhost:5432/codestencil?schema=public"
```

---

## 9. トラブルシューティング

### 9.1 pgvector拡張が見つからない

```sql
-- 拡張が有効か確認
SELECT * FROM pg_available_extensions WHERE name = 'vector';

-- 有効化されていない場合は実行
CREATE EXTENSION IF NOT EXISTS vector;
```

### 9.2 ベクトル次元数のエラー

```
ERROR: vector must have 1536 dimensions
```

**解決策**: エンベディングモデルの次元数と一致しているか確認してください。
- OpenAI text-embedding-3-small: 1536次元
- Ollama nomic-embed-text: 768次元

### 9.3 接続エラー

```
Error: Can't reach database server
```

**解決策**:
1. DATABASE_URLが正しいか確認
2. Supabaseプロジェクトが一時停止していないか確認
3. ファイアウォール設定を確認

---

## 10. 次のステップ

1. [ ] Supabaseプロジェクトを作成
2. [ ] pgvector拡張を有効化
3. [ ] .envファイルに接続情報を設定
4. [ ] Prismaスキーマをデータベースに適用
5. [ ] サンプルデータで動作確認

---

**参考リソース**:
- [Supabase Documentation](https://supabase.com/docs)
- [pgvector GitHub](https://github.com/pgvector/pgvector)
- [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)
