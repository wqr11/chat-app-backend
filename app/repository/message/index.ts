import { prisma } from "@/db/index.js";

export class MessageRepository {
  static async createMessage({
    content,
    userId,
    chatId,
  }: {
    content: string;
    userId: string;
    chatId: string;
  }) {
    return await prisma.message.create({
      data: {
        content,
        authorId: userId,
        chatId,
      },
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
    });
  }
  static async deleteMessage({ messageId }: { messageId: string }) {
    return await prisma.message.delete({
      where: {
        id: messageId,
      },
    });
  }
}
