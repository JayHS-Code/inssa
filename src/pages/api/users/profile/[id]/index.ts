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
    select: {
      id: true,
      email: true,
      phone: true,
      nickname: true,
      avatar: true,
      description: true,
      website: true,
      createdAt: true,
      Post: {
        where: {
          fileType: "image",
        },
        select: {
          id: true,
          url: true,
          fileType: true,
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
