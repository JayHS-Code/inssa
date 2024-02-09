import { Post } from "@prisma/client";
import {
  IconBookMark,
  IconComment,
  IconEllipsisVertical,
  IconHeart,
} from "./svg";
import { useEffect, useState } from "react";
import PostOptionModal from "./postOptionModal";

type PostWithUser = Post & {
  user: {
    avatar: string;
    nickname: string;
  };
};

interface PropsType {
  post: PostWithUser;
}

export default function Item({ post }: PropsType) {
  const {
    fileType,
    url,
    user: { nickname },
  } = post;
  const [imgUrl, setImgUrl] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const splitUrl = url.split(" ");
    setImgUrl(splitUrl);
  }, []);
  const clickModal = () => setShowModal(!showModal);
  return (
    <div className="mt-10">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <img src="2.jpg" className="w-8 h-8 rounded-full" />
          <div className="font-medium text-sm">{nickname}</div>
        </div>
        <div className="relative flex justify-center items-center">
          <div onClick={clickModal} className="cursor-pointer">
            <IconEllipsisVertical />
          </div>
          {showModal && <PostOptionModal clickModal={clickModal} post={post} />}
        </div>
      </div>
      {fileType === "video" ? (
        <video src={post?.url} className="mt-3 rounded-md"></video>
      ) : (
        <img src={imgUrl[0]} className="mt-3 rounded-md" />
      )}
      <div className="mt-3 flex justify-between">
        <div className="flex">
          <IconHeart />
          <IconComment />
        </div>
        <IconBookMark />
      </div>
      <div className="pt-2 break-words break-all">description</div>
      <div>
        <span># hashtag</span>
      </div>
    </div>
  );
}

// 유저 이름, 사진, 제목, 내용, 태그
// 비디오는 상황에 따라 다른데 따로 페이지를 만들기 아니면 홈 화면에 비디오, 사진 구분없이
