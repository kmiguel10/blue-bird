"use client";

import Likes from "./likes";
import { experimental_useOptimistic as useOptimistic } from "react";

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

  return optimisticTweets.map((tweet) => (
    <div key={tweet.id}>
      <p>
        {tweet.author.name} {tweet.author.name}
      </p>
      <p>{tweet.title}</p>
      <Likes tweet={tweet} addOptimisticTweet={addOptimisticTweet} />
    </div>
  ));
}
