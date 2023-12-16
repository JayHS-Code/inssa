import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    session: { user },
    body: { title, description },
  } = req;

  const {
    result: {
      uid,
      rtmps: { streamKey, url },
    },
  } = await (
    await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ID}/stream/live_inputs`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CF_LIVE_TOKEN}`,
        },
        body: `{"meta": {"name":"${title}"},"recording": { "mode": "automatic"}}`,
      }
    )
  ).json();

  const live = await client.live.create({
    data: {
      title,
      description,
      cloudflareId: uid,
      cloudflareKey: streamKey,
      cloudflareUrl: url,
      user: {
        connect: {
          id: user?.id,
        },
      },
    },
  });

  res.json({ ok: true, live });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
