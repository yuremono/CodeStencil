/**
 * CodeStencil API Server
 * tRPC + Hono + Prisma
 */

import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { trpcServer } from '@hono/trpc-server';
import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';

/**
 * tRPC 初期化
 */
const t = initTRPC.context<Context>().create();

/**
 * Context 型定義
 */
interface Context {
  // 必要に応じてコンテキストを拡張
  // userId?: string;
}

/**
 * Prisma クライアント（ダミー - 実際は Prisma を使用）
 */
// const prisma = new PrismaClient();

/**
 * Parser ルーター
 */
const parserRouter = t.router({
  /**
   * コードをパースする
   */
  parse: t.procedure
    .input(
      z.object({
        code: z.string(),
        language: z.enum(['typescript', 'javascript', 'python', 'go']),
      })
    )
    .mutation(async ({ input }) => {
      // Parser パッケージを呼び出し
      const { Parser } = await import('@codestencil/parser');
      const parser = new Parser();

      const result = parser.parse(input.code, {
        language: input.language as any,
      });

      return {
        success: true,
        data: result,
      };
    }),

  /**
   * 命名規則を分析する
   */
  analyzeNaming: t.procedure
    .input(
      z.object({
        code: z.string(),
        language: z.enum(['typescript', 'javascript', 'python', 'go']),
      })
    )
    .mutation(async ({ input }) => {
      const { Parser } = await import('@codestencil/parser');
      const parser = new Parser();

      const result = parser.parse(input.code, {
        language: input.language as any,
      });

      const naming = parser.analyzeNaming(result);

      return {
        success: true,
        data: naming,
      };
    }),
});

/**
 * Template ルーター
 */
const templateRouter = t.router({
  /**
   * テンプレート一覧を取得
   */
  list: t.procedure
    .input(
      z.object({
        language: z.string().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .query(async ({ input }) => {
      // TODO: Prisma でデータベースから取得
      return {
        templates: [
          {
            id: '1',
            name: 'React Component',
            description: 'Basic React component template',
            language: 'typescript',
            tags: ['react', 'component'],
            code: 'export function Component() {\n  return <div>Hello</div>;\n}',
          },
        ],
      };
    }),

  /**
   * テンプレートを取得
   */
  get: t.procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      // TODO: Prisma でデータベースから取得
      return {
        id: input.id,
        name: 'React Component',
        description: 'Basic React component template',
        language: 'typescript',
        tags: ['react', 'component'],
        code: 'export function Component() {\n  return <div>Hello</div>;\n}',
      };
    }),

  /**
   * テンプレートを作成
   */
  create: t.procedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        language: z.string(),
        tags: z.array(z.string()),
        code: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // TODO: Prisma でデータベースに保存
      return {
        success: true,
        id: '1',
        ...input,
      };
    }),

  /**
   * テンプレートを更新
   */
  update: t.procedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        tags: z.array(z.string()).optional(),
        code: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // TODO: Prisma でデータベースを更新
      return {
        success: true,
        id: input.id,
      };
    }),

  /**
   * テンプレートを削除
   */
  delete: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      // TODO: Prisma でデータベースから削除
      return {
        success: true,
      };
    }),
});

/**
 * Style ルーター
 */
const styleRouter = t.router({
  /**
   * プロジェクトのスタイルを分析
   */
  analyze: t.procedure
    .input(
      z.object({
        files: z.array(
          z.object({
            path: z.string(),
            code: z.string(),
            language: z.enum(['typescript', 'javascript', 'python', 'go']),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const { Parser } = await import('@codestencil/parser');
      const parser = new Parser();

      // 全ファイルをパース
      const results = input.files.map((file) => ({
        path: file.path,
        result: parser.parse(file.code, {
          language: file.language as any,
        }),
      }));

      // 命名規則を集計
      const namingPatterns = results.map((r) => parser.analyzeNaming(r.result));

      // 最も頻度の高い規則を採用
      const aggregateNaming = {
        variables: getMostFrequent(namingPatterns.map((n) => n.variables)),
        functions: getMostFrequent(namingPatterns.map((n) => n.functions)),
        classes: getMostFrequent(namingPatterns.map((n) => n.classes)),
        interfaces: getMostFrequent(namingPatterns.map((n) => n.interfaces)),
        constants: getMostFrequent(namingPatterns.map((n) => n.constants)),
      };

      // インポートスタイルを分析
      const importStyles = analyzeImportStyles(results);

      return {
        success: true,
        data: {
          naming: aggregateNaming,
          imports: importStyles,
        },
      };
    }),
});

/**
 * メインルーター
 */
const appRouter = t.router({
  parser: parserRouter,
  template: templateRouter,
  style: styleRouter,
});

/**
 * App タイプ
 */
export type AppRouter = typeof appRouter;

/**
 * Hono アプリケーション
 */
const app = new Hono();

app.use('/*', cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));

app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext: (): Context => ({}),
  })
);

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * サーバー起動
 */
const port = parseInt(process.env.PORT || '3001');

console.log(`🚀 CodeStencil API Server starting on port ${port}...`);

serve({
  fetch: app.fetch,
  port,
});

console.log(`✅ Server ready at http://localhost:${port}`);
console.log(`📡 tRPC endpoint: http://localhost:${port}/trpc`);
console.log(`❤️  Health check: http://localhost:${port}/health`);

/**
 * ユーティリティ関数
 */

function getMostFrequet<T>(items: T[]): T {
  const counts = new Map<T, number>();
  for (const item of items) {
    counts.set(item, (counts.get(item) || 0) + 1);
  }
  let max = 0;
  let most: T = items[0];
  for (const [item, count] of counts) {
    if (count > max) {
      max = count;
      most = item;
    }
  }
  return most;
}

function getMostFrequent(items: string[]): string {
  return getMostFrequet(items);
}

interface ImportStyle {
  useAbsolutePath: boolean;
  useTypeImports: boolean;
  useNamespaceImports: boolean;
  averageImportsPerFile: number;
}

function analyzeImportStyles(
  results: Array<{ path: string; result: any }>
): ImportStyle {
  let absolutePathCount = 0;
  let typeImportCount = 0;
  let namespaceImportCount = 0;
  let totalImports = 0;

  for (const { result } of results) {
    for (const imp of result.imports || []) {
      totalImports++;

      if (imp.source.startsWith('.') || imp.source.startsWith('/')) {
        // 相対パス
      } else {
        absolutePathCount++;
      }

      for (const spec of imp.specifiers || []) {
        if (spec.isType) {
          typeImportCount++;
        }
      }
    }
  }

  const fileCount = results.length || 1;

  return {
    useAbsolutePath: absolutePathCount / totalImports > 0.3,
    useTypeImports: typeImportCount / totalImports > 0.2,
    useNamespaceImports: namespaceImportCount > 0,
    averageImportsPerFile: totalImports / fileCount,
  };
}
