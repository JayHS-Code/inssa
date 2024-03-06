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
  IconVideo,
  IconVideoSolid,
} from "./svg";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import HeaderMenu from "./headerMenu";
import BottomMenu from "./bottomMenu";
import { useWindowSize } from "@/libs/hooks/useWindowSize";

export default function MainMenu() {
  const { user } = useUser();
  const router = useRouter();
  const [sideMenu, largeSide] = useWindowSize();
  const [onlySide, setOnlySide] = useState(false);
  const [useHeader, setUseHeader] = useState(true);

  useEffect(() => {
    if (router.pathname === "/direct/[id]") {
      setOnlySide(true);
    }

    if (router.pathname === "/upload") {
      setUseHeader(false);
    }
  }, [router]);

  const linkCls = `w-full px-3`;
  const btnCls = `h-10 rounded-md flex items-center gap-3 hover:bg-black/20 ${
    largeSide ? "w-full pl-2 justify-start" : "w-10 justify-center"
  }`;

  return (
    <>
      {sideMenu ? (
        <div
          className={`fixed top-0 left-0 h-full border-r-[1px] border-black flex flex-col items-start z-10 ${
            largeSide ? "w-72" : "w-16"
          }`}
        >
          <div className="w-full mt-8">
            <Link
              className={`${
                largeSide
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
                {largeSide ? <span>홈</span> : null}
              </div>
            </Link>
            <Link className={linkCls} href="/v">
              <div className={btnCls}>
                {router?.asPath === "/v" ? (
                  <IconFilmSolid cls={"w-7 h-7"} />
                ) : (
                  <IconFilm cls={"w-7 h-7"} />
                )}
                {largeSide ? <span>비디오</span> : null}
              </div>
            </Link>
            <Link className={linkCls} href="/live">
              <div className={btnCls}>
                {router?.asPath === "/live" ? (
                  <IconVideoSolid cls={"w-7 h-7"} />
                ) : (
                  <IconVideo cls={"w-7 h-7"} />
                )}
                {largeSide ? <span>라이브</span> : null}
              </div>
            </Link>
            <Link className={linkCls} href="/direct">
              <div className={btnCls}>
                {router?.asPath.includes("/direct") ? (
                  <IconChatBubbleSolid cls={"w-7 h-7"} />
                ) : (
                  <IconChatBubble cls={"w-7 h-7"} />
                )}
                {largeSide ? <span>메시지</span> : null}
              </div>
            </Link>
            <Link className={linkCls} href="/upload">
              <div className={btnCls}>
                {router?.asPath === "/upload" ? (
                  <IconPlus
                    cls={
                      "w-7 h-7 rounded-md border-2 border-black bg-black text-white"
                    }
                  />
                ) : (
                  <IconPlus cls={"w-7 h-7 rounded-md border-2 border-black"} />
                )}
                {largeSide ? <span>업로드</span> : null}
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
                {largeSide ? <span>프로필</span> : null}
              </div>
            </Link>
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
