import Link from "next/link";

const Footer = () => {
  return (
    <footer className="p-4 mt-8">
      <div className="max-w-7xl mx-auto flex justify-center items-center">
        <Link
          href="/privacy-policy"
          passHref
          className="text-blue-800 hover:underline"
        >
          プライバシーポリシー
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
