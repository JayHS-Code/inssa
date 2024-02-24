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
      leaveUser: true,
      chat: {
        include: {
          user: true,
        },
      },
    },
  });

  const userValid = room?.user.some((data) => data?.id === user?.id);
  if (!userValid) return res.status(401).json({ ok: false });

  res.status(201).json({ ok: true, room });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
