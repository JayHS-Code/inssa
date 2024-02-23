import { getTime } from "@/libs/utils/getTime";

interface MessageProps {
  message: string;
  dateTime: Date;
  reversed?: boolean;
  notification?: boolean;
  avatar?: string | null;
}

export default function Message({
  message,
  dateTime,
  reversed,
  notification,
  avatar,
}: MessageProps) {
  if (notification) {
    return (
      <div className="relative mt-5">
        <div className="absolute w-full border-t border-gray-300" />
        <div className="relative -top-3 text-center">
          <span className="bg-white px-2 text-sm text-gray-500">{message}</span>
        </div>
      </div>
    );
  }
  return (
    <div
      className={`flex space-x-2 mb-3 whitespace-pre ${
        reversed ? "flex-row-reverse space-x-reverse" : ""
      }`}
    >
      {!reversed ? (
        <img
          src={`${avatar ? avatar : "/empty.png"}`}
          className="w-8 h-8 rounded-full"
        />
      ) : null}
      <div className="w-1/2 text-sm text-gray-700 p-2 border border-gray-300 rounded-md">
        <p>{message}</p>
      </div>
      <div className="flex items-end text-[10px]">{getTime({ dateTime })}</div>
    </div>
  );
}
