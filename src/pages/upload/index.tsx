import Error from "@/components/common/error";
import {
  IconArrowLeft,
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
import dynamic from "next/dynamic";
const MainMenu = dynamic(() => import("../../components/common/mainMenu"), {
  ssr: false,
});

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
    formState: { errors },
    setError,
  } = useForm<uploadForm>();
  const [useApi, { loading, data }] = useFetch("/api/upload");
  useEffect(() => {
    if (data?.ok) {
      router.push(`/`);
    }
  }, [data, router]);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [fileType, setFileType] = useState<UploadFilesType>("image");
  const [previews, setPreviews] = useState<PreviewType[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
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
        setPreviews([...arr]);
        setFileType("image");
      }
    }
  }, [uploadFiles]);
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
    previews.splice(previewIndex, 1);
    setPreviews([...previews]);

    uploadFiles.splice(previewIndex, 1);

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
      <MainMenu />
      <div className="mb-5 inset-x-0 top-0 flex justify-center bg-white z-0">
        <div className="max-w-133 w-full h-10 flex justify-between items-center">
          <div
            onClick={() => router.back()}
            className="flex justify-center gap-5 cursor-pointer"
          >
            <IconArrowLeft />
            <span>업로드</span>
          </div>
        </div>
      </div>
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
                {uploadFiles.length > 1 ? (
                  <div
                    onClick={onPrevClick}
                    className="absolute text-white cursor-pointer"
                  >
                    <IconChevronLeft />
                  </div>
                ) : null}
                {uploadFiles.length > 1 ? (
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
          {loading ? "loading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
