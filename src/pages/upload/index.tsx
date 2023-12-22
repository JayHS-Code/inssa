import Error from "@/components/error";
import { IconPhoto } from "@/components/svg";
import useFetch from "@/libs/client/useFetch";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useS3Upload } from "next-s3-upload";
import useUser from "@/libs/client/useUser";

interface uploadForm {
  description?: string;
  title?: string;
  uploadFiles: FileList;
  urls: string;
  s3FolderId: string;
  fileType: string;
}

type PreviewType = string;
type UploadFilesType = "image" | "video";

export default function Upload() {
  const { user } = useUser();
  const router = useRouter();
  const { uploadToS3 } = useS3Upload();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<uploadForm>();
  const [useApi, { loading, data }] = useFetch("/api/upload");
  useEffect(() => {
    if (data?.ok) {
      router.push(`/`);
    }
  }, [data, router]);
  const uploadFiles = watch("uploadFiles");
  const [fileType, setFileType] = useState<UploadFilesType>("image");
  const [previews, setPreviews] = useState<PreviewType[]>([]);
  useEffect(() => {
    if (uploadFiles && uploadFiles.length > 0) {
      const videoFile = Array.from(uploadFiles).filter(
        (file) => file.type === "video/mp4"
      );

      if (videoFile.length > 1) {
        return setError("uploadFiles", {
          message: "Only one video file can be uploaded",
        });
      }

      if (videoFile.length && videoFile.length !== uploadFiles.length) {
        return setError("uploadFiles", {
          message: "Video and image cannot be uploaded at the same time",
        });
      }

      if (videoFile.length) {
        setFileType("video");
        console.log(URL.createObjectURL(videoFile[0]));
      } else {
        setFileType("image");
        const arr = Array.from(uploadFiles).map((file) =>
          URL.createObjectURL(file)
        );
        setPreviews([...arr]);
      }
    }
  }, [uploadFiles]);
  const onValid = async (form: uploadForm) => {
    if (loading) return;

    const s3FolderId = new Date().getTime().toString(36);

    const urls = await Promise.all(
      Array.from(uploadFiles).map(async (file) => {
        const { url } = await uploadToS3(file, {
          endpoint: {
            request: {
              body: {
                userId: user?.id,
                s3FolderId,
              },
            },
          },
        });
        return url;
      })
    );

    form.s3FolderId = s3FolderId;
    form.urls = urls.join(" ");
    form.fileType = fileType;

    useApi(form);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onValid)}>
        {!previews.length ? (
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
        ) : (
          <div className="flex justify-center">
            {previews.map((preview, idx) => (
              <img key={idx} src={preview} />
            ))}
          </div>
        )}
        {errors?.uploadFiles?.message ? (
          <Error message={errors?.uploadFiles?.message} />
        ) : null}
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
