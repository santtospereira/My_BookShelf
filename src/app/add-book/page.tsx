import AddBookForm from "@/components/add-book-form";
import { getAllGenres } from "@/actions/genre";

export default async function AddBookPage() {
  const genres = await getAllGenres();
  return <AddBookForm genres={genres} />;
}
