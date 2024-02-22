import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { NextApiRequest } from "next";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: any) {
  const { message, roomId, roomActive } = req.body;
  const {
    session: { user },
  } = req;

  if (!roomActive) {
    await client.room.update({
      where: {
        id: roomId,
      },
      data: {
        active: true,
      },
    });
  }

  const chat = await client.chat.create({
    data: {
      message: message,
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
    include: {
      user: true,
    },
  });

  res.socket.server.io.emit("message", chat);

  res.status(201).json({ ok: true, message: chat });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
