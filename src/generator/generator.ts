// Generator Agent - Main Implementation

import { z } from 'zod'
import { LLMFactory } from '../lib/llm'
import { searchSimilarPatterns } from '../lib/db'
import type {
  GenerateTemplateOptions,
  GeneratedTemplate,
  GeneratedFile,
  Placeholder,
} from './types'
import { PromptBuilder, SystemPrompts } from './prompts'

// Zod schema for validating LLM response
const GeneratedFileSchema = z.object({
  path: z.string(),
  content: z.string(),
})

const PlaceholderSchema = z.object({
  name: z.string(),
  type: z.enum(['string', 'boolean', 'number', 'select']),
  default: z.union([z.string(), z.number(), z.boolean()]).optional(),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
  description: z.string().optional(),
})

const GeneratedTemplateSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  files: z.array(GeneratedFileSchema).min(1),
  placeholders: z.array(PlaceholderSchema),
})

export class GeneratorAgent {
  private defaultLanguage: string

  constructor(defaultLanguage: string = 'typescript') {
    this.defaultLanguage = defaultLanguage
  }

  /**
   * Generate a code template based on user requirements
   */
  async generateTemplate(options: GenerateTemplateOptions): Promise<GeneratedTemplate> {
    const {
      language = this.defaultLanguage,
      description,
      context,
      codeStyle,
      userId,
    } = options

    // 1. Build prompts
    const systemPrompt = this.getSystemPrompt(language)
    const userPrompt = await this.buildUserPrompt(language, description, context, userId)

    // 2. Get LLM instance
    const llm = LLMFactory.create({
      type: process.env.OPENAI_API_KEY ? 'openai' : 'ollama',
      apiKey: process.env.OPENAI_API_KEY,
    })

    // 3. Generate response
    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`
    const response = await llm.generate(fullPrompt, {
      temperature: 0.7,
      maxTokens: 4000,
    })

    // 4. Parse and validate response
    const parsed = await this.parseResponse(response)

    // 5. Apply code style if specified
    if (codeStyle) {
      parsed.files = this.applyCodeStyle(parsed.files, codeStyle)
    }

    return parsed
  }

  /**
   * Generate template with RAG (Retrieval-Augmented Generation)
   */
  async generateTemplateWithRAG(options: GenerateTemplateOptions): Promise<GeneratedTemplate> {
    const { language = this.defaultLanguage, description, userId } = options

    // 1. Generate embedding for the description
    const { EmbeddingFactory } = await import('../lib/embedding')
    const embedder = await EmbeddingFactory.getDefault()
    const queryEmbedding = await embedder.embed(description)

    // 2. Retrieve similar patterns
    const similarPatterns = await searchSimilarPatterns(queryEmbedding, {
      language,
      limit: 3,
      threshold: 0.7,
      userId,
    })

    // 3. Build prompts with retrieved patterns
    const systemPrompt = this.getSystemPrompt(language)
    const patternExamples = similarPatterns.map(p => p.code)
    const userPrompt = PromptBuilder.buildUserPrompt(
      { language, description, context: options.context },
      patternExamples
    )

    // 4. Generate response
    const llm = LLMFactory.create({
      type: process.env.OPENAI_API_KEY ? 'openai' : 'ollama',
      apiKey: process.env.OPENAI_API_KEY,
    })

    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`
    const response = await llm.generate(fullPrompt, {
      temperature: 0.7,
      maxTokens: 4000,
    })

    // 5. Parse and validate response
    const parsed = await this.parseResponse(response)

    // 6. Add metadata about retrieved patterns
    parsed.metadata = {
      generatedAt: new Date().toISOString(),
      model: process.env.OPENAI_API_KEY ? 'gpt-4o-mini' : 'ollama',
      promptTokens: description.length,
      completionTokens: response.length,
      retrievedPatterns: similarPatterns.length,
    }

    return parsed
  }

  /**
   * Refine an existing template based on feedback
   */
  async refineTemplate(
    originalTemplate: GeneratedTemplate,
    feedback: string,
    language?: string
  ): Promise<GeneratedTemplate> {
    const lang = language || originalTemplate.language

    // Build refinement prompt
    const mainFile = originalTemplate.files.find(f => f.path.includes('index')) ||
                     originalTemplate.files[0]
    const prompt = PromptBuilder.buildRefinementPrompt(
      mainFile.content,
      feedback,
      lang
    )

    // Generate refined version
    const llm = LLMFactory.create({
      type: process.env.OPENAI_API_KEY ? 'openai' : 'ollama',
      apiKey: process.env.OPENAI_API_KEY,
    })

    const response = await llm.generate(prompt, {
      temperature: 0.6,
      maxTokens: 4000,
    })

    // Parse response
    const refined = await this.parseResponse(response)

    // Preserve metadata from original
    refined.metadata = {
      ...originalTemplate.metadata,
      generatedAt: new Date().toISOString(),
    }

    return refined
  }

