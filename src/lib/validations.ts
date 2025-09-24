import { z } from 'zod'

// Enum para status de leitura
export const ReadingStatusEnum = z.enum([
  'QUERO_LER',
  'LENDO',
  'LIDO',
  'PAUSADO',
  'ABANDONADO'
])

// Schema para criar um livro
export const createBookSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  author: z.string().min(1, 'Autor é obrigatório'),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 5).optional(),
  pages: z.number().int().positive().optional(),
  currentPage: z.number().int().min(0).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  synopsis: z.string().optional(),
  cover: z.string().url().optional(),
  status: ReadingStatusEnum.optional(),
  isbn: z.string().optional(),
  genreId: z.string().uuid().optional()
})

// Schema para atualizar um livro
export const updateBookSchema = createBookSchema.partial()

// Schema para criar um gênero
export const createGenreSchema = z.object({
  name: z.string().min(1, 'Nome do gênero é obrigatório')
})

// Schema para parâmetros de busca de livros
export const booksSearchSchema = z.object({
  title: z.string().optional(),
  author: z.string().optional(),
  genre: z.string().optional(),
  status: ReadingStatusEnum.optional(),
  isbn: z.string().optional(),
  year: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 5).optional(),
  pages: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10)
})

export type CreateBookInput = z.infer<typeof createBookSchema>
export type UpdateBookInput = z.infer<typeof updateBookSchema>
export type CreateGenreInput = z.infer<typeof createGenreSchema>
export type BooksSearchParams = z.infer<typeof booksSearchSchema>
