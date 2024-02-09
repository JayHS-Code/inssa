import Message from "@/components/message";
import useFetch from "@/libs/client/useFetch";
import useUser from "@/libs/client/useUser";
import { Chat, Room, User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import io from "socket.io-client";
import useSWR from "swr";

type MessageWithUser = Chat & {
  user: User;
};

export default function DirectRoom() {
  const router = useRouter();
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

  const onValid = (form: any) => {
    if (loading) return;
    form.roomId = data?.room?.id;
    useApi(form);
    reset();
  };

  return (
    <div className="relative">
      <div>
        {messages.length
          ? messages.map((message, idx) => (
              <Message
                key={idx}
                message={message.message}
                reversed={message?.user?.id === user?.id}
              />
            ))
          : null}
      </div>
      <div className="fixed inset-x-0 bottom-0">
        <form
          className="relative flex items-center max-w-133 w-full mx-auto"
          onSubmit={handleSubmit(onValid)}
        >
          <textarea
            className="w-full"
            {...register("message", { required: true })}
          />
          <button className="">전송</button>
        </form>
      </div>
    </div>
  );
}
