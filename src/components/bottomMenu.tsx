import Link from "next/link";

export default function BottomMenu() {
  return (
    <div className="fixed w-full max-w-3xl left-2/4 -translate-x-2/4 bottom-0 flex justify-around">
      <Link href="/">
        <div>Home</div>
      </Link>
      <Link href="/live">
        <div>Live</div>
      </Link>
      <Link href="/profile">
        <div>Profile</div>
      </Link>
    </div>
  );
}
