import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import { User } from "@supabase/auth-js";

const Navbar = ({ user }: { user: User | null }) => {
  const [points, setPoints] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserPoints = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("points")
          .select("points")
          .eq("user_id", user.id)
          .single();
        if (error) {
          console.error("Error fetching user points:", error);
        } else {
          setPoints(data.points);
        }
      }
    };

    fetchUserPoints();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="bg-gray-800 p-4 fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" passHref className="text-white text-xl font-bold">
          Bookstore
        </Link>
        <div>
          {user ? (
            <>
              <span className="text-white mr-4">{user.email}</span>
              <span className="text-white mr-4">
                {points !== null
                  ? `ポイント: ${points}`
                  : "ポイント情報を取得中..."}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link href="/login" passHref className="text-white mr-4">
                ログイン
              </Link>
              <Link href="/signup" passHref className="text-white">
                ユーザ登録
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
