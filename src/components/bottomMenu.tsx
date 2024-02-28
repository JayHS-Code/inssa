import useUser from "@/libs/client/useUser";
import Link from "next/link";
import {
  IconChatBubble,
  IconChatBubbleSolid,
  IconFilm,
  IconFilmSolid,
  IconHome,
  IconHomeSolid,
  IconVideo,
  IconVideoSolid,
} from "./svg";
import { useRouter } from "next/router";

export default function BottomMenu() {
  const { user } = useUser();
  const router = useRouter();
  return (
    <div className="bg-white py-2 border-t border-black fixed w-full max-w-3xl left-2/4 -translate-x-2/4 bottom-0 flex items-center justify-around z-0">
      <Link href="/">
        <div>
          {router?.asPath === "/" ? (
            <IconHomeSolid cls={"w-7 h-7"} />
          ) : (
            <IconHome cls={"w-7 h-7"} />
          )}
        </div>
      </Link>
      <Link href="/v">
        <div>
          {router?.asPath === "/v" ? (
            <IconFilmSolid cls={"w-7 h-7"} />
          ) : (
            <IconFilm cls={"w-7 h-7"} />
          )}
        </div>
      </Link>
      <Link href="/live">
        <div>
          {router?.asPath === "/live" ? (
            <IconVideoSolid cls={"w-7 h-7"} />
          ) : (
            <IconVideo cls={"w-7 h-7"} />
          )}
        </div>
      </Link>
      <Link href="/direct">
        <div>
          {router?.asPath === "/direct" ? (
            <IconChatBubbleSolid cls={"w-7 h-7"} />
          ) : (
            <IconChatBubble cls={"w-7 h-7"} />
          )}
        </div>
      </Link>
      <Link href={`/profile/${user?.nickname}`}>
        <div>
          <img
            className={`w-7 h-7 rounded-full ${
              router?.asPath === `/profile/${user?.nickname}`
                ? "border-solid border-2 border-black"
                : null
            }`}
            src={user?.avatar ? user?.avatar : "/empty.png"}
          />
        </div>
      </Link>
    </div>
  );
}
