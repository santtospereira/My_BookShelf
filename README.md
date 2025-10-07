# BookShelf

BookShelf é uma aplicação web moderna para gerenciamento de biblioteca pessoal, permitindo aos usuários catalogar, organizar e acompanhar o progresso de leitura de seus livros.

## Tecnologias Utilizadas

- Next.js 15 com App Router
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma ORM com SQLite
- NextAuth.js para autenticação

## Funcionalidades

- Dashboard principal com estatísticas da biblioteca.
- Listagem de livros com busca, filtros e paginação.
- Adição, edição e exclusão de livros.
- Visualização detalhada de cada livro.
- Autenticação de usuários.

## Como Rodar o Projeto

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/seu-usuario/BookShelf.git
    cd BookShelf
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configuração de Variáveis de Ambiente:**

    Crie um arquivo `.env.local` na raiz do projeto (este arquivo não deve ser versionado) e adicione as seguintes variáveis:

    ```
    # Configuração do Banco de Dados
    DATABASE_URL="file:./prisma/dev.db"

    # Configuração do Admin (usado no seeding inicial)
    ADMIN_EMAIL="admin@example.com" # Opcional: email para o usuário admin
    ADMIN_PASSWORD="adminpassword" # Opcional: senha para o usuário admin

    # Chave da API do Google Books (para buscar dados de livros por ISBN)
    GOOGLE_BOOKS_API_KEY="SUA_CHAVE_DA_API_DO_GOOGLE_BOOKS"

    # Configurações do NextAuth.js
    NEXTAUTH_SECRET="UM_TEXTO_LONGO_E_ALEATORIO_PARA_SEGURANCA"
    NEXTAUTH_URL="http://localhost:3000"

    # Credenciais do Google para autenticação (se estiver usando login com Google)
    GOOGLE_CLIENT_ID="SEU_GOOGLE_CLIENT_ID"
    GOOGLE_CLIENT_SECRET="SEU_GOOGLE_CLIENT_SECRET"
    ```

    **Importante:** Substitua os valores entre aspas pelos seus próprios. `NEXTAUTH_SECRET` deve ser uma string longa e aleatória. Para `GOOGLE_BOOKS_API_KEY`, `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`, você precisará obtê-los nos respectivos serviços.

4.  **Configure o banco de dados:**

    Execute as migrações e o seed do banco de dados:

    ```bash
    npx prisma migrate dev --name init
    npx prisma db seed
    ```

5.  **Inicie o servidor de desenvolvimento:**

    ```bash
    npm run dev
    ```

    A aplicação estará disponível em `http://localhost:3000`.

## Scripts Úteis

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Compila a aplicação para produção.
- `npm start`: Inicia a aplicação em modo de produção.
- `npx prisma studio`: Abre o Prisma Studio para visualizar e gerenciar o banco de dados.
- `npx prisma generate`: Gera o Prisma Client.
- `npx prisma migrate dev`: Cria e aplica novas migrações de banco de dados.
- `npx prisma db seed`: Executa o script de seed para popular o banco de dados.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## Licença

Este projeto está licenciado sob a licença MIT.

### Configuração das Variáveis de Ambiente

Para que o aplicativo funcione corretamente, você precisará configurar as seguintes variáveis de ambiente no seu arquivo `.env.local` (ou `.env`):

1.  **`NEXTAUTH_SECRET`**
    Esta é uma chave de criptografia de uso interno do NextAuth.js para assinar tokens, criptografar cookies e proteger seu aplicativo. É a única que você gera por conta própria.

    **Como gerar (Recomendado):**
    Você pode gerar uma string forte e aleatória usando o terminal. O NextAuth.js sugere o uso do OpenSSL.
    Abra seu terminal (Linux, macOS, ou Git Bash/WSL no Windows).
    Execute o comando:

    ```bash

    openssl rand -base64 32
    
    ```
    O terminal irá exibir uma string longa. Copie essa string e cole-a no seu arquivo `.env` para a variável `NEXTAUTH_SECRET`.

    **Exemplo de resultado (o seu será diferente):**
    `kM6o/H/m/fUv5Q0yT8A4xW1zB2C9LpOeR7gJbOqYkXlW0GgD4cIuE3tS2rV6`

2.  **`GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`**
    Essas chaves são usadas para permitir que os usuários façam login no seu aplicativo usando suas contas do Google (OAuth).

    **Como obter:**
    Acesse o [Google Cloud Console](https://console.cloud.google.com/) (ou a Central de APIs e Serviços do Google).
    Crie um novo projeto (se ainda não tiver um).
    Vá para "APIs e Serviços" → "Credenciais".
    Clique em "Criar credenciais" → "ID do cliente OAuth".
    Se for a primeira vez, será necessário configurar a Tela de consentimento OAuth (dando nome ao app, etc.).
    Em "Tipo de aplicativo", selecione "Aplicativo da Web".
    Você precisará adicionar os URIs de redirecionamento autorizados (Authorized redirect URIs). Para desenvolvimento local, geralmente é:
    `http://localhost:3000/api/auth/callback/google` (ou a porta que você usa)
    Após a criação, o Google exibirá o ID do Cliente (`GOOGLE_CLIENT_ID`) e o Segredo do Cliente (`GOOGLE_CLIENT_SECRET`).

3.  **`GITHUB_CLIENT_ID` e `GITHUB_CLIENT_SECRET`**
    Essas chaves são para permitir que os usuários façam login no seu aplicativo usando suas contas do GitHub (OAuth).

    **Como obter:**
    Acesse as [Configurações da sua conta do GitHub](https://github.com/settings/profile) (Profile → Settings).
    Vá para Developer settings → OAuth Apps (ou clique [aqui](https://github.com/settings/developers)).
    Clique em "New OAuth App".
    Preencha os campos:
    *   Application name (Nome do seu app).
    *   Homepage URL (Geralmente a URL base do seu app, ex: `http://localhost:3000`).
    *   Authorization callback URL (URI de redirecionamento). Para o NextAuth.js, use:
        `http://localhost:3000/api/auth/callback/github`
    Após o registro, você receberá o Client ID (`GITHUB_CLIENT_ID`).
    Clique em "Generate a new client secret". O GitHub exibirá o Client Secret (`GITHUB_CLIENT_SECRET`). Copie imediatamente, pois você não poderá vê-lo novamente.

