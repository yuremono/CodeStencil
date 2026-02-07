// Vector Search Utilities using pgvector

import { prisma } from './prisma'
import type { CodePattern, Prisma } from '@prisma/client'

export interface VectorSearchOptions {
  limit?: number
  threshold?: number // Minimum similarity score (0-1)
  language?: string
  userId?: string
}

export interface VectorSearchResult {
  id: string
  name: string
  description: string | null
  language: string
  code: string
  similarity: number
  metadata: Prisma.JsonValue | null
}

/**
 * Search for similar code patterns using vector similarity
 */
export async function searchSimilarPatterns(
  queryEmbedding: number[],
  options: VectorSearchOptions = {}
): Promise<VectorSearchResult[]> {
  const {
    limit = 10,
    threshold = 0.7,
    language,
    userId,
  } = options

  // pgvector uses operator `<=>` for cosine distance
  // Cosine similarity = 1 - cosine distance
  const embeddingString = `[${queryEmbedding.join(',')}]`

  const results = await prisma.$queryRaw<Array<{
    id: string
    name: string
    description: string | null
    language: string
    code: string
    similarity: number
    metadata: Prisma.JsonValue | null
  }>>`
    SELECT
      id,
      name,
      description,
      language,
      code,
      1 - (embedding <=> ${embeddingString}::vector) AS similarity,
      metadata
    FROM code_patterns
    WHERE 1 - (embedding <=> ${embeddingString}::vector) >= ${threshold}
      ${language ? Prisma.sql`AND language = ${language}` : Prisma.empty}
      ${userId ? Prisma.sql`AND user_id = ${userId}` : Prisma.empty}
    ORDER BY embedding <=> ${embeddingString}::vector
    LIMIT ${limit}
  `

  return results
}

/**
 * Store a code pattern with its embedding
 */
export async function storeCodePattern(data: {
  userId?: string
  name: string
  description?: string
  language: string
  code: string
  embedding: number[]
  metadata?: Prisma.JsonValue
}): Promise<CodePattern> {
  const embeddingString = `[${data.embedding.join(',')}]`

  return await prisma.$executeRaw`
    INSERT INTO code_patterns (user_id, name, description, language, code, embedding, metadata, created_at, updated_at)
    VALUES (
      ${data.userId || null},
      ${data.name},
      ${data.description || null},
      ${data.language},
      ${data.code},
      ${embeddingString}::vector,
      ${data.metadata || null}::jsonb,
      NOW(),
      NOW()
    )
    RETURNING *
  ` as unknown as CodePattern
}

/**
 * Update a code pattern's embedding
 */
export async function updatePatternEmbedding(
  id: string,
  embedding: number[]
): Promise<void> {
  const embeddingString = `[${embedding.join(',')}]`

  await prisma.$executeRaw`
    UPDATE code_patterns
    SET embedding = ${embeddingString}::vector, updated_at = NOW()
    WHERE id = ${id}
  `
}

/**
 * Batch store code patterns
 */
export async function batchStorePatterns(
  patterns: Array<{
    userId?: string
    name: string
    description?: string
    language: string
    code: string
    embedding: number[]
    metadata?: Prisma.JsonValue
  }>
): Promise<void> {
  await prisma.$transaction(
    patterns.map(pattern =>
      prisma.codePattern.create({
        data: {
          userId: pattern.userId,
          name: pattern.name,
          description: pattern.description,
          language: pattern.language,
          code: pattern.code,
          embedding: pattern.embedding as any, // pgvector type
          metadata: pattern.metadata,
        },
      })
    )
  )
}

/**
 * Find patterns by language
 */
export async function findPatternsByLanguage(
  language: string,
  limit: number = 100
): Promise<CodePattern[]> {
  return await prisma.codePattern.findMany({
    where: { language },
    take: limit,
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Get pattern statistics
 */
export async function getPatternStats() {
  const [totalCount, languageCounts] = await Promise.all([
    prisma.codePattern.count(),
    prisma.codePattern.groupBy({
      by: ['language'],
      _count: true,
    }),
  ])

  return {
    total: totalCount,
    byLanguage: languageCounts.map(c => ({
      language: c.language,
      count: c._count,
    })),
  }
}
