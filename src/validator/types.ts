// Validator Agent Types

export interface ValidationOptions {
  language: string
  checkSyntax?: boolean
  checkTypes?: boolean
  checkStyle?: boolean
  checkSecurity?: boolean
  customRules?: ValidationRule[]
}

export interface ValidationRule {
  name: string
  severity: 'error' | 'warning' | 'info'
  check: (code: string) => ValidationResult
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
  info: ValidationInfo[]
  summary: ValidationSummary
}

export interface ValidationError {
  type: 'syntax' | 'type' | 'security' | 'import'
  message: string
  line?: number
  column?: number
  rule?: string
  fix?: {
    description: string
    replacement: string
  }
}

export interface ValidationWarning {
  type: 'style' | 'best-practice' | 'performance' | 'accessibility'
  message: string
  line?: number
  column?: number
  rule?: string
  suggestion?: string
}

export interface ValidationInfo {
  type: 'info' | 'suggestion'
  message: string
  line?: number
  suggestion?: string
}

export interface ValidationSummary {
  totalErrors: number
  totalWarnings: number
  totalInfo: number
  hasBlockingIssues: boolean
  score: number // 0-100
}

export interface SecurityIssue {
  type: 'sql-injection' | 'xss' | 'hardcoded-secret' | 'insecure-random' | 'eval'
  message: string
  line: number
  severity: 'critical' | 'high' | 'medium' | 'low'
}

export interface StyleIssue {
  type: 'indentation' | 'quotes' | 'semicolons' | 'naming' | 'unused'
  message: string
  line: number
  suggestion?: string
}
