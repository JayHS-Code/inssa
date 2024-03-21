import useUser from "@/libs/client/useUser";
import Link from "next/link";
import {
  IconChatBubble,
  IconChatBubbleSolid,
  IconFilm,
  IconFilmSolid,
  IconHome,
  IconHomeSolid,
  IconPlus,
  IconSearch,
  IconVideo,
  IconVideoSolid,
  IconXMark,
} from "../svg";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import HeaderMenu from "./headerMenu";
import BottomMenu from "./bottomMenu";
import { useWindowSize } from "@/libs/hooks/useWindowSize";
import { useForm } from "react-hook-form";
import useFetch from "@/libs/client/useFetch";
import SearchResult from "../search/searchResult";
import { User } from "@prisma/client";

interface FormType {
  keyword: string;
}

export default function MainMenu() {
  const { user } = useUser();
  const router = useRouter();
  const { register, handleSubmit } = useForm<FormType>();
  const [useApi, { loading, data }] = useFetch(`/api/search/post`);
  const [sideMenu, largeSide] = useWindowSize();
  const [clickSearch, setClickSearch] = useState(false);
  const [onlySide, setOnlySide] = useState(false);
  const [useHeader, setUseHeader] = useState(true);
  const [searchData, setSearchData] = useState<User[]>([]);

  useEffect(() => {
    if (router.pathname === "/direct/[id]") {
      setOnlySide(true);
    }

    if (router.pathname === "/upload") {
      setUseHeader(false);
    }

    if (router.pathname === "/p/[id]") {
      setUseHeader(false);
    }
  }, [router]);

  useEffect(() => {
    if (loading) return;
    if (data) {
      setSearchData([...data?.result]);
    }
  }, [data]);

  const linkCls = `w-full px-3`;
  const btnCls = `h-10 rounded-md flex items-center gap-3 hover:bg-black/20 ${
    largeSide && !clickSearch
      ? "w-full pl-2 justify-start"
      : "w-10 justify-center"
  }`;

  const onValid = (form: FormType) => {
    useApi(form);
  };

  return (
    <>
      {sideMenu ? (
        <div>
          <div
            className={`fixed top-0 left-0 h-full border-r-[1px] border-black flex flex-col items-start z-20 transition-all duration-700 ${
              largeSide && !clickSearch ? "w-72" : "w-16"
            }`}
          >
            <div className="w-full mt-8">
              <Link
                className={`${
                  largeSide && !clickSearch
                    ? "pl-5 font-bold text-3xl"
                    : "flex font-bold text-base justify-center items-center"
                }`}
                href="/"
              >
                inssa
              </Link>
            </div>
            <div className={`w-full mt-10 flex flex-col items-center gap-5`}>
              <Link className={linkCls} href="/">
                <div className={btnCls}>
                  {router?.asPath === "/" ? (
                    <div>
                      <IconHomeSolid cls={"w-7 h-7"} />
                    </div>
                  ) : (
                    <IconHome cls={"w-7 h-7"} />
                  )}
                  {largeSide && !clickSearch ? <span>홈</span> : null}
                </div>
              </Link>
              <Link className={linkCls} href="/v">
                <div className={btnCls}>
                  {router?.asPath === "/v" ? (
                    <IconFilmSolid cls={"w-7 h-7"} />
                  ) : (
                    <IconFilm cls={"w-7 h-7"} />
                  )}
                  {largeSide && !clickSearch ? <span>비디오</span> : null}
                </div>
              </Link>
              <Link className={linkCls} href="/live">
                <div className={btnCls}>
                  {router?.asPath === "/live" ? (
                    <IconVideoSolid cls={"w-7 h-7"} />
                  ) : (
                    <IconVideo cls={"w-7 h-7"} />
                  )}
                  {largeSide && !clickSearch ? <span>라이브</span> : null}
                </div>
              </Link>
              <Link className={linkCls} href="/direct">
                <div className={btnCls}>
                  {router?.asPath.includes("/direct") ? (
                    <IconChatBubbleSolid cls={"w-7 h-7"} />
                  ) : (
                    <IconChatBubble cls={"w-7 h-7"} />
                  )}
                  {largeSide && !clickSearch ? <span>메시지</span> : null}
                </div>
              </Link>
              <div
                onClick={() => setClickSearch(!clickSearch)}
                className={`${linkCls} cursor-pointer`}
              >
                <div className={btnCls}>
                  {router?.asPath === "/search" ? (
                    <IconSearch cls={"w-7 h-7 rounded-md"} />
                  ) : (
                    <IconSearch cls={"w-7 h-7 rounded-md"} />
                  )}
                  {largeSide && !clickSearch ? <span>검색</span> : null}
                </div>
              </div>
              <Link className={linkCls} href="/upload">
                <div className={btnCls}>
                  {router?.asPath === "/upload" ? (
                    <IconPlus
                      cls={
                        "w-7 h-7 rounded-md border-2 border-black bg-black text-white"
                      }
                    />
                  ) : (
                    <IconPlus
                      cls={"w-7 h-7 rounded-md border-2 border-black"}
                    />
                  )}
                  {largeSide && !clickSearch ? <span>업로드</span> : null}
                </div>
              </Link>
              <Link className={linkCls} href={`/profile/${user?.nickname}`}>
                <div className={btnCls}>
                  <img
                    className={`w-7 h-7 rounded-full ${
                      router?.asPath === `/profile/${user?.nickname}`
                        ? "border-solid border-2 border-black"
                        : null
                    }`}
                    src={user?.avatar ? user?.avatar : "/empty.png"}
                  />
                  {largeSide && !clickSearch ? <span>프로필</span> : null}
                </div>
              </Link>
            </div>
          </div>
          <div
            className={`fixed top-0 left-16 p-3 h-full border-r-[1px] border-black bg-white z-50 transition-all duration-700 ${
              !clickSearch
                ? "-translate-x-[400px] opacity-0"
                : "translate-x-0 opacity-100"
            }`}
          >
            <div
              onClick={() => setClickSearch(false)}
              className="absolute right-3 cursor-pointer"
            >
              <IconXMark />
            </div>
            <div className="font-semibold text-2xl">검색</div>
            <form onSubmit={handleSubmit(onValid)}>
              <input
                className="w-80 h-8 mt-5 rounded-md"
                placeholder="사용자 검색"
                {...register("keyword", { required: true })}
              />
            </form>
            <div>
              {searchData.map((search, idx) => (
                <SearchResult key={idx} search={search} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {!onlySide ? (
            <div>
              {useHeader ? <HeaderMenu /> : null}
              <BottomMenu />
            </div>
          ) : null}
        </>
      )}
    </>
  );
}
