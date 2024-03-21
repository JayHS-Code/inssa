import Head from "next/head";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

interface TitleType {
  title?: string;
}

interface FormType {
  search: string;
}

export default function HeaderMenu({ title }: TitleType) {
  const router = useRouter();
  const { register, handleSubmit } = useForm<FormType>();
  const onValid = (form: FormType) => {
    router.push(`/search?keyword=${form?.search}`);
  };
  return (
    <div className="relative pb-8">
      <Head>
        <title>홈 - </title>
      </Head>
      <div className="bg-white fixed px-4 h-14 w-full max-w-3xl top-0 left-2/4 -translate-x-2/4 flex justify-between items-center border-b z-20">
        <Link className="font-bold text-xl" href="/">
          inssa
        </Link>
        <div className="flex justify-center items-center gap-4">
          <form
            onSubmit={handleSubmit(onValid)}
            className="relative w-60 flex items-center border-[1px] border-black rounded-md group"
          >
            <input
              placeholder="검색"
              {...register("search")}
              className="w-full h-7 border-none rounded-md focus:ring-0"
            />
          </form>
          <Link href="/upload">업로드</Link>
        </div>
      </div>
    </div>
  );
}
