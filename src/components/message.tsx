interface MessageProps {
  message: string;
  reversed?: boolean;
  avatar?: string | null;
}

export default function Message({ message, reversed, avatar }: MessageProps) {
  return (
    <div
      className={`flex items-end space-x-2 mb-3 whitespace-pre ${
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
      <div className="text-[10px]">16:00</div>
    </div>
  );
}
