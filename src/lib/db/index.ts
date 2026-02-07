// Database exports

export { prisma, vectorHelpers } from './prisma'
export {
  searchSimilarPatterns,
  storeCodePattern,
  updatePatternEmbedding,
  batchStorePatterns,
  findPatternsByLanguage,
  getPatternStats,
  type VectorSearchOptions,
  type VectorSearchResult,
} from './vector-search'
