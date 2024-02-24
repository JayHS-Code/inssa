import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { NextApiRequest } from "next";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: any) {
  const {
    session: { user },
    body: { roomId },
  } = req;

  /*
  await client.user.update({
    where: {
      id: user?.id,
    },
    data: {
      Room: {
        disconnect: {
          id: roomId,
        },
      },
    },
  });*/

  await client.room.update({
    where: {
      id: roomId,
    },
    data: {
      leaveUser: {
        connect: {
          id: user?.id,
        },
      },
    },
  });

  /*
  await client.chat.create({
    data: {
      message: `상대방이 채팅방을 나갔습니다.`,
      notification: true,
      user: {
        connect: {
          id: user?.id,
        },
      },
      room: {
        connect: {
          id: roomId,
        },
      },
    },
  });*/

  res.status(201).json({ ok: true });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
