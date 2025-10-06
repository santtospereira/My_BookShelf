"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";
import React from "react";

export default function HomePage(): JSX.Element {
  return (
    <main className="relative flex items-center justify-center h-screen w-screen overflow-hidden
      bg-gradient-to-br from-[#9b5de5]/90 to-[#7b1fa2]/90">

      {/* Fundo translúcido */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 opacity-60" />

      {/* Container principal com púrpura mais escuro */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between
        w-[79%] h-[79%] rounded-3xl p-8 lg:p-12
        bg-gradient-to-br from-[#4b0082] via-[#5a2d8c] to-[#6a0dad]
        shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">

        {/* Texto à esquerda */}
        <div className="flex flex-col justify-center items-start text-left space-y-6 lg:max-w-xl w-full lg:w-1/2">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-md">
            Bem-vindo à sua <br /> Biblioteca Digital
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-white/90 max-w-md">
            Organize seus livros, acompanhe seu progresso de leitura e descubra novas histórias.
          </p>

          {/* Botões */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Button
              asChild
              size="lg"
              className="px-8 py-4 text-lg rounded-full font-semibold text-white
                bg-gradient-to-r from-[#ff00c8] to-[#b5179e] 
                hover:from-[#ff3de2] hover:to-[#c95fff] 
                transition-all duration-300 shadow-lg hover:scale-105"
            >
              <Link href="/auth/signin">
                <LogIn className="mr-2 h-5 w-5" />
                Entrar
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="px-8 py-4 text-lg rounded-full font-semibold
                border-2 border-white/60 text-white bg-white/10
                hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <Link href="/auth/register">
                <UserPlus className="mr-2 h-5 w-5" />
                Criar Conta
              </Link>
            </Button>
          </div>
        </div>

        {/* Imagem da estante à direita, encostada na borda do container */}
        <div className="relative flex w-full lg:w-1/2 h-full mt-8 lg:mt-0">
          <Image
            src="/estante.png"
            alt="Ilustração de estante de livros"
            fill
            className="object-contain object-right opacity-25 drop-shadow-2xl select-none"
            priority
          />
        </div>

      </div>

      {/* Rodapé */}
      <footer className="absolute bottom-4 text-xs text-white/60 w-full text-center">
        © {new Date().getFullYear()} BookShelf
      </footer>

    </main>
  );
}
