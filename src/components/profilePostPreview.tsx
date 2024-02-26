import { useRouter } from "next/router";

type postType = {
  post: {
    id: number;
    url: string;
    fileType: "image" | "video";
  };
};

export default function ProfilePostPreview({ post }: postType) {
  const router = useRouter();

  if (post?.fileType === "image") {
    return (
      <img
        onClick={() => router.push(`/p/${post?.id}`)}
        className="w-[32%] aspect-square mb-[2%] cursor-pointer hover:brightness-50"
        src={post?.url.split(" ")[1]}
      />
    );
  }

  return (
    <video
      onClick={() => router.push(`/p/${post?.id}`)}
      className="w-[32%] aspect-square mb-[2%] object-cover cursor-pointer hover:brightness-50"
      src={post?.url}
    ></video>
  );
}
