import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { NextApiRequest } from "next";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: any) {
  const {
    session: { user },
    query: { id },
  } = req;

  const room = await client.room.findFirst({
    where: {
      roomId: id?.toString(),
    },
    include: {
      user: true,
      chat: {
        include: {
          user: true,
        },
      },
    },
  });

  res.status(201).json({ ok: true, room });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
