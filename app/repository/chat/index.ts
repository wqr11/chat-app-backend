import { prisma } from "@/db/index.js";

export class ChatRepository {
  static async createChat({ name, email }: { name: string; email: string }) {
    const chat = await prisma.chat.create({
      data: {
        name,
        users: {
          connect: {
            email,
          },
        },
      },
    });
    return chat;
  }
  static async findChatsForUser({ email }: { email: string }) {
    const chats = await prisma.chat.findMany({
      where: {
        users: {
          some: {
            email,
          },
        },
      },
    });
    return chats;
  }
  static async deleteChat({ chatId }: { chatId: string }) {
    const chat = await prisma.chat.delete({
      where: {
        id: chatId,
      },
    });
    return chat;
  }
  static async patchChat({
    name,
    chatId,
    email,
  }: {
    name: string;
    chatId: string;
    email: string;
  }) {
    const chat = await prisma.chat.update({
      where: {
        id: chatId,
        users: {
          some: {
            email,
          },
        },
      },
      data: {
        name,
      },
    });
    return chat;
  }
}
