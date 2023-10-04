"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Likes from "./likes";
import { useEffect, experimental_useOptimistic as useOptimistic } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Tweets({ tweets }: { tweets: TweetWithAuthor[] }) {
  const [optimisticTweets, addOptimisticTweet] = useOptimistic<
    TweetWithAuthor[],
    TweetWithAuthor
  >(tweets, (currentOptimisticTweets, newTweet) => {
    //replace the old tweet with newTweet in currentOptimistic tweets
    const newOptimisticTweets = [...currentOptimisticTweets];

    //find the index of the old version of newTweet
    const index = newOptimisticTweets.findIndex(
      (tweet) => tweet.id === newTweet.id
    );

    //replace with newTweet
    newOptimisticTweets[index] = newTweet;

    return newOptimisticTweets;
  });

  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel("real-time tweets")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tweets",
        },
        (payload) => {
          //refresh on callback to update page and show state
          router.refresh();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [router, supabase]);

  return optimisticTweets.map((tweet) => (
    <div
      key={tweet.id}
      className="border border-gray-800 border-t-0 px-4 py-8 flex"
    >
      <div className="h-12 w-12">
        <Image
          className="rounded-full"
          src={tweet.author.avatar_url}
          alt="tweet user avatar"
          width={48}
          height={48}
        />
      </div>
      <div className="ml-4">
        <p>
          <span className="font-bold">{tweet.author.name}</span>
          <span className="text-sm ml-2 text-gray-400">
            {" "}
            {tweet.author.name}
          </span>
        </p>
        <p>{tweet.title}</p>
        <Likes tweet={tweet} addOptimisticTweet={addOptimisticTweet} />
      </div>
    </div>
  ));
}
