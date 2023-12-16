import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
  } = req;
  const post = await client.post.update({
    where: {
      id: Number(id),
    },
    data: {
      views: {
        increment: 1,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          nickname: true,
          avatar: true,
        },
      },
    },
  });
  const relatedPost = await client.post.findMany({
    where: {
      userId: Number(post?.user?.id),
      AND: {
        id: {
          not: Number(id),
        },
      },
    },
    take: 6,
    skip: 0,
  });
  const isLiked = Boolean(
    await client.fav.findFirst({
      where: {
        postId: post?.id,
        userId: user?.id,
      },
      select: {
        id: true,
      },
    })
  );
  const comment = await client.comment.findMany({
    where: {
      postId: Number(id),
    },
    include: {
      user: {
        select: {
          id: true,
          nickname: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  res.json({ ok: true, post, relatedPost, isLiked, comment });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
