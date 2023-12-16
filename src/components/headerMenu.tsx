import Head from "next/head";
import Link from "next/link";

interface TitleType {
  title?: string;
}

export default function HeaderMenu({ title }: TitleType) {
  return (
    <div className="relative">
      <Head>
        <title>홈 - </title>
      </Head>
      <div className="fixed px-4 h-12 w-full max-w-3xl top-0 left-2/4 -translate-x-2/4 flex justify-between items-center border-b">
        <Link href="/">inssa</Link>
        <Link href="/upload">업로드</Link>
      </div>
    </div>
  );
}
