import "../styles/globals.css";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { User } from "@supabase/auth-js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false); // 認証状態の確認が完了したらローディングを終了
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false); // 認証状態の確認が完了したらローディングを終了
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (
      !loading &&
      !user &&
      router.pathname !== "/login" &&
      router.pathname !== "/signup" &&
      router.pathname !== "/privacy-policy"
    ) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>; // ローディング中の表示
  }

  if (
    !user &&
    router.pathname !== "/login" &&
    router.pathname !== "/signup" &&
    router.pathname !== "/privacy-policy"
  ) {
    return null; // 認証状態が確認されるまで何も表示しない
  }

  return (
    <>
      {router.pathname !== "/privacy-policy" && <Navbar user={user} />}
      <Component {...pageProps} />
      {router.pathname !== "/privacy-policy" && <Footer />}{" "}
      {/* フッターコンポーネントを追加 */}
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default MyApp;
