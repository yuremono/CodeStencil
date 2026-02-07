# @codestencil/api

CodeStencil API サーバー。tRPC + Hono + Prisma で構築されています。

## 機能

- **Parser API**: ソースコードのAST解析
- **Template API**: テンプレートのCRUD操作
- **Style API**: コーディングスタイルの分析

## 技術スタック

- **Hono**: 軽量なWebフレームワーク
- **tRPC**: 型安全なAPI通信
- **Prisma**: ORM
- **PostgreSQL + pgvector**: データベース

## セットアップ

```bash
# 依存関係のインストール
pnpm install

# 環境変数の設定
cp .env.example .env

# データベースのセットアップ
pnpm db:push

# （オプション）Prisma Studioの起動
pnpm db:studio
```

## 開発

```bash
# 開発サーバーの起動
pnpm dev

# ビルド
pnpm build

# 本番環境で起動
pnpm start
```

## API エンドポイント

### tRPC

```
POST /trpc/parser.parse
POST /trpc/parser.analyzeNaming
GET  /trpc/template.list
GET  /trpc/template.get
POST /trpc/template.create
POST /trpc/template.update
POST /trpc/template.delete
POST /trpc/style.analyze
```

### Health Check

```
GET /health
```

## 使用例

### Parser API

```typescript
const response = await fetch('http://localhost:3001/trpc/parser.parse', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: 'function hello() { return "world"; }',
    language: 'javascript',
  }),
});

const data = await response.json();
console.log(data.result.data);
```

### Template API

```typescript
// テンプレート一覧
const response = await fetch('http://localhost:3001/trpc/template.list?language=typescript');
const data = await response.json();
console.log(data.result.data.templates);
```

## データベーススキーマ

```prisma
model Project {
  id            String   @id @default(uuid())
  name          String
  repositoryUrl String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Template {
  id          String   @id @default(uuid())
  projectId   String?
  name        String
  description String?
  language    String
  code        String   @db.Text
  tags        String[]
  isPublic    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model CodePattern {
  id        String   @id @default(uuid())
  projectId String
  language  String
  content   String   @db.Text
  embedding Unsupported("vector(1536)")?
  metadata  Json?
  createdAt DateTime @default(now())
}
```

## ライセンス

MIT
