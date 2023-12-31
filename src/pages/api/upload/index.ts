import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    body: { description, title, urls, s3FolderId, fileType },
    session: { user },
  } = req;

  const post = await client.post.create({
    data: {
      description: description ? description : null,
      title: title ? title : null,
      url: urls,
      fileType,
      s3FolderId,
      user: {
        connect: {
          id: user?.id,
        },
      },
    },
  });

  return res.json({ ok: true, post });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
