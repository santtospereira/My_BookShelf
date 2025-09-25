import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { handleApiError, createSuccessResponse, createErrorResponse } from '@/lib/api-utils'
import { updateBookSchema, UpdateBookInput } from '@/lib/validations'

// GET /api/books/[id] - Obter detalhes de um livro
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await context.params;
    const { id } = resolvedParams;
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        genre: true
      }
    })
    
    if (!book) {
      return createErrorResponse('Livro não encontrado', 404, 'BOOK_NOT_FOUND')
    }
    
    return createSuccessResponse(book)
  } catch (error) {
    return handleApiError(error)
  }
}
