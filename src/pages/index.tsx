import Item from "@/components/item";
import { Post } from "@prisma/client";
import useSWR from "swr";
import dynamic from "next/dynamic";
const MainMenu = dynamic(() => import("../components/mainMenu"), {
  ssr: false,
});

interface PostsType extends Post {
  user: {
    avatar: string;
    nickname: string;
  };
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
