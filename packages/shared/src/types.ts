// 共通型定義

export interface CodeTemplate {
  id: string;
  name: string;
  description: string;
  language: string;
  code: string;
  metadata: TemplateMetadata;
}

export interface TemplateMetadata {
  author?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  ast?: ASTNode;
}

export interface ASTNode {
  type: string;
  children?: ASTNode[];
  [key: string]: unknown;
}

export interface ParserResult {
  success: boolean;
  ast?: ASTNode;
  error?: string;
}

export interface StyleAnalysis {
  indentStyle: "space" | "tab";
  indentSize: number;
  semicolons: boolean;
  quotes: "single" | "double";
  trailingComma: boolean;
}

export interface GenerationContext {
  language: string;
  style: StyleAnalysis;
  ast?: ASTNode;
  prompt: string;
}

export interface ValidationResult {
  success: boolean;
  errors?: ValidationError[];
  warnings?: ValidationWarning[];
}

export interface ValidationError {
  line: number;
  column: number;
  message: string;
  severity: "error" | "warning";
}

export type ValidationWarning = ValidationError;
