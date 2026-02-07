// Prisma Client Singleton

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Helper functions for vector operations
export const vectorHelpers = {
  /**
   * Convert array to PostgreSQL vector format
   */
  toPgVector: (embedding: number[]): string => {
    return `[${embedding.join(',')}]`
  },

  /**
   * Calculate cosine similarity (for reference, pgvector does this internally)
   */
  cosineSimilarity: (a: number[], b: number[]): number => {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same length')
    }

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  },
}

export default prisma
