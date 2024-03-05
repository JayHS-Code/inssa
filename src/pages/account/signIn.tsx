import { IconExclamationCircle } from "@/components/svg";
import useFetch from "@/libs/client/useFetch";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface SignForm {
  email?: string;
  phone?: string;
  token: string;
}

export default function signIn() {
  const router = useRouter();
  const [useApi, { loading, data, error }] = useFetch("/api/users/signIn");
  const { register, handleSubmit, reset } = useForm<SignForm>();
  const [method, setMethod] = useState<"email" | "phone">("email");
  const onEmailClick = () => {
    reset();
    setMethod("email");
  };
  const onPhoneClick = () => {
    reset();
    setMethod("phone");
  };
  const onValid = (data: SignForm) => {
    useApi(data);
  };
  useEffect(() => {
    if (data?.tokenAccess && !loading) {
      router.push("/");
    }
  }, [data, loading, router]);
  return (
    <div className="mt-16 px-4">
      <h3 className="text-3xl font-bold text-center">Inssa</h3>
      <div className="mt-8">
        <div className="flex flex-col items-center">
          <h5 className="text-sm text-gray-500 font-medium">Enter using:</h5>
          <div className="mt-8 w-full border-b grid grid-cols-2 gap-16">
            <button
              className={`pb-4 border-b-2 font-medium ${
                method === "email"
                  ? "border-orange-500 text-orange-400"
                  : "border-transparent text-gray-500"
              }`}
              onClick={onEmailClick}
            >
              Email address
            </button>
            <button
              className={`pb-4 border-b-2 font-medium ${
                method === "phone"
                  ? "border-orange-500 text-orange-400"
                  : "border-transparent text-gray-500"
              }`}
              onClick={onPhoneClick}
            >
              Phone number
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit(onValid)} className="flex flex-col mt-8">
          <label className="text-sm font-medium text-gray-700">
            {method === "email" ? "Email address" : null}
            {method === "phone" ? "Phone number" : null}
          </label>
          <div className="mt-1">
            {method === "email" ? (
              <input
                type="email"
                {...register("email", { required: true })}
                className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            ) : null}
            {method === "phone" ? (
              <div className="flex rounded-md shadow-sm">
                <span className="flex items-center justify-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 select-none text-sm">
                  +82
                </span>
                <input
                  type="number"
                  {...register("phone", { required: true })}
                  className="appearance-none rounded-l-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            ) : null}
          </div>
          {data?.ok ? (
            <div className="mt-3">
              <label className="text-sm font-medium text-gray-700">
                Confirmation Token
              </label>
              <input
                type="text"
                {...register("token", { required: true })}
                className="mt-1 appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          ) : data?.invalidToken ? (
            <div className="mt-3">
              <label className="text-sm font-medium text-gray-700">
                Confirmation Token
              </label>
              <input
                type="text"
                {...register("token", { required: true })}
                className="mt-1 appearance-none w-full px-3 py-2 border border-red-500 ring-1 ring-red-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
              <div className="mt-3 flex items-center">
                <IconExclamationCircle cls="w-6 h-6 text-red-500" />
                <span className="ml-1 text-sm text-red-500">Invalid Token</span>
              </div>
            </div>
          ) : null}
          <button className="mt-5 bg-orange-500 hover:gb-orange-600 text-white py-2 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none">
            {loading
              ? "Loading..."
              : method === "email"
              ? "Get login link"
              : "Get one-time password"}
          </button>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute w-full border-t border-gray-300" />
            <div className="relative -top-3 text-center">
              <span className="bg-white px-2 text-sm text-gray-500">
                Or enter with
              </span>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <button className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </button>
            <button className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
