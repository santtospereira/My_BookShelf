'use client';

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import FormProgress from "@/components/form-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getBookByISBN } from "@/actions/google-books";
import { editBookAction } from "@/actions/book"; // Importar a Server Action

interface Book {
  id: string;
  title: string;
  author: string;
  year: number | null;
  pages: number | null;
  currentPage: number | null;
  rating: number | null;
  synopsis: string | null;
  cover: string | null;
  status: string | null;
  isbn: string | null;
  genreId: string | null;
  genre: {
    id: string;
    name: string;
  } | null;
}

interface Genre {
  id: string;
  name: string;
  _count: {
    books: number;
  };
}

const STATUS_OPTIONS = [
  { value: "QUERO_LER", label: "Quero Ler" },
  { value: "LENDO", label: "Lendo" },
  { value: "LIDO", label: "Lido" },
  { value: "PAUSADO", label: "Pausado" },
  { value: "ABANDONADO", label: "Abandonado" }
] as const;

const RATINGS = [1, 2, 3, 4, 5] as const;

const formSchema = z.object({
  title: z.string().min(2, {
    message: "O título deve ter no mínimo 2 caracteres.",
  }),
  author: z.string().min(2, {
    message: "O nome do autor deve ter no mínimo 2 caracteres.",
  }),
  pages: z.union([z.string(), z.number()]).transform((val) => {
    if (val === '' || val === null || val === undefined) return undefined;
    const num = typeof val === 'string' ? parseInt(val) : val;
    return isNaN(num) ? undefined : num;
  }).optional(),
  year: z.union([z.string(), z.number()]).transform((val) => {
    if (val === '' || val === null || val === undefined) return undefined;
    const num = typeof val === 'string' ? parseInt(val) : val;
    return isNaN(num) ? undefined : num;
  }).optional(),
  currentPage: z.union([z.string(), z.number()]).transform((val) => {
    if (val === '' || val === null || val === undefined) return undefined;
    const num = typeof val === 'string' ? parseInt(val) : val;
    return isNaN(num) ? undefined : num;
  }).optional(),
  status: z.enum(["QUERO_LER", "LENDO", "LIDO", "PAUSADO", "ABANDONADO"]).optional(),
  isbn: z.string().optional(),
  cover: z.string().url("A URL da capa deve ser válida.").or(z.literal('')).optional(),
  genreId: z.string().optional(),
  rating: z.union([z.string(), z.number(), z.literal("none")]).transform((val) => {
    if (val === 'none' || val === '' || val === null || val === undefined) return undefined;
    const num = typeof val === 'string' ? parseInt(val) : val;
    return isNaN(num) ? undefined : num;
  }).optional(),
  synopsis: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface Props {
  book: Book;
}

export default function EditBookForm({ book }: Props) {
  const router = useRouter();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isFetchingBook, setIsFetchingBook] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: book.title || "",
      author: book.author || "",
      pages: book.pages || undefined,
      year: book.year || undefined,
      currentPage: book.currentPage || undefined,
      status: (book.status as FormData['status']) || undefined,
      isbn: book.isbn || "",
      cover: book.cover || "",
      genreId: book.genreId || "none",
      rating: book.rating?.toString() || "none",
      synopsis: book.synopsis || "",
    },
  });

  const { isSubmitting } = form.formState;

  const coverUrl = form.watch("cover");

  // Buscar gêneros ao carregar o componente
  useEffect(() => {
    async function fetchGenres() {
      try {
        const response = await fetch('/api/genres');
        if (!response.ok) throw new Error('Erro ao carregar gêneros');
        
        const data: Genre[] = await response.json();
        setGenres(data);
      } catch (err) {
        console.error('Erro ao carregar gêneros:', err);
        toast.error('Erro ao carregar gêneros');
      }
    }

    fetchGenres();
  }, []);

  async function onSubmit(values: FormData) {
    try {
      const result = await editBookAction(book.id, values);

      if (!result?.success) {
        const serverErrors = result?.errors ? Object.values(result.errors).flat().join(' ') : "Erro desconhecido";
        throw new Error(serverErrors || "Não foi possível atualizar o livro.");
      }

      toast.success("Livro atualizado com sucesso!");
      router.push('/books');
    } catch (error) {
      console.error('Erro ao atualizar livro:', error);
      toast.error(error instanceof Error ? error.message : "Erro ao atualizar o livro.");
    }
  }

  const fetchBookData = async () => {
    const isbn = form.getValues("isbn");
    if (!isbn) return;

    setIsFetchingBook(true);
    try {
      const bookData = await getBookByISBN(isbn);
      if (bookData) {
        form.setValue("title", bookData.title);
        form.setValue("author", bookData.author);
        form.setValue("pages", bookData.pages);
        form.setValue("year", bookData.year);
        form.setValue("synopsis", bookData.synopsis);
        form.setValue("cover", bookData.cover);
      } else {
        toast.error("Nenhum livro encontrado com o ISBN fornecido.");
      }
    } catch (error) {
      console.error("Erro ao buscar dados do livro:", error);
      toast.error("Erro ao buscar dados do livro. Verifique o ISBN e tente novamente.");
    } finally {
      setIsFetchingBook(false);
    }
  };
  
  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormProgress />
          <Card>
            <CardHeader>
              <CardTitle>Informações Principais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título *</FormLabel>
                    <FormControl>
                      <Input placeholder="O nome do livro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Autor *</FormLabel>
                    <FormControl>
                      <Input placeholder="O nome do autor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Livro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="genreId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gênero</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || 'none'}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um gênero" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Nenhum gênero</SelectItem>
                          {genres.map(genre => (
                            <SelectItem key={genre.id} value={genre.id}>
                              {genre.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ano de Publicação</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ex: 2023" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="pages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total de páginas</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 350" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isbn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISBN</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input placeholder="ISBN do livro" {...field} />
                      </FormControl>
                      <Button type="button" onClick={fetchBookData} disabled={isFetchingBook}>
                        {isFetchingBook ? "Buscando..." : "Buscar"}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acompanhamento de Leitura</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status de Leitura</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || 'none'}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Nenhum status</SelectItem>
                          {STATUS_OPTIONS.map(status => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avaliação</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(value === 'none' ? 'none' : value)} 
                        value={field.value?.toString() || 'none'}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Avaliação por estrelas" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Sem avaliação</SelectItem>
                          {RATINGS.map(rating => (
                            <SelectItem key={rating} value={rating.toString()}>
                              {rating} Estrela{rating > 1 ? 's' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="currentPage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Página atual</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Página que você está lendo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Capa e Sinopse</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="cover"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da Capa</FormLabel>
                    <FormControl>
                      <Input placeholder="Cole a URL da capa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {coverUrl && (
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium mb-2">Prévia da Capa</p>
                  <img
                    src={coverUrl}
                    alt="Capa do livro"
                    className="w-40 h-auto rounded-md shadow-md"
                  />
                </div>
              )}
              <FormField
                control={form.control}
                name="synopsis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sinopse</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Sinopse ou notas sobre o livro..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}