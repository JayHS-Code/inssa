import { PrismaClient } from "@prisma/client";

// 왜 var 만 사용해야 오류가 안 나는지.
// interface 해도 왜 오류가 나는지.
declare global {
  var client: PrismaClient | undefined;
}

const client = global.client || new PrismaClient();

if (process.env.NODE_ENV === "development") global.client = client;

export default client;
