import { z } from 'zod'

// Enum para status de leitura
export const ReadingStatusEnum = z.enum([
  'QUERO_LER',
  'LENDO',
  'LIDO',
  'PAUSADO',
  'ABANDONADO'
])

// Schema unificado para o formulário de livro (criação e edição)
export const bookFormSchema = z.object({
  title: z.string().min(2, {
    message: "O título deve ter no mínimo 2 caracteres.",
  }),
  author: z.string().min(2, {
    message: "O nome do autor deve ter no mínimo 2 caracteres.",
  }),
  pages: z.coerce.number().positive("O número de páginas deve ser positivo.").optional().or(z.literal('')),
  year: z.coerce.number().int().min(1000, "Ano inválido.").max(new Date().getFullYear() + 5, "Ano inválido.").optional().or(z.literal('')),
  currentPage: z.coerce.number().int().min(0, "A página atual não pode ser negativa.").optional().or(z.literal('')),
  status: ReadingStatusEnum.optional().or(z.literal('none')).or(z.literal('')),
  isbn: z.string().optional(),
  cover: z.string().url("A URL da capa deve ser válida.").or(z.literal('')).optional(),
  genreId: z.string().optional().or(z.literal('none')).or(z.literal('')),
  rating: z.coerce.number().int().min(1).max(5).optional().or(z.literal('none')).or(z.literal('')),
  synopsis: z.string().optional(),
});

export const updateBookSchema = bookFormSchema.partial();

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

export type BookFormInput = z.infer<typeof bookFormSchema>
export type UpdateBookInput = z.infer<typeof updateBookSchema>
export type CreateGenreInput = z.infer<typeof createGenreSchema>
export type BooksSearchParams = z.infer<typeof booksSearchSchema>
