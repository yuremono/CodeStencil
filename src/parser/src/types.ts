/**
 * AST Parser Type Definitions
 */

/**
 * 対応言語
 */
export enum Language {
  TypeScript = 'typescript',
  JavaScript = 'javascript',
  Python = 'python',
  Go = 'go',
  Rust = 'rust',
  Java = 'java',
  CPP = 'cpp',
}

/**
 * ソースコードの位置情報
 */
export interface SourceLocation {
  /** 開始行 (1-indexed) */
  startLine: number;
  /** 開始列 (0-indexed) */
  startColumn: number;
  /** 終了行 (1-indexed) */
  endLine: number;
  /** 終了列 (0-indexed) */
  endColumn: number;
}

/**
 * ASTノードの種類
 */
export enum NodeType {
  // 宣言
  FunctionDeclaration = 'function_declaration',
  ClassDeclaration = 'class_declaration',
  InterfaceDeclaration = 'interface_declaration',
  TypeAliasDeclaration = 'type_alias_declaration',
  VariableDeclaration = 'variable_declaration',

  // ステートメント
  IfStatement = 'if_statement',
  ForStatement = 'for_statement',
  WhileStatement = 'while_statement',
  ReturnStatement = 'return_statement',
  TryStatement = 'try_statement',

  // 式
  CallExpression = 'call_expression',
  MemberExpression = 'member_expression',
  BinaryExpression = 'binary_expression',
  ArrowFunction = 'arrow_function',

  // その他
  ImportStatement = 'import_statement',
  ExportStatement = 'export_statement',
  Identifier = 'identifier',
  Literal = 'literal',
}

/**
 * ASTノードの基底インターフェース
 */
export interface ASTNode {
  /** ノードタイプ */
  type: NodeType;
  /** ソースコード上の位置 */
  location: SourceLocation;
  /** 子ノード */
  children?: ASTNode[];
}

/**
 * インポート宣言
 */
export interface ImportDeclaration extends ASTNode {
  type: NodeType.ImportStatement;
  /** インポート元のパス */
  source: string;
  /** インポートするシンボル */
  specifiers: ImportSpecifier[];
}

/**
 * インポートSpecifier
 */
export interface ImportSpecifier {
  /** インポート元の名前 */
  imported: string;
  /** ローカルでの名前 */
  local: string;
  /** デフォルトインポートかどうか */
  isDefault: boolean;
  /** 型インポートかどうか (TypeScript) */
  isType: boolean;
}

/**
 * エクスポート宣言
 */
export interface ExportDeclaration extends ASTNode {
  type: NodeType.ExportStatement;
  /** エクスポートされるシンボル */
  specifiers: ExportSpecifier[];
  /** ソース指定 (re-exportのみ) */
  source?: string;
}

/**
 * エクスポートSpecifier
 */
export interface ExportSpecifier {
  /** ローカル名 */
  local: string;
  /** エクスポート名 */
  exported: string;
}

/**
 * 関数宣言
 */
export interface FunctionDeclaration extends ASTNode {
  type: NodeType.FunctionDeclaration;
  /** 関数名 */
  name: string;
  /** パラメータリスト */
  parameters: Parameter[];
  /** 戻り値の型 (TypeScript) */
  returnType?: string;
  /** 非同期関数かどうか */
  isAsync: boolean;
  /** ジェネレータかどうか */
  isGenerator: boolean;
}

/**
 * パラメータ
 */
export interface Parameter {
  /** パラメータ名 */
  name: string;
  /** パラメータの型 (TypeScript) */
  type?: string;
  /** デフォルト値 */
  defaultValue?: string;
}

/**
 * クラス宣言
 */
export interface ClassDeclaration extends ASTNode {
  type: NodeType.ClassDeclaration;
  /** クラス名 */
  name: string;
  /** 継承するクラス */
  extends?: string;
  /** 実装するインターフェース */
  implements?: string[];
  /** クラスメンバ */
  members: ClassMember[];
}

/**
 * クラスメンバ
 */
