'use client';

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Book } from "@prisma/client";
import { toast } from "sonner";
import React from "react";
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

import { editBookAction } from "@/actions/book";

const GENRES = ["Literatura Brasileira", "Ficção Científica", "Ficção", "Romance", "Biografia", "História", "Autoajuda", "Tecnologia", "Negócios", "Psicologia", "Filosofia", "Poesia", "Conto", "Literatura Política", "Aventura", "Fábula", "Existencialismo"] as const;
const STATUS = ["QUERO_LER", "LENDO", "LIDO", "PAUSADO", "ABANDONADO"] as const;
const RATINGS = [1, 2, 3, 4, 5] as const;

const formSchema = z.object({
  title: z.string().min(2, {
    message: "O título deve ter no mínimo 2 caracteres.",
  }),
  author: z.string().min(2, {
    message: "O nome do autor deve ter no mínimo 2 caracteres.",
  }),
  pages: z.coerce.number().optional(),
  year: z.coerce.number().optional(),
  currentPage: z.coerce.number().optional(),
  status: z.enum(STATUS, {
    errorMap: () => ({ message: "Por favor, selecione um status de leitura." }),
  }).optional(),
  isbn: z.string().optional(),
  cover: z.string().url("A URL da capa deve ser válida.").or(z.literal('')).optional(),
  genre: z.string().optional(),
  rating: z.enum(["1", "2", "3", "4", "5"], {
    errorMap: () => ({ message: "Por favor, selecione uma avaliação." }),
  }).optional(),
  synopsis: z.string().optional(),
});

interface Props {
  book: Book;
}

export default function EditBookForm({ book }: Props) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: book.title || "",
      author: book.author || "",
      pages: book.pages || undefined,
      year: book.year || undefined,
      currentPage: book.currentPage || undefined,
      status: book.status || undefined,
      isbn: book.isbn || "",
      cover: book.cover || "",
      genre: book.genre || undefined,
      rating: book.rating?.toString() || undefined,
      synopsis: book.synopsis || "",
    },
  });

  const { isSubmitting } = form.formState;
  const [isFetchingBook, setIsFetchingBook] = React.useState(false);

  const coverUrl = form.watch("cover");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();

    for (const key in values) {
      const value = values[key as keyof typeof values];
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    }

    try {
      await editBookAction(book.id, formData);
      toast.success("Livro atualizado com sucesso!");
      router.push('/books');
    } catch (error) {
      toast.error("Erro ao atualizar o livro.");
    }
  }

  const fetchBookData = async () => {
    const isbn = form.getValues("isbn");
    if (!isbn) return;

    setIsFetchingBook(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`
      );
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const book = data.items[0].volumeInfo;
        form.setValue("title", book.title);
        form.setValue("author", book.authors?.join(", ") || "");
        form.setValue("pages", book.pageCount);
        const yearMatch = book.publishedDate?.match(/\d{4}/);
        const year = yearMatch ? parseInt(yearMatch[0]) : undefined;
        form.setValue("year", year && !isNaN(year) ? year : undefined);
        form.setValue("synopsis", book.description);
        form.setValue("cover", book.imageLinks?.thumbnail || "");
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
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gênero</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um gênero" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {GENRES.map(genre => (
                            <SelectItem key={genre} value={genre}>{genre}</SelectItem>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {STATUS.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Avaliação por estrelas" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {RATINGS.map(rating => (
                            <SelectItem key={rating} value={rating.toString()}>{rating} Estrela{rating > 1 ? 's' : ''}</SelectItem>
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