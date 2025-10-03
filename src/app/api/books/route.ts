import { NextRequest, NextResponse } from 'next/server'
import { ReadingStatus } from '@prisma/client'
import { handleApiError, createSuccessResponse } from '@/lib/api-utils'
import { booksSearchSchema } from '@/lib/validations'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

interface BookWhereInput {
  userId: string; // Adicionado para segurança
  title?: { contains: string };
  author?: { contains: string };
  status?: ReadingStatus;
  isbn?: string;
  year?: number;
  pages?: number;
  genre?: { name: { contains: string } };
}

// GET /api/books - Listar todos os livros com filtros
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams.entries())
    const validatedParams = booksSearchSchema.parse(params)
    
    // Filtro base para garantir que o usuário só veja seus próprios livros
    const where: BookWhereInput = { userId: session.user.id };
    
    if (validatedParams.title) where.title = { contains: validatedParams.title };
    if (validatedParams.author) where.author = { contains: validatedParams.author };
    if (validatedParams.status) where.status = validatedParams.status as ReadingStatus;
    if (validatedParams.isbn) where.isbn = validatedParams.isbn;
    if (validatedParams.year) where.year = validatedParams.year;
    if (validatedParams.pages) where.pages = validatedParams.pages;
    if (validatedParams.genre) where.genre = { name: { contains: validatedParams.genre } };
    
    const skip = (validatedParams.page - 1) * validatedParams.limit
    
    const [books, totalCount] = await prisma.$transaction([
      prisma.book.findMany({
        where,
        include: { genre: true },
        skip,
        take: validatedParams.limit,
        orderBy: { title: 'asc' },
      }),
      prisma.book.count({ where })
    ]);
    
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
