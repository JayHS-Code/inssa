import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
  } = req;

  const profile = await client.user.findFirst({
    where: {
      nickname: id?.toString(),
    },
    include: {
      Fav: {
        include: {
          post: {
            select: {
              id: true,
              url: true,
              fileType: true,
            },
          },
        },
      },
    },
  });

  return res.json({ ok: true, profile });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
