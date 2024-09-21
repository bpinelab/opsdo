interface PrivacyPolicyContentProps {
  onClose: () => void;
}

const PrivacyPolicyContent = ({ onClose }: PrivacyPolicyContentProps) => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">プライバシーポリシー</h1>
      <p>
        当サイトは、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。
      </p>
      <h2 className="text-xl font-bold mt-4">1. 個人情報の収集</h2>
      <p>
        当サイトでは、ユーザーがサービスを利用する際に、必要に応じて個人情報を収集することがあります。
      </p>
      <h2 className="text-xl font-bold mt-4">2. 個人情報の利用目的</h2>
      <p>収集した個人情報は、以下の目的で利用します。</p>
      <ul className="list-disc list-inside">
        <li>サービスの提供・運営</li>
        <li>ユーザーサポートの提供</li>
        <li>サービス改善のための分析</li>
      </ul>
      <h2 className="text-xl font-bold mt-4">3. 個人情報の第三者提供</h2>
      <p>
        当サイトは、法令に基づく場合を除き、ユーザーの同意なく個人情報を第三者に提供することはありません。
      </p>
      <h2 className="text-xl font-bold mt-4">4. 個人情報の管理</h2>
      <p>
        当サイトは、個人情報の漏洩、紛失、毀損を防止するため、適切なセキュリティ対策を講じます。
      </p>
      <h2 className="text-xl font-bold mt-4">5. プライバシーポリシーの変更</h2>
      <p>
        当サイトは、必要に応じてプライバシーポリシーを変更することがあります。変更後の内容は、当サイトに掲載された時点で効力を生じます。
      </p>
      <h2 className="text-xl font-bold mt-4">6. お問い合わせ</h2>
      <p>
        プライバシーポリシーに関するお問い合わせは、以下の連絡先までお願いいたします。
      </p>
      <p>Email: support@xxx.xxx [this is a dummy address.]</p>
      <div className="flex justify-center">
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          閉じる
        </button>
      </div>
    </div>
  );
};

export default PrivacyPolicyContent;
