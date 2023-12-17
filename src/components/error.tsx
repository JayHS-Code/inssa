import { IconExclamationCircle } from "./svg";

interface ErrProp {
  message: string;
}

export default function Error({ message }: ErrProp) {
  return (
    <div className="mt-3 flex items-center">
      <IconExclamationCircle cls="w-6 h-6 text-red-500" />
      <span className="ml-1 text-sm text-red-500">{message}</span>
    </div>
  );
}
