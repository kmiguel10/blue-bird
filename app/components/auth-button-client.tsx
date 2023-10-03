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
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });
    console.log("clicked");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  return session ? (
    <button onClick={handleLogout}>Logout</button>
  ) : (
    <button onClick={handleLogin}>Login</button>
  );
};

export default AuthButton;
