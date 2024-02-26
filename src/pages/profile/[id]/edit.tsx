import Img from "@/components/img";
import { IconExclamationCircle } from "@/components/svg";
import useFetch from "@/libs/client/useFetch";
import useUser from "@/libs/client/useUser";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface EditProfileForm {
  nickname: string;
  description?: string;
  website?: string;
  phone?: string;
  email?: string;
  avatar?: FileList;
  formError: string;
}

export default function EditProfile() {
  const { user } = useUser();
  const [editButton, setEditButton] = useState(false);
  const [preview, setPreview] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
    watch,
  } = useForm<EditProfileForm>();
  const [useApi, { data, loading }] = useFetch(
    `/api/users/profile/editProfile`
  );
  useEffect(() => {
    if (user?.nickname) setValue("nickname", user?.nickname);
    if (user?.description) setValue("description", user?.description);
    if (user?.website) setValue("website", user?.website);
    if (user?.email) setValue("email", user?.email);
    if (user?.phone) setValue("phone", user?.phone);
  }, [user]);
  useEffect(() => {
    if (!data?.ok && data?.error) {
      setError("formError", { message: data.error });
    }
  }, [data, setError]);
  const avatar = watch("avatar");
  useEffect(() => {
    if (avatar && avatar?.length > 0) {
      const file = avatar[0];
      setPreview(URL.createObjectURL(file));
    }
  }, [avatar]);
  const onValid = async (form: EditProfileForm) => {
    if (loading) return;

    if (!editButton) {
      delete form.phone;
      delete form.email;
    }

    if (avatar && avatar.length > 0) {
      const { uploadURL } = await (await fetch(`/api/files`)).json();
      const data = new FormData();
      data.append("file", avatar[0], user.id);
      const {
        result: { id },
      } = await (
        await fetch(uploadURL, {
          method: "POST",
          body: data,
        })
      ).json();

      form.avatar = id;
    }

    useApi(form);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onValid)}>
        <div className="flex justify-center items-center">
          <label htmlFor="picture" className="cursor-pointer rounded-full">
            <Img
              url={user?.avatar}
              preview={preview}
              cls={"w-36 h-36 rounded-full bg-slate-500 object-cover"}
            />
            <input
              {...register("avatar")}
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <div className="space-y-1">
          <label
            htmlFor="nickname"
            className="text-sm font-medium text-gray-700"
          >
            nickname
          </label>
          <input
            {...register("nickname", { required: true })}
            id="nickname"
            type="text"
            className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>
        <div className="space-y-1">
          <label
            htmlFor="description"
            className="text-sm font-medium text-gray-700"
          >
            description
          </label>
          <textarea
            {...register("description")}
            id="description"
            className="appearance-none mt-2 shadow-sm resize-none w-full rounded-md border-gray-300 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        <div className="space-y-1">
          <label
            htmlFor="website"
            className="text-sm font-medium text-gray-700"
          >
            website
          </label>
          <input
            {...register("website")}
            id="website"
            type="text"
            className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        {user?.email ? (
          <div className="space-y-1">
            <div className="flex justify-between">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <button
                onClick={() => setEditButton((prev) => !prev)}
                className="text-sm font-bold text-red-500"
              >
                수정
              </button>
            </div>
            <input
              id="email"
              type="email"
              className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
        ) : null}
        {user?.phone ? (
          <div className="space-y-1">
            <div className="flex justify-between">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700"
              >
                Phone number
              </label>
              <button
                onClick={() => setEditButton((prev) => !prev)}
                className="text-sm font-bold text-red-500"
              >
                수정
              </button>
            </div>
            <div className="flex rounded-md shadow-sm">
              <span className="flex items-center justify-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 select-none text-sm">
                +82
              </span>
              <input
                disabled={editButton ? false : true}
                {...register("phone")}
                id="input"
                type="number"
                className={`appearance-none w-full px-3 py-2 border border-gray-300 rounded-md rounded-l-none shadow-sm ${
                  editButton
                    ? "placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    : "text-gray-400"
                }`}
                required
              />
            </div>
          </div>
        ) : null}
        {errors?.formError ? (
          <div className="mt-3 flex items-center">
            <IconExclamationCircle cls="w-6 h-6 text-red-500" />
            <span className="ml-1 text-sm text-red-500">
              {errors?.formError?.message}
            </span>
          </div>
        ) : null}
        <button className="mt-5 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none ">
          Update profile
        </button>
      </form>
    </div>
  );
}
