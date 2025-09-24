'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Book } from '@prisma/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import DeleteBookButton from '@/components/delete-book-button';
import BookCover from '@/components/book-cover';
import { useRouter } from 'next/navigation';
import StatusBadge from '@/components/status-badge';

interface Props {
  books: Book[];
}

function Rating({ value }: { value: number | null }) {
  if (value === null) return null;
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < value ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.366 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.366-2.446a1 1 0 00-1.175 0l-3.366 2.446c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
        </svg>
      ))}
    </div>
  );
}

export default function BooksList({ books }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const router = useRouter();

  const genres = ['all', ...new Set(books.map(book => book.genre).filter(Boolean))];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre;
    
    return matchesSearch && matchesGenre;
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Buscar por título ou autor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select onValueChange={setSelectedGenre} defaultValue="all">
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filtrar por Gênero" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Gêneros</SelectItem>
            {genres.filter(g => g !== 'all').map(genre => (
              <SelectItem key={genre as string} value={genre as string}>{genre}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredBooks.map((book) => (
            <Link key={book.id} href={`/books/${book.id}`} className="block">
              <Card className="flex flex-col overflow-hidden rounded-lg shadow-lg h-full transition-transform duration-300 hover:scale-105">
                <div className="aspect-w-2 aspect-h-3">
                  <BookCover src={book.cover} alt={book.title} />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <CardTitle className="text-base font-bold truncate mb-1">{book.title}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground mb-2">{book.author} ({book.year})</CardDescription>
                  <div className="mt-2 mb-3">
                    <StatusBadge status={book.status} />
                  </div>
                  <div className="flex justify-between items-center mt-auto">
                    <Rating value={book.rating} />
                    {book.genre && (
                      <span className="inline-block bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full whitespace-nowrap">{book.genre}</span>
                    )}
                  </div>
                </div>
                <CardFooter className="p-2 bg-muted/40 border-t">
                  <div className="flex w-full justify-around">
                    <Button variant="ghost" size="sm" className="flex-1" onClick={(e) => { e.stopPropagation(); router.push(`/books/${book.id}/edit`); }}>
                      Editar
                    </Button>
                    <div onClick={(e) => e.stopPropagation()}>
                      <DeleteBookButton bookId={book.id} />
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">Nenhum livro encontrado.</p>
          <p className="mt-2">Tente ajustar seus filtros ou adicione um novo livro!</p>
          <Button asChild className="mt-6">
            <Link href="/add-book">Adicionar Livro</Link>
          </Button>
        </div>
      )}
    </div>
  );
}