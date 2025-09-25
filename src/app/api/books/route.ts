import { NextRequest } from 'next/server'
import { PrismaClient, ReadingStatus } from '@prisma/client'
import { handleApiError, createSuccessResponse } from '@/lib/api-utils'
import { booksSearchSchema, bookFormSchema, BookFormInput } from '@/lib/validations'

const prisma = new PrismaClient()

interface BookWhereInput {
  title?: { contains: string };
  author?: { contains: string };
  status?: ReadingStatus; // Changed type to ReadingStatus
  isbn?: string;
  year?: number;
  pages?: number;
  genre?: { name: { contains: string } };
}

// GET /api/books - Listar todos os livros com filtros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Converter searchParams para objeto
    const params = Object.fromEntries(searchParams.entries())
    
    // Validar parâmetros de busca
    const validatedParams = booksSearchSchema.parse(params)
    
    // Construir filtros do Prisma
    const where: BookWhereInput = {}
    
    if (validatedParams.title) {
      where.title = {
        contains: validatedParams.title
      }
    }
    
    if (validatedParams.author) {
      where.author = {
        contains: validatedParams.author
      }
    }
    
    if (validatedParams.status) {
      where.status = validatedParams.status as ReadingStatus // Cast to ReadingStatus
    }
    
    if (validatedParams.isbn) {
      where.isbn = validatedParams.isbn
    }
    
    if (validatedParams.year) {
      where.year = validatedParams.year
    }
    
    if (validatedParams.pages) {
      where.pages = validatedParams.pages
    }
    
    if (validatedParams.genre) {
      where.genre = {
        name: {
          contains: validatedParams.genre
        }
      }
    }
    
    // Calcular paginação
    const skip = (validatedParams.page - 1) * validatedParams.limit
    
    // Buscar livros com contagem total
    const [books, totalCount] = await Promise.all([
      prisma.book.findMany({
        where,
        include: {
          genre: true
        },
        skip,
        take: validatedParams.limit,
        orderBy: {
          title: 'asc'
        }
      }),
      prisma.book.count({ where })
    ])
    
    const totalPages = Math.ceil(totalCount / validatedParams.limit)
    
    return createSuccessResponse({
      books,
      pagination: {
        page: validatedParams.page,
        limit: validatedParams.limit,
        totalCount,
        totalPages,
        hasNext: validatedParams.page < totalPages,
        hasPrev: validatedParams.page > 1
      }
    })
  } catch (error) {
    return handleApiError(error)
  }
}
