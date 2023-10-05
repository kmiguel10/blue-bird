"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import GithubImage from "../../public/github-mark-white.png";

export default function GithubButton() {
  const supabase = createClientComponentClient<Database>();
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    console.log("clicked");
  };
  return (
    <button onClick={handleLogin} className="hover:bg-gray-800 p-8 rounded-xl">
      <Image src={GithubImage} alt="Github logo" width={100} height={100} />
    </button>
  );
}
