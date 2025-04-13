import { createClient } from "redis";
import { PrismaClient } from "@/generated/prisma/client.js";
import { REDIS_URL } from "@/config/index.js";

export const redis = await createClient({
  url: REDIS_URL,
}).connect();

export const prisma = new PrismaClient();

await prisma.$connect();
