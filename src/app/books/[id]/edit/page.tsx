import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import EditBookForm from '@/components/edit-book-form';

interface Props {
  params: {
    id: string;
  };
}

export default async function EditBookPage({ params }: Props) {
  const { id } = params;
  const book = await prisma.book.findUnique({
    where: {
      id,
    },
  });

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
