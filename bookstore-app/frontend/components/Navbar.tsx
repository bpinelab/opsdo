import { useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import { User } from "@supabase/auth-js";

interface NavbarProps {
  user: User | null;
}

const Navbar = ({ user }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="bg-gray-800 p-4 fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-white text-lg font-bold"
          onClick={handleMenuClose}
        >
          Bookstore
        </Link>
        {user ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                <Link
                  href="/account"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  onClick={handleMenuClose}
                >
                  アカウント情報
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  ログアウト
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className="text-white">
            ログイン
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
