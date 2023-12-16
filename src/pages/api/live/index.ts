import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const lives = await client.live.findMany({});

  res.json({ ok: true, lives });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
