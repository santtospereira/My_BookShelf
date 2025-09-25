import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import DeleteBookButton from '@/components/delete-book-button';
import BookCover from '@/components/book-cover';

const prisma = new PrismaClient();

interface Props {
  params: {
    id: string;
  };
}

function Rating({ value }: { value: number | null }) {
  if (value === null) return null;
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < value ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.366 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.366-2.446a1 1 0 00-1.175 0l-3.366 2.446c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
        </svg>
      ))}
    </div>
  );
}

export default async function BookDetailsPage({ params }: Props) {
  const { id } = params;
  const book = await prisma.book.findUnique({
    where: {
      id,
    },
    include: {
      genre: true,
    },
  });

  if (!book) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8 md:p-12 lg:p-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-muted-foreground">{book.author}</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={`/books/${book.id}/edit`}>Editar</Link>
            </Button>
            <DeleteBookButton bookId={book.id} />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-0">
                <BookCover src={book.cover} alt={`Capa do livro ${book.title}`} />
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-semibold">Avaliação</span>
                  <Rating value={book.rating} />
                </div>
                {book.genre && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Gênero</span>
                    <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">{book.genre.name}</span>
                  </div>
                )}
                {book.status && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Status</span>
                    <span>{book.status}</span>
                  </div>
                )}
                {book.pages && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Páginas</span>
                    <span>{book.pages}</span>
                  </div>
                )}
                {book.year && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Ano</span>
                    <span>{book.year}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {book.synopsis && (
              <Card>
                <CardHeader>
                  <CardTitle>Sinopse</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{book.synopsis}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
