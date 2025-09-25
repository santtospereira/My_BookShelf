'use server';

import { z } from "zod";
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { bookFormSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

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
  'use server';

  const validationResult = bookFormSchema.safeParse(formData);

  if (!validationResult.success) {
    console.error("Validation failed:", validationResult.error.flatten().fieldErrors);
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const cleanedData = cleanDataForPrisma(validationResult.data);

  try {
    await prisma.book.create({
      data: cleanedData,
    });

    console.log("Book created successfully");

    revalidatePath('/books');
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error adding book:", error);
    return {
      success: false,
      errors: { _server: ["Não foi possível adicionar o livro. Tente novamente."] },
    };
  }
}

// Server Action para editar um livro
export async function editBookAction(id: string, formData: any) {
  'use server';

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
      where: {
        id,
      },
      data: cleanedData,
    });

    revalidatePath('/books');
    revalidatePath('/'); // Revalidate home page to update stats
    return {
      success: true,
    };
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
  try {
    const book = await prisma.book.findUnique({
      where: { id },
      include: { genre: true },
    });
    return book;
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    return null;
  }
}