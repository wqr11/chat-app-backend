import { redis } from "@/db/index.js";
import { JWT_ACCESS_EX } from "@/config/index.js";

export class RedisUtils {
  static async setUserIdToken({
    userId,
    token,
  }: {
    userId: string;
    token: string;
  }) {
    return await redis.set(userId, token, {
      EX: JWT_ACCESS_EX,
    });
  }
  static async deleteUserIdToken({ userId }: { userId: string }) {
    return await redis.del(userId);
  }
  static async getUserIdToken({ userId }: { userId: string }) {
    return await redis.get(userId);
  }
}
