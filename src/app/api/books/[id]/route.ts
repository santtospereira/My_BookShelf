import { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { handleApiError, createSuccessResponse, createErrorResponse } from '@/lib/api-utils'
import { updateBookSchema, UpdateBookInput } from '@/lib/validations'

const prisma = new PrismaClient()

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

// PUT /api/books/[id] - Atualizar livro existente
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await context.params;
    const { id } = resolvedParams;
    // Verificar se o livro existe
    const existingBook = await prisma.book.findUnique({
      where: { id },
    })
    
    if (!existingBook) {
      return createErrorResponse('Livro não encontrado', 404, 'BOOK_NOT_FOUND')
    }
    
    const body = await request.json()
    const validatedData: UpdateBookInput = updateBookSchema.parse(body)
    
    // Verificar se o gênero existe (se fornecido)
    if (validatedData.genreId) {
      const genreExists = await prisma.genre.findUnique({
        where: { id: validatedData.genreId }
      })
      
      if (!genreExists) {
        return createErrorResponse('Gênero não encontrado', 400, 'GENRE_NOT_FOUND')
      }
    }
    
    // Verificar se já existe outro livro com o mesmo ISBN (se fornecido)
    if (validatedData.isbn && validatedData.isbn !== existingBook.isbn) {
      const bookWithSameISBN = await prisma.book.findFirst({
        where: {
          isbn: validatedData.isbn,
          id: { not: id }
        }
      })
      
      if (bookWithSameISBN) {
        return createErrorResponse(
          'Já existe outro livro com este ISBN',
          409,
          'ISBN_CONFLICT'
        )
      }
    }
    
    const updatedBook = await prisma.book.update({
      where: { id },
      data: validatedData,
      include: {
        genre: true
      }
    })
    
    return createSuccessResponse(updatedBook)
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/books/[id] - Remover livro
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await context.params;
    const { id } = resolvedParams;
    // Verificar se o livro existe
    const existingBook = await prisma.book.findUnique({
      where: { id },
    })
    
    if (!existingBook) {
      return createErrorResponse('Livro não encontrado', 404, 'BOOK_NOT_FOUND')
    }
    
    await prisma.book.delete({
      where: { id },
    })
    
    return createSuccessResponse(
      { message: 'Livro removido com sucesso' },
      200
    )
  } catch (error) {
    return handleApiError(error)
  }
}
