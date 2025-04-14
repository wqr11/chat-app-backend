import { MessageRepository } from "@/repository/message/index.js";
import { WsServiceResult } from "@/ws/types/index.js";

export const createMessage = async ({
  content,
  chatId,
  userId,
}: {
  content: string;
  chatId: string;
  userId: string;
}): Promise<WsServiceResult> => {
  try {
    const createdMessage = await MessageRepository.createMessage({
      content,
      chatId,
      userId,
    });
    return {
      success: true,
      data: createdMessage,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};
