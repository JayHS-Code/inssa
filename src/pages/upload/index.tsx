import { IconPhoto } from "@/components/svg";
import useFetch from "@/libs/client/useFetch";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface uploadForm {
  description?: string;
  title?: string;
  uploadFiles: FileList;
}

interface test {
  [key: string]: string;
}

export default function Upload() {
  const router = useRouter();
  const { register, handleSubmit, watch } = useForm<uploadForm>();
  const [useApi, { loading, data }] = useFetch("/api/upload");
  const onValid = (data: uploadForm) => {
    if (loading) return;
    useApi(data);
  };
  useEffect(() => {
    if (data?.ok) {
      router.push(`/`);
    }
  }, [data, router]);
  const uploadFiles = watch("uploadFiles");
  const [preview, setPreview] = useState([]);
  useEffect(() => {
    if (uploadFiles && uploadFiles.length > 0) {
      console.log(uploadFiles);
    }
  }, [uploadFiles]);
  return (
    <div>
      <form onSubmit={handleSubmit(onValid)}>
        <div>
          <div>
            <label className="w-full cursor-pointer text-gray-600 flex items-center justify-center border-2 border-dashed border-gray-300 h-48 rounded-md hover:text-orange-500 hover:border-orange-500">
              <IconPhoto cls="h-12 w-12" />
              <input
                {...register("uploadFiles")}
                className="hidden"
                type="file"
                accept="image/*, video/*"
                multiple
              />
            </label>
          </div>
        </div>
        <div className="my-5">
          <label className="mb-1 block text-sm text-gray-700 font-medium">
            Title
          </label>
          <div>
            <input
              type="text"
              {...register("title")}
              className="mt-1 shadow-sm resize-none w-full rounded-md border-gray-300 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
        <div className="my-5">
          <label className="mb-1 block text-sm text-gray-700 font-medium">
            Description
          </label>
          <div>
            <textarea
              {...register("description")}
              className="mt-1 shadow-sm resize-none w-full rounded-md border-gray-300 focus:ring-orange-500 focus:border-orange-500"
              rows={4}
            />
          </div>
        </div>
        <button className="w-full bg-orange-500 hover:gb-orange-600 text-white py-2 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none">
          {loading ? "loading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
