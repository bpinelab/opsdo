import { GetServerSideProps } from "next";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";

type Book = {
  id: number;
  title: string;
  content: string;
  blurb: string;
  publication_date: string;
  author: {
    id: number;
    name: string;
    background: string;
  };
};

type Props = {
  book: Book | null;
};

const BookDetail = ({ book }: Props) => {
  if (!book)
    return (
      <div className="text-center text-red-500">本が見つかりませんでした。</div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg mt-16">
      <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
      <p className="text-gray-700 mb-4">{book.content}</p>
      <p className="text-gray-700 mb-4">
        <strong>著者:</strong> {book.author.name}
      </p>
      <p className="text-gray-700 mb-4">
        <strong>著者の背景:</strong> {book.author.background}
      </p>
      <p className="text-gray-700">
        <strong>出版日:</strong> {book.publication_date}
      </p>
      <Link
        href="/"
        className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        一覧に戻る
      </Link>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params!;
  const { data: book, error } = await supabase
    .from("books")
    .select(
      `
      id,
      title,
      content,
      blurb,
      publication_date,
      author:authors (
        id,
        name,
        background
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return { props: { book: null } };
  }

  return { props: { book } };
};

export default BookDetail;
