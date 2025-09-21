'use client';

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

import { addBookAction } from "@/actions/book";

const GENRES = ["Literatura Brasileira", "Ficção Científica", "Realismo Mágico", "Ficção", "Fantasia", "Romance", "Biografia", "História", "Autoajuda", "Tecnologia", "Programação", "Negócios", "Psicologia", "Filosofia", "Poesia", "Conto"] as const;
const STATUS = ["QUERO_LER", "LENDO", "LIDO", "PAUSADO", "ABANDONADO"] as const;
const RATINGS = [1, 2, 3, 4, 5] as const;

const formSchema = z.object({
  title: z.string().min(2, {
    message: "O título deve ter no mínimo 2 caracteres.",
  }),
  author: z.string().min(2, {
    message: "O nome do autor deve ter no mínimo 2 caracteres.",
  }),
  pages: z.coerce.number().min(1, {
    message: "O número de páginas deve ser pelo menos 1."
  }).optional(),
  year: z.coerce.number().optional(),
  currentPage: z.coerce.number().optional(),
  status: z.enum(STATUS, {
    errorMap: () => ({ message: "Por favor, selecione um status de leitura." }),
  }).optional(),
  isbn: z.string().optional(),
  cover: z.string().url("A URL da capa deve ser válida.").optional(),
  genre: z.string({
    required_error: "Por favor, selecione um gênero.",
  }).optional(),
  rating: z.enum(["1", "2", "3", "4", "5"], {
    errorMap: () => ({ message: "Por favor, selecione uma avaliação." }),
  }).optional(),
  synopsis: z.string().optional(),
});

export default function AddBookPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "",
      pages: undefined, // Keep as undefined for number inputs, as empty string might cause issues with type coercion
      year: undefined, // Keep as undefined for number inputs, as empty string might cause issues with type coercion
      currentPage: undefined, // Keep as undefined for number inputs, as empty string might cause issues with type coercion
      status: "", // Initialize with empty string for Select
      isbn: "",
      cover: "",
      genre: "", // Initialize with empty string for Select
      rating: "", // Initialize with empty string for Select
      synopsis: "",
    },
  });

  const { isSubmitting } = form.formState;

  const coverUrl = form.watch("cover");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();

    for (const key in values) {
      const value = values[key as keyof typeof values];
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    }

    await addBookAction(formData);
  }

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
                      <FormControl>
                        <Input placeholder="ISBN do livro" {...field} />
                      </FormControl>
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