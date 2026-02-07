# CodeStencil アーキテクチャ設計

> 作成日: 2026-02-07
> バージョン: 0.1.0
> 担当: @member2

---

## システム概要

CodeStencilはAI駆動のインテリジェントコードテンプレートプラットフォーム。プロジェクトのコンテキストを理解し、最適なテンプレートを生成・提案する。

---

## 全体アーキテクチャ

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CodeStencil                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                │
│  │   Editor    │    │   Web UI    │    │  CLI Tool   │                │
│  │  (LSP Client)│   │  (Next.js)  │    │   (Optional) │                │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘                │
│         │                   │                   │                      │
│         └───────────────────┼───────────────────┘                      │
│                             │                                          │
│                     ┌───────▼────────┐                                │
│                     │  API Gateway   │                                │
│                     │    (tRPC)      │                                │
│                     └───────┬────────┘                                │
│                             │                                          │
│         ┌───────────────────┼───────────────────┐                     │
│         │                   │                   │                     │
│  ┌──────▼────────┐  ┌──────▼────────┐  ┌──────▼────────┐            │
│  │ Parser Agent  │  │  Style Agent  │  │ Generator     │            │
│  │  (AST解析)    │  │  (スタイル学習)│  │   Agent       │            │
│  │  Tree-sitter  │  │  RAG検索      │  │   (LLM)        │            │
│  └──────┬────────┘  └──────┬────────┘  └──────┬────────┘            │
│         │                   │                   │                     │
│         └───────────────────┼───────────────────┘                     │
│                             │                                          │
│                     ┌───────▼────────┐                                │
│                     │ Validator Agent│                                │
│                     │  (静的解析)     │                                │
│                     └───────┬────────┘                                │
│                             │                                          │
│         ┌───────────────────┼───────────────────┐                     │
│         │                   │                   │                     │
│  ┌──────▼────────┐  ┌──────▼────────┐  ┌──────▼────────┐            │
│  │ PostgreSQL    │  │ Vector Store  │  │  File System  │            │
│  │ + pgvector    │  │  (pgvector)   │  │  (Repo Cache) │            │
│  └───────────────┘  └───────────────┘  └───────────────┘            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## エージェントアーキテクチャ

### 1. Parser Agent（AST解析）

**役割**: ソースコードをパースし、構造情報を抽出

```typescript
interface ParserAgent {
  // コードをパースしてASTを生成
  parse(sourceCode: string, language: string): Promise<AST>

  // インポート/エクスポートを抽出
  extractImports(ast: AST): Import[]

  // 関数/クラス定義を抽出
  extractDefinitions(ast: AST): Definition[]

  // コードの命名規則を分析
  analyzeNaming(ast: AST): NamingPattern
}

実装:
import * as parser from 'tree-sitter'

class TreeSitterParser implements ParserAgent {
  private parsers = new Map<string, Language>()

  async parse(sourceCode: string, language: string) {
    const lang = this.getLanguage(language)
    const tree = lang.parse(sourceCode)
    return this.convertToAST(tree)
  }
}
```

**サポート言語**:
- TypeScript / JavaScript
- Python
- Go
- Rust
- Java
- その他Tree-sitter対応言語

### 2. Style Agent（スタイル学習）

**役割**: プロジェクトのコーディングスタイルを学習・推論

```typescript
interface StyleAgent {
  // プロジェクト全体のスタイルを分析
  analyzeProject(repoPath: string): Promise<ProjectStyle>

  // 類似するパターンを検索（RAG）
  findSimilarPatterns(query: string, limit: number): Promise<CodePattern[]>

  // スタイルガイドを生成
  generateStyleGuide(style: ProjectStyle): StyleGuide
}

実装:
class RAGStyleAgent implements StyleAgent {
  async findSimilarPatterns(query: string, limit: number) {
    const embedding = await this.embed(query)

    return this.db.query(`
      SELECT id, content, 1 - (embedding <=> $1) AS similarity
      FROM code_patterns
      WHERE embedding <=> $1 < 0.3
      ORDER BY similarity DESC
      LIMIT $2
    `, [embedding, limit])
  }
}
```

**学習するスタイル要素**:
- インポートスタイル（絶対/相対パス、名前空間）
- 命名規則（camelCase, PascalCase, snake_case）
- インデント（スペース2/4、タブ）
- セミコロンの有無
- アロー関数 vs function宣言
- TypeScript型定義のスタイル

### 3. Generator Agent（テンプレート生成）

**役割**: LLMを使用してテンプレートを生成

```typescript
interface GeneratorAgent {
  // テンプレートを生成
  generateTemplate(
    request: TemplateRequest,
    context: ProjectContext
  ): Promise<GeneratedTemplate>

  // 既存コードに基づいたテンプレート生成
  generateFromPattern(
    pattern: CodePattern,
    requirements: Requirements
  ): Promise<GeneratedTemplate>
}

実装:
class LLMGeneratorAgent implements GeneratorAgent {
  async generateTemplate(request: TemplateRequest, context: ProjectContext) {
    const prompt = this.buildPrompt(request, context)
    const completion = await this.llm.generate(prompt)
    return this.parseTemplate(completion)
  }

  private buildPrompt(request: TemplateRequest, context: ProjectContext): string {
    return `
あなたはコードテンプレート生成エキスパートです。

## リクエスト
${request.description}

## プロジェクトのスタイル
${context.style.guide}

