import {
  IconComment,
  IconEye,
  IconHeart,
  IconPencil,
  IconSolidComment,
  IconSolidHeart,
} from "@/components/svg";
import useFetch from "@/libs/client/useFetch";
import { Post, User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

interface CommentForm {
  comment: string;
}

interface ResponseData {
  ok: boolean;
  isLiked: boolean;
  post: Post;
  comment: {
    comment: string;
    id: number;
    user: User;
  }[];
}

export default function PostDetail() {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<CommentForm>();
  const [clickComment, setClickComment] = useState(false);
  const [moreView, setMoreView] = useState(false);
  const { data, mutate } = useSWR<ResponseData>(
    router.query.id ? `/api/post/${router.query.id}/detail` : null
  );
  const [useApi] = useFetch(`/api/post/${router.query.id}/fav`);
  const [useCommentApi, { data: commentData, loading: commentLoading }] =
    useFetch(`/api/post/${router.query.id}/comment`);
  const onFavClick = () => {
    useApi({});
    if (!data) return;
    mutate({ ...data, isLiked: !data.isLiked }, false);
  };
  const onEditClick = () => {
    router.push(`/p/${data?.post?.id}/edit`);
  };
  const onCommentValid = (comment: CommentForm) => {
    if (commentLoading) return;
    useCommentApi(comment);
  };
  useEffect(() => {
    if (commentData?.ok) {
      reset();
      mutate();
    }
  }, [commentData, reset, mutate]);
  console.log(data);
  // 받은 data 값을 실제 값으로 바꿔주기
  return (
    <div>
      <div>
        <div className="h-96 bg-slate-300" />
        <div className="py-3 flex items-center space-x-3 cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-slate-300" />
          <div>
            <p className="text-sm font-medium text-gray-700">Steve Jebs</p>
            <p className="text-xs font-medium text-gray-500">
              View profile &rarr;
            </p>
          </div>
        </div>
        <div className="border-b flex justify-between">
          <div className="flex">
            <div className="p-3 rounded-md rounded-b-none flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-gray-500 border-b border-white">
              <IconEye />
              <span className="ml-3">{data?.post?.views}</span>
            </div>
            <button
              onClick={onFavClick}
              className={`p-3 rounded-md rounded-b-none flex items-center justify-center hover:bg-gray-100 ${
                data?.isLiked
                  ? "text-red-400  hover:text-red-500 border-b border-orange-500"
                  : "text-gray-400 hover:text-gray-500 border-b border-white"
              }`}
            >
              {data?.isLiked ? <IconSolidHeart /> : <IconHeart />}
            </button>
            <button
              onClick={() => setClickComment((prev) => !prev)}
              className={`p-3 rounded-md rounded-b-none flex items-center justify-center hover:bg-gray-100 ${
                !clickComment
                  ? "text-gray-400 hover:text-gray-500 border-b border-white"
                  : "text-orange-500 hover:text-orange-500 border-b border-orange-500"
              }`}
            >
              {!clickComment ? <IconComment /> : <IconSolidComment />}
            </button>
          </div>
          <div
            onClick={onEditClick}
            className="p-3 rounded-md rounded-b-none flex items-center justify-center hover:bg-gray-100"
          >
            <IconPencil />
          </div>
        </div>
        <div
          onClick={!moreView ? () => setMoreView(true) : undefined}
          className={`mt-3 p-3 pl-4 bg-gray-500 rounded-md ${
            !moreView ? "relative hover:bg-gray-400 cursor-pointer group" : null
          }`}
        >
          <div className={!moreView ? "line-clamp-3" : "null"}>
            My money&apos;s in that office, right? If she start giving me some
            bullshit about it ain&apos;t there, and we got to go someplace else
            and get it, I&apos;m gonna shoot you in the head then and there.
            Then I&apos;m gonna shoot that bitch in the kneecaps, find out where
            my goddamn money is. She gonna tell me too. Hey, look at me when
            I&apos;m talking to you, motherfucker. You listen: we go in there,
            and that ni**a Winston or anybody else is in there, you the first
            motherfucker to get shot. You understand?
          </div>
          <button
            className={
              !moreView
                ? "absolute bottom-0 right-0 m-3 mr-4 pl-1 leading-6 bg-gray-500 group-hover:bg-gray-400"
                : "hidden"
            }
          >
            ...더보기
          </button>
          <button
            onClick={() => setMoreView((prev) => !prev)}
            className={!moreView ? "hidden" : "mt-5"}
          >
            간략히
          </button>
        </div>
      </div>
      {!clickComment ? (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((_, i) => (
              <div key={i}>
                <div className="h-56 w-full mb-4 bg-slate-300" />
                <h3 className="text-gray-700 -mb-1">Galaxy S60</h3>
                <span className="text-sm font-medium text-gray-900">$6</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between space-x-2 mt-5">
            <button className="flex-1 font-medium bg-orange-500 text-white py-3 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
              불러오기
            </button>
          </div>
        </div>
      ) : null}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
        <form onSubmit={handleSubmit(onCommentValid)}>
          <textarea
            {...register("comment", { required: true })}
            className="mt-2 shadow-sm resize-none w-full rounded-md border-gray-300 focus:ring-orange-500 focus:border-orange-500"
            rows={3}
          />
          <div className="flex justify-end">
            <button>전송</button>
          </div>
        </form>
        <div className="mt-6">
          {data?.comment?.map((comment) => (
            <div key={comment?.id} className="mt-5 flex gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-300" />
              <div className="flex flex-col justify-start">
                <span className="text-xs leading-[8px]">
                  {comment?.user?.nickname}
                </span>
                <div className="mt-2 leading-[12px] text-sm">
                  {comment?.comment}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
