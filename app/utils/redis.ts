import { redis } from "@/db/index.js";
import { JWT_ACCESS_EX } from "@/config/index.js";

export class RedisUtils {
  static async setEmailToken({
    email,
    token,
  }: {
    email: string;
    token: string;
  }) {
    return await redis.set(email, token, {
      EX: JWT_ACCESS_EX,
    });
  }
  static async deleteEmailToken({ email }: { email: string }) {
    return await redis.del(email);
  }
  static async getEmailToken({ email }: { email: string }) {
    return await redis.get(email);
  }
}
