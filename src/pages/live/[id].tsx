import Message from "@/components/message";
import useFetch from "@/libs/client/useFetch";
import useUser from "@/libs/client/useUser";
import { Live } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

interface MessageResponse extends Live {
  message: {
    id: number;
    message: string;
    user: {
      avatar?: string;
      id: number;
    };
  }[];
}

interface LiveResponse {
  ok: boolean;
  live: MessageResponse;
}

interface MessageForm {
  message: string;
}

export default function LiveDetail() {
  const router = useRouter();
  const { user } = useUser();
  const { data, mutate } = useSWR<LiveResponse>(
    router?.query?.id ? `/api/live/${router?.query?.id}` : null
  );
  const [useApi, { loading, data: sendMessageData }] = useFetch(
    `/api/live/${router.query.id}/message`
  );
  const { register, handleSubmit, reset } = useForm<MessageForm>();
  const onValid = (form: MessageForm) => {
    if (loading) return;
    reset();
    mutate();
    useApi(form);
  };
  return (
    <div className="space-y-4">
      <iframe
        className="w-full aspect-video rounded-md shadow-sm"
        src={`https://iframe.videodelivery.net/${data?.live?.cloudflareId}`}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen={true}
      ></iframe>
      <div className="mt-5">
        <h1 className="text-3xl font-bold text-gray-900">
          {data?.live?.title}
        </h1>
        <p className=" my-6 text-gray-700">{data?.live?.description}</p>
        <div className="bg-orange-400 p-5 rounded-md overflow-x-scroll flex flex-col space-y-3">
          <span>Stream Keys (secret)</span>
          <span className="text-white">
            <span className="font-medium text-gray-800">URL:</span>{" "}
            {data?.live?.cloudflareUrl}
          </span>
          <span className="text-white">
            <span className="font-medium text-gray-800">Key:</span>{" "}
            {data?.live?.cloudflareKey}
          </span>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
        <div className="py-10 pb-16 h-[50vh] overflow-y-scroll  px-4 space-y-4">
          {data?.live?.message?.map((message) => (
            <div>{message.message}</div>
          ))}
        </div>
        <div className="fixed py-2 bg-white  bottom-0 inset-x-0">
          <form
            onSubmit={handleSubmit(onValid)}
            className="flex relative max-w-md items-center  w-full mx-auto"
          >
            <input
              {...register("message", { required: true })}
              type="text"
              className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
            />
            <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
              <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white">
                &rarr;
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
