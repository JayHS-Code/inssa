import BottomMenu from "@/components/bottomMenu";
import HeaderMenu from "@/components/headerMenu";
import Item from "@/components/item";
import { Post } from "@prisma/client";
import useSWR from "swr";

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
  console.log(data);
  return (
    <div>
      <HeaderMenu />
      {data?.posts?.map((post) => (
        <Item key={post?.id} post={post} />
      ))}
      <BottomMenu />
    </div>
  );
}
