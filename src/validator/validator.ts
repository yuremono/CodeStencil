// Validator Agent - Main Implementation

import type {
  ValidationOptions,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ValidationInfo,
  ValidationSummary,
} from './types'
import { checkSecurity, checkSecurityBestPractices } from './security'

export class ValidatorAgent {
  /**
   * Validate code
   */
  async validate(
    code: string,
    options: ValidationOptions
  ): Promise<ValidationResult> {
    const {
      language,
      checkSyntax = true,
      checkTypes = true,
      checkStyle = true,
      checkSecurity = true,
    } = options

    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []
    const info: ValidationInfo[] = []

    // 1. Syntax check
    if (checkSyntax) {
      const syntaxErrors = await this.checkSyntax(code, language)
      errors.push(...syntaxErrors)
    }

    // 2. Type check
    if (checkTypes && (language.includes('ts') || language.includes('typescript'))) {
      const typeErrors = await this.checkTypes(code, language)
      errors.push(...typeErrors)
    }

    // 3. Style check
    if (checkStyle) {
      const styleWarnings = await this.checkStyle(code, language)
      warnings.push(...styleWarnings)
    }

    // 4. Security check
    if (checkSecurity) {
      const securityIssues = checkSecurity(code)
      const securityResult = checkSecurityBestPractices(code, language)

      errors.push(
        ...securityIssues.map(issue => ({
          type: issue.type as ValidationError['type'],
          message: issue.message,
          line: issue.line,
          severity: issue.severity === 'critical' || issue.severity === 'high' ? 'error' : 'warning' as const,
        }))
      )

      warnings.push(
        ...securityResult.suggestions.map(suggestion => ({
          type: 'best-practice' as const,
          message: suggestion,
          suggestion,
        }))
      )
    }

    // 5. Generate summary
    const summary = this.generateSummary(errors, warnings, info)

    return {
      valid: summary.totalErrors === 0,
      errors,
      warnings,
      info,
      summary,
    }
  }

  /**
   * Validate template files
   */
  async validateTemplate(
    files: Array<{ path: string; content: string }>,
    options: ValidationOptions
  ): Promise<ValidationResult> {
    const allErrors: ValidationError[] = []
    const allWarnings: ValidationWarning[] = []
    const allInfo: ValidationInfo[] = []

    // Validate each file
    for (const file of files) {
      const result = await this.validate(file.content, options)

      // Add file path to errors/warnings
      allErrors.push(
        ...result.errors.map(err => ({
          ...err,
          message: `${file.path}:${err.line || 1}: ${err.message}`,
        }))
      )

      allWarnings.push(
        ...result.warnings.map(warn => ({
          ...warn,
          message: `${file.path}:${warn.line || 1}: ${warn.message}`,
        }))
      )

      allInfo.push(...result.info)
    }

    // Check for duplicate files
    const paths = files.map(f => f.path)
    const duplicates = paths.filter((path, index) => paths.indexOf(path) !== index)
    if (duplicates.length > 0) {
      allErrors.push({
        type: 'syntax',
        message: `Duplicate file paths detected: ${duplicates.join(', ')}`,
        severity: 'error',
      })
    }

    // Check for required files
    const hasIndex = paths.some(p => p.includes('index'))
    if (!hasIndex && files.length > 1) {
      allWarnings.push({
        type: 'best-practice',
        message: 'Template should include an index.ts file for exports',
        suggestion: 'Add an index.ts that exports from all other files',
      })
    }

    const summary = this.generateSummary(allErrors, allWarnings, allInfo)

    return {
      valid: summary.totalErrors === 0,
      errors: allErrors,
      warnings: allWarnings,
      info: allInfo,
      summary,
    }
  }

