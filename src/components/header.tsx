'use client';

import Link from 'next/link';
import { Book, Library } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <Library className="w-6 h-6" />
            <span>BookShelf</span>
          </Link>
          <nav>
            <ul className="flex items-center gap-6">
              <li>
                <Link href="/books" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Biblioteca
                </Link>
              </li>
              <li>
                <Link href="/add-book" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Adicionar Livro
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}