  /**
   * Extract placeholders from code
   */
  async extractPlaceholders(
    code: string,
    language: string
  ): Promise<Placeholder[]> {
    const prompt = PromptBuilder.buildPlaceholderExtractionPrompt(code, language)

    const llm = LLMFactory.create({
      type: process.env.OPENAI_API_KEY ? 'openai' : 'ollama',
      apiKey: process.env.OPENAI_API_KEY,
    })

    const response = await llm.generate(prompt, {
      temperature: 0.3,
      maxTokens: 2000,
    })

    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        throw new Error('No JSON array found in response')
      }

      const placeholders = PlaceholderSchema.array().parse(JSON.parse(jsonMatch[0]))
      return placeholders
    } catch (error) {
      console.error('Failed to parse placeholders:', error)
      return []
    }
  }

  /**
   * Generate tests for a template
   */
  async generateTests(
    templateCode: string,
    language: string
  ): Promise<string> {
    const prompt = PromptBuilder.buildTestGenerationPrompt(templateCode, language)

    const llm = LLMFactory.create({
      type: process.env.OPENAI_API_KEY ? 'openai' : 'ollama',
      apiKey: process.env.OPENAI_API_KEY,
    })

    return await llm.generate(prompt, {
      temperature: 0.5,
      maxTokens: 3000,
    })
  }

  /**
   * Get system prompt based on language
   */
  private getSystemPrompt(language: string): string {
    // Use specialized prompts for specific cases
    if (language.includes('react') || language.includes('tsx')) {
      return SystemPrompts.reactComponent
    }
    if (language.includes('api') || language.includes('route')) {
      return SystemPrompts.apiRoute
    }
    if (language.includes('hook')) {
      return SystemPrompts.customHook
    }

    // Default prompt
    return PromptBuilder.buildSystemPrompt({ language, description: '' })
  }

  /**
   * Build user prompt
   */
  private async buildUserPrompt(
    language: string,
    description: string,
    context?: string,
    userId?: string
  ): Promise<string> {
    return PromptBuilder.buildUserPrompt({
      language,
      description,
      context,
    })
  }

  /**
   * Parse and validate LLM response
   */
  private async parseResponse(response: string): Promise<GeneratedTemplate> {
    try {
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) ||
                       response.match(/\{[\s\S]*\}/)

      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }

      const jsonContent = jsonMatch[1] || jsonMatch[0]
      const parsed = JSON.parse(jsonContent)

      // Validate with Zod
      const validated = GeneratedTemplateSchema.parse(parsed)

      // Add default metadata
      return {
        ...validated,
        metadata: {
          generatedAt: new Date().toISOString(),
          model: process.env.OPENAI_API_KEY ? 'gpt-4o-mini' : 'ollama',
          promptTokens: response.length,
          completionTokens: JSON.stringify(parsed).length,
        },
      }
    } catch (error) {
      console.error('Failed to parse generated template:', error)
      throw new Error(`Invalid response format: ${error}`)
    }
  }

  /**
   * Apply code style to generated files
   */
  private applyCodeStyle(
    files: GeneratedFile[],
    codeStyle: NonNullable<GenerateTemplateOptions['codeStyle']>
  ): GeneratedFile[] {
    // This is a simplified version - in production, use prettier/eslint
    return files.map(file => ({
      ...file,
      content: this.applyStyleToContent(file.content, codeStyle),
    }))
  }

  /**
   * Apply style to code content
   */
  private applyStyleToContent(
    content: string,
    codeStyle: NonNullable<GenerateTemplateOptions['codeStyle']>
  ): string {
    let styled = content

    // Apply quote style
    if (codeStyle.singleQuote !== undefined) {
      const quote = codeStyle.singleQuote ? "'" : '"'
      const opposite = codeStyle.singleQuote ? '"' : "'"
      // Simple replacement (in production, use proper AST)
      styled = styled.replace(new RegExp(`${opposite}([^${opposite}]*)${opposite}`, 'g'), `${quote}$1${quote}`)
    }

    // Apply semicolons
    if (codeStyle.semi === false) {
      // Remove semicolons (simplified)
      styled = styled.replace(/;(\s*$)/gm, '$1')
    }

    return styled
  }
}

// Export singleton instance
export const generatorAgent = new GeneratorAgent()
