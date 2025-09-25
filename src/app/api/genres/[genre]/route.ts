import { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { handleApiError, createSuccessResponse, createErrorResponse } from '@/lib/api-utils'

const prisma = new PrismaClient()

// DELETE /api/genres/[genre] - Remover gênero
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ genre: string }> }
) {
  try {
    const resolvedParams = await context.params;
    const { genre } = resolvedParams;
    // Decodificar o nome do gênero da URL
    const genreName = decodeURIComponent(genre)
    
    // Buscar o gênero pelo nome
    const existingGenre = await prisma.genre.findFirst({
      where: {
        name: genreName
      },
      include: {
        _count: {
          select: { books: true }
        }
      }
    })
    
    if (!existingGenre) {
      return createErrorResponse('Gênero não encontrado', 404, 'GENRE_NOT_FOUND')
    }
    
    // Verificar se há livros associados a este gênero
    if (existingGenre._count.books > 0) {
      return createErrorResponse(
        'Não é possível remover um gênero que possui livros associados',
        409,
        'GENRE_HAS_BOOKS'
      )
    }
    
    await prisma.genre.delete({
      where: { id: existingGenre.id }
    })
    
    return createSuccessResponse(
      { message: 'Gênero removido com sucesso' },
      200
    )
  } catch (error) {
    return handleApiError(error)
  }
}
