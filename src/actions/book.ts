'use server';

import { z } from "zod";
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const GENRES = ["Literatura Brasileira", "Ficção Científica", "Ficção", "Fantasia", "Romance", "Biografia", "História", "Autoajuda", "Tecnologia", "Programação", "Negócios", "Psicologia", "Filosofia", "Poesia", "Conto", "Existencialismo"] as const;
const STATUS = ["QUERO_LER", "LENDO", "LIDO", "PAUSADO", "ABANDONADO"] as const;
const RATINGS = [1, 2, 3, 4, 5] as const;

const formSchema = z.object({
  title: z.string().min(2, {
    message: "O título deve ter no mínimo 2 caracteres.",
  }),
  author: z.string().min(2, {
    message: "O nome do autor deve ter no mínimo 2 caracteres.",
  }),
  pages: z.coerce.number().optional(),
  currentPage: z.coerce.number().optional(),
  status: z.enum(STATUS, {
    errorMap: () => ({ message: "Por favor, selecione um status de leitura." }),
  }).optional(),
  isbn: z.string().optional(),
  cover: z.string().url("A URL da capa deve ser válida.").or(z.literal('')).optional(),
  genre: z.string().optional(),
  rating: z.enum(["1", "2", "3", "4", "5"], {
    errorMap: () => ({ message: "Por favor, selecione uma avaliação." }),
  }).optional(),
  synopsis: z.string().optional(),
  year: z.coerce.number().optional(),
});

// Server Action para adicionar um livro
export async function addBookAction(formData: FormData) {
  'use server';
  
  const rawFormData = Object.fromEntries(formData.entries());
  
  const parsedData = formSchema.parse(rawFormData);
  
  await prisma.book.create({
    data: {
      title: parsedData.title,
      author: parsedData.author,
      genre: parsedData.genre || null,
      pages: parsedData.pages || null,
      currentPage: parsedData.currentPage || null,
      status: parsedData.status || null,
      isbn: parsedData.isbn || null,
      cover: parsedData.cover || null,
      rating: parsedData.rating ? parseInt(parsedData.rating) : null,
      synopsis: parsedData.synopsis || null,
      year: parsedData.year || null,
    },
  });

  console.log("Livro adicionado com sucesso!");
  redirect('/books');
}

// Server Action para editar um livro
export async function editBookAction(id: string, formData: FormData) {
  'use server';

  const rawFormData = Object.fromEntries(formData.entries());
  
  const parsedData = formSchema.parse(rawFormData);
  
  await prisma.book.update({
    where: {
      id,
    },
    data: {
      title: parsedData.title,
      author: parsedData.author,
      genre: parsedData.genre || null,
      pages: parsedData.pages || null,
      currentPage: parsedData.currentPage || null,
      status: parsedData.status || null,
      isbn: parsedData.isbn || null,
      cover: parsedData.cover || null,
      rating: parsedData.rating ? parseInt(parsedData.rating) : null,
      synopsis: parsedData.synopsis || null,
      year: parsedData.year || null,
    },
  });

  console.log("Livro atualizado com sucesso!");
  redirect('/books');
}

// Server Action para excluir um livro
export async function deleteBookAction(id: string) {
  'use server';

  await prisma.book.delete({
    where: {
      id,
    },
  });

  console.log("Livro excluído com sucesso!");
  redirect('/books');
}