  /**
   * Check syntax
   */
  private async checkSyntax(
    code: string,
    language: string
  ): Promise<ValidationError[]> {
    const errors: ValidationError[] = []

    // Basic syntax checks
    const lines = code.split('\n')

    // Check for unclosed brackets
    const brackets = { '(': ')', '[': ']', '{': '}' }
    const stack: string[] = []

    for (let i = 0; i < code.length; i++) {
      const char = code[i]

      if (brackets[char as keyof typeof brackets]) {
        stack.push(char)
      } else if (Object.values(brackets).includes(char)) {
        const last = stack.pop()
        if (brackets[last as keyof typeof brackets] !== char) {
          errors.push({
            type: 'syntax',
            message: `Unexpected closing bracket '${char}'`,
            line: getLineNumber(code, i),
            severity: 'error',
          })
        }
      }
    }

    // Check for unclosed brackets
    if (stack.length > 0) {
      errors.push({
        type: 'syntax',
        message: `Unclosed bracket(s): ${stack.join(', ')}`,
        severity: 'error',
      })
    }

    // Check for unclosed strings
    const singleQuotes = (code.match(/'/g) || []).length
    const doubleQuotes = (code.match(/"/g) || []).length
    const templateLiterals = (code.match(/`/g) || []).length

    if (singleQuotes % 2 !== 0) {
      errors.push({
        type: 'syntax',
        message: 'Unclosed single quote detected',
        severity: 'error',
      })
    }
    if (doubleQuotes % 2 !== 0) {
      errors.push({
        type: 'syntax',
        message: 'Unclosed double quote detected',
        severity: 'error',
      })
    }
    if (templateLiterals % 2 !== 0) {
      errors.push({
        type: 'syntax',
        message: 'Unclosed template literal detected',
        severity: 'error',
      })
    }

    return errors
  }

  /**
   * Check types (basic TypeScript checks)
   */
  private async checkTypes(
    code: string,
    language: string
  ): Promise<ValidationError[]> {
    const errors: ValidationError[] = []

    // Check for 'any' type usage
    const anyMatches = code.matchAll(/:\s*any\b/g)
    for (const match of anyMatches) {
      if (match.index !== undefined) {
        errors.push({
          type: 'type',
          message: 'Avoid using "any" type. Use specific types or "unknown".',
          line: getLineNumber(code, match.index),
          severity: 'warning',
        })
      }
    }

    // Check for missing return types
    const functionMatches = code.matchAll(/function\s+\w+\s*\([^)]*\)\s*(?=:)/g)
    for (const match of functionMatches) {
      if (match.index !== undefined) {
        const line = getLineNumber(code, match.index)
        // Check if return type is specified
        const afterFunction = code.substring(match.index, match.index + 100)
        if (!afterFunction.includes(':')) {
          errors.push({
            type: 'type',
            message: 'Function should have explicit return type annotation',
            line,
            severity: 'warning',
          })
        }
      }
    }

    // Check for untyped parameters
    const paramMatches = code.matchAll(/\(\s*(\w+)\s*(?::)/g)
    for (const match of paramMatches) {
      if (match.index !== undefined) {
        errors.push({
          type: 'type',
          message: `Parameter '${match[1]}' should have a type annotation`,
          line: getLineNumber(code, match.index),
          severity: 'warning',
        })
      }
    }

    return errors
  }

  /**
   * Check style
   */
  private async checkStyle(
    code: string,
    language: string
  ): Promise<ValidationWarning[]> {
    const warnings: ValidationWarning[] = []
    const lines = code.split('\n')

    // Check indentation consistency
    const indentStyles = lines
      .filter(line => line.trim().length > 0)
      .map(line => {
        const match = line.match(/^(\s+)/)
        return match ? (match[1].includes('\t') ? 'tabs' : 'spaces') : null
      })
      .filter((style): style is string => style !== null)

    if (indentStyles.length > 0) {
      const hasTabs = indentStyles.some(s => s === 'tabs')
      const hasSpaces = indentStyles.some(s => s === 'spaces')
      if (hasTabs && hasSpaces) {
        warnings.push({
          type: 'style',
          message: 'Mixed indentation styles detected (tabs and spaces)',
          suggestion: 'Use either tabs or spaces consistently',
        })
      }
    }

    // Check for console.log
    const logMatches = code.matchAll(/console\.(log|debug|info|warn)\(/g)
    for (const match of logMatches) {
      if (match.index !== undefined) {
        warnings.push({
          type: 'style',
          message: `console.${match[1]}() should be removed in production`,
          line: getLineNumber(code, match.index),
          suggestion: 'Use a proper logging library or remove',
        })
      }
    }

    // Check for TODO comments
    const todoMatches = code.matchAll(/\/\/\s*TODO:/gi)
    for (const match of todoMatches) {
      if (match.index !== undefined) {
        warnings.push({
          type: 'best-practice',
          message: 'TODO comment detected',
          line: getLineNumber(code, match.index),
          suggestion: 'Consider creating an issue or implementing the TODO',
        })
      }
    }

    // Check for empty lines at end of file
    if (code.length > 0 && !code.endsWith('\n')) {
      warnings.push({
        type: 'style',
        message: 'File should end with a newline',
        suggestion: 'Add a newline at the end of the file',
      })
    }

    return warnings
  }

  /**
   * Generate validation summary
   */
  private generateSummary(
    errors: ValidationError[],
    warnings: ValidationWarning[],
    info: ValidationInfo[]
  ): ValidationSummary {
    const totalErrors = errors.length
    const totalWarnings = warnings.length
    const totalInfo = info.length

    // Calculate score (0-100)
    let score = 100
    score -= totalErrors * 10
    score -= totalWarnings * 2
    score -= totalInfo
    score = Math.max(0, score)

    // Check for blocking issues
    const hasBlockingIssues = errors.some(e => e.severity === 'error')

    return {
      totalErrors,
      totalWarnings,
      totalInfo,
      hasBlockingIssues,
      score,
    }
  }
}

/**
 * Get line number from index
 */
function getLineNumber(code: string, index: number): number {
  const before = code.substring(0, index)
  return before.split('\n').length
}

// Export singleton instance
export const validatorAgent = new ValidatorAgent()
