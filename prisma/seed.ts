import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Deleta todos os livros existentes para evitar duplicatas
  await prisma.book.deleteMany();

  const books = [
    {
      title: 'A Guerra dos Tronos',
      author: 'George R. R. Martin',
      genre: 'Fantasia',
      year: 1996,
      pages: 694,
      rating: 5,
      synopsis: 'A Guerra dos Tronos é o primeiro livro da série de fantasia épica As Crônicas de Gelo e Fogo, escrita pelo autor norte-americano George R. R. Martin.',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/91+1SUO3vUL.jpg',
      status: 'LIDO',
      currentPage: 694,
    },
    {
      title: 'Duna',
      author: 'Frank Herbert',
      genre: 'Ficção Científica',
      year: 1965,
      pages: 688,
      rating: 5,
      synopsis: 'Uma estonteante mistura de aventura e misticismo, ecologia e política, este romance vencedor dos prêmios Hugo e Nebula deu início a uma das mais bem-sucedidas sagas da ficção científica.',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/81dIAR2jR3L.jpg',
      status: 'LENDO',
      currentPage: 350,
    },
    {
      title: 'O Guia do Mochileiro das Galáxias',
      author: 'Douglas Adams',
      genre: 'Ficção Científica',
      year: 1979,
      pages: 208,
      rating: 4,
      synopsis: 'A saga de Arthur Dent, um inglês azarado que escapa da destruição da Terra com a ajuda de seu amigo Ford Prefect, um alienígena disfarçado.',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/81o-7BPII4L.jpg',
      status: 'QUERO_LER',
    },
    {
      title: 'Sapiens: Uma Breve História da Humanidade',
      author: 'Yuval Noah Harari',
      genre: 'História',
      year: 2011,
      pages: 464,
      rating: 5,
      synopsis: 'Harari se baseia em conceitos da biologia, antropologia, paleontologia e economia para explorar como a história moldou nossas sociedades, nossos animais e plantas e até mesmo nossas personalidades.',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/715afn3aYxL.jpg',
      status: 'PAUSADO',
      currentPage: 120,
    },
    {
      title: 'O Poder do Hábito',
      author: 'Charles Duhigg',
      genre: 'Autoajuda',
      year: 2012,
      pages: 400,
      rating: 4,
      synopsis: 'Um jornalista do New York Times examina como os hábitos funcionam e como podemos transformá-los em nossas vidas, empresas e sociedades.',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/81CXtV3STgL.jpg',
      status: 'LIDO',
      currentPage: 400,
    }
  ];

  for (const book of books) {
    await prisma.book.create({
      data: book,
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
