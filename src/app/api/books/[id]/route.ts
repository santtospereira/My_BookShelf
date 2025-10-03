import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { handleApiError, createSuccessResponse, createErrorResponse } from '@/lib/api-utils'
import { updateBookSchema, UpdateBookInput } from '@/lib/validations'
import { auth } from "@/lib/auth"; // Importar auth
import { Role } from "@prisma/client"; // Importar Role

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

// PUT /api/books/:id - Atualizar um livro por ID
export async function PUT(
  request: NextRequest, { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== Role.USER && session.user.role !== Role.ADMIN)) {
      return createErrorResponse("Não autorizado. Você não tem permissão para atualizar livros.", 403, "FORBIDDEN");
    }

    const { id } = params;
    const body = await request.json();

    // Validar os dados do corpo da requisição
    const validatedData = updateBookSchema.parse(body);

    const book = await prisma.book.update({
      where: { id },
      data: {
        ...validatedData,
        pages: validatedData.pages === '' ? null : validatedData.pages,
        year: validatedData.year === '' ? null : validatedData.year,
        currentPage: validatedData.currentPage === '' ? null : validatedData.currentPage,
        status: validatedData.status === '' || validatedData.status === 'none' ? undefined : validatedData.status,
        genreId: validatedData.genreId === '' || validatedData.genreId === 'none' ? null : validatedData.genreId,
        rating: validatedData.rating === '' || validatedData.rating === 'none' ? null : validatedData.rating,
      }
    });

    return createSuccessResponse(book);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/books/:id - Excluir um livro por ID
export async function DELETE(
  request: NextRequest, { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== Role.ADMIN) {
      return createErrorResponse("Não autorizado. Apenas administradores podem excluir livros.", 403, "FORBIDDEN");
    }

    const { id } = params;

    await prisma.book.delete({
      where: { id },
    });

    return createSuccessResponse(null, 204);
  } catch (error) {
    return handleApiError(error);
  }
}
