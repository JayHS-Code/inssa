import BottomMenu from "@/components/bottomMenu";
import Img from "@/components/img";
import useUser from "@/libs/client/useUser";
import Link from "next/link";

export default function Profile() {
  const { user } = useUser();
  return (
    <div>
      <div>
        <div className="flex items-center space-x-16">
          <Img url={user?.avatar} cls={"w-32 h-32 bg-slate-500 rounded-full"} />
          <div className="h-32 flex flex-col">
            <span className="font-bold text-lg text-gray-900">
              {user?.nickname}
              <span>로그인 아이콘</span>
            </span>
            <div>
              <Link href="/profile/edit">
                <span className="text-sm text-blue-600">프로필 수정</span>
              </Link>
              <span className="ml-5 text-sm text-red-500">로그아웃</span>
            </div>
          </div>
        </div>
        <div className="mt-5 text-sm font-sans">{user?.description}</div>
      </div>
      <div className="mt-10">
        <div className="border-t flex justify-center gap-14">
          <div className="w-14 h-10 text-xs flex justify-center items-center">
            사진
          </div>
          <div className="w-14 h-10 text-xs flex justify-center items-center">
            동영상
          </div>
          <div className="w-14 h-10 text-xs flex justify-center items-center">
            좋아요
          </div>
        </div>
      </div>
      <BottomMenu />
    </div>
  );
}
