// Validator Agent Tests

import { describe, it, expect } from '@jest/globals'
import { validatorAgent } from '../validator'

describe('ValidatorAgent', () => {
  describe('validate', () => {
    it('should detect syntax errors', async () => {
      const code = `
function test() {
  const obj = { a: 1
  return obj
}
      `

      const result = await validatorAgent.validate(code, {
        language: 'typescript',
        checkSyntax: true,
      })

      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
      expect(result.errors.some(e => e.type === 'syntax')).toBe(true)
    })

    it('should detect security issues', async () => {
      const code = `
const password = "secret123"
api_key = "sk-1234567890abcdef"
eval(userInput)
document.getElementById("output").innerHTML = userInput
      `

      const result = await validatorAgent.validate(code, {
        language: 'typescript',
        checkSecurity: true,
      })

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.type === 'hardcoded-secret')).toBe(true)
    })

    it('should detect type issues', async () => {
      const code = `
function processData(data: any): any {
  return data.map((item: any) => any)
}
      `

      const result = await validatorAgent.validate(code, {
        language: 'typescript',
        checkTypes: true,
      })

      expect(result.warnings.some(w => w.message.includes('any'))).toBe(true)
    })

    it('should detect style issues', async () => {
      const code = `
function test() {
  console.log("TODO: implement this")
  return null
}
      `

      const result = await validatorAgent.validate(code, {
        language: 'typescript',
        checkStyle: true,
      })

      expect(result.warnings.length).toBeGreaterThan(0)
    })

    it('should generate quality score', async () => {
      const code = `
export function add(a: number, b: number): number {
  return a + b
}
      `

      const result = await validatorAgent.validate(code, {
        language: 'typescript',
        checkSyntax: true,
        checkTypes: true,
        checkStyle: true,
        checkSecurity: true,
      })

      expect(result.summary.score).toBeGreaterThan(0)
      expect(result.summary.score).toBeLessThanOrEqual(100)
    })
  })

  describe('validateTemplate', () => {
    it('should validate multiple files', async () => {
      const files = [
        {
          path: 'useCounter.ts',
          content: \`export function useCounter() {
  const [count, setCount] = useState(0)
  return { count, setCount }
}\`,
        },
        {
          path: 'types.ts',
          content: \`export interface CounterProps {
  initial: number
}\`,
        },
      ]

      const result = await validatorAgent.validateTemplate(files, {
        language: 'typescript',
      })

      expect(result).toBeDefined()
      expect(result.summary).toBeDefined()
    })

    it('should detect duplicate files', async () => {
      const files = [
        { path: 'index.ts', content: 'export {}' },
        { path: 'index.ts', content: 'export {}' },
      ]

      const result = await validatorAgent.validateTemplate(files, {
        language: 'typescript',
      })

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.message.includes('Duplicate'))).toBe(true)
    })
  })
})
