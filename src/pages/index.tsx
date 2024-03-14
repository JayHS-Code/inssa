import Item from "@/components/home/item";
import { Fav, Post } from "@prisma/client";
import useSWR from "swr";
import dynamic from "next/dynamic";
const MainMenu = dynamic(() => import("../components/common/mainMenu"), {
  ssr: false,
});

interface PostsType extends Post {
  user: {
    avatar: string;
    nickname: string;
  };
  Fav: Fav[];
}

interface PostsResponse {
  ok: boolean;
  posts: PostsType[];
}

export default function Home() {
  const { data } = useSWR<PostsResponse>("/api/post");
  return (
    <div>
      <MainMenu />
      {data?.posts?.map((post) => (
        <Item key={post?.id} post={post} />
      ))}
    </div>
  );
}
