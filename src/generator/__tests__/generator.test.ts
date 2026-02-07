// Generator Agent Tests

import { describe, it, expect, beforeAll } from '@jest/globals'
import { generatorAgent } from '../generator'

describe('GeneratorAgent', () => {
  beforeAll(() => {
    // Set test environment variables
    process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'test-key'
  })

  describe('generateTemplate', () => {
    it('should generate a React hook template', async () => {
      const template = await generatorAgent.generateTemplate({
        language: 'typescript',
        description: 'Create a React hook for managing local storage',
        codeStyle: {
          semi: true,
          singleQuote: true,
          indentSize: 2,
        },
      })

      expect(template).toBeDefined()
      expect(template.name).toBeTruthy()
      expect(template.files).toHaveLengthGreaterThan(0)
      expect(template.language).toBe('typescript')
      expect(template.placeholders).toBeDefined()
    }, 30000)

    it('should generate an API route template', async () => {
      const template = await generatorAgent.generateTemplate({
        language: 'typescript',
        description: 'Create a Next.js API route for user authentication',
      })

      expect(template.files.some(f => f.path.includes('route'))).toBe(true)
    }, 30000)
  })

  describe('generateTemplateWithRAG', () => {
    it('should generate template with similar patterns', async () => {
      const template = await generatorAgent.generateTemplateWithRAG({
        language: 'typescript',
        description: 'Create a custom hook for data fetching',
      })

      expect(template.metadata?.retrievedPatterns).toBeGreaterThanOrEqual(0)
      expect(template.files).toBeDefined()
    }, 30000)
  })

  describe('refineTemplate', () => {
    it('should refine template based on feedback', async () => {
      const original = await generatorAgent.generateTemplate({
        language: 'typescript',
        description: 'Create a simple counter hook',
      })

      const refined = await generatorAgent.refineTemplate(
        original,
        'Add reset functionality to the counter'
      )

      expect(refined.files).toBeDefined()
    }, 30000)
  })
})
