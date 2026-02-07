// Generator Agent Types

export interface GenerateTemplateOptions {
  language: string
  description: string
  context?: string
  codeStyle?: {
    indentStyle?: 'spaces' | 'tabs'
    indentSize?: number
    semi?: boolean
    singleQuote?: boolean
    trailingComma?: boolean
  }
  userId?: string
}

export interface GeneratedTemplate {
  name: string
  description: string
  language: string
  files: GeneratedFile[]
  placeholders: Placeholder[]
  metadata: TemplateMetadata
}

export interface GeneratedFile {
  path: string
  content: string
}

export interface Placeholder {
  name: string
  type: 'string' | 'boolean' | 'number' | 'select'
  default?: string | number | boolean
  required: boolean
  options?: string[]
  description?: string
}

export interface TemplateMetadata {
  generatedAt: string
  model: string
  promptTokens: number
  completionTokens: number
  retrievedPatterns?: number
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
  suggestions: string[]
}

export interface ValidationError {
  type: 'syntax' | 'type' | 'security' | 'style'
  message: string
  line?: number
  column?: number
  severity: 'error' | 'warning'
}

export interface ValidationWarning {
  type: 'style' | 'best-practice' | 'performance'
  message: string
  line?: number
  suggestion?: string
}
