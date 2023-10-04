import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButton from "./components/auth-button-client";
import AuthButtonServer from "./components/auth-button-server";
import { redirect } from "next/navigation";
import NewTweet from "./new-tweet";
import Likes from "./likes";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });
  //get session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("tweets")
    .select("*, author:profiles(*), likes(user_id)");

  //create a new shape for tweets
  const tweets =
    data?.map((tweet) => ({
      ...tweet,
      author: Array.isArray(tweet.author) ? tweet.author[0] : tweet.author,
      user_has_liked_tweet: !!tweet.likes.find(
        (like) => like.user_id === session.user.id
      ),
      likes: tweet.likes.length,
    })) ?? [];

  return (
    <>
      <AuthButtonServer />
      <NewTweet />
      {tweets?.map((tweet) => (
        <div key={tweet.id}>
          <p>
            {tweet.author.name} {tweet.author.name}
          </p>
          <p>{tweet.title}</p>
          <Likes tweet={tweet} />
        </div>
      ))}
    </>
  );
}
