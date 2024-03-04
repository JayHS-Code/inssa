import Head from "next/head";
import Link from "next/link";

interface TitleType {
  title?: string;
}

export default function HeaderMenu({ title }: TitleType) {
  return (
    <div className="relative pb-8">
      <Head>
        <title>홈 - </title>
      </Head>
      <div className="bg-white fixed px-4 h-14 w-full max-w-3xl top-0 left-2/4 -translate-x-2/4 flex justify-between items-center border-b z-10">
        <Link className="font-bold text-xl" href="/">
          inssa
        </Link>
        <Link href="/upload">업로드</Link>
      </div>
    </div>
  );
}
