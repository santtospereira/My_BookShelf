'use client';

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import FormProgress from "@/components/form-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getBookByISBN } from "@/actions/google-books";
import { addBookAction } from "@/actions/book";
import { useRouter } from "next/navigation";
import { bookFormSchema, BookFormInput } from "@/lib/validations";

interface Genre {
  id: string;
  name: string;
  _count?: {
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

type FormData = BookFormInput;

interface AddBookFormProps {
  genres: Genre[];
}

export default function AddBookForm({ genres }: AddBookFormProps) {
  const [isFetchingBook, setIsFetchingBook] = useState(false);
  const router = useRouter();
  
  const form = useForm({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: "",
      author: "",
      pages: undefined,
      year: undefined,
      currentPage: undefined,
      status: undefined,
      isbn: "",
      cover: "",
      genreId: undefined,
      rating: undefined,
      synopsis: "",
    },
  });

  const { isSubmitting } = form.formState;

  const coverUrl = form.watch("cover");

  async function onSubmit(values: FormData) {
    try {
      const result = await addBookAction(values);

      if (!result?.success) {
        const serverErrors = result?.errors ? Object.values(result.errors).flat().join(' ') : "Erro desconhecido";
        throw new Error(serverErrors || "Não foi possível adicionar o livro.");
      }

      toast.success("Livro adicionado com sucesso!");
      router.push('/books?page=1&limit=5');
    } catch (error) {
      console.error('Erro ao adicionar livro:', error);
      toast.error(error instanceof Error ? error.message : "Erro ao adicionar o livro.");
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Adicionar Novo Livro</h1>
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
                        <Select onValueChange={field.onChange} value={field.value}>
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
                          <Input type="number" placeholder="Ex: 2023" {...field} value={field.value === undefined || field.value === null ? "" : field.value} />
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
                        <Input type="number" placeholder="Ex: 350" {...field} value={field.value === undefined || field.value === null ? "" : field.value} />
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
                        <Select onValueChange={field.onChange} value={field.value}>
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
                          onValueChange={field.onChange}
                          value={field.value}
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
                        <Input type="number" placeholder="Página que você está lendo" {...field} value={field.value === undefined || field.value === null ? "" : field.value} />
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
                {isSubmitting ? "Salvando..." : "Adicionar Livro"}
              </Button>
            </div>
          </form>
        </Form>
      </FormProvider>
    </div>
  );
}
