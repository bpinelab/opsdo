import { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "@supabase/auth-js";
import { supabase } from "../lib/supabaseClient";

interface FooterProps {
  user: User | null;
}

const Footer = ({ user }: FooterProps) => {
  const [year, setYear] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data: yearData, error: yearError } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "year")
        .single();
      if (yearError) {
        console.error("Error fetching year:", yearError);
      } else {
        setYear(yearData?.value);
      }

      const { data: companyNameData, error: companyNameError } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "companyName")
        .single();
      if (companyNameError) {
        console.error("Error fetching company name:", companyNameError);
      } else {
        setCompanyName(companyNameData?.value);
      }
    };

    fetchSettings();
  }, []);

  return (
    <footer className="w-full p-4 mt-8 bg-transparent">
      <div className="container mx-auto text-center text-gray-800">
        {year && companyName && (
          <p>
            &copy; {year} {companyName}. All rights reserved.
          </p>
        )}
        {!user && (
          <Link
            href="/privacy-policy"
            className="text-blue-500 hover:underline"
          >
            プライバシーポリシー
          </Link>
        )}
      </div>
    </footer>
  );
};

export default Footer;
