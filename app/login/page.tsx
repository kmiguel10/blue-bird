import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AuthButton from "../components/auth-button-client";

export default async function Login() {
  const supabase = createServerComponentClient<Database>({ cookies });

  //get session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/");
  }

  return <AuthButton session={session} />;
}