import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
    body: { comment },
  } = req;
  const post = await client.post.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      id: true,
    },
  });

  if (!post) return res.status(404).end();

  const newComment = await client.comment.create({
    data: {
      user: {
        connect: {
          id: user?.id,
        },
      },
      post: {
        connect: {
          id: Number(id),
        },
      },
      comment,
    },
  });
  res.json({ ok: true, comment: newComment });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
