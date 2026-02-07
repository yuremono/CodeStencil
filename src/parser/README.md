# @codestencil/parser

Tree-sitterを使用したAST解析パッケージ。

## 機能

- TypeScript/JavaScript/Python/Go のソースコード解析
- ASTノードの抽出（関数、クラス、インターフェース等）
- インポート/エクスポートの解析
- 命名規則の自動検出
- エラー耐性のあるパース

## インストール

```bash
pnpm install
```

## 使用方法

```typescript
import { Parser, Language } from '@codestencil/parser';

const parser = new Parser();
const sourceCode = `
export function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
`;

const result = parser.parse(sourceCode, {
  language: Language.TypeScript,
});

console.log(result.declarations);
// [
//   {
//     type: 'function_declaration',
//     name: 'greet',
//     parameters: [{ name: 'name', type: 'string' }],
//     returnType: 'string',
//     isAsync: false,
//     isGenerator: false,
//     ...
//   }
// ]

// 命名規則の分析
const naming = parser.analyzeNaming(result);
console.log(naming);
// {
//   functions: 'camelCase',
//   classes: 'PascalCase',
//   ...
// }
```

## 対応言語

- TypeScript
- JavaScript
- Python
- Go

## API

### Parser

#### `parse(sourceCode: string, options: ParserOptions): ParseResult`

ソースコードをパースします。

**Parameters:**
- `sourceCode`: 解析するソースコード
- `options.language`: 対象言語 (`Language` enum)
- `options.tolerant?: boolean`: エラーを許容するか（デフォルト: true）
- `options.includeLocations?: boolean`: 位置情報を含めるか（デフォルト: true）

**Returns:** `ParseResult`

#### `analyzeNaming(result: ParseResult): NamingPattern`

プロジェクトの命名規則を分析します。

**Parameters:**
- `result`: パース結果

**Returns:** `NamingPattern`

### 型定義

```typescript
// パース結果
interface ParseResult {
  language: Language;
  declarations: Declaration[];
  imports: ImportDeclaration[];
  exports: ExportDeclaration[];
  calls: CallExpression[];
  errors: ParseError[];
}

// 宣言
type Declaration =
  | FunctionDeclaration
  | ClassDeclaration
  | InterfaceDeclaration
  | TypeAliasDeclaration
  | VariableDeclaration;

// 命名規則
interface NamingPattern {
  variables: NamingConvention;
  functions: NamingConvention;
  classes: NamingConvention;
  interfaces: NamingConvention;
  constants: NamingConvention;
}

enum NamingConvention {
  camelCase = 'camelCase',
  PascalCase = 'PascalCase',
  snake_case = 'snake_case',
  SCREAMING_SNAKE_CASE = 'SCREAMING_SNAKE_CASE',
  'kebab-case' = 'kebab-case',
  unknown = 'unknown',
}
```

## テスト

```bash
pnpm test
```

## ビルド

```bash
pnpm build
```

## ライセンス

MIT
