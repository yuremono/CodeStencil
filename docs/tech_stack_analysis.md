# CodeStencil 技術スタック分析

> 作成日: 2026-02-07
> バージョン: 0.1.0
> 担当: @member2

---

## 概要

CodeStencilの技術スタック選定に関する分析ドキュメント。各コンポーネントについて候補技術を比較検討し、推奨構成を提案する。

---

## 1. AST解析

### 候補技術比較

| 技術 | 言語対応 | 速度 | エラー耐性 | 採用実績 | 推奨度 |
|------|---------|------|-----------|---------|--------|
| **Tree-sitter** | 40+ | 高い | 高い | GitHub, Neovim | ★★★★★ |
| Babel | JS/TSのみ | 中 | 中 | ESLint, Prettier | ★★☆☆☆ |
| espree | JSのみ | 高 | 中 | ESLint | ★☆☆☆☆ |
| ANTLR | 多言語 | 中 | 高 | JetBrains | ★★★☆☆ |
| Babylon | JSのみ | 高 | 中 | Babel | ★★☆☆☆ |

### 推奨: Tree-sitter

**理由**:
1. **多言語対応**: TypeScript, Python, Rust, Go, Java 等40以上の言語をネイティブサポート
2. **エラー耐性**: 不完全なコードでも解析可能（インクリメンタルパースに最適）
3. **高速**: Cで実装されたコアパーサー
4. **エディタ統合実績**: Neovim, VS Code拡張での採用実績が豊富
5. **WASM対応**: ブラウザ上での動作が可能

**実装方針**:
```typescript
import * as parser from 'tree-sitter'
import TypeScript from 'tree-sitter-typescript'

const tsParser = new Parser()
tsParser.setLanguage(TypeScript)

const tree = tsParser.parse(sourceCode)
const query = new Language(Query)
const captures = query.captures(tree.rootNode)
```

---

## 2. RAGシステム

### 候補技術比較

| 技術 | ホスティング | コスト | スケーラビリティ | 推奨度 |
|------|------------|--------|----------------|--------|
| **pgvector** | セルフホスト | 無料（追加コストなし） | 中 | ★★★★★ |
| **Qdrant** | セルフ/クラウド | 無料/有料 | 高 | ★★★★☆ |
| Pinecone | マネージドのみ | 高 | 高 | ★★★☆☆ |
| Weaviate | セルフ/クラウド | 無料/有料 | 高 | ★★★☆☆ |
| Chroma | セルフホスト | 無料 | 低 | ★★☆☆☆ |

### 推奨: pgvector

**理由**:
1. **既存DBとの統合**: PostgreSQL拡張として動作、別途ベクトルDBを運用する必要がない
2. **コスト効率**: 追加インフラコストが発生しない
3. **SQLとの親和性**: 通常のクエリとベクトル検索を組み合わせ可能
4. **十分な性能**: MVP規模（数千〜数万ベクトル）で十分な性能
5. **運用の簡素化**: 1つのDBで管理可能

**実装方針**:
```sql
-- ベクトル列の追加
ALTER TABLE code_patterns ADD COLUMN embedding vector(1536);

-- 類似検索（コサイン類似度）
SELECT id, content, 1 - (embedding <=> $1) AS similarity
FROM code_patterns
ORDER BY embedding <=> $1
LIMIT 10;
```

**エンベディングモデル**:
- OpenAI `text-embedding-3-small` (1536次元, 低コスト)
- またはローカル `gte-small` (Ollama使用時)

---

## 3. LLM連携

### 候補技術比較

| プロバイダ | モデル | コスト/1M tokens | 品質 | レイテンシ | 推奨度 |
|----------|--------|------------------|------|----------|--------|
| **OpenAI** | GPT-4o | $5.00/15.00 | 最高 | 低 | ★★★★★ |
| **Anthropic** | Claude 3.5 Sonnet | $3.00/15.00 | 最高 | 中 | ★★★★★ |
| **OpenAI** | GPT-4o-mini | $0.15/0.60 | 高 | 低 | ★★★★☆ |
| **ローカル** | Llama 3.1 (8B) | 無料 | 中 | 高 | ★★★☆☆ |

### 推奨: ハイブリッド構成

1. **メイン**: OpenAI GPT-4o-mini（コストと品質のバランス）
2. **オンプレオプション**: Ollama + Llama 3.1 または Qwen2.5-Coder

**実装方針**:
```typescript
// 抽象化レイヤー
interface LLMProvider {
  generate(prompt: string, options?: GenerateOptions): Promise<string>
  stream(prompt: string): AsyncIterable<string>
}

// OpenAI実装
class OpenAIProvider implements LLMProvider {
  private client = new OpenAI()
  async generate(prompt: string) {
    return this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }]
    })
  }
}

// Ollama実装（プライベートコード対応）
class OllamaProvider implements LLMProvider {
  private client = new Ollama()
  async generate(prompt: string) {
    return this.client.generate({
      model: 'llama3.1',
      prompt
    })
  }
}
```

**切り替え基準**:
- デフォルト: OpenAI（高品質・低レイテンシ）
- プライベートリポジトリ: Ollama（コードを外部に送信しない）

---

## 4. Language Server

### LSP実装アプローチ

| アプローチ | 説明 | 推奨度 |
|-----------|------|--------|
| **TypeScript LSP Server** | `vscode-languageserver` で独自サーバーを実装 | ★★★★★ |
| 拡張機能のみ | VS Code Extension API のみ使用 | ★★☆☆☆ |
| 既存LSP拡張 | 既存のLSPを拡張 | ★★★☆☆ |

