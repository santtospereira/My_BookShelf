'use server';

import { z } from "zod";
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const GENRES = ["Literatura Brasileira", "Ficção Científica", "Ficção", "Romance", "Biografia", "História", "Autoajuda", "Tecnologia", "Negócios", "Psicologia", "Filosofia", "Poesia", "Conto", "Literatura Política", "Aventura", "Fábula", "Existencialismo"] as const;
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

import { revalidatePath } from "next/cache";

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
  revalidatePath('/books');
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
  revalidatePath('/books');
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
  revalidatePath('/books');
}

export async function fetchBookDataByISBN(isbn: string) {
  'use server';

  if (!isbn) {
    return null;
  }

  const apiKey = "AIzaSyDtqNJUG2H1BzVn0fhSXfzKBGcN5PFKi6E";

  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${apiKey}`);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const item = data.items[0].volumeInfo;
      return {
        title: item.title || '',
        author: item.authors ? item.authors.join(', ') : '',
        genre: item.categories ? item.categories.join(', ') : '',
        year: item.publishedDate ? parseInt(item.publishedDate.substring(0, 4)) : null,
        pages: item.pageCount || null,
        cover: item.imageLinks?.thumbnail || '',
        synopsis: item.description || '',
      };
    }
  } catch (error) {
    console.error("Error fetching book data:", error);
    return null;
  }

  return null;
}