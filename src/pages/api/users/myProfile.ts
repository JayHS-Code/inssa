import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";

/** 내 프로필 정보 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const profile = await client.user.findUnique({
    where: {
      id: req.session.user?.id,
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
