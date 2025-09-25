import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { handleApiError, createSuccessResponse, createErrorResponse } from '@/lib/api-utils'
import { createGenreSchema, CreateGenreInput } from '@/lib/validations'

// GET /api/genres - Listar todos os gêneros
export async function GET() {
  try {
    const genres = await prisma.genre.findMany({
      include: {
        _count: {
          select: { books: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })
    
    return createSuccessResponse(genres)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/genres - Adicionar novo gênero
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData: CreateGenreInput = createGenreSchema.parse(body)
    
    // Verificar se já existe um gênero com o mesmo nome
    const existingGenre = await prisma.genre.findFirst({
      where: {
        name: validatedData.name
      }
    })
    
    if (existingGenre) {
      return createErrorResponse(
        'Já existe um gênero com este nome',
        409,
        'GENRE_EXISTS'
      )
    }
    
    const newGenre = await prisma.genre.create({
      data: validatedData,
      include: {
        _count: {
          select: { books: true }
        }
      }
    })
    
    return createSuccessResponse(newGenre, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
