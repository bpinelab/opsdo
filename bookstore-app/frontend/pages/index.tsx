import { GetServerSideProps } from "next";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";

type Book = {
  id: number;
  title: string;
  blurb: string;
  publication_date: string;
  author: {
    id: number;
    name: string;
  };
};

type Props = {
  books: Book[];
};

const Home = ({ books }: Props) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4">本の一覧</h1>
      <ul>
        {books.map((book) => (
          <li key={book.id} className="mb-4">
            <Link href={`/books/${book.id}`} legacyBehavior>
              <a className="text-xl font-semibold text-blue-500 hover:underline">
                {book.title} - {book.author.name}
              </a>
            </Link>
            <p className="text-gray-700">{book.blurb}</p>
            <p className="text-gray-700">
              <strong>出版日:</strong> {book.publication_date}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: books, error } = await supabase.from("books").select(`
      id,
      title,
      blurb,
      publication_date,
      author:authors (
        id,
        name
      )
    `);

  if (error) {
    console.error(error);
    return { props: { books: [] } };
  }

  return { props: { books } };
};

export default Home;
