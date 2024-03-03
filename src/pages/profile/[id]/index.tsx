import BottomMenu from "@/components/bottomMenu";
import ProfilePreview from "@/components/profilePreview";
import PostPreview from "@/components/postPreview";
import { IconAtSymbol, IconDevicePhoneMobile } from "@/components/svg";
import useUser from "@/libs/client/useUser";
import { User } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";

type PostType = {
  id: number;
  url: string;
  fileType: "image" | "video";
};

type PostWithUser = User & {
  Post: PostType[];
};

type profileType = {
  profile: PostWithUser;
};

export default function Profile() {
  const router = useRouter();
  const { user } = useUser();
  const { data } = useSWR<profileType>(
    `${router?.query?.id ? `/api/users/profile/${router.query.id}` : null}`
  );
  const indexProfile = () => {
    router.push(`/profile/${router?.query?.id}`);
  };
  const videoProfile = () => {
    router.push(`/profile/${router?.query?.id}/v`);
  };
  const favProfile = () => {
    router.push(`/profile/${router?.query?.id}/fav`);
  };
  return (
    <div>
      <div>
        <div className="flex items-center space-x-16">
          <ProfilePreview
            url={user?.avatar}
            cls={"w-32 h-32 bg-slate-500 rounded-full"}
          />
          <div className="h-32 flex flex-col">
            <span className="flex items-end gap-2 font-bold text-lg text-gray-900">
              {router?.query?.id}
              <span>
                {data?.profile?.phone ? (
                  <IconDevicePhoneMobile cls={"w-5 h-5"} />
                ) : (
                  <IconAtSymbol cls={"w-5 h-5"} />
                )}
              </span>
            </span>
            <div>
              <Link href={`/profile/${user?.nickname}/edit`}>
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
          <div
            onClick={indexProfile}
            className={`w-14 h-10 text-xs flex justify-center items-center cursor-pointer border-t-[1px] border-y-black`}
          >
            사진
          </div>
          <div
            onClick={videoProfile}
            className={`w-14 h-10 text-xs flex justify-center items-center cursor-pointer`}
          >
            동영상
          </div>
          <div
            onClick={favProfile}
            className={`w-14 h-10 text-xs flex justify-center items-center cursor-pointer`}
          >
            좋아요
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-[2%]">
        {data?.profile?.Post.length
          ? data?.profile?.Post.map((post, idx) => (
              <PostPreview key={idx} post={post} />
            ))
          : null}
      </div>
      <BottomMenu />
    </div>
  );
}
