import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import { User } from "@supabase/auth-js";

const Navbar = ({ user }: { user: User | null }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" passHref className="text-white text-xl font-bold">
          Bookstore
        </Link>
        <div>
          {user ? (
            <>
              <span className="text-white mr-4">{user.email}</span>
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
