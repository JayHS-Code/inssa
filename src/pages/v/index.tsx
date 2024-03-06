import Item from "@/components/item";
import useUser from "@/libs/client/useUser";
import { Fav, Post } from "@prisma/client";
import useSWR from "swr";
import dynamic from "next/dynamic";
const MainMenu = dynamic(() => import("../../components/mainMenu"), {
  ssr: false,
});

interface VideoType extends Post {
  user: {
    avatar: string;
    nickname: string;
  };
  Fav: Fav[];
}

interface VideosResponse {
  ok: boolean;
  videos: VideoType[];
}

export default function Video() {
  useUser();
  const { data } = useSWR<VideosResponse>("/api/post/video");
  return (
    <div>
      <MainMenu />
      {data?.videos?.map((video) => (
        <Item key={video?.id} post={video} />
      ))}
    </div>
  );
}
