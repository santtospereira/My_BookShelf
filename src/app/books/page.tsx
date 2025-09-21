import { PrismaClient } from '@prisma/client';
import BooksList from '@/components/books-list';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function BooksPage() {
  const books = await prisma.book.findMany({
    orderBy: {
      title: 'asc',
    },
  });

  return (
    <main className="min-h-screen p-8 md:p-12 lg:p-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Minha Biblioteca</h1>
        </div>
        <BooksList books={books} />
      </div>
    </main>
  );
}
