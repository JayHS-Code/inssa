import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
  } = req;

  const post = await client.post.findUnique({
    where: {
      id: Number(id),
    },
  });

  res.json({ ok: true, post });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
