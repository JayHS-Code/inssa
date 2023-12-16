import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
  } = req;

  const live = await client.live.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      message: {
        select: {
          id: true,
          message: true,
          user: {
            select: {
              avatar: true,
              id: true,
            },
          },
        },
      },
    },
  });

  const isOwner = live?.userId === user?.id;

  const notOwnedLive = await client.live.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      id: true,
      title: true,
      description: true,
      userId: true,
      cloudflareId: true,
      createdAt: true,
      updateAt: true,
      message: {
        select: {
          id: true,
          message: true,
          user: {
            select: {
              avatar: true,
              id: true,
            },
          },
        },
      },
    },
  });

  /* delete 연산자 에러
  const isOwner = live?.userId === user?.id;
  if (live && !isOwner) {
    // delete live?.cloudflareKey
    // key 랑 Url 을 삭제
  }
*/
  res.json({ ok: true, live: isOwner ? live : notOwnedLive });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
