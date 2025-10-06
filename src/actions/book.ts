'use server';

import { z } from "zod";
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { bookFormSchema, booksSearchSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/lib/auth";
import { ReadingStatus, Role } from "@prisma/client";

// Função para limpar os dados do formulário validados
const cleanDataForPrisma = (data: z.infer<typeof bookFormSchema>) => {
  const cleaned: any = {};
  for (const key in data) {
    const value = data[key as keyof typeof data];
    if (value === '' || value === 'none') {
      cleaned[key] = null;
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
};

// Server Action para adicionar um livro
export async function addBookAction(formData: any) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    return {
      success: false,
      errors: { _server: ["Não autorizado. Você precisa estar logado para adicionar livros."] },
    };
  }

  const validationResult = bookFormSchema.safeParse(formData);

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const cleanedData = cleanDataForPrisma(validationResult.data);

  try {
    await prisma.book.create({
      data: {
        ...cleanedData,
        userId: session.user.id, // Associar ao usuário logado
      },
    });

    revalidatePath('/books');
    return { success: true };
  } catch (error: any) {
    console.error("Error adding book:", error);
    return {
      success: false,
      errors: { _server: ["Não foi possível adicionar o livro. Tente novamente."] },
    };
  }
}

// Server Action para editar um livro
export async function editBookAction(id: string, formData: any) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    return {
      success: false,
      errors: { _server: ["Não autorizado."] },
    };
  }

  const book = await prisma.book.findUnique({ where: { id } });
  if (!book || book.userId !== session.user.id) {
    return {
      success: false,
      errors: { _server: ["Livro não encontrado ou você não tem permissão para editá-lo."] },
    };
  }

  const validationResult = bookFormSchema.safeParse(formData);

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const cleanedData = cleanDataForPrisma(validationResult.data);

  try {
    await prisma.book.update({
      where: { id }, // A verificação de permissão já foi feita
      data: cleanedData,
    });

    revalidatePath('/books');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Error updating book:", error);
    return {
      success: false,
      errors: { _server: ["Não foi possível atualizar o livro. Tente novamente."] },
    };
  }
}

// Server Action para excluir um livro
export async function deleteBookAction(id: string) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    return;
  }

  const book = await prisma.book.findUnique({ where: { id } });

  // Permitir exclusão se o usuário for o dono ou um admin
  if (!book || (book.userId !== session.user.id && session.user.role !== Role.ADMIN)) {
    // Idealmente, deveria retornar um objeto de erro, mas vamos manter simples por enquanto
    console.error("Unauthorized attempt to delete a book");
    return;
  }

  await prisma.book.delete({ where: { id } });

  revalidatePath('/books');
}

export async function fetchBookDataByISBN(isbn: string) {
  'use server';

  if (!isbn) {
    return null;
  }

  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

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

export async function getBookById(id: string) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) return null;

  try {
    const book = await prisma.book.findFirst({
      where: { id, userId: session.user.id }, // Apenas buscar livro do usuário logado
      include: { genre: true },
    });
    return book;
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    return null;
  }
}

interface BookWhereInput {
  userId: string;
  title?: { contains: string };
  author?: { contains: string };
  status?: ReadingStatus;
  isbn?: string;
  year?: number;
  pages?: number;
  genre?: { name: { contains: string } };
}

export async function getBooks(searchParams: { [key: string]: string | string[] | undefined }) {
  const session = await getServerSession(authConfig);
  const defaultReturn = {
    success: false,
    error: "Failed to fetch books",
    data: {
      books: [],
      pagination: { page: 1, limit: 10, totalCount: 0, totalPages: 0, hasNext: false, hasPrev: false },
    },
  };

  if (!session?.user?.id) {
    return defaultReturn;
  }

  try {
    const validatedParams = booksSearchSchema.parse({
      title: searchParams.title,
      author: searchParams.author,
      genre: searchParams.genre,
      status: searchParams.status,
      isbn: searchParams.isbn,
      year: searchParams.year,
      pages: searchParams.pages,
      page: searchParams.page,
      limit: searchParams.limit,
    });
    
    const where: BookWhereInput = { userId: session.user.id }; // Filtro base: apenas livros do usuário
    
    if (validatedParams.title) where.title = { contains: validatedParams.title };
    if (validatedParams.author) where.author = { contains: validatedParams.author };
    if (validatedParams.status) where.status = validatedParams.status as ReadingStatus;
    if (validatedParams.isbn) where.isbn = validatedParams.isbn;
    if (validatedParams.year) where.year = validatedParams.year;
    if (validatedParams.pages) where.pages = validatedParams.pages;
    if (validatedParams.genre) where.genre = { name: { contains: validatedParams.genre } };
    
    const skip = (validatedParams.page - 1) * validatedParams.limit;
    
    const [books, totalCount] = await prisma.$transaction([
      prisma.book.findMany({
        where,
        include: { genre: true },
        skip,
        take: validatedParams.limit,
        orderBy: { title: 'asc' },
      }),
      prisma.book.count({ where }),
    ]);
    
    const totalPages = Math.ceil(totalCount / validatedParams.limit);
    
    return {
      success: true,
      data: {
        books,
        pagination: {
          page: validatedParams.page,
          limit: validatedParams.limit,
          totalCount,
          totalPages,
          hasNext: validatedParams.page < totalPages,
          hasPrev: validatedParams.page > 1,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching books:", error);
    return defaultReturn;
  }
}