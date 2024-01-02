import { Post } from "@prisma/client";
import {
  IconBookMark,
  IconComment,
  IconEllipsisVertical,
  IconHeart,
} from "./svg";
import { useEffect, useState } from "react";

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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  useEffect(() => {
    const splitUrl = url.split(" ");
    setImgUrl(splitUrl);
  }, []);
  const dropDownOpen = () => {
    setIsOpen((prev) => !prev);
  };
  const dropDownClose = () => {
    setIsOpen(false);
  };
  return (
    <div className="mt-10">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <img src="2.jpg" className="w-8 h-8 rounded-full" />
          <div className="font-medium text-sm">{nickname}</div>
        </div>
        <div className="relative flex justify-center items-center">
          <button onClick={dropDownOpen} onBlur={dropDownClose}>
            <IconEllipsisVertical />
          </button>
          <ul
            className={`absolute flex justify-center flex-wrap-reverse w-12 mt-20 mr-6 bg-black text-white rounded-md cursor-pointer z-10 ${
              isOpen ? "block" : "hidden"
            }`}
          >
            <li>차단</li>
            <li>수정</li>
          </ul>
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
// 비디오는 상황에 따라 다른데 따로 페이지를 만들던지 아니면 홈 화면에 비디오, 사진 구분없이 올리던지.
