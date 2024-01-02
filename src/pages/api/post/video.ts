import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const videos = await client.post.findMany({
    where: {
      AND: {
        fileType: "video",
      },
    },
    include: {
      user: {
        select: {
          avatar: true,
          nickname: true,
        },
      },
    },
  });

  return res.json({ ok: true, videos });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
