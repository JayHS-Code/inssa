import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { session } = req;

  session.destroy();

  return res.json({ ok: true });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
