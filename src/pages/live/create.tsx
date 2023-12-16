import useFetch from "@/libs/client/useFetch";
import { Live } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface CreateForm {
  title: string;
  description: string;
}

interface CreateResponse {
  ok: boolean;
  live: Live;
}

export default function Create() {
  const router = useRouter();
  const [useApi, { loading, data }] = useFetch(`/api/live/create`);
  const { register, handleSubmit } = useForm<CreateForm>();
  const onValid = (form: CreateForm) => {
    if (loading) return;
    useApi(form);
  };
  useEffect(() => {
    if (data && data?.ok) {
      router.push(`/live/${data?.live?.id}`);
    }
  }, [data, router]);
  return (
    <div>
      <form onSubmit={handleSubmit(onValid)} className="space-y-5">
        <div>
          <label
            className="mb-1 block text-sm font-medium text-gray-700"
            htmlFor="title"
          >
            Title
          </label>
          <div className="rounded-md relative flex  items-center shadow-sm">
            <input
              {...register("title", { required: true })}
              id="title"
              type="text"
              className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            {...register("description")}
            id="description"
            className="mt-1 shadow-sm w-full focus:ring-orange-500 rounded-md border-gray-300 focus:border-orange-500 "
            rows={4}
          />
        </div>
        <button className=" w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none ">
          Go live
        </button>
      </form>
    </div>
  );
}
