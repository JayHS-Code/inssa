import { useRouter } from "next/router";

type postType = {
  post: {
    id: number;
    url: string;
    fileType: "image" | "video";
  };
  width?: string;
};

export default function PostPreview({ post, width }: postType) {
  const router = useRouter();

  if (post?.fileType === "image") {
    return (
      <img
        onClick={() => router.push(`/p/${post?.id}`)}
        className={`${
          width ? width : "w-[32%]"
        } aspect-square mb-[2%] cursor-pointer hover:brightness-50`}
        src={post?.url.split(" ")[0]}
      />
    );
  }

  return (
    <video
      onClick={() => router.push(`/p/${post?.id}`)}
      className={`${
        width ? width : "w-[32%]"
      } aspect-square mb-[2%] cursor-pointer hover:brightness-50 object-cover`}
      src={post?.url}
    ></video>
  );
}
