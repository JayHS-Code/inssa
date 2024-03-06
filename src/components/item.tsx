import { Fav, Post } from "@prisma/client";
import {
  IconComment,
  IconEllipsisVertical,
  IconHeart,
  IconSolidHeart,
} from "./svg";
import { useEffect, useState } from "react";
import PostOptionModal from "./postOptionModal";
import { useRouter } from "next/router";
import ProfilePreview from "./profilePreview";
import useFetch from "@/libs/client/useFetch";

type PostWithUser = Post & {
  user: {
    avatar: string;
    nickname: string;
  };
  Fav: Fav[];
};

interface PropsType {
  post: PostWithUser;
}

export default function Item({ post }: PropsType) {
  const {
    id,
    fileType,
    url,
    description,
    Fav,
    user: { nickname, avatar },
  } = post;
  const [imgUrl, setImgUrl] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [like, setLike] = useState(false);
  const router = useRouter();
  const [useApi] = useFetch(`/api/post/${id}/fav`);
  useEffect(() => {
    const splitUrl = url.split(" ");
    setImgUrl(splitUrl);
  }, []);
  useEffect(() => {
    if (post && Fav.length) {
      setLike(true);
    }
  }, []);
  const viewProfile = () => {
    router.push(`/profile/${nickname}`);
  };
  const onFavClick = () => {
    setLike(!like);
    useApi({});
  };
  const clickModal = () => setShowModal(!showModal);
  return (
    <div className="mt-10 z-0">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <ProfilePreview
            url={avatar}
            cls={"w-8 h-8 rounded-full cursor-pointer"}
          />
          <div
            onClick={viewProfile}
            className="font-medium text-sm cursor-pointer"
          >
            {nickname}
          </div>
        </div>
        <div className="relative flex justify-center items-center">
          <div onClick={clickModal} className="cursor-pointer">
            <IconEllipsisVertical />
          </div>
          {showModal && <PostOptionModal clickModal={clickModal} post={post} />}
        </div>
      </div>
      {fileType === "video" ? (
        <video
          src={url}
          controls
          className="w-full bg-black mt-3 rounded-md aspect-square object-contain"
        ></video>
      ) : (
        <img
          src={imgUrl[0]}
          className="w-full bg-black mt-3 rounded-md aspect-square object-contain"
        />
      )}
      <div className="mt-3 flex gap-2">
        <button
          onClick={onFavClick}
          className={`flex items-center justify-center ${
            like ? "text-red-400  hover:text-red-500" : "hover:text-gray-500"
          }`}
        >
          {like ? <IconSolidHeart /> : <IconHeart />}
        </button>
        <IconComment />
      </div>
      <div className="pt-2 break-words break-all">{description}</div>
    </div>
  );
}