### 推奨: 独自LSPサーバー

**理由**:
1. **エディタ横断**: VS Code, vim/Neovim (coc.nvim), Emacs等で共通実装
2. **機能の集中**: テンプレート生成ロジックをサーバー側に集約
3. **リアルタイム解析**: ドキュメントの変更を監視し、コンテキストを維持

**対応エディタ**:
| エディタ | LSPクライアント | 対応優先度 |
|---------|----------------|-----------|
| VS Code | ネイティブ対応 | 高 |
| Neovim | nvim-lspconfig | 高 |
| vim | coc.nvim | 中 |
| JetBrains | LSPサポート プラグイン | 中 |
| Emacs | eglot | 低 |

**実装方針**:
```typescript
// server/src/server.ts
import {
  createConnection,
  TextDocuments,
  ProposedFeatures
} from 'vscode-languageserver/node'

const connection = createConnection(ProposedFeatures.all)
const documents = new TextDocuments(TextDocument)

connection.onCompletion(async () => {
  // コンテキストに応じたテンプレート候補を返す
  return await getTemplateSuggestions()
})

connection.listen()
```

---

## 5. Webフロントエンド

### フレームワーク比較

| フレームワーク | 型安全 | パフォーマンス | エコシステム | 推奨度 |
|--------------|--------|--------------|------------|--------|
| **Next.js** | ★★★★★ | 高 | 最大 | ★★★★★ |
| Remix | ★★★★☆ | 高 | 中 | ★★★☆☆ |
| SvelteKit | ★★★☆☆ | 高 | 中 | ★★☆☆☆ |
| Vite + React | ★★★★★ | 高 | 大 | ★★★★☆ |

### 推奨: Next.js (App Router)

**理由**:
1. **型安全**: TypeScriptファースト、tRPCとの親和性
2. **パフォーマンス**: RSC, Server Actions, 最適化が組み込み
3. **デプロイ**: Vercelでのゼロコンフィグデプロイ
4. **エコシステム**: shadcn/ui, NextAuth等の豊富なライブラリ

**技術スタック**:
```typescript
// 構成
{
  framework: 'Next.js 15 (App Router)',
  language: 'TypeScript 5.7',
  styling: 'Tailwind CSS + shadcn/ui',
  state: 'Zustand',
  forms: 'React Hook Form + Zod',
  api: 'tRPC v11',
  auth: 'NextAuth.js v5',
  db: 'Prisma + PostgreSQL (pgvector)',
  deployment: 'Vercel'
}
```

**プロジェクト構成**:
```
codestencil/
├── apps/
│   ├── web/              # Next.js フロントエンド
│   └── lsp-server/       # LSPサーバー
├── packages/
│   ├── ast/              # Tree-sitter ラッパー
│   ├── embedding/        # エンベディング生成
│   ├── llm/              # LLM プロバイダー抽象化
│   ├── db/               # Prisma スキーマ
│   └── config/           # 共通設定
└── docs/
```

---

## 推奨技術スタック総覧

| コンポーネント | 採用技術 | バージョン |
|--------------|---------|-----------|
| AST解析 | Tree-sitter | 最新 |
| ベクトルDB | pgvector | 0.7.0+ |
| LLM | OpenAI GPT-4o-mini (メイン) / Ollama (サブ) | - |
| LSP | vscode-languageserver | 9.0.0+ |
| フロントエンド | Next.js | 15 (App Router) |
| バックエンド | tRPC | v11 |
| ORM | Prisma | 6.0+ |
| データベース | PostgreSQL | 16+ |
| スタイリング | Tailwind CSS | 3.4+ |
| UIコンポーネント | shadcn/ui | 最新 |

---

## MVP実装ロードマップ

### Phase 1: 基盤構築 (2週間)
- [ ] プロジェクト構成（Monorepo: Turborepo）
- [ ] データベース設計とPrismaスキーマ
- [ ] Tree-sitterラッパーの実装
- [ ] pgvector のセットアップ

### Phase 2: コア機能 (3週間)
- [ ] LLMプロバイダー抽象化レイヤー
- [ ] RAGによる類似コード検索
- [ ] テンプレート生成エンジン
- [ ] 基本的なWeb UI

### Phase 3: LSP統合 (2週間)
- [ ] LSPサーバーの実装
- [ ] VS Code拡張機能
- [ ] テンプレート挿入機能

### Phase 4: ブラッシュアップ (1週間)
- [ ] パフォーマンス最適化
- [ ] エラーハンドリング強化
- [ ] ドキュメント整備

---

## リスクと軽減策

| リスク | 影響 | 軽減策 |
|--------|------|--------|
| LLM API コスト | 高 | キャッシング戦略、ローカルLLMオプション |
| AST解析の精度 | 中 | Tree-sitterの採用（エラー耐性が高い） |
| マルチリポジトリ対応 | 中 | 最初はシングルリポジトリのみ対応 |
| エディタ対応の複雑さ | 高 | 最初はVS Codeのみ対応、他は後回し |

---

## 参考リソース

- [Tree-sitter Documentation](https://tree-sitter.github.io/tree-sitter/)
- [pgvector GitHub](https://github.com/pgvector/pgvector)
- [vscode-languageserver-node](https://github.com/microsoft/vscode-languageserver-node)
- [Next.js Documentation](https://nextjs.org/docs)
- [tRPC Documentation](https://trpc.io/docs)
