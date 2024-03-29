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
      _count: {
        select: {
          Post: true,
        },
      },
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
        skip: 0,
      },
    },
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

  res.json({ ok: true, post, relatedPost: relatedPost[0], isLiked, comment });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
