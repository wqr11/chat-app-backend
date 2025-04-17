import { prisma } from "@/db/index.js";

export class ChatRepository {
  static async createChat({ name, userId }: { name?: string; userId: string }) {
    const chat = await prisma.chat.create({
      data: {
        name,
        users: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        users: {
          omit: {
            password: true,
          },
        },
        messages: true,
      },
    });
    return chat;
  }
  static async findChatsForUser({ userId }: { userId: string }) {
    const chats = await prisma.chat.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        messages: {
          include: {
            author: {
              omit: {
                password: true,
              },
            },
          },
          omit: {
            authorId: true,
          },
        },
        users: {
          omit: {
            password: true,
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
  static async getChatMessages({
    chatId,
    userId,
  }: {
    chatId: string;
    userId: string;
  }) {
    const chats = await prisma.message.findMany({
      where: {
        chat: {
          id: chatId,
          users: {
            some: {
              id: userId,
            },
          },
        },
      },
    });
    return chats;
  }

  static async findAvailableChatsByName({
    search,
    userId,
  }: {
    search?: string;
    userId: string;
  }) {
    return await prisma.chat.findMany({
      where: {
        users: {
          none: {
            id: userId,
          },
        },
        ...(search && {
          AND: {
            name: {
              contains: search,
            },
          },
        }),
      },
    });
  }

  static async addUserToChat({
    userId,
    chatId,
  }: {
    userId: string;
    chatId: string;
  }) {
    return await prisma.chat.update({
      data: {
        users: {
          connect: {
            id: userId,
          },
        },
      },
      where: {
        id: chatId,
        users: {
          none: {
            id: userId,
          },
        },
      },
    });
  }
}
