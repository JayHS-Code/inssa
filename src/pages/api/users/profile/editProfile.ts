import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    session: { user },
    body: { nickname, description, website, phone, email, avatar },
  } = req;

  const currentUser = await client.user.findUnique({
    where: {
      id: user?.id,
    },
    select: {
      phone: true,
      email: true,
      avatar: true,
    },
  });

  if (phone && phone !== currentUser?.phone) {
    const exists = Boolean(
      await client.user.findUnique({
        where: {
          phone: phone,
          AND: {
            phone: {
              not: currentUser?.phone,
            },
          },
        },
      })
    );

    if (exists)
      return res.json({
        ok: false,
        error: "This is a registered phone number",
      });
  }

  if (email && email !== currentUser?.email) {
    const exists = Boolean(
      await client.user.findUnique({
        where: {
          email: email,
          AND: {
            email: {
              not: currentUser?.email,
            },
          },
        },
      })
    );

    if (exists)
      return res.json({
        ok: false,
        error: "This is a registered email",
      });
  }

  await client.user.update({
    where: {
      id: user?.id,
    },
    data: {
      nickname,
      description,
      website,
      ...(phone ? { phone } : { email }),
      avatar: avatar.length ? avatar : currentUser?.avatar,
    },
  });
  return res.json({ ok: true });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
