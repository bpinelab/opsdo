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
    const isMaintenanceMode =
      process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";
    if (isMaintenanceMode && router.pathname !== "/maintenance") {
      router.push("/maintenance");
    } else if (
      !loading &&
      !user &&
      router.pathname !== "/login" &&
      router.pathname !== "/signup" &&
      router.pathname !== "/privacy-policy" &&
      router.pathname !== "/maintenance"
    ) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>; // ローディング中の表示
  }

  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";
  if (isMaintenanceMode && router.pathname !== "/maintenance") {
    return null; // メンテナンスモードが有効な場合、メンテナンスページにリダイレクトされるまで何も表示しない
  }

  if (
    !user &&
    router.pathname !== "/login" &&
    router.pathname !== "/signup" &&
    router.pathname !== "/privacy-policy" &&
    router.pathname !== "/maintenance"
  ) {
    return null; // 認証状態が確認されるまで何も表示しない
  }

  return (
    <div className="min-h-screen flex flex-col">
      {router.pathname !== "/privacy-policy" && <Navbar user={user} />}
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
      {router.pathname !== "/privacy-policy" && <Footer user={user} />}{" "}
      {/* フッターコンポーネントにuserプロパティを渡す */}
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

export default MyApp;
