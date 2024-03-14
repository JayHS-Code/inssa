import Error from "@/components/common/error";
import {
  IconChevronLeft,
  IconChevronRight,
  IconPhoto,
  IconPlusCircle,
  IconXCircle,
} from "@/components/svg";
import useFetch from "@/libs/client/useFetch";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useS3Upload } from "next-s3-upload";
import useUser from "@/libs/client/useUser";
import useSWR from "swr";

interface uploadForm {
  description?: string;
  title?: string;
  uploadFiles: FileList;
  urls: string;
  s3FolderId: string;
  fileType: string;
}

export default function EditPost() {
  const { user } = useUser();
  const router = useRouter();
  const { data: postData } = useSWR(
    `${router?.query?.id ? `/api/post/${router.query.id}` : null}`
  );
  console.log(postData);
  const { uploadToS3 } = useS3Upload();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
  } = useForm<uploadForm>();
  const [useApi, { loading, data }] = useFetch(
    `${router?.query?.id ? `/api/post/${router.query.id}/edit` : null}`
  );
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [fileType, setFileType] = useState<"image" | "video">("image");
  const [previews, setPreviews] = useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  useEffect(() => {
    if (data?.ok) {
      fileType === "image"
        ? router.push(`/p/${router.query.id}`)
        : router.push(`/v/${router.query.id}`);
    }
  }, [data, router]);
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
        const videoUrl = URL.createObjectURL(videoFile[0]);
        setPreviews([videoUrl]);
        setFileType("video");
      } else {
        const arr = Array.from(uploadFiles).map((file) =>
          URL.createObjectURL(file)
        );
        setPreviews([...previews, ...arr]);
        setFileType("image");
      }
    }
  }, [uploadFiles]);
  useEffect(() => {
    if (postData) {
      const previewUrls = postData?.post?.url.split(" ");
      setPreviews(previewUrls);
    }

    if (postData?.post?.description)
      setValue("description", postData?.post?.description);

    if (postData?.post?.title) setValue("title", postData?.post?.title);
  }, [postData]);
  const onPrevClick = (e: React.MouseEvent) => {
    if (previewIndex === 0) {
      setPreviewIndex(previews.length - 1);
    } else {
      setPreviewIndex((current) => current - 1);
    }
  };
  const onNextClick = (e: React.MouseEvent) => {
    if (previewIndex === previews.length - 1) {
      setPreviewIndex(0);
    } else {
      setPreviewIndex((current) => current + 1);
    }
  };
  const onAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length) {
      setUploadFiles([...uploadFiles, ...Array.from(files)]);
    }
  };
  const onDelClick = (e: React.MouseEvent) => {
    const cuttingUrl = previews.splice(previewIndex, 1);
    setPreviews([...previews]);

    if (cuttingUrl.toString().startsWith("blob:")) {
      const delIdx =
        previewIndex - Math.abs(previews.length - uploadFiles.length + 1);
      uploadFiles.splice(delIdx, 1);
    }

    if (uploadFiles.length && previewIndex > uploadFiles.length - 1) {
      setPreviewIndex(previewIndex - 1);
    }
  };
  const onChangeFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length) {
      setUploadFiles(Array.from(files));
    }
  };
  const onValid = async (form: uploadForm) => {
    if (loading) return;

    if (uploadFiles.length) {
      const urls = await Promise.all(
        Array.from(uploadFiles).map(async (file) => {
          const { url } = await uploadToS3(file, {
            endpoint: {
              request: {
                body: {
                  userId: user?.id,
                  s3FolderId: postData?.post?.s3FolderId,
                },
              },
            },
          });
          return url;
        })
      );

      const awsUrls = previews.slice(0, previews.length - uploadFiles.length);
      form.urls = awsUrls.join(" ") + urls.join(" ");
    }

    form.fileType = fileType;

    useApi(form);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onValid)}>
        {!previews.length ? (
          <div>
            <label className="w-full h-48 cursor-pointer text-gray-600 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md hover:text-orange-500 hover:border-orange-500">
              <IconPhoto cls="h-12 w-12" />
              <input
                {...register("uploadFiles", {
                  onChange: onChangeFiles,
                })}
                className="hidden"
                type="file"
                accept="image/*, video/*"
                multiple
              />
            </label>
          </div>
        ) : (
          <div>
            {fileType === "image" ? (
              <div className="relative flex flex-col justify-center bg-black">
                <img
                  src={previews[previewIndex]}
                  className="w-full h-128 object-contain"
                />
                {previews.length > 1 ? (
                  <div
                    onClick={onPrevClick}
                    className="absolute text-white cursor-pointer"
                  >
                    <IconChevronLeft />
                  </div>
                ) : null}
                {previews.length > 1 ? (
                  <div
                    onClick={onNextClick}
                    className="absolute right-0 text-white cursor-pointer"
                  >
                    <IconChevronRight />
                  </div>
                ) : null}
                <div
                  onClick={onDelClick}
                  className="absolute top-0 right-0 mt-3 mr-3 text-white cursor-pointer"
                >
                  <IconXCircle />
                </div>
                <label className="absolute bottom-0 right-0 mb-3 mr-3 w-10 h-10 cursor-pointer rounded-full text-gray-600 flex items-center justify-center border-gray-300 hover:text-orange-500 hover:border-orange-500">
                  <IconPlusCircle cls="h-12 w-12" />
                  <input
                    {...register("uploadFiles", {
                      onChange: onAddFiles,
                    })}
                    className="hidden"
                    type="file"
                    accept="image/*"
                    multiple
                  />
                </label>
              </div>
            ) : (
              <div className="relative flex flex-col justify-center bg-black">
                <video src={previews[0]} controls />
                <div
                  onClick={onDelClick}
                  className="absolute top-0 right-0 mt-3 mr-3 text-white cursor-pointer"
                >
                  <IconXCircle />
                </div>
              </div>
            )}
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
          {loading ? "loading..." : "Edit"}
        </button>
      </form>
    </div>
  );
}
