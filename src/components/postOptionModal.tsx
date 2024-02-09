import useFetch from "@/libs/client/useFetch";
import useUser from "@/libs/client/useUser";
import { Post } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface PropsType {
  clickModal: () => void;
  post: Post;
}

export default function PostOptionModal({ clickModal, post }: PropsType) {
  const router = useRouter();
  const [useApi, { loading, data }] = useFetch(`/api/direct/create`);
  const { user } = useUser();
  console.log(user);
  const enterDirect = () => {
    if (loading) return;
    useApi({ postOwner: post?.userId });
  };
  useEffect(() => {
    if (data) {
      console.log(data);
      router.push(`/direct/${data?.roomId}`);
    }
  }, [data]);
  return (
    <div
      onClick={clickModal}
      className="fixed top-0 left-0 w-full h-full bg-black/40 flex justify-center items-center z-10"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-96 bg-gray-700 rounded-md flex flex-col divide-y-[1px] cursor-pointer"
      >
        {post?.userId !== user?.id && (
          <div className="p-3 text-white text-center">수정하기</div>
        )}
        {post?.userId !== user?.id && (
          <div onClick={enterDirect} className="p-3 text-white text-center">
            1:1 대화하기
          </div>
        )}
        <div className="p-3 text-white text-center">차단하기</div>
        <div onClick={clickModal} className="p-3 text-white text-center">
          취소하기
        </div>
      </div>
    </div>
  );
}
