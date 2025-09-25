import { getAllGenres } from "@/actions/genre";
import AddBookForm from "@/components/add-book-form";

export default async function AddBookPage() {
  const genres = await getAllGenres();
  return <AddBookForm genres={genres} />;
}