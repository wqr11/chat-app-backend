import { ChatRepository } from "@/repository/chat/index.js";
import { WsServiceResult } from "@/ws/types/service.js";

export const getChats = async ({
  userId,
}: {
  userId: string;
}): Promise<WsServiceResult> => {
  try {
    const chats = await ChatRepository.findChatsForUser({
      userId,
    });
    return {
      success: true,
      data: chats,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};
