import { ChatRepository } from "@/repository/chat/index.js";
import { WsServiceResult } from "@/ws/types/service.js";

export const addUserToChat = async ({
  userId,
  chatId,
}: {
  userId: string;
  chatId: string;
}): Promise<WsServiceResult> => {
  try {
    const updatedChat = await ChatRepository.addUserToChat({ chatId, userId });

    return {
      success: true,
      data: updatedChat,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};
