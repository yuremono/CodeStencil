// Validator Agent - Security Checks

import type { SecurityIssue } from './types'

/**
 * Security patterns to detect
 */
const SECURITY_PATTERNS = {
  sqlInjection: [
    /SELECT.*FROM.*WHERE.*=\s*["']?[\w]+\s*$/gim,
    /exec\(|execute\(|query\(\s*["'].*\+.*["']\)/gim,
  ],
  xss: [
    /innerHTML\s*=/gim,
    /dangerouslySetInnerHTML/gim,
    /document\.write\(/gim,
  ],
  hardcodedSecrets: [
    /api[_-]?key\s*[:=]\s*["']sk-[a-zA-Z0-9]{20,}["']/gim,
    /password\s*[:=]\s*["'][^"']{8,}["']/gim,
    /secret\s*[:=]\s*["'][^"']{16,}["']/gim,
    /token\s*[:=]\s*["']bearer [a-zA-Z0-9]{20,}["']/gim,
  ],
  insecureRandom: [
    /Math\.random\(\)/gim,
  ],
  evalUsage: [
    /eval\(/gim,
    /new Function\(/gim,
    /setTimeout\(["'].*["']\)/gim,
    /setInterval\(["'].*["']\)/gim,
  ],
} as const

/**
 * Check code for security issues
 */
export function checkSecurity(code: string): SecurityIssue[] {
  const issues: SecurityIssue[] = []
  const lines = code.split('\n')

  // Check SQL injection patterns
  for (const pattern of SECURITY_PATTERNS.sqlInjection) {
    let match
    const regex = new RegExp(pattern.source, pattern.flags)
    while ((match = regex.exec(code)) !== null) {
      const line = getLineNumber(code, match.index)
      issues.push({
        type: 'sql-injection',
        message: 'Potential SQL injection vulnerability. Use parameterized queries.',
        line,
        severity: 'critical',
      })
    }
  }

  // Check XSS patterns
  for (const pattern of SECURITY_PATTERNS.xss) {
    let match
    const regex = new RegExp(pattern.source, pattern.flags)
    while ((match = regex.exec(code)) !== null) {
      const line = getLineNumber(code, match.index)
      issues.push({
        type: 'xss',
        message: 'Potential XSS vulnerability. Sanitize user input before rendering.',
        line,
        severity: 'high',
      })
    }
  }

  // Check hardcoded secrets
  for (const pattern of SECURITY_PATTERNS.hardcodedSecrets) {
    let match
    const regex = new RegExp(pattern.source, pattern.flags)
    while ((match = regex.exec(code)) !== null) {
      const line = getLineNumber(code, match.index)
      issues.push({
        type: 'hardcoded-secret',
        message: 'Hardcoded secret detected. Use environment variables.',
        line,
        severity: 'high',
      })
    }
  }

  // Check insecure random
  for (const pattern of SECURITY_PATTERNS.insecureRandom) {
    let match
    const regex = new RegExp(pattern.source, pattern.flags)
    while ((match = regex.exec(code)) !== null) {
      const line = getLineNumber(code, match.index)
      issues.push({
        type: 'insecure-random',
        message: 'Insecure random number generation. Use crypto.randomBytes() or similar.',
        line,
        severity: 'medium',
      })
    }
  }

  // Check eval usage
  for (const pattern of SECURITY_PATTERNS.evalUsage) {
    let match
    const regex = new RegExp(pattern.source, pattern.flags)
    while ((match = regex.exec(code)) !== null) {
      const line = getLineNumber(code, match.index)
      issues.push({
        type: 'eval',
        message: 'Use of eval() or similar. This can lead to code injection vulnerabilities.',
        line,
        severity: 'high',
      })
    }
  }

  return issues
}

/**
 * Get line number from index
 */
function getLineNumber(code: string, index: number): number {
  const before = code.substring(0, index)
  return before.split('\n').length
}

/**
 * Security best practices check
 */
export function checkSecurityBestPractices(code: string, language: string): {
  issues: SecurityIssue[]
  suggestions: string[]
} {
  const issues: SecurityIssue[] = []
  const suggestions: string[] = []

  // Check for input validation
  if (code.includes('req.body') || code.includes('request.body')) {
    if (!code.includes('zod') && !code.includes('joi') && !code.includes('validate')) {
      suggestions.push('Consider adding input validation using Zod or Joi')
    }
  }

  // Check for authentication
  if (code.includes('router.') || code.includes('app.')) {
    if (!code.includes('auth') && !code.includes('middleware')) {
      issues.push({
        type: 'hardcoded-secret',
        message: 'API endpoint without authentication detected',
        line: 1,
        severity: 'medium',
      })
    }
  }

  // Check for CORS
  if (language.includes('api') || language.includes('server')) {
    if (!code.includes('cors')) {
      suggestions.push('Consider implementing CORS for API security')
    }
  }

  // Check for rate limiting
  if (code.includes('router.') || code.includes('endpoint')) {
    if (!code.includes('rate') && !code.includes('throttle')) {
      suggestions.push('Consider implementing rate limiting for API endpoints')
    }
  }

  return { issues, suggestions }
}

/**
 * Check for dependency vulnerabilities (placeholder)
 */
export async function checkDependencyVulnerability(
  dependencies: Record<string, string>
): Promise<SecurityIssue[]> {
  const issues: SecurityIssue[] = []

  // This would integrate with npm audit or similar in production
  // For now, just check for known vulnerable versions
  const knownVulnerable = {
    'lodash': '<4.17.21',
    'axios': '<0.21.1',
    'express': '<4.17.0',
  }

  for (const [dep, version] of Object.entries(dependencies)) {
    const vulnerableRange = knownVulnerable[dep as keyof typeof knownVulnerable]
    if (vulnerableRange && satisfiesVersion(version, vulnerableRange)) {
      issues.push({
        type: 'hardcoded-secret',
        message: `Dependency ${dep}@${version} has known vulnerabilities. Update to latest version.`,
        line: 1,
        severity: 'high',
      })
    }
  }

  return issues
}

/**
 * Simple version comparison (for demo purposes)
 */
function satisfiesVersion(version: string, range: string): boolean {
  // Simplified version check - in production, use semver library
  const extractVersion = (v: string) => v.match(/\d+\.\d+\.\+/)?.[0] || v
  const v1 = extractVersion(version)
  const v2 = extractVersion(range.replace(/[<>=]/, ''))
  return v1 < v2
}
