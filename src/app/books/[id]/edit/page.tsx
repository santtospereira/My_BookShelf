'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import EditBookForm from '@/components/edit-book-form';

interface Book {
  id: string;
  title: string;
  author: string;
  year: number | null;
  pages: number | null;
  currentPage: number | null;
  rating: number | null;
  synopsis: string | null;
  cover: string | null;
  status: string | null;
  isbn: string | null;
  genreId: string | null;
  genre: {
    id: string;
    name: string;
  } | null;
}

export default function EditBookPage() {
  const params = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBook() {
      try {
        const response = await fetch(`/api/books/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error('Erro ao carregar livro');
        }
        
        const data: Book = await response.json();
        setBook(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchBook();
    }
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen p-8 md:p-12 lg:p-24">
        <div className="max-w-lg mx-auto">
          <div className="text-center">
            <div className="text-xl">Carregando livro...</div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen p-8 md:p-12 lg:p-24">
        <div className="max-w-lg mx-auto">
          <div className="text-center">
            <div className="text-xl text-red-500">Erro: {error}</div>
          </div>
        </div>
      </main>
    );
  }

  if (!book) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8 md:p-12 lg:p-24">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold mb-8">Editar Livro: {book.title}</h1>
        <EditBookForm book={book} />
      </div>
    </main>
  );
}
