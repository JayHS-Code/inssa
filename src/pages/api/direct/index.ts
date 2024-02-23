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
          id: {
            in: [Number(user?.id)],
          },
        },
      },
      chat: {
        some: {
          notification: false,
        },
      },
    },
    include: {
      user: true,
      chat: {
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
