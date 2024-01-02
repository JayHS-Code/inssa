import BottomMenu from "@/components/bottomMenu";
import HeaderMenu from "@/components/headerMenu";
import Item from "@/components/item";
import useUser from "@/libs/client/useUser";
import { Post } from "@prisma/client";
import useSWR from "swr";

interface VideoType extends Post {
  user: {
    avatar: string;
    nickname: string;
  };
}

interface VideosResponse {
  ok: boolean;
  videos: VideoType[];
}

export default function Video() {
  useUser();
  const { data } = useSWR<VideosResponse>("/api/post/video");
  console.log(data);
  return (
    <div>
      <HeaderMenu />
      {data?.videos?.map((video) => (
        <Item key={video?.id} post={video} />
      ))}
      <BottomMenu />
    </div>
  );
}
