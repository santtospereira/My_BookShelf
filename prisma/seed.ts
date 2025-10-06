import * as bcrypt from 'bcryptjs'; // Importar bcryptjs
import { PrismaClient, ReadingStatus, Role } from '@prisma/client'; // Adicionar Role

const prisma = new PrismaClient();

// Lista de gêneros a serem criados
export const GENRE_OPTIONS = [
    'Romance',
    'Fantasia',
    'Aventura',
    'Ficção Histórica',
    'Ficção Científica',
    'Distopia',
    'Horror',
    'Suspense / Thriller / Mistério',
    'Contos / Novela',
    'Poesia',
    'Não-Ficção',
    'Biografia',
    'Autoajuda',
    'Ensaio',
    'Filosofia',
    'Psicologia',
    'História',
];

async function main() {
  console.log('Start seeding ...');

  // --- Admin User Creation ---
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          role: Role.ADMIN,
          emailVerified: new Date(), // Mark as verified for admin
        },
      });
      console.log(`Created admin user: ${adminEmail}`);
    } else {
      console.log(`Admin user ${adminEmail} already exists.`);
    }
  } else {
    console.log("ADMIN_EMAIL or ADMIN_PASSWORD not set in .env. Skipping admin user creation.");
  }
  // --- End Admin User Creation ---

  // Deleta todos os livros e gêneros existentes para evitar duplicatas
  await prisma.book.deleteMany();
  await prisma.genre.deleteMany();
  console.log('Deleted existing books and genres.');

  // Mapear os gêneros por nome para facilitar a busca
  const genreMap: { [key: string]: string } = {};

  // Criar os gêneros e armazenar seus IDs gerados
  console.log('Creating genres...');
  for (const genreName of GENRE_OPTIONS) {
    const createdGenre = await prisma.genre.create({
      data: {
        name: genreName,
      },
    });
    genreMap[genreName] = createdGenre.id; // Mapeia o nome do gênero para o ID gerado
  }
  console.log(`Created ${Object.keys(genreMap).length} genres.`);

  // Criar os livros com referência aos gêneros recém-criados
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
      genreId: genreMap['Suspense / Mistério'],
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
    {
      title: '1984',
      author: 'George Orwell',
      genreId: genreMap['Ficção'],
      year: 1949,
      pages: 328,
      rating: 5,
      synopsis: 'Um romance distópico que descreve um futuro totalitário onde o governo controla todos os aspectos da vida.',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/71+o30s-YQL.jpg',
      status: ReadingStatus.LIDO,
      currentPage: 328,
    },
    {
      title: 'O Pequeno Príncipe',
      author: 'Antoine de Saint-Exupéry',
      genreId: genreMap['Conto / Fábula'],
      year: 1943,
      pages: 96,
      rating: 5,
      synopsis: 'Uma fábula filosófica sobre um pequeno príncipe que viaja por vários planetas, encontrando diferentes personagens e aprendendo sobre a vida, o amor e a perda.',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/81+o30s-YQL.jpg',
      status: ReadingStatus.LIDO,
      currentPage: 96,
    },
    {
      title: 'Cosmos',
      author: 'Carl Sagan',
      genreId: genreMap['Tecnologia'], // Mapeado para Tecnologia, pois não há um gênero 'Ciência' específico
      year: 1980,
      pages: 365,
      rating: 5,
      synopsis: 'Uma exploração da ciência e do universo, abrangendo desde a origem da vida até a vastidão do espaço.',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/81+o30s-YQL.jpg',
      status: ReadingStatus.LENDO,
      currentPage: 150,
    },
  ];

  console.log('Creating books...');
  for (const book of books) {
    await prisma.book.create({
      data: book,
    });
  }
  console.log(`Created ${books.length} books.`);

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
