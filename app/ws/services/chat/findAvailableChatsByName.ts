import { ChatRepository } from "@/repository/chat/index.js";
import { WsServiceResult } from "@/ws/types/service.js";

export const findAvailableChatsByName = async ({
  search,
  userId,
}: {
  search?: string;
  userId: string;
}): Promise<WsServiceResult> => {
  try {
    const chats = await ChatRepository.findAvailableChatsByName({
      search,
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