export interface ClassMember {
  /** メンバタイプ */
  kind: 'method' | 'property' | 'getter' | 'setter';
  /** 名前 */
  name: string;
  /** アクセシビリティ */
  accessibility: 'public' | 'private' | 'protected';
  /** 静的メンバかどうか */
  isStatic: boolean;
  /** 型 (プロパティの場合) */
  type?: string;
}

/**
 * インターフェース宣言 (TypeScript)
 */
export interface InterfaceDeclaration extends ASTNode {
  type: NodeType.InterfaceDeclaration;
  /** インターフェース名 */
  name: string;
  /** 拡張するインターフェース */
  extends?: string[];
  /** プロパティ・メソッド */
  members: InterfaceMember[];
}

/**
 * インターフェースメンバ
 */
export interface InterfaceMember {
  /** メンバタイプ */
  kind: 'property' | 'method';
  /** 名前 */
  name: string;
  /** 型 */
  type: string;
  /** オプションかどうか */
  isOptional: boolean;
}

/**
 * 変数宣言
 */
export interface VariableDeclaration extends ASTNode {
  type: NodeType.VariableDeclaration;
  /** 変数名 */
  name: string;
  /** 型 (TypeScript) */
  declaredType?: string;
  /** 初期値 */
  initializer?: string;
  /** 宣言キーワード */
  kind: 'const' | 'let' | 'var';
}

/**
 * 呼び出し式
 */
export interface CallExpression extends ASTNode {
  type: NodeType.CallExpression;
  /** 呼び出し関数・メソッド */
  callee: string;
  /** 引数 */
  arguments: string[];
}

/**
 * 解析結果
 */
export interface ParseResult {
  /** 言語 */
  language: Language;
  /** 抽出された宣言 */
  declarations: Declaration[];
  /** インポート */
  imports: ImportDeclaration[];
  /** エクスポート */
  exports: ExportDeclaration[];
  /** 呼び出し式 */
  calls: CallExpression[];
  /** パースエラー */
  errors: ParseError[];
}

/**
 * 宣言のユニオンタイプ
 */
export type Declaration =
  | FunctionDeclaration
  | ClassDeclaration
  | InterfaceDeclaration
  | TypeAliasDeclaration
  | VariableDeclaration;

/**
 * 型エイリアス宣言 (TypeScript)
 */
export interface TypeAliasDeclaration extends ASTNode {
  type: NodeType.TypeAliasDeclaration;
  /** 名前 */
  name: string;
  /** 型パラメータ */
  typeParameters?: string[];
  /** 型定義 */
  definition: string;
}

/**
 * パースエラー
 */
export interface ParseError {
  /** エラーメッセージ */
  message: string;
  /** エラー位置 */
  location: SourceLocation;
}

/**
 * パーサーオプション
 */
export interface ParserOptions {
  /** ソースコードの言語 */
  language: Language;
  /** エラーを許容するか */
  tolerant?: boolean;
  /** 位置情報を含めるか */
  includeLocations?: boolean;
}

/**
 * 命名規則の分析結果
 */
export interface NamingPattern {
  /** 変数命名規則 */
  variables: NamingConvention;
  /** 関数命名規則 */
  functions: NamingConvention;
  /** クラス命名規則 */
  classes: NamingConvention;
  /** インターフェース命名規則 */
  interfaces: NamingConvention;
  /** 定数命名規則 */
  constants: NamingConvention;
}

/**
 * 命名規約
 */
export enum NamingConvention {
  /** キャメルケース (myVariable) */
  camelCase = 'camelCase',
  /** パスカルケース (MyClass) */
  PascalCase = 'PascalCase',
  /** スネークケース (my_variable) */
  snake_case = 'snake_case',
  /** スネークケース大文字 (MY_CONSTANT) */
  SCREAMING_SNAKE_CASE = 'SCREAMING_SNAKE_CASE',
  /** ケバブケース (my-variable) */
  'kebab-case' = 'kebab-case',
  /** 未検出/不定 */
  unknown = 'unknown',
}
