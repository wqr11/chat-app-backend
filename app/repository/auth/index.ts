import { prisma } from "@/db/index.js";
import { Role, User } from "@/generated/prisma/index.js";

export class AuthRepository {
  static async checkIfuserEmailExists(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return !!user;
  }

  static async findUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  static async createUser({
    email,
    password,
    role,
  }: {
    email: string;
    password: string;
    role?: Role;
  }) {
    const user = await prisma.user.create({
      data: {
        email,
        password,
        ...(role && {
          role,
        }),
      },
    });
    return user;
  }
}
