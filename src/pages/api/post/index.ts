import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user } = req.session;
  const posts = await client.post.findMany({
    include: {
      user: {
        select: {
          avatar: true,
          nickname: true,
        },
      },
      Fav: {
        where: {
          userId: user?.id,
        },
      },
    },
  });

  return res.json({ ok: true, posts });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
