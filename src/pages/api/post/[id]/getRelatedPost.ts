import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id, page },
  } = req;

  const post = await client.post.findFirst({
    where: {
      id: Number(id),
    },
    select: {
      user: {
        select: {
          id: true,
        },
      },
    },
  });

  const relatedPost = await client.user.findMany({
    where: {
      id: Number(post?.user?.id),
      AND: {
        id: {
          not: Number(id),
        },
      },
    },
    select: {
      Post: {
        where: {
          NOT: {
            id: Number(id),
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          url: true,
          fileType: true,
        },
        take: 4,
        skip: Number(page) * 4,
      },
    },
  });

  res.json({ ok: true, relatedPost: relatedPost[0].Post });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
