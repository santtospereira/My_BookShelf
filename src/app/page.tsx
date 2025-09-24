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

async function getStats() {
  const books = await prisma.book.findMany();

  const totalBooks = books.length;
  const readingNow = books.filter(book => book.status === 'LENDO').length;
  const finishedBooks = books.filter(book => book.status === 'LIDO').length;
  const totalPagesRead = books.reduce((acc, book) => {
    if (book.status === 'LIDO') {
      return acc + (book.pages || 0);
    }
    return acc + (book.currentPage || 0);
  }, 0);

  return { totalBooks, readingNow, finishedBooks, totalPagesRead };
}

export default async function Home() {
  const { totalBooks, readingNow, finishedBooks, totalPagesRead } = await getStats();

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-12 lg:p-24">
      <div className="w-full max-w-5xl mb-12">
        <h1 className="text-4xl font-bold text-center md:text-left">Dashboard da Biblioteca</h1>
      </div>

      <div className="w-full max-w-5xl grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-12">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Livros
            </CardTitle>
            <Library className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBooks}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Livros em Leitura
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{readingNow}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Livros Finalizados
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{finishedBooks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Páginas Lidas
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPagesRead.toLocaleString('pt-BR')}</div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}