import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButton from "./components/auth-button-client";
import AuthButtonServer from "./components/auth-button-server";
import { redirect } from "next/navigation";
import NewTweet from "./new-tweet";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });
  //get session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: tweets } = await supabase
    .from("tweets")
    .select("*, profiles(*)");

  return (
    <>
      <AuthButtonServer />
      <NewTweet />
      {tweets?.map((tweet) => (
        <div key={tweet.id}>
          <p>
            {tweet?.profiles?.name} {tweet.profiles?.name}
          </p>
          <p>{tweet.title}</p>
        </div>
      ))}
    </>
  );
}
