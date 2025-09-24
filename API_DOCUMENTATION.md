# API Documentation - My BookShelf

## Visão Geral

Esta API fornece endpoints para gerenciar livros e gêneros na aplicação My BookShelf.

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### Livros

#### GET /api/books
Listar todos os livros com filtros opcionais e paginação.

**Parâmetros de Query:**
- `title` (string, opcional): Filtrar por título (busca parcial)
- `author` (string, opcional): Filtrar por autor (busca parcial)  
- `genre` (string, opcional): Filtrar por gênero (busca parcial)
- `status` (string, opcional): Filtrar por status (`QUERO_LER`, `LENDO`, `LIDO`, `PAUSADO`, `ABANDONADO`)
- `isbn` (string, opcional): Filtrar por ISBN (busca exata)
- `year` (number, opcional): Filtrar por ano
- `pages` (number, opcional): Filtrar por número de páginas
- `page` (number, opcional): Página atual (padrão: 1)
- `limit` (number, opcional): Itens por página (padrão: 10, máximo: 100)

**Exemplo de Resposta:**
```json
{
  "books": [
    {
      "id": "uuid",
      "title": "O Senhor dos Anéis",
      "author": "J.R.R. Tolkien",
      "year": 1954,
      "pages": 1216,
      "currentPage": 100,
      "rating": 5,
      "synopsis": "...",
      "cover": "https://...",
      "status": "LENDO",
      "isbn": "978-0544003415",
      "genreId": "uuid",
      "genre": {
        "id": "uuid",
        "name": "Fantasia"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalCount": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### GET /api/books/[id]
Obter detalhes de um livro específico.

**Parâmetros:**
- `id` (string): ID do livro

**Exemplo de Resposta:**
```json
{
  "id": "uuid",
  "title": "O Senhor dos Anéis",
  "author": "J.R.R. Tolkien",
  "year": 1954,
  "pages": 1216,
  "currentPage": 100,
  "rating": 5,
  "synopsis": "...",
  "cover": "https://...",
  "status": "LENDO",
  "isbn": "978-0544003415",
  "genreId": "uuid",
  "genre": {
    "id": "uuid",
    "name": "Fantasia"
  }
}
```

#### POST /api/books
Criar um novo livro.

**Body (JSON):**
```json
{
  "title": "O Senhor dos Anéis", // obrigatório
  "author": "J.R.R. Tolkien", // obrigatório
  "year": 1954, // opcional
  "pages": 1216, // opcional
  "currentPage": 0, // opcional
  "rating": 5, // opcional (1-5)
  "synopsis": "...", // opcional
  "cover": "https://...", // opcional (URL válida)
  "status": "QUERO_LER", // opcional
  "isbn": "978-0544003415", // opcional
  "genreId": "uuid" // opcional
}
```

#### PUT /api/books/[id]
Atualizar um livro existente.

**Parâmetros:**
- `id` (string): ID do livro

**Body (JSON):** Mesmos campos do POST, todos opcionais.

#### DELETE /api/books/[id]
Remover um livro.

**Parâmetros:**
- `id` (string): ID do livro

**Resposta:**
```json
{
  "message": "Livro removido com sucesso"
}
```

### Dashboard

#### GET /api/dashboard
Obter estatísticas completas do dashboard.

**Exemplo de Resposta:**
```json
{
  "overview": {
    "totalBooks": 25,
    "readingNow": 3,
    "finishedBooks": 15,
    "wantToRead": 5,
    "paused": 1,
    "abandoned": 1,
    "totalPagesRead": 8540,
    "averageProgress": 65.5
  },
  "statusStats": {
    "QUERO_LER": 5,
    "LENDO": 3,
    "LIDO": 15,
    "PAUSADO": 1,
    "ABANDONADO": 1
  },
  "genreStats": {
    "Fantasia": {
      "total": 8,
      "finished": 5,
      "reading": 2
    },
    "Ficção Científica": {
      "total": 6,
      "finished": 4,
      "reading": 1
    }
  },
  "topRatedBooks": [
    {
      "id": "uuid",
      "title": "Duna",
      "author": "Frank Herbert",
      "rating": 5,
      "genre": "Ficção Científica"
    }
  ],
  "recentBooks": [
    {
      "id": "uuid",
      "title": "O Senhor dos Anéis",
      "author": "J.R.R. Tolkien",
      "status": "LENDO",
      "genre": "Fantasia"
    }
  ]
}
```

### Gêneros

#### GET /api/genres
Listar todos os gêneros com contagem de livros.

**Exemplo de Resposta:**
```json
[
  {
    "id": "uuid",
    "name": "Fantasia",
    "_count": {
      "books": 5
    }
  }
]
```

#### POST /api/genres
Adicionar um novo gênero.

**Body (JSON):**
```json
{
  "name": "Ficção Científica" // obrigatório
}
```

#### DELETE /api/genres/[genre]
Remover um gênero (apenas se não houver livros associados).

**Parâmetros:**
- `genre` (string): Nome do gênero (URL encoded)

**Resposta:**
```json
{
  "message": "Gênero removido com sucesso"
}
```

## Códigos de Status

- `200`: Sucesso
- `201`: Criado com sucesso
- `400`: Dados inválidos
- `404`: Recurso não encontrado
- `409`: Conflito (ex: ISBN duplicado, gênero com livros)
- `500`: Erro interno do servidor

## Tratamento de Erros

Todas as respostas de erro seguem o formato:

```json
{
  "message": "Descrição do erro",
  "code": "CODIGO_DO_ERRO",
  "details": {} // opcional, para erros de validação
}
```

## Validações

### Livro
- `title`: Obrigatório, string não vazia
- `author`: Obrigatório, string não vazia
- `year`: Opcional, número inteiro entre 1900 e ano atual + 5
- `pages`: Opcional, número inteiro positivo
- `currentPage`: Opcional, número inteiro >= 0
- `rating`: Opcional, número inteiro entre 1 e 5
- `cover`: Opcional, URL válida
- `isbn`: Opcional, único no sistema
- `genreId`: Opcional, deve existir na tabela de gêneros

### Gênero
- `name`: Obrigatório, string não vazia, único no sistema (case insensitive)
