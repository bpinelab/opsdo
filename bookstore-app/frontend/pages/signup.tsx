import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";
import Modal from "../components/Modal"; // モーダルコンポーネントをインポート

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの状態
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signing up user...");
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error("Error signing up:", error);
      setError(error.message);
    } else {
      console.log("User signed up:", data);
      setIsModalOpen(true); // モーダルを表示
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    router.push("/login"); // モーダルを閉じたらログイン画面に遷移
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-6 bg-white">
      <h1 className="text-2xl font-bold mb-4">サインアップ</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSignup}>
        <div className="mb-4">
          <label className="block text-gray-700">メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          サインアップ
        </button>
      </form>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="w-11/12 md:w-1/2 lg:w-1/3 mx-auto p-6 bg-white">
          <p>確認メールが送信されました。メールを確認してください。</p>
          <button
            onClick={handleCloseModal}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 mt-4"
          >
            閉じる
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Signup;
