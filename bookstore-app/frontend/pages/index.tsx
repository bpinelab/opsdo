import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

interface Author {
  name: string;
}

interface Book {
  id: string;
  title: string;
  publication_date: string;
  blurb: string;
  authors: Author[];
}

const Home = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase.from("books").select(`
          id,
          title,
          publication_date,
          blurb,
          authors (
            name
          )
        `);
      if (error) {
        console.error("Error fetching books:", error);
      } else {
        setBooks(data as Book[]);
        setFilteredBooks(data as Book[]);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const results = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.authors.some((author) =>
          author.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        book.blurb.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.publication_date.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(results);
  }, [searchTerm, books]);

  return (
    <div className="max-w-7xl mx-auto p-4 mt-16">
      <h1 className="text-2xl font-bold mb-4">本の一覧</h1>
      <input
        type="text"
        placeholder="検索..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBooks.map((book) => (
          <div key={book.id} className="p-4 border border-gray-300 rounded">
            <Link
              href={`/books/${book.id}`}
              passHref
              className="text-xl font-bold text-blue-500 hover:underline"
            >
              {book.title}
            </Link>
            <p>著者: {book.authors.map((author) => author.name).join(", ")}</p>
            <p>出版日: {book.publication_date}</p>
            <p>{book.blurb}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
