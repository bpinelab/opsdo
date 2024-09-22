import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { User } from "@supabase/auth-js";
import { useRouter } from "next/router";
import Link from "next/link";

const Account = () => {
  const [user, setUser] = useState<User | null>(null);
  const [points, setPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPoints, setSelectedPoints] = useState<number>(1000);
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

  const handlePurchase = () => {
    setIsModalOpen(true);
  };

  const handleConfirmPurchase = async () => {
    if (user) {
      const { error } = await supabase.from("transactions").insert({
        user_id: user.id,
        points_earned: selectedPoints,
      });
      if (error) {
        console.error("Error inserting transaction:", error);
      } else {
        setPoints(points! + selectedPoints);
        setIsModalOpen(false);
      }
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
    <div className="container mx-auto p-6 md:p-12 mt-16">
      <div className="border border-gray-300 p-4 rounded-md">
        <h1 className="text-xl md:text-2xl font-bold mb-4">アカウント情報</h1>
        <p className="text-sm md:text-base">メールアドレス: {user.email}</p>
        <p className="text-sm md:text-base">
          アカウント作成日: {user.created_at}
        </p>
        <p className="text-sm md:text-base">
          所持ポイント数: {points !== null ? points : "取得中..."}
        </p>
        <div className="mt-8">
          <label
            htmlFor="points"
            className="block text-sm font-medium text-gray-700"
          >
            購入ポイント数
          </label>
          <select
            id="points"
            name="points"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={selectedPoints}
            onChange={(e) => setSelectedPoints(Number(e.target.value))}
          >
            <option value={1000}>1000ポイント</option>
            <option value={500}>500ポイント</option>
            <option value={300}>300ポイント</option>
            <option value={100}>100ポイント</option>
          </select>
          <button
            onClick={handlePurchase}
            className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            購入
          </button>
        </div>
      </div>
      <div className="flex justify-center mt-6">
        <Link
          href="/"
          className="text-blue-500 hover:underline text-sm md:text-base"
        >
          ホームに戻る
        </Link>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              購入を確定してよいですか？
            </h2>
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

export default Account;