## 既存の類似パターン
\`\`\`${context.language}
${context.similarPattern}
\`\`\`

## 制約
- プロジェクトの命名規則に従う
- 既存のインポートスタイルを維持
- TypeScriptの型定義を含める

テンプレートを生成してください。
    `
  }
}
```

### 4. Validator Agent（静的解析）

**役割**: 生成されたコードの品質を検証

```typescript
interface ValidatorAgent {
  // 構文エラーをチェック
  validateSyntax(code: string, language: string): Promise<ValidationResult>

  // リンティング
  lint(code: string, config: LintConfig): Promise<LintResult>

  // セキュリティチェック
  checkSecurity(code: string): Promise<SecurityIssue[]>
}

実装:
class ASTValidator implements ValidatorAgent {
  async validateSyntax(code: string, language: string) {
    const parser = new TreeSitterParser()
    const ast = await parser.parse(code, language)

    return {
      valid: !ast.hasErrors,
      errors: ast.errors
    }
  }
}
```

---

## データフロー

### テンプレート生成フロー

```
ユーザーリクエスト
     │
     ▼
┌────────────────┐
│ Parser Agent   │ ← ソースコードをパース
│ AST解析        │
└────────┬───────┘
         │
         ▼
┌────────────────┐
│ Style Agent    │ ← プロジェクトスタイルを分析
│ RAGで類似パターン検索
└────────┬───────┘
         │
         ▼
┌────────────────┐
│ Generator      │ ← LLMでテンプレート生成
│ Agent          │   (コンテキストを考慮)
└────────┬───────┘
         │
         ▼
┌────────────────┐
│ Validator      │ ← 構文・リントチェック
│ Agent          │
└────────┬───────┘
         │
         ▼
┌────────────────┐
│ テンプレート出力 │
└────────────────┘
```

---

## データベース設計

### 主要テーブル

```sql
-- プロジェクト
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  repository_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- コードパターン
CREATE TABLE code_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  language TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536),  -- pgvector
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- テンプレート
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  language TEXT NOT NULL,
  code TEXT NOT NULL,
  tags TEXT[],
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 生成履歴
CREATE TABLE generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  template_id UUID REFERENCES templates(id),
  request TEXT NOT NULL,
  result TEXT,
  llm_provider TEXT,
  llm_model TEXT,
  tokens_used INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## LSP統合

### LSPサーバーの機能

```typescript
const server = createConnection(ProposedFeatures.all)

// コード補完
server.onCompletion(async (params) => {
  const document = documents.get(params.textDocument.uri)
  const context = await analyzeContext(document)

  return getTemplateSuggestions(context)
})

// コードアクション
server.onCodeAction(async (params) => {
  return [
    {
      title: 'Generate template for this pattern',
      kind: CodeActionKind.QuickFix,
      command: Command('codestencil.generate', 'Generate Template')
    }
  ]
})

// ホバー情報
server.onHover(async (params) => {
  const pattern = await identifyPattern(params.position)
  return {
    contents: getPatternDocumentation(pattern)
  }
})
```

---

## プロジェクト構成

```
codestencil/
├── apps/
│   ├── web/                      # Next.js Webアプリ
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   │
│   ├── lsp-server/               # LSPサーバー
│   │   ├── src/
│   │   │   ├── server.ts
│   │   │   ├── handlers/
│   │   │   └── agents/
│   │   └── package.json
│   │
│   └── cli/                      # CLIツール（オプション）
│       └── src/
│
├── packages/
│   ├── ast/                      # AST解析パッケージ
│   │   ├── src/
│   │   │   ├── parser.ts
│   │   │   ├── tree-sitter.ts
│   │   │   └── languages/
│   │   └── package.json
│   │
│   ├── embedding/                # エンベディング生成
│   │   ├── src/
│   │   │   ├── openai.ts
│   │   │   └── ollama.ts
│   │   └── package.json
│   │
│   ├── llm/                      # LLM抽象化
│   │   ├── src/
│   │   │   ├── provider.ts
│   │   │   ├── openai.ts
│   │   │   └── ollama.ts
│   │   └── package.json
│   │
│   ├── db/                       # データベース
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── src/
│   │
│   ├── config/                   # 共通設定
│   │   ├── tsconfig.json
│   │   └── eslint.config.js
│   │
│   └── ui/                       # 共通UIコンポーネント
│       └── src/
│
├── docs/
│   ├── tech_stack_analysis.md
│   ├── architecture.md
│   └── api.md
│
├── package.json
├── turbo.json
└── pnpm-workspace.yaml
```

---

## スケーラビリティ考慮

### 水平スケーリング
- LSPサーバー: ユーザーごとに独立したプロセス
- APIサーバー: Kubernetes等でスケールアウト可能
- データベース: pgvectorはレプリケーション対応

### パフォーマンス最適化
- AST解析結果のキャッシュ（Redis）
- エンベディングの事前計算
- LLMレスポンスのキャッシュ
- WebSocketによるリアルタイム更新

---

## セキュリティ考慮

| 脅威 | 対策 |
|------|------|
| プライベートコードの漏洩 | ローカルLLMオプション（Ollama） |
| マルiciousコードの生成 | Validator Agentでの検証 |
| APIキーの漏洩 | 環境変数管理、暗号化 |
| リポジトリへの不正アクセス | OAuth認証、スコープ制限 |

---

## 今後の拡張

### Phase 2+
- [ ] 複数リポジトリ対応（monorepo）
- [ ] チーム共有機能
- [ ] テンプレートマーケットプレイス
- [ ] CI/CD連携
- [ ] GitHub Actions / GitLab CIとの統合
- [ ] プルリクエストの自動レビュー
