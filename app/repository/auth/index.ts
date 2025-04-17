import { prisma } from "@/db/index.js";
import { Role, User } from "@/generated/prisma/index.js";

export class AuthRepository {
  static async checkIfUserEmailExists(email: string) {
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

  static async findUserById(userId: string) {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  static async createUser({
    name,
    email,
    password,
    role,
  }: {
    name: string;
    email: string;
    password: string;
    role?: Role;
  }) {
    const user = await prisma.user.create({
      data: {
        name,
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
