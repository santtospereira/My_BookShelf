'use server';

import { z } from 'zod';

const BookSchema = z.object({
  title: z.string(),
  authors: z.array(z.string()),
  pageCount: z.number().optional(),
  publishedDate: z.string().optional(),
  description: z.string().optional(),
  imageLinks: z.object({
    thumbnail: z.string().optional(),
  }).optional(),
});

const GoogleBooksResponseSchema = z.object({
  items: z.array(z.object({
    volumeInfo: BookSchema,
  })).optional(),
});

export async function getBookByISBN(isbn: string) {
  if (!process.env.GOOGLE_BOOKS_API_KEY) {
    throw new Error('Google Books API key is not configured.');
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${process.env.GOOGLE_BOOKS_API_KEY}`
    );
    const data = await response.json();
    const parsedData = GoogleBooksResponseSchema.parse(data);

    if (parsedData.items && parsedData.items.length > 0) {
      const book = parsedData.items[0].volumeInfo;
      const yearMatch = book.publishedDate?.match(/\d{4}/);
      const year = yearMatch ? parseInt(yearMatch[0]) : undefined;

      return {
        title: book.title,
        author: book.authors?.join(', ') || '',
        pages: book.pageCount,
        year: year && !isNaN(year) ? year : undefined,
        synopsis: book.description,
        cover: book.imageLinks?.thumbnail || '',
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching book data from Google Books API:", error);
    throw new Error("Failed to fetch book data.");
  }
}
