import { prisma } from "@/db/index.js";
import { WsServiceResult } from "@/ws/types/service.js";

export const deleteMessage = async ({
  messageId,
}: {
  messageId: string;
}): Promise<WsServiceResult> => {
  try {
    const deletedMessage = await prisma.message.delete({
      where: {
        id: messageId,
      },
    });
    return {
      success: true,
      data: deletedMessage,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};
