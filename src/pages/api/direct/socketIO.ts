import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";

export default async (req: NextApiRequest, res: any) => {
  if (!res.socket.server.io) {
    console.log("New Socket.io server...✅");

    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: "/api/direct/socketIO",
    });

    res.socket.server.io = io;
  }

  res.end();
};
