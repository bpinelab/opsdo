import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../components/Navbar"; // Navbarコンポーネントをインポート
import { User } from "@supabase/auth-js";

interface Author {
  name: string;
}

interface Book {
  id: string;
  title: string;
  publication_date: string;
  blurb: string;
  points_required: number;
  authors: Author[];
}

const Home = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase.from("books").select(`
          id,
          title,
          publication_date,
          blurb,
          points_required,
          author_id,
          authors:author_id (name)
        `);
      if (error) {
        console.error("Error fetching books:", error);
      } else {
        // データの型を適切にキャスト
        const formattedData: Book[] = data.map((book: Book) => ({
          id: book.id,
          title: book.title,
          publication_date: book.publication_date,
          blurb: book.blurb,
          points_required: book.points_required,
          authors: Array.isArray(book.authors) ? book.authors : [book.authors],
        }));
        setBooks(formattedData);
        setFilteredBooks(formattedData);
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
        book.publication_date
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        book.points_required.toString().includes(searchTerm)
    );
    setFilteredBooks(results);
  }, [searchTerm, books]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching user session:", error);
      } else {
        setUser(data?.session?.user ?? null);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <Navbar user={user} /> {/* Navbarコンポーネントにuserプロパティを渡す */}
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
              <p>
                著者:{" "}
                {book.authors
                  ? book.authors.map((author) => author.name).join(", ")
                  : "著者情報がありません"}
              </p>
              <p>出版日: {book.publication_date}</p>
              <p>{book.blurb}</p>
              <p>必要ポイント: {book.points_required}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
