import Message from "@/components/message";
import {
  IconArrowLeft,
  IconArrowRightStartOnRectAngle,
  IconSolidPaperAirplane,
} from "@/components/svg";
import useFetch from "@/libs/client/useFetch";
import useUser from "@/libs/client/useUser";
import { Chat, User } from "@prisma/client";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import io from "socket.io-client";
import useSWR from "swr";

type MessageWithUser = Chat & {
  user: User;
};

export default function DirectRoom() {
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { user } = useUser();
  const { data } = useSWR(
    `${router.query.id ? `/api/direct/${router.query.id}/getMessage` : null}`
  );
  const { register, handleSubmit, reset } = useForm();
  const [useApi, { loading }] = useFetch(
    `${router.query.id ? `/api/direct/${router.query.id}/sendMessage` : null}`
  );
  const [messages, setMessages] = useState<MessageWithUser[]>([]);
  useEffect(() => {
    if (messages.length || data) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [messages, data]);
  useEffect(() => {
    if (data) {
      setMessages([...data?.room?.chat]);
    }
  }, [data]);
  useEffect((): any => {
    const socket = io(window.location.origin, {
      path: "/api/direct/socketIO",
    });

    socket.on("connect", () => {
      console.log("connected", socket);
    });

    socket.on("error", (error: any) => {
      console.log(error);
    });

    socket.on("message", (message: MessageWithUser) => {
      setMessages((prev) => [...prev, message]);
    });

    if (socket) return () => socket.disconnect();
  }, []);

  const pressEnterKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.shiftKey === false) {
      e.preventDefault();
      buttonRef?.current?.click();
      if (textareaRef.current) textareaRef.current.style.height = "40px";
    }
  };

  const changeHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  };

  const { ref, ...rest } = register("message", {
    required: true,
    onChange: changeHeight,
  });

  const onValid = (form: any) => {
    if (loading) return;
    form.roomId = data?.room?.id;
    useApi(form);
    reset();
  };

  return (
    <div className="relative">
      <div className="fixed inset-x-0 top-0 flex justify-center bg-white">
        <div className="max-w-133 w-full h-10 px-3 flex justify-between items-center">
          <div onClick={() => router.back()} className="cursor-pointer">
            <IconArrowLeft />
          </div>
          <div>
            {data?.room?.user[0]?.id === user?.id
              ? data?.room?.user[0].nickname
              : data?.room?.user[1].nickname}
          </div>
          <div className="cursor-pointer">
            <IconArrowRightStartOnRectAngle />
          </div>
        </div>
      </div>
      <div className="mt-5 -mb-6">
        {messages.length
          ? messages.map((message, idx) => (
              <Message
                key={idx}
                message={message.message}
                reversed={message?.user?.id === user?.id}
                avatar={message?.user?.avatar}
              />
            ))
          : null}
      </div>
      <div className="fixed inset-x-0 bottom-0">
        <form
          className="relative flex justify-end items-center max-w-133 w-full mx-auto"
          onSubmit={handleSubmit(onValid)}
        >
          <textarea
            rows={1}
            className="w-full max-h-20 mr-10 bg-slate-300 border-none resize-none"
            ref={(e) => {
              ref(e);
              textareaRef.current = e;
            }}
            {...rest}
            onKeyDown={pressEnterKey}
          />
          <button
            ref={buttonRef}
            className="absolute bg-black h-full flex items-center justify-center w-10 text-white"
          >
            <IconSolidPaperAirplane />
          </button>
        </form>
      </div>
    </div>
  );
}
