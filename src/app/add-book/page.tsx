import AddBookForm from "@/components/add-book-form";
import { getAllGenres } from "@/actions/genre";

export default async function AddBookPage() {
  const genres = await getAllGenres();
  console.log("Gêneros recebidos em AddBookPage:", genres);
  return <AddBookForm genres={genres} />;
}
