import BottomMenu from "@/components/bottomMenu";
import HeaderMenu from "@/components/headerMenu";
import useUser from "@/libs/client/useUser";
import { chatProfileImg } from "@/libs/utils/chatProfileImg";
import { Chat, Room, User } from "@prisma/client";
import { useRouter } from "next/router";
import useSWR from "swr";

type RoomType = Room & {
  chat: Chat[];
  user: User[];
};

type ResponseRooms = {
  room: RoomType[];
};

export default function Direct() {
  const router = useRouter();
  const { user } = useUser();
  const { data } = useSWR<ResponseRooms>(`/api/direct`);
  return (
    <div className="space-y-5">
      <HeaderMenu />
      {data?.room?.map((room, idx) => (
        <div
          onClick={() => {
            router.push(`direct/${room?.roomId}`);
          }}
          key={idx}
          className="py-2 px-2 flex hover:bg-slate-500/20 cursor-pointer"
        >
          <img
            src={chatProfileImg({ myId: user?.id, userList: room?.user })}
            className="w-14 h-14 rounded-full border object-cover"
          />
          <div className="w-full px-5">
            <div className="flex flex-col">
              <div className="font-extrabold text-sm">이름</div>
              <div className="font-thin text-sm max-w-sm overflow-hidden text-ellipsis whitespace-nowrap text-slate-500">
                oooooooooooooooooooooooooooooooooooooooooooooooooooooasdfasfdasf
                {/*room?.chat[0]?.message*/}
              </div>
            </div>
          </div>
          <div className="text-xs text-slate-500 whitespace-nowrap">
            오후 16:00
          </div>
        </div>
      ))}
      <BottomMenu />
    </div>
  );
}
