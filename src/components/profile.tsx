import ProfilePreview from "@/components/profilePreview";
import PostPreview from "@/components/postPreview";
import { IconAtSymbol, IconDevicePhoneMobile } from "@/components/svg";
import useUser from "@/libs/client/useUser";
import { User } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import dynamic from "next/dynamic";
const MainMenu = dynamic(() => import("./mainMenu"), {
  ssr: false,
});

type PostType = {
  id: number;
  url: string;
  fileType: "image" | "video";
};

type PostWithUser = User & {
  Post: PostType[];
  Fav: {
    post: PostType;
  }[];
};

type profileType = {
  profile: PostWithUser;
};

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useUser();
  const { data } = useSWR<profileType>(
    `${router?.query?.id ? `/api/users/${router.asPath}` : null}`
  );
  const handleLogout = async () => {
    await fetch("/api/users/profile/logout");
    router.push(`/account/signIn`);
  };
  const indexProfile = () => {
    router.push(`/profile/${router?.query?.id}`);
  };
  const videoProfile = () => {
    router.push(`/profile/${router?.query?.id}/v`);
  };
  const favProfile = () => {
    router.push(`/profile/${router?.query?.id}/fav`);
  };

  console.log(data);
  return (
    <div>
      <MainMenu />
      <div>
        <div className="pt-16 flex items-center space-x-16">
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
            {user?.id === data?.profile?.id ? (
              <div>
                <Link href={`/profile/${user?.nickname}/edit`}>
                  <span className="text-sm text-blue-600">프로필 수정</span>
                </Link>
                <span
                  onClick={handleLogout}
                  className="ml-5 text-sm text-red-500 cursor-pointer"
                >
                  로그아웃
                </span>
              </div>
            ) : null}
          </div>
        </div>
        <div className="mt-5 text-sm font-sans">{user?.description}</div>
      </div>
      <div className="mt-10">
        <div className="border-t flex justify-center gap-14">
          <div
            onClick={indexProfile}
            className={`w-14 h-10 text-xs flex justify-center items-center cursor-pointer ${
              router.asPath === `/profile/${router.query.id}`
                ? "border-t-[1px] border-y-black"
                : null
            }`}
          >
            사진
          </div>
          <div
            onClick={videoProfile}
            className={`w-14 h-10 text-xs flex justify-center items-center cursor-pointer ${
              router.asPath === `/profile/${router.query.id}/v`
                ? "border-t-[1px] border-y-black"
                : null
            }`}
          >
            동영상
          </div>
          <div
            onClick={favProfile}
            className={`w-14 h-10 text-xs flex justify-center items-center cursor-pointer ${
              router.asPath === `/profile/${router.query.id}/fav`
                ? "border-t-[1px] border-y-black"
                : null
            }`}
          >
            좋아요
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-[2%]">
        {data?.profile?.Post?.length
          ? data?.profile?.Post.map((post, idx) => (
              <PostPreview key={idx} post={post} />
            ))
          : null}
      </div>
      <div className="flex flex-wrap gap-[2%]">
        {data?.profile?.Fav?.length
          ? data?.profile?.Fav.map((post, idx) => (
              <PostPreview key={idx} post={post?.post} />
            ))
          : null}
      </div>
    </div>
  );
}
