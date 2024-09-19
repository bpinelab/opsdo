import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

const Navbar = ({ user }: { user: any }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
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
              <Link href="/login" className="text-white mr-4">
                ログイン
              </Link>
              <Link href="/signup" className="text-white">
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
