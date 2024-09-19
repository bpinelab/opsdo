import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar"; // Navbarコンポーネントのインポート

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (
      !user &&
      router.pathname !== "/login" &&
      router.pathname !== "/signup"
    ) {
      router.push("/login");
    }
  }, [user, router]);

  return (
    <>
      <Navbar user={user} /> {/* Navbarコンポーネントの使用 */}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
