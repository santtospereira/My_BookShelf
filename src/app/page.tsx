import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, CheckCircle2, FileText, Library } from "lucide-react";
import GenreChart from '@/components/genre-chart';
import { cn } from '@/lib/utils';

async function getDashboardData() {
  const books = await prisma.book.findMany({
    include: {
      genre: true,
    },
  });

  const totalBooks = books.length;
  const readingNow = books.filter(book => book.status === 'LENDO').length;
  const finishedBooks = books.filter(book => book.status === 'LIDO').length;
  const wantToRead = books.filter(book => book.status === 'QUERO_LER').length;
  const paused = books.filter(book => book.status === 'PAUSADO').length;
  const abandoned = books.filter(book => book.status === 'ABANDONADO').length;

  const totalPagesRead = books.reduce((acc, book) => {
    if (book.status === 'LIDO' && book.pages) {
      return acc + book.pages;
    }
    if (book.status === 'LENDO' && book.currentPage) {
      return acc + book.currentPage;
    }
    return acc;
  }, 0);

  const totalPossiblePages = books.reduce((acc, book) => acc + (book.pages || 0), 0);
  const averageProgress = totalPossiblePages > 0 ? (totalPagesRead / totalPossiblePages) * 100 : 0;

  const genreCounts = books.reduce((acc, book) => {
    if (book.genre) {
      acc[book.genre.name] = (acc[book.genre.name] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const genreData = Object.entries(genreCounts)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total);

  return {
    overview: {
      totalBooks,
      readingNow,
      finishedBooks,
      wantToRead,
      paused,
      abandoned,
      totalPagesRead,
      averageProgress,
    },
    genreData,
  };
}

export default async function Home() {
  const { overview, genreData } = await getDashboardData();

  const pausedColor = overview.paused >= 3 ? 'text-destructive' : 'text-primary';
  const abandonedColor = overview.abandoned >= 3 ? 'text-destructive' : 'text-primary';

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-12 lg:p-24">
      <div className="w-full max-w-5xl mb-12 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-center md:text-left text-primary">Dashboard da Biblioteca</h1>
        
      </div>

      <div className="w-full max-w-5xl grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-12">
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Livros
            </CardTitle>
            <Library className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-primary">{overview.totalBooks}</div>
          </CardContent>
        </Card>
        
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Livros em Leitura
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-primary">{overview.readingNow}</div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Livros Finalizados
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-primary">{overview.finishedBooks}</div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Páginas Lidas
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-primary">{overview.totalPagesRead.toLocaleString('pt-BR')}</div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Quero Ler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-primary">{overview.wantToRead}</div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pausados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-extrabold", pausedColor)}>{overview.paused}</div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Abandonados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-extrabold", abandonedColor)}>{overview.abandoned}</div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Progresso Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-primary">{overview.averageProgress.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="w-full max-w-5xl mb-12">
        <GenreChart data={genreData} />
      </div>
    </main>
  );
}