import BooksList from '@/components/books-list';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getBooks } from '@/actions/book';
import { getAllGenres } from '@/actions/genre';
import { Suspense } from 'react';

interface BooksPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function BooksPage({ searchParams }: BooksPageProps) {
  // Buscar dados dos livros e gêneros em paralelo
  const [booksResult, genres] = await Promise.all([
    getBooks(searchParams),
    getAllGenres()
  ]);

  const { books, pagination } = booksResult.data;

  return (
    <main className="min-h-screen p-8 md:p-12 lg:p-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary">Minha Biblioteca</h1>
          <Button asChild>
            <Link href="/add-book">Adicionar Livro</Link>
          </Button>
        </div>
        <Suspense fallback={<div className="text-center py-16 text-xl">Carregando livros...</div>}>
          <BooksList 
            initialBooks={books} 
            initialPagination={pagination}
            genres={genres}
          />
        </Suspense>
      </div>
    </main>
  );
}
