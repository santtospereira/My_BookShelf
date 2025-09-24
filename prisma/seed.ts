import { PrismaClient, ReadingStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Deleta todos os livros e gêneros existentes para evitar duplicatas
  await prisma.book.deleteMany();
  await prisma.genre.deleteMany();

  // Primeiro, criar os gêneros
  const genres = [
    { name: 'Fantasia' },
    { name: 'Ficção Científica' },
    { name: 'História' },
    { name: 'Autoajuda' },
    { name: 'Romance' },
    { name: 'Mistério' },
    { name: 'Biografia' }
  ];

  const createdGenres = [];
  for (const genre of genres) {
    const createdGenre = await prisma.genre.create({
      data: genre,
    });
    createdGenres.push(createdGenre);
  }

  // Mapear os gêneros por nome para facilitar a busca
  const genreMap = createdGenres.reduce((map, genre) => {
    map[genre.name] = genre.id;
    return map;
  }, {} as Record<string, string>);

  // Criar os livros com referência aos gêneros
  const books = [
    {
      title: 'A Guerra dos Tronos',
      author: 'George R. R. Martin',
      genreId: genreMap['Fantasia'],
      year: 1996,
      pages: 694,
      rating: 5,
      synopsis: 'A Guerra dos Tronos é o primeiro livro da série de fantasia épica As Crônicas de Gelo e Fogo, escrita pelo autor norte-americano George R. R. Martin.',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/91+1SUO3vUL.jpg',
      status: ReadingStatus.LIDO,
      currentPage: 694,
    },
    {
      title: 'Duna',
      author: 'Frank Herbert',
      genreId: genreMap['Ficção Científica'],
      year: 1965,
      pages: 688,
      rating: 5,
      synopsis: 'Uma estonteante mistura de aventura e misticismo, ecologia e política, este romance vencedor dos prêmios Hugo e Nebula deu início a uma das mais bem-sucedidas sagas da ficção científica.',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/81dIAR2jR3L.jpg',
      status: ReadingStatus.LENDO,
      currentPage: 350,
    },
    {
      title: 'O Guia do Mochileiro das Galáxias',
      author: 'Douglas Adams',
      genreId: genreMap['Ficção Científica'],
      year: 1979,
      pages: 208,
      rating: 4,
      synopsis: 'A saga de Arthur Dent, um inglês azarado que escapa da destruição da Terra com a ajuda de seu amigo Ford Prefect, um alienígena disfarçado.',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/81o-7BPII4L.jpg',
      status: ReadingStatus.QUERO_LER,
    },
    {
      title: 'Sapiens: Uma Breve História da Humanidade',
      author: 'Yuval Noah Harari',
      genreId: genreMap['História'],
      year: 2011,
      pages: 464,
      rating: 5,
      synopsis: 'Harari se baseia em conceitos da biologia, antropologia, paleontologia e economia para explorar como a história moldou nossas sociedades, nossos animais e plantas e até mesmo nossas personalidades.',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/715afn3aYxL.jpg',
      status: ReadingStatus.PAUSADO,
      currentPage: 120,
    },
    {
      title: 'O Poder do Hábito',
      author: 'Charles Duhigg',
      genreId: genreMap['Autoajuda'],
      year: 2012,
      pages: 400,
      rating: 4,
      synopsis: 'Um jornalista do New York Times examina como os hábitos funcionam e como podemos transformá-los em nossas vidas, empresas e sociedades.',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/81CXtV3STgL.jpg',
      status: ReadingStatus.LIDO,
      currentPage: 400,
    },
    {
      title: 'Orgulho e Preconceito',
      author: 'Jane Austen',
      genreId: genreMap['Romance'],
      year: 1813,
      pages: 432,
      rating: 5,
      synopsis: 'Uma das mais famosas obras da literatura inglesa, que retrata a sociedade rural inglesa do início do século XIX através da história de Elizabeth Bennet e Mr. Darcy.',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/81DWBXHK-BL.jpg',
      status: ReadingStatus.LIDO,
      currentPage: 432,
    },
    {
      title: 'O Nome da Rosa',
      author: 'Umberto Eco',
      genreId: genreMap['Mistério'],
      year: 1980,
      pages: 624,
      rating: 4,
      synopsis: 'Um romance de mistério ambientado em um mosteiro medieval, onde o frade franciscano Guilherme de Baskerville investiga uma série de mortes misteriosas.',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/81qfKfUzKYL.jpg',
      status: ReadingStatus.PAUSADO,
      currentPage: 200,
    },
    {
      title: 'Steve Jobs',
      author: 'Walter Isaacson',
      genreId: genreMap['Biografia'],
      year: 2011,
      pages: 656,
      rating: 5,
      synopsis: 'A biografia autorizada do co-fundador da Apple, baseada em mais de quarenta entrevistas com Jobs ao longo de dois anos, além de entrevistas com mais de cem familiares, amigos, adversários, concorrentes e colegas.',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/81VStYnDGrL.jpg',
      status: ReadingStatus.QUERO_LER,
    },
    {
      title: 'O Senhor dos Anéis: A Sociedade do Anel',
      author: 'J.R.R. Tolkien',
      genreId: genreMap['Fantasia'],
      year: 1954,
      pages: 576,
      rating: 5,
      synopsis: 'O primeiro volume da épica trilogia O Senhor dos Anéis, que narra a jornada de Frodo Baggins para destruir o Um Anel e salvar a Terra-média.',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/91b0C2YNSrL.jpg',
      status: ReadingStatus.LENDO,
      currentPage: 234,
    },
    {
      title: 'Uma Breve História do Tempo',
      author: 'Stephen Hawking',
      genreId: genreMap['Ficção Científica'],
      year: 1988,
      pages: 256,
      rating: 4,
      synopsis: 'Uma exploração fascinante dos conceitos fundamentais da física moderna, incluindo o Big Bang, buracos negros e a natureza do tempo e do espaço.',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/81CQ1cyBhyL.jpg',
      status: ReadingStatus.QUERO_LER,
    },
  ];

  for (const book of books) {
    await prisma.book.create({
      data: book,
    });
  }

  console.log('Seeding finished.');
  console.log(`Created ${createdGenres.length} genres and ${books.length} books.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
