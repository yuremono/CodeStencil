// Prisma Seed Script
// Run with: pnpm db:seed

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create system templates
  const reactHookTemplate = await prisma.template.upsert({
    where: { id: 'system-react-usefetch' },
    update: {},
    create: {
      id: 'system-react-usefetch',
      name: 'React useFetch Hook',
      description: 'Custom hook for data fetching with loading and error states',
      language: 'typescript',
      isPublic: true,
      isSystem: true,
      tags: ['react', 'hook', 'fetch', 'typescript'],
      files: {
        create: [
          {
            path: 'useFetch.ts',
            content: `import { useState, useEffect } from 'react'

interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => void
}

export function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`)
      }
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [url])

  return { data, loading, error, refetch: fetchData }
}`,
          },
        ],
      },
      placeholders: {
        create: [
          {
            name: 'url',
            type: 'string',
            default: '/api/data',
            required: true,
            options: [],
          },
          {
            name: 'typeName',
            type: 'string',
            default: 'unknown',
            required: false,
            options: [],
          },
        ],
      },
    },
  })

  console.log(\`✅ Created template: \${reactHookTemplate.name}\`)

  const nextApiRoute = await prisma.template.upsert({
    where: { id: 'system-next-api-route' },
    update: {},
    create: {
      id: 'system-next-api-route',
      name: 'Next.js API Route',
      description: 'Type-safe API route with error handling',
      language: 'typescript',
      isPublic: true,
      isSystem: true,
      tags: ['nextjs', 'api', 'typescript'],
      files: {
        create: [
          {
            path: 'api/users/route.ts',
            content: `import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID parameter is required' },
        { status: 400 }
      )
    }

    // Your data fetching logic here
    const data = { id, name: 'John Doe' }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}`,
          },
        ],
      },
      placeholders: {
        create: [
          {
            name: 'routePath',
            type: 'string',
            default: 'api/users',
            required: true,
            options: [],
          },
        ],
      },
    },
  })

  console.log(\`✅ Created template: \${nextApiRoute.name}\`)

  // Create sample code patterns for RAG
  const patterns = [
    {
      name: 'React Custom Hook Pattern',
      description: 'Template for creating reusable React hooks',
      language: 'typescript',
      code: \`import { useState, useCallback } from 'react'

export function use{{HookName}}() {
  const [state, setState] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(async () => {
    setLoading(true)
    try {
      // Your logic here
      const result = await doSomething()
      setState(result)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  return { state, loading, error, execute }
}\`,
    },
    {
      name: 'Express Route Handler',
      description: 'Express.js route with async/await and error handling',
      language: 'typescript',
      code: \`import { Request, Response, NextFunction } from 'express'

export const {{routeName}}Handler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    // Your logic here
    const result = await getData(id)

    res.json(result)
  } catch (error) {
    next(error)
  }
}\`,
    },
    {
      name: 'Python Async Function',
      description: 'Python async function with error handling',
      language: 'python',
      code: \`async def {{functionName}}(*args, **kwargs):
    """
    Async function with error handling.
    """
    try:
        result = await some_async_operation()
        return result
    except Exception as e:
        logger.error(f"Error: {e}")
        raise\`,
    },
  ]

  for (const pattern of patterns) {
    await prisma.codePattern.create({
      data: {
        ...pattern,
        isPublic: true,
        embedding: Array(1536).fill(0), // Placeholder embedding
      },
    })
    console.log(\`✅ Created pattern: \${pattern.name}\`)
  }

  console.log('🎉 Seeding complete!')
}

main()
  .catch(e => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
