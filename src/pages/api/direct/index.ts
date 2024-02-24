import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { NextApiRequest } from "next";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: any) {
  const {
    session: { user },
  } = req;

  const room = await client.room.findMany({
    where: {
      user: {
        some: {
          id: user?.id,
        },
      },
      NOT: {
        leaveUser: {
          some: {
            id: user?.id,
          },
        },
      },
    },
    include: {
      user: true,
      leaveUser: true,
      chat: {
        include: {
          user: true,
        },
        orderBy: {
          id: "desc",
        },
        take: 1,
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
