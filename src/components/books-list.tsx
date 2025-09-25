'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import DeleteBookButton from '@/components/delete-book-button';
import BookCover from '@/components/book-cover';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';

// Tipos de dados permanecem os mesmos
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
  genre: { id: string; name: string; } | null;
}

interface Genre {
  id: string;
  name: string;
  _count: { books: number; };
}

interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface BooksListProps {
  initialBooks: Book[];
  initialPagination: Pagination;
  genres: Genre[];
}

interface Filters {
  title: string;
  author: string;
  genre: string;
  status: string;
  year: string;
  page: number;
  limit: number;
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

export default function BooksList({ initialBooks, initialPagination, genres }: BooksListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<Filters>({
    title: searchParams.get('title') || '',
    author: searchParams.get('author') || '',
    genre: searchParams.get('genre') || '',
    status: searchParams.get('status') || '',
    year: searchParams.get('year') || '',
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '5')
  });

  // Efeito para atualizar a URL quando os filtros mudam
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (filters.title) params.set('title', filters.title);
      if (filters.author) params.set('author', filters.author);
      if (filters.genre) params.set('genre', filters.genre);
      if (filters.status) params.set('status', filters.status);
      if (filters.year) params.set('year', filters.year);
      params.set('page', filters.page.toString());
      params.set('limit', filters.limit.toString());
      router.push(`?${params.toString()}`);
    }, 300); // Debounce para evitar muitas requisições

    return () => clearTimeout(timer);
  }, [filters, router]);

  const handleFilterChange = (key: keyof Omit<Filters, 'page'>, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePaginationChange = (key: 'page' | 'limit', value: number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      title: '',
      author: '',
      genre: '',
      status: '',
      year: '',
      page: 1,
      limit: 5
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filtros */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Filtros</h2>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Limpar Filtros
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título..."
              value={filters.title}
              onChange={(e) => handleFilterChange('title', e.target.value)}
              className="pl-10"
            />
          </div>

          <Input
            placeholder="Buscar por autor..."
            value={filters.author}
            onChange={(e) => handleFilterChange('author', e.target.value)}
          />

          <Select 
            onValueChange={(value) => handleFilterChange('genre', value === 'all' ? '' : value)} 
            value={filters.genre || 'all'}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por Gênero" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Gêneros</SelectItem>
              {genres.map(genre => (
                <SelectItem key={genre.id} value={genre.name}>
                  {genre.name} ({genre._count.books})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)} 
            value={filters.status || 'all'}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="QUERO_LER">Quero Ler</SelectItem>
              <SelectItem value="LENDO">Lendo</SelectItem>
              <SelectItem value="LIDO">Lido</SelectItem>
              <SelectItem value="PAUSADO">Pausado</SelectItem>
              <SelectItem value="ABANDONADO">Abandonado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4 items-center">
          <Select onValueChange={(value) => handlePaginationChange('limit', parseInt(value))} value={filters.limit.toString()}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 por página</SelectItem>
              <SelectItem value="5">5 por página</SelectItem>
              <SelectItem value="12">12 por página</SelectItem>
              <SelectItem value="24">24 por página</SelectItem>
              <SelectItem value="48">48 por página</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Resultados e Paginação Info */}
      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Mostrando {((initialPagination.page - 1) * initialPagination.limit) + 1} - {Math.min(initialPagination.page * initialPagination.limit, initialPagination.totalCount)} de {initialPagination.totalCount} livros
        </div>
      </div>

      {/* Lista de Livros */}
      {initialBooks.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {initialBooks.map((book) => (
              <div key={book.id} >
                <Card className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                  <div className="aspect-w-2 aspect-h-3">
                    <BookCover src={book.cover} alt={book.title} />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <CardTitle className="text-base font-bold truncate mb-1">{book.title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground mb-2">
                      {book.author} {book.year && `(${book.year})`}
                    </CardDescription>
                    
                    <div className="flex justify-between items-center mt-auto">
                      <Rating value={book.rating} />
                      {book.genre && (
                        <span className="inline-block bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full whitespace-nowrap">
                          {book.genre.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <CardFooter className="p-2 bg-muted/40 border-t">
                    <div className="flex w-full justify-around">
                      <Button asChild variant="ghost" size="sm" className="flex-1">
                        <Link href={`/books/${book.id}/edit`}>Editar</Link>
                      </Button>
                      <Button asChild variant="ghost" size="sm" className="flex-1">
                        <Link href={`/books/${book.id}`}>Ver</Link>
                      </Button>
                      <DeleteBookButton 
                        bookId={book.id} 
                        onDelete={() => router.refresh()} 
                      />
                    </div>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>

          {/* Paginação */}
          {initialPagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePaginationChange('page', initialPagination.page - 1)}
                disabled={!initialPagination.hasPrev}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>

              <div className="flex gap-2">
                {Array.from({ length: Math.min(5, initialPagination.totalPages) }, (_, i) => {
                  const pageNumber = Math.max(1, Math.min(
                    initialPagination.totalPages - 4,
                    initialPagination.page - 2
                  )) + i;

                  if (pageNumber > initialPagination.totalPages) return null;

                  return (
                    <Button
                      key={pageNumber}
                      variant={pageNumber === initialPagination.page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePaginationChange('page', pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePaginationChange('page', initialPagination.page + 1)}
                disabled={!initialPagination.hasNext}
              >
                Próxima
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
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