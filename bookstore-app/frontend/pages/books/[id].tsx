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
  // const [userPoints, setUserPoints] = useState<number | null>(null);
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
    // const fetchUserPoints = async () => {
    //   const { data: session } = await supabase.auth.getSession();
    //   const userId = session?.session?.user?.id;

    //   if (userId) {
    //     const { data: userPointsData, error: userPointsError } = await supabase
    //       .from("points")
    //       .select("points")
    //       .eq("user_id", userId)
    //       .single();

    //     if (userPointsError) {
    //       console.error(userPointsError);
    //     } else {
    //       setUserPoints(userPointsData.points);
    //     }
    //   }
    // };

    // fetchUserPoints();
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
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg mt-16">
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
      <button
        onClick={handlePurchase}
        className="mt-4 inline-block bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
      >
        購入
      </button>
      <Link
        href="/"
        className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        一覧に戻る
      </Link>

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
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleConfirmPurchase}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                確定
              </button>
              <button
                onClick={handleCancelPurchase}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
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
