import { GetServerSideProps } from "next";
import { supabase } from "../../lib/supabaseClient";
import { User } from "@supabase/auth-js";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
// import { useServerInsertedHTML } from "next/navigation";

type Book = {
  id: number;
  title: string;
  content: string;
  blurb: string;
  publication_date: string;
  points_required: number;
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
  const [user, setUser] = useState<User | null>(null);
  const [points, setPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const { data: pointsData, error } = await supabase
          .from("points")
          .select("points")
          .eq("user_id", session.user.id)
          .single();
        if (error) {
          console.error("Error fetching points:", error);
        } else {
          setPoints(pointsData.points);
        }
      } else {
        router.push("/login");
      }
      setLoading(false);
    };
    getUser();
  }, [router]);

  if (!book)
    return (
      <div className="text-center text-red-500">本が見つかりませんでした。</div>
    );

  const handlePurchase = () => {
    setIsModalOpen(true);
  };

  const handleConfirmPurchase = async () => {
    if (!user) {
      console.error("User is not logged in.");
      return;
    }

    const { error } = await supabase.from("transactions").insert({
      user_id: user.id,
      book_id: book.id,
      points_used: book.points_required,
    });

    if (error) {
      console.error("Error inserting transaction:", error);
    } else {
      setIsModalOpen(false);
      router.push("/");
    }
  };

  const handleCancelPurchase = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white mt-16">
      <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
      <p className="text-gray-700 mb-4">{book.content}</p>
      <p className="text-gray-700 mb-4">
        <strong>著者:</strong> {book.author.name}
      </p>
      <p className="text-gray-700 mb-4">
        <strong>著者の背景:</strong> {book.author.background}
      </p>
      <p className="text-gray-700 mb-4">
        <strong>出版日:</strong> {book.publication_date}
      </p>
      <p className="text-gray-700 mb-4">
        <strong>必要ポイント:</strong> {book.points_required}
      </p>
      <div>
        <button
          onClick={handlePurchase}
          className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          購入
        </button>
      </div>
      <div className="flex justify-center mt-6">
        <Link
          href="/"
          className="text-blue-500 hover:underline text-sm md:text-base"
        >
          一覧に戻る
        </Link>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              購入を確定してよいですか？
            </h2>
            <p className="mb-4">必要ポイント: {book.points_required}</p>
            <p className="mb-4">
              保有ポイント: {points !== null ? points : "取得中..."}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleConfirmPurchase}
                className="w-1/2 px-2 py-1 border border-green-500 text-green-500 rounded-md hover:bg-green-100"
              >
                確定
              </button>
              <button
                onClick={handleCancelPurchase}
                className="w-1/2 px-2 py-1 border border-red-500 text-red-500 rounded-md hover:bg-red-100"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params!;
  const { data: book, error: bookError } = await supabase
    .from("books")
    .select(
      `
      id,
      title,
      content,
      blurb,
      publication_date,
      points_required,
      author:authors (
        id,
        name,
        background
      )
    `
    )
    .eq("id", id)
    .single();

  if (bookError) {
    console.error(bookError);
    return { props: { book: null } };
  }

  return { props: { book } };
};

export default BookDetail;
