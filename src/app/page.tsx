import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 md:p-12 lg:p-24 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
          Bem-vindo à sua Biblioteca Digital
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8">
          Organize seus livros, acompanhe seu progresso de leitura e descubra novas histórias.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/auth/signin" passHref>
            <Button size="lg" className="text-lg px-8 py-3">
              Entrar
            </Button>
          </Link>
          <Link href="/auth/register" passHref>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-gray-300 text-gray-800 hover:bg-gray-100">
              Criar Conta
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}