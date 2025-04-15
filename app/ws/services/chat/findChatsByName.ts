import { ChatRepository } from "@/repository/chat/index.js";
import { WsServiceResult } from "@/ws/types/service.js";

export const findChatsByName = async ({
  search,
}: {
  search?: string;
}): Promise<WsServiceResult> => {
  try {
    const chats = await ChatRepository.findChatsByName({ search });

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
