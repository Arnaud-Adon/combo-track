import { Prisma, PrismaClient } from "../../generated/prisma";

export { Prisma };

const prismaClientSingleton = () => new PrismaClient();

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
