// RAG (Retrieval-Augmented Generation) Service

import { EmbeddingFactory } from '../embedding'
import { searchSimilarPatterns, storeCodePattern } from '../db'
import { LLMFactory } from '../llm'

export interface RAGGenerateOptions {
  language: string
  context?: string // Additional context from the user's project
  numResults?: number // Number of similar patterns to retrieve
  threshold?: number // Minimum similarity score
  userId?: string
}

export interface RAGResult {
  generatedCode: string
  retrievedPatterns: Array<{
    name: string
    code: string
    similarity: number
  }>
}

/**
 * Generate code using RAG approach
 */
export async function generateWithRAG(
  prompt: string,
  options: RAGGenerateOptions
): Promise<RAGResult> {
  const {
    language,
    context,
    numResults = 5,
    threshold = 0.7,
    userId,
  } = options

  // 1. Generate embedding for the prompt
  const embedder = await EmbeddingFactory.getDefault()
  const queryEmbedding = await embedder.embed(prompt)

  // 2. Retrieve similar code patterns
  const retrievedPatterns = await searchSimilarPatterns(queryEmbedding, {
    limit: numResults,
    threshold,
    language,
    userId,
  })

  // 3. Construct augmented prompt
  let augmentedPrompt = `You are a code generation expert. Generate ${language} code based on the following request:\n\n${prompt}\n\n`

  if (context) {
    augmentedPrompt += `Additional context from the project:\n${context}\n\n`
  }

  if (retrievedPatterns.length > 0) {
    augmentedPrompt += `Here are some similar code patterns for reference:\n\n`
    retrievedPatterns.forEach((pattern, i) => {
      augmentedPrompt += `Pattern ${i + 1} (${pattern.name}, similarity: ${pattern.similarity.toFixed(2)}):\n${pattern.code}\n\n`
    })
    augmentedPrompt += `\nUse these patterns as inspiration, but adapt the code to fit the specific request.\n`
  }

  augmentedPrompt += `\nGenerate clean, well-commented code that follows best practices.`

  // 4. Generate code using LLM
  const llm = LLMFactory.create({
    type: process.env.OPENAI_API_KEY ? 'openai' : 'ollama',
    apiKey: process.env.OPENAI_API_KEY,
  })

  const generatedCode = await llm.generate(augmentedPrompt)

  return {
    generatedCode,
    retrievedPatterns: retrievedPatterns.map(p => ({
      name: p.name,
      code: p.code,
      similarity: p.similarity,
    })),
  }
}

/**
 * Index a code pattern for future retrieval
 */
export async function indexCodePattern(data: {
  userId?: string
  name: string
  description?: string
  language: string
  code: string
  metadata?: Record<string, unknown>
}): Promise<void> {
  const embedder = await EmbeddingFactory.getDefault()
  const embedding = await embedder.embed(
    `${data.name}\n${data.description || ''}\n${data.code}`
  )

  await storeCodePattern({
    userId: data.userId,
    name: data.name,
    description: data.description,
    language: data.language,
    code: data.code,
    embedding,
    metadata: data.metadata,
  })
}

/**
 * Batch index code patterns
 */
export async function batchIndexPatterns(
  patterns: Array<{
    userId?: string
    name: string
    description?: string
    language: string
    code: string
    metadata?: Record<string, unknown>
  }>
): Promise<void> {
  const embedder = await EmbeddingFactory.getDefault()

  const patternsToStore = await Promise.all(
    patterns.map(async pattern => {
      const embedding = await embedder.embed(
        `${pattern.name}\n${pattern.description || ''}\n${pattern.code}`
      )

      return {
        ...pattern,
        embedding,
      }
    })
  )

  // Store in batches to avoid overwhelming the database
  const batchSize = 10
  for (let i = 0; i < patternsToStore.length; i += batchSize) {
    const batch = patternsToStore.slice(i, i + batchSize)
    await Promise.all(
      batch.map(p =>
        storeCodePattern({
          userId: p.userId,
          name: p.name,
          description: p.description,
          language: p.language,
          code: p.code,
          embedding: p.embedding,
          metadata: p.metadata,
        })
      )
    )
  }
}

/**
 * Generate a template from retrieved patterns
 */
export async function generateTemplateFromPatterns(
  prompt: string,
  options: RAGGenerateOptions
): Promise<{
  name: string
  description: string
  files: Array<{ path: string; content: string }>
}> {
  const ragResult = await generateWithRAG(prompt, options)

  // Parse the generated code to extract template structure
  // This is a simplified version - in production, you'd use AST parsing
  const lines = ragResult.generatedCode.split('\n')

  let name = 'Generated Template'
  let description = `Auto-generated template based on: ${prompt}`

  // Try to extract name/description from comments
  for (const line of lines) {
    if (line.includes('// @name') || line.includes('// @template')) {
      name = line.split(/\/\/ @name|\/\/ @template/)[1]?.trim() || name
    }
    if (line.includes('// @description')) {
      description = line.split('// @description')[1]?.trim() || description
    }
  }

  return {
    name,
    description,
    files: [
      {
        path: `generated.${options.language === 'typescript' ? 'ts' : options.language}`,
        content: ragResult.generatedCode,
      },
    ],
    retrievedPatterns: ragResult.retrievedPatterns,
  } as unknown as {
    name: string
    description: string
    files: Array<{ path: string; content: string }>
  }
}
