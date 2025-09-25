'use server';

import prisma from '@/lib/prisma';

export async function getAllGenres() {
  try {
    const genres = await prisma.genre.findMany({
      include: {
        _count: {
          select: { books: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
    console.log("Gêneros buscados:", genres); // Adicionado para depuração
    return genres;
  } catch (error) {
    console.error("Erro ao buscar gêneros:", error); // Erro mais detalhado
    return [];
  }
}
