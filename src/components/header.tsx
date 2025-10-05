'use client';

import Link from "next/link";
import { Book, Library } from "lucide-react"; // Re-adding original imports
import { ThemeSwitcher } from "./theme-switcher";
import ClientOnly from "./client-only"; // Re-adding original imports
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from "./ui/button"; // Assuming this path is correct

export default function Header() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <Library className="w-6 h-6" /> {/* Original icon */}
            <span>BookShelf</span>
          </Link>
          <div className="flex items-center gap-6"> {/* Group auth buttons and theme switcher */}
            <nav>
              <ul className="flex items-center gap-6">
                {!loading && session?.user && ( // Render only when not loading and user is logged in
                  <>
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
                  </>
                )}
              </ul>
            </nav>
            <div className="flex items-center space-x-2"> {/* Group auth buttons and theme switcher */}

              {!loading && session?.user && (
                <>
                  <span className="text-sm text-muted-foreground hidden md:inline">Olá, {session.user.name || session.user.email}!</span>
                  <Button variant="ghost" onClick={async () => { await signOut({ redirect: false }); window.location.href = '/'; }}>Sair</Button>
                </>
              )}
              <ClientOnly> {/* Original ClientOnly wrapper */}
                <ThemeSwitcher />
              </ClientOnly>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}