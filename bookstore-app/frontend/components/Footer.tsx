import { useState } from "react";
import Modal from "./Modal";
import PrivacyPolicyContent from "./PrivacyPolicyContent";

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <footer className="p-4 mt-8">
      <div className="max-w-7xl mx-auto flex justify-center items-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-gray-800 hover:underline"
        >
          プライバシーポリシー
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <PrivacyPolicyContent onClose={() => setIsModalOpen(false)} />
      </Modal>
    </footer>
  );
};

export default Footer;
