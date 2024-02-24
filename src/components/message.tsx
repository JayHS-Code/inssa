import { getTime } from "@/libs/utils/getTime";
import ProfileModal from "./profileModal";
import { useState } from "react";
import { Chat, User } from "@prisma/client";

type MessageWithUser = Chat & {
  user: User;
};

type MessageProps = {
  message: MessageWithUser;
  reversed?: boolean;
};

export default function Message({ message, reversed }: MessageProps) {
  const {
    message: chat,
    createdAt: dateTime,
    user: { avatar },
  } = message;
  const [showProfile, setShowProfile] = useState(false);
  const clickModal = () => setShowProfile(!showProfile);
  return (
    <div
      className={`flex space-x-2 mb-3 whitespace-pre ${
        reversed ? "flex-row-reverse space-x-reverse" : ""
      }`}
    >
      {!reversed ? (
        <img
          onClick={clickModal}
          src={`${avatar ? avatar : "/empty.png"}`}
          className="w-8 h-8 rounded-full cursor-pointer"
        />
      ) : null}
      {showProfile && (
        <ProfileModal user={message?.user} clickModal={clickModal} />
      )}
      <div className="w-1/2 text-sm text-gray-700 p-2 border border-gray-300 rounded-md">
        <p>{chat}</p>
      </div>
      <div className="flex items-end text-[10px]">{getTime({ dateTime })}</div>
    </div>
  );
}
