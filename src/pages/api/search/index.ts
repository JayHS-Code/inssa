import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { keyword },
  } = req;

  const users = await client.user.findMany({
    where: {
      nickname: keyword?.toString(),
    },
  });

  return res.json({ ok: true, result: users });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
