import { User } from "@prisma/client";
import { useRouter } from "next/router";
import ProfilePostPreview from "./profilePostPreview";

type UserWithPost = User & {
  Post: {
    id: number;
    url: string;
    fileType: "image" | "video";
  }[];
};

type propsType = {
  user: UserWithPost;
  clickModal: () => void;
};

export default function ProfileModal({ clickModal, user }: propsType) {
  const router = useRouter();
  const viewProfile = () => {
    router.push(`/profile/${user?.nickname}`);
  };
  return (
    <div
      onClick={clickModal}
      className="fixed top-0 -left-2 w-full h-full bg-black/40 flex flex-col justify-end items-center z-10"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-133 h-2/3 bg-gray-700 rounded-md"
      >
        <div className="">
          <div className="py-10 flex flex-col items-center">
            <img
              src={`${user?.avatar ? user?.avatar : "/empty.png"}`}
              className="w-24 h-24 rounded-full"
            />
            <div className="mt-2 text-xl text-white">{user?.nickname}</div>
            <div className="mt-2 text-base text-white">{user.description}</div>
            <div className="mt-3 flex gap-8">
              <div
                onClick={clickModal}
                className="p-1 rounded-lg bg-white cursor-pointer"
              >
                1:1 대화하기
              </div>
              <div
                onClick={viewProfile}
                className="p-1 rounded-lg bg-white cursor-pointer"
              >
                프로필 보기
              </div>
            </div>
          </div>
          <div className="px-2 flex flex-wrap gap-[1.5%]">
            {user?.Post.length
              ? user?.Post.map((post, idx) => (
                  <ProfilePostPreview key={idx} post={post} />
                ))
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}
