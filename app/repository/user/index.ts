import { prisma } from "@/db/index.js";

export class UserRepository {
  static async getUserData({ userId }: { userId: string }) {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }
}
