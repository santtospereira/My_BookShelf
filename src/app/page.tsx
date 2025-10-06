import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { LogIn, UserPlus } from "lucide-react";

export default function HomePage() {
  return (
    <main className="relative flex h-screen flex-col items-center p-8 overflow-hidden
      bg-gradient-to-br from-[#b5179e] via-[#7209b7] to-[#560bad]
      dark:from-[#10002b] dark:via-[#240046] dark:to-[#3c096c] transition-colors duration-500">
      
      {/* Bookshelf Illustration */}
      <Image
        src="/estante.png"
        alt="Ilustração de estante de livros"
        width={400} // Adjust size as needed
        height={400} // Adjust size as needed
        className="absolute bottom-0 right-0 opacity-20 dark:opacity-10 -z-10 pointer-events-none"
      />

      {/* Central Content Container */}
      <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-2 items-center lg:items-start text-center lg:text-left max-w-[90%] h-[90%] overflow-auto w-full p-8 rounded-lg shadow-2xl
                      bg-white/10 dark:bg-black/20 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-10 duration-1000">
        
        {/* Left Column: Text and Buttons */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg tracking-wide">
            Bem-vindo à sua Biblioteca Digital
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 drop-shadow-lg">
            Organize seus livros, acompanhe seu progresso de leitura e descubra novas histórias.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <Button asChild size="lg" className="px-8 py-6 text-lg rounded-full font-semibold text-white
                                                bg-gradient-to-r from-[#ff00c3] to-[#b5179e]
                                                hover:scale-105 transition-all duration-300 shadow-lg">
              <Link href="/auth/signin">
                <LogIn className="mr-2 h-5 w-5" />
                Entrar
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8 py-6 text-lg rounded-full font-semibold
                                                                  bg-white/30 text-white border-white/30
                                                                  hover:bg-white/40 hover:scale-105 transition-all duration-300 shadow-lg">
              <Link href="/auth/register">
                <UserPlus className="mr-2 h-5 w-5" />
                Criar Conta
              </Link>
            </Button>
          </div>
        </div>

        {/* Right Column: Bookshelf Image */}
        <div className="hidden lg:flex justify-center items-center">
          <Image
            src="/estante.png"
            alt="Ilustração de estante de livros"
            width={400} // Adjust size as needed
            height={400} // Adjust size as needed
            className="opacity-80 dark:opacity-60" // Make it prominent but not too dark
          />
        </div>
      </div>

      {/* Footer */}
      <footer
        className="absolute bottom-4 text-xs text-white/60 animate-in fade-in duration-1000 delay-500"
      >
        © {new Date().getFullYear()} BookShelf
      </footer>
    </main>
  );
}