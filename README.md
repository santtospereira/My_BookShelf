# BookShelf

## Visão Geral do Projeto

BookShelf é uma aplicação web para gerenciar sua coleção de livros. Permite aos usuários adicionar novos livros, acompanhar o status de leitura, registrar o progresso, atribuir avaliações e organizar sua biblioteca pessoal.

## Funcionalidades

-   **Adicionar Livros:** Registre novos livros com detalhes como título, autor, gênero, ano de publicação, número de páginas, ISBN e URL da capa.
-   **Acompanhamento de Leitura:** Defina o status de leitura (Quero Ler, Lendo, Lido, Pausado, Abandonado) e a página atual.
-   **Avaliação:** Atribua uma avaliação de 1 a 5 estrelas aos livros.
-   **Visualização da Biblioteca:** Navegue e visualize todos os livros em sua coleção.
-   **Edição de Livros:** Atualize as informações e o progresso de leitura de livros existentes.

## Tecnologias Utilizadas

-   **Next.js:** Framework React para aplicações web.
-   **React:** Biblioteca JavaScript para construção de interfaces de usuário.
-   **TypeScript:** Superset tipado de JavaScript.
-   **Prisma:** ORM para Node.js e TypeScript, utilizado para interação com o banco de dados.
-   **Tailwind CSS:** Framework CSS utilitário para estilização rápida.
-   **Zod:** Biblioteca de validação de esquemas TypeScript-first.
-   **React Hook Form:** Biblioteca para gerenciamento de formulários com validação.

## Primeiros Passos

Siga estas instruções para configurar e executar o projeto localmente.

### Pré-requisitos

Certifique-se de ter o Node.js (versão 18 ou superior) e o npm (ou yarn/pnpm/bun) instalados em sua máquina.

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/BookShelf.git
    cd BookShelf
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    # ou
    pnpm install
    # ou
    bun install
    ```

3.  **Configuração do Banco de Dados (Prisma):**

    Crie um arquivo `.env` na raiz do projeto e adicione sua string de conexão com o banco de dados. Exemplo para SQLite (usado por padrão no desenvolvimento):

    ```
    DATABASE_URL="file:./prisma/dev.db"
    ```

    Execute as migrações do Prisma para criar o esquema do banco de dados:

    ```bash
    npx prisma migrate dev --name init
    ```

    Se desejar popular o banco de dados com dados de exemplo, execute o seed:

    ```bash
    npx prisma db seed
    ```

### Executando a Aplicação

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Abra [http://localhost:3000](http://localhost:3000) em seu navegador para ver a aplicação.

## Estrutura do Projeto

-   `src/actions/`: Funções do lado do servidor para manipulação de dados.
-   `src/app/`: Rotas e páginas da aplicação Next.js.
-   `src/components/`: Componentes React reutilizáveis.
-   `src/lib/`: Funções utilitárias e configurações.
-   `prisma/`: Esquema do banco de dados e migrações.

## Saiba Mais

Para saber mais sobre Next.js, consulte os seguintes recursos:

-   [Documentação do Next.js](https://nextjs.org/docs) - aprenda sobre os recursos e a API do Next.js.
-   [Aprenda Next.js](https://nextjs.org/learn) - um tutorial interativo do Next.js.

Você pode conferir [o repositório Next.js no GitHub](https://github.com/vercel/next.js) - seu feedback e contribuições são bem-vindos!

## Deploy na Vercel

A maneira mais fácil de implantar seu aplicativo Next.js é usar a [Plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) dos criadores do Next.js.

Confira nossa [documentação de implantação do Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para mais detalhes.

## Contribuindo

Contribuições são bem-vindas! Por favor, siga estas etapas:

1.  Faça um fork do repositório.
2.  Crie uma nova branch (`git checkout -b feature/sua-feature`).
3.  Faça suas alterações e commit (`git commit -m 'feat: Adiciona nova funcionalidade'`).
4.  Envie para a branch (`git push origin feature/sua-feature`).
5.  Abra um Pull Request.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.