import PostPreview from "@/components/postPreview";
import ProfilePreview from "@/components/profilePreview";
import {
  IconChevronLeft,
  IconChevronRight,
  IconComment,
  IconEye,
  IconHeart,
  IconPencil,
  IconSolidComment,
  IconSolidHeart,
} from "@/components/svg";
import useFetch from "@/libs/client/useFetch";
import useUser from "@/libs/client/useUser";
import { Post, User } from "@prisma/client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

type CommentForm = {
  comment: string;
};

type PostWithUser = Post & {
  user: User;
};

type RelatedResponse = {
  id: number;
  url: string;
  fileType: "image" | "video";
};

type RelatedPostType = {
  Post: {
    id: number;
    url: string;
    fileType: "image" | "video";
  }[];
  _count: {
    Post: number;
  };
};

type ResponseData = {
  ok: boolean;
  isLiked: boolean;
  post: PostWithUser;
  relatedPost: RelatedPostType;
  comment: {
    comment: string;
    id: number;
    user: User;
  }[];
};

export default function PostDetail() {
  const router = useRouter();
  const { user } = useUser();
  const { register, handleSubmit, reset } = useForm<CommentForm>();
  const [clickComment, setClickComment] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [relatedPost, setRelatedPost] = useState<RelatedResponse[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const { data, mutate } = useSWR<ResponseData>(
    router.query.id ? `/api/post/${router.query.id}/detail` : null
  );
  const [useApi] = useFetch(`/api/post/${router.query.id}/fav`);
  const [useRelatedApi, { data: relatedData, loading: relatedLoading }] =
    useFetch(`/api/post/${router.query.id}/getRelatedPost?page=${pageIndex}`);
  const [useCommentApi, { data: commentData, loading: commentLoading }] =
    useFetch(`/api/post/${router.query.id}/comment`);
  const onFavClick = () => {
    useApi({});
    if (!data) return;
    mutate({ ...data, isLiked: !data.isLiked }, false);
  };
  const onPrevClick = () => {
    if (previewIndex === 0) {
      setPreviewIndex(previews.length - 1);
    } else {
      setPreviewIndex((current) => current - 1);
    }
  };
  const onNextClick = () => {
    if (previewIndex === previews.length - 1) {
      setPreviewIndex(0);
    } else {
      setPreviewIndex((current) => current + 1);
    }
  };
  const viewProfile = () => {
    router.push(`/profile/${data?.post?.user?.nickname}`);
  };
  const onEditClick = () => {
    router.push(`/p/${data?.post?.id}/edit`);
  };
  const getRelatedPost = () => {
    setPageIndex(pageIndex + 1);
    useRelatedApi({});
  };
  const onCommentValid = (comment: CommentForm) => {
    if (commentLoading) return;
    useCommentApi(comment);
  };
  useEffect(() => {
    if (data?.post?.fileType === "image") {
      setPreviews([...data?.post?.url.split(" ")]);
    }

    if (data?.post?.fileType === "video") {
      setPreviews([data?.post?.url]);
    }
  }, [data?.post]);
  useEffect(() => {
    if (relatedLoading) return;

    if (relatedData?.ok && relatedData) {
      console.log(relatedData?.relatedPost);
      setRelatedPost((prev) => [...prev, ...relatedData?.relatedPost]);
    }
  }, [relatedData]);
  useEffect(() => {
    if (commentData?.ok) {
      reset();
      mutate();
    }
  }, [commentData, reset, mutate]);
  console.log(relatedPost);
  return (
    <div>
      <div>
        <div>
          {data?.post?.fileType === "image" ? (
            <div className="relative flex flex-col justify-center bg-black group">
              <img
                src={previews[previewIndex]}
                className="w-full aspect-square object-contain"
              />
              {previews.length > 1 ? (
                <div
                  onClick={onPrevClick}
                  className="absolute ml-3 flex justify-center items-center w-8 h-8 rounded-full opacity-0 bg-gray-700/60 text-white cursor-pointer group-hover:opacity-100"
                >
                  <IconChevronLeft />
                </div>
              ) : null}
              {previews.length > 1 ? (
                <div
                  onClick={onNextClick}
                  className="absolute right-0 mr-3 flex justify-center items-center w-8 h-8 rounded-full opacity-0 bg-gray-700/60 text-white cursor-pointer group-hover:opacity-100"
                >
                  <IconChevronRight />
                </div>
              ) : null}
            </div>
          ) : (
            <div className="relative flex flex-col justify-center bg-black">
              <video src={previews[0]} controls />
            </div>
          )}
        </div>
        <div className="py-3 flex items-center space-x-3">
          <div onClick={viewProfile}>
            <ProfilePreview
              url={data?.post?.user?.avatar}
              cls={"w-12 h-12 rounded-full cursor-pointer"}
            />
          </div>
          <div onClick={viewProfile} className="cursor-pointer">
            <p className="text-sm font-medium text-gray-700">
              {data?.post?.user?.nickname}
            </p>
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
          {data?.post?.user?.id === user?.id ? (
            <div
              onClick={onEditClick}
              className="p-3 rounded-md rounded-b-none flex items-center justify-center hover:bg-gray-100 cursor-pointer"
            >
              <IconPencil />
            </div>
          ) : null}
        </div>
        <div className="mt-3 p-3 pl-4 bg-gray-400 rounded-md whitespace-pre-wrap break-words">
          {data?.post?.description}
        </div>
      </div>
      {!clickComment ? (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900">Similar posts</h2>
          <div className="mt-6 flex flex-wrap gap-[2%]">
            {data?.relatedPost?.Post.map((post, idx) => (
              <PostPreview key={idx} post={post} width="w-[49%]" />
            ))}
          </div>
          <div className="flex flex-wrap gap-[2%]">
            {relatedPost.map((post, idx) => (
              <PostPreview key={idx} post={post} width="w-[49%]" />
            ))}
          </div>
          <div className="flex items-center justify-between space-x-2 mt-5">
            {pageIndex * 4 < Number(data?.relatedPost?._count?.Post) - 1 ? (
              <button
                onClick={getRelatedPost}
                className="mb-4 flex-1 font-medium bg-orange-500 text-white py-3 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                불러오기
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
      <div className="">
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
              <div
                onClick={() => router.push(`/profile/${comment.user.nickname}`)}
              >
                <ProfilePreview
                  url={comment.user.avatar}
                  cls={"w-12 h-12 rounded-full cursor-pointer"}
                />
              </div>
              <div className="flex flex-col justify-start">
                <span
                  onClick={() =>
                    router.push(`/profile/${comment.user.nickname}`)
                  }
                  className="text-xs leading-[8px] cursor-pointer"
                >
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
