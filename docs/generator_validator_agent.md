# Generator/Validator Agent ドキュメント

> **作成日**: 2026-02-07
> **担当**: @member3

---

## 概要

Generator AgentはLLMを使用してコードテンプレートを生成し、Validator Agentは生成されたコードの品質を検証します。

---

## Generator Agent

### 機能

1. **テンプレート生成**: ユーザーの要件からコードテンプレートを生成
2. **RAG対応**: 過去のパターンを参照して高品質なコードを生成
3. **スタイル適用**: プロジェクトのコーディングスタイルを適用
4. **リファイン**: フィードバックに基づいてテンプレートを改善

### 使用方法

```typescript
import { generatorAgent } from '@/generator'

// 基本的なテンプレート生成
const template = await generatorAgent.generateTemplate({
  language: 'typescript',
  description: 'Create a React hook for data fetching with loading state',
  codeStyle: {
    semi: true,
    singleQuote: true,
    indentSize: 2,
  },
})

// RAGを使用した生成
const ragTemplate = await generatorAgent.generateTemplateWithRAG({
  language: 'typescript',
  description: 'API route for user authentication',
  userId: 'user-123',
})

// テンプレートのリファイン
const refined = await generatorAgent.refineTemplate(
  template,
  'Add error handling for network failures'
)
```

### 出力形式

```typescript
{
  name: 'useFetch Hook',
  description: 'Data fetching hook with loading and error states',
  language: 'typescript',
  files: [
    {
      path: 'useFetch.ts',
      content: 'export function useFetch(url: string) { ... }'
    }
  ],
  placeholders: [
    {
      name: 'url',
      type: 'string',
      default: '/api/data',
      required: true,
      description: 'API endpoint URL'
    }
  ],
  metadata: {
    generatedAt: '2026-02-07T...',
    model: 'gpt-4o-mini',
    retrievedPatterns: 3
  }
}
```

---

## Validator Agent

### 機能

1. **構文チェック**: 基本的な構文エラーを検出
2. **型チェック**: TypeScriptの型の問題を検出
3. **スタイルチェック**: コーディングスタイルの一貫性を検証
4. **セキュリティチェック**: 一般的な脆弱性を検出

### セキュリティチェック項目

| タイプ | 説明 | 重大度 |
|--------|------|--------|
| SQLインジェクション | ユーザー入力の直接連結 | Critical |
| XSS | innerHTMLの使用 | High |
| ハードコードされたシークレット | APIキーやパスワードの直書き | High |
| 安全でない乱数 | Math.random()の使用 | Medium |
| evalの使用 | eval()やnew Function() | High |

### 使用方法

```typescript
import { validatorAgent } from '@/validator'

// コードの検証
const result = await validatorAgent.validate(code, {
  language: 'typescript',
  checkSyntax: true,
  checkTypes: true,
  checkStyle: true,
  checkSecurity: true,
})

if (!result.valid) {
  console.error('Validation failed:', result.errors)
}

if (result.warnings.length > 0) {
  console.warn('Warnings:', result.warnings)
}

console.log('Quality Score:', result.summary.score)
```

### テンプレート全体の検証

```typescript
const result = await validatorAgent.validateTemplate(
  [
    { path: 'useFetch.ts', content: '...' },
    { path: 'types.ts', content: '...' },
  ],
  { language: 'typescript' }
)
```

---

## 統合フロー

```typescript
import { generatorAgent } from '@/generator'
import { validatorAgent } from '@/validator'

// 1. テンプレートを生成
const template = await generatorAgent.generateTemplateWithRAG({
  language: 'typescript',
  description: 'React custom hook',
})

// 2. 生成されたコードを検証
const mainFile = template.files[0]
const validation = await validatorAgent.validate(mainFile.content, {
  language: template.language,
  checkSecurity: true,
})

// 3. エラーがあればリファイン
if (!validation.valid) {
  const feedback = validation.errors.map(e => e.message).join('\n')
  template = await generatorAgent.refineTemplate(template, feedback)
}

// 4. 最終検証
const finalValidation = await validatorAgent.validateTemplate(
  template.files,
  { language: template.language }
)

console.log('Final score:', finalValidation.summary.score)
```

---

## 品質スコア

品質スコアは以下の計算式で算出されます：

```
スコア = 100 - (エラー数 × 10) - (警告数 × 2) - (情報数 × 1)
```

| スコア範囲 | 評価 |
|-----------|------|
| 90-100 | 優秀 |
| 70-89 | 良好 |
| 50-69 | 普通 |
| 30-49 | 要改善 |
| 0-29 | 不合格 |

---

## 設定

### 環境変数

```bash
# OpenAI API（Generatorで使用）
OPENAI_API_KEY="sk-..."

# Ollama（ローカルLLM、オプション）
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="llama3.1"
```

### コーディングスタイル設定

```typescript
const codeStyle = {
  indentStyle: 'spaces', // or 'tabs'
  indentSize: 2,
  semi: true,
  singleQuote: true,
  trailingComma: true,
}
```

---

## パフォーマンスの最適化

1. **キャッシュ**: 生成されたテンプレートをデータベースにキャッシュ
2. **バッチ検証**: 複数ファイルを並行して検証
3. **差分検証**: 変更された部分のみを再検証

```typescript
// バッチ検証の例
const results = await Promise.all(
  files.map(file =>
    validatorAgent.validate(file.content, { language: 'typescript' })
  )
)
```

---

## 次のステップ

1. [ ] Generator/Validator Agentのテスト実装
2. [ ] より高度なセキュリティチェックの追加
3. [ ] ESLint/TSLintとの統合
4. [ ] カスタムバリデーションルールのサポート

---

**参考リソース**:
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Zod Documentation](https://zod.dev/)
- [ESLint Documentation](https://eslint.org/docs/latest/)
