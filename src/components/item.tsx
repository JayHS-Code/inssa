import { IconBookMark, IconComment, IconHeart } from "./svg";

export default function Item() {
  return (
    <div>
      <div className="flex items-center gap-3">
        <img src="2.jpg" className="w-8 h-8 rounded-full" />
        <div className="font-medium text-sm">유저네임 username</div>
      </div>
      <img src="1.png" className="mt-3 rounded-md" />
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
