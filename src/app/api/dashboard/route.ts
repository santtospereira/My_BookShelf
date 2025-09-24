import { PrismaClient, ReadingStatus } from '@prisma/client'
import { handleApiError, createSuccessResponse } from '@/lib/api-utils'

const prisma = new PrismaClient()

// GET /api/dashboard - Obter estatísticas do dashboard
export async function GET() {
  try {
    // Buscar todos os livros com seus dados
    const books = await prisma.book.findMany({
      include: {
        genre: true
      }
    })

    // Calcular estatísticas básicas
    const totalBooks = books.length
    const readingNow = books.filter(book => book.status === ReadingStatus.LENDO).length
    const finishedBooks = books.filter(book => book.status === ReadingStatus.LIDO).length
    const wantToRead = books.filter(book => book.status === ReadingStatus.QUERO_LER).length
    const paused = books.filter(book => book.status === ReadingStatus.PAUSADO).length
    const abandoned = books.filter(book => book.status === ReadingStatus.ABANDONADO).length

    // Calcular total de páginas lidas
    const totalPagesRead = books.reduce((acc, book) => {
      if (book.status === ReadingStatus.LIDO) {
        return acc + (book.pages || 0)
      }
      return acc + (book.currentPage || 0)
    }, 0)

    // Calcular progresso médio dos livros em leitura
    const booksInProgress = books.filter(book => 
      book.status === ReadingStatus.LENDO && book.pages && book.currentPage
    )
    
    const averageProgress = booksInProgress.length > 0 
      ? booksInProgress.reduce((acc, book) => {
          return acc + ((book.currentPage || 0) / (book.pages || 1)) * 100
        }, 0) / booksInProgress.length
      : 0

    // Estatísticas por gênero
    const genreStats = books.reduce((acc, book) => {
      if (book.genre) {
        if (!acc[book.genre.name]) {
          acc[book.genre.name] = {
            total: 0,
            finished: 0,
            reading: 0
          }
        }
        acc[book.genre.name].total++
        if (book.status === ReadingStatus.LIDO) {
          acc[book.genre.name].finished++
        } else if (book.status === ReadingStatus.LENDO) {
          acc[book.genre.name].reading++
        }
      }
      return acc
    }, {} as Record<string, { total: number; finished: number; reading: number }>)

    // Estatísticas por status
    const statusStats = {
      [ReadingStatus.QUERO_LER]: wantToRead,
      [ReadingStatus.LENDO]: readingNow,
      [ReadingStatus.LIDO]: finishedBooks,
      [ReadingStatus.PAUSADO]: paused,
      [ReadingStatus.ABANDONADO]: abandoned
    }

    // Livros mais bem avaliados
    const topRatedBooks = books
      .filter(book => book.rating && book.rating >= 4)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5)
      .map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        rating: book.rating,
        genre: book.genre?.name
      }))

    // Atividade recente (livros adicionados recentemente - simulado por ordem de criação)
    const recentBooks = books
      .slice(-5)
      .reverse()
      .map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        status: book.status,
        genre: book.genre?.name
      }))

    const dashboardData = {
      overview: {
        totalBooks,
        readingNow,
        finishedBooks,
        wantToRead,
        paused,
        abandoned,
        totalPagesRead,
        averageProgress: Math.round(averageProgress * 100) / 100
      },
      statusStats,
      genreStats,
      topRatedBooks,
      recentBooks
    }

    return createSuccessResponse(dashboardData)
  } catch (error) {
    return handleApiError(error)
  }
}
