import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { NextApiRequest } from "next";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: any) {
  const {
    body: { postOwner },
    session: { user },
  } = req;

  const room = await client.room.findFirst({
    where: {
      /*
      users: users,
      AND: {
        chatInvisibleTo: null,
        active: true,
      },
      */
      user: {
        every: {
          id: {
            in: [user?.id, postOwner],
          },
        },
      },
    },
    include: {
      user: true,
    },
  });

  if (!room) {
    const randomStr = Math.random().toString(36).substring(2, 12);
    const uniqueStr = new Date().getTime().toString(36);

    const roomId = randomStr + uniqueStr;

    const createRoom = await client.room.create({
      data: {
        roomId,
        user: {
          connect: [{ id: user?.id }, { id: postOwner }],
        },
      },
    });

    await client.user.update({
      where: {
        id: user?.id,
      },
      data: {
        Room: {
          connect: {
            id: createRoom?.id,
          },
        },
      },
    });

    await client.user.update({
      where: {
        id: postOwner,
      },
      data: {
        Room: {
          connect: {
            id: createRoom?.id,
          },
        },
      },
    });

    return res.status(201).json({ ok: true, roomId: createRoom?.roomId });
  }

  res.status(201).json({ ok: true, roomId: room?.roomId });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
