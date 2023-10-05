"use client";

import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import React from "react";

const AuthButton = ({ session }: { session: Session | null }) => {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  return session ? (
    <button className="text-xs text-gray-400" onClick={handleLogout}>
      Logout
    </button>
  ) : (
    <button className="text-xs text-gray-400" onClick={handleLogin}>
      Login
    </button>
  );
};

export default AuthButton;
