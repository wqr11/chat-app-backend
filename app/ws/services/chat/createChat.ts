import { ChatRepository } from "@/repository/chat/index.js";
import { WsServiceResult } from "@/ws/types/service.js";

export const createChat = async ({
  name,
  userId,
}: {
  name?: string;
  userId: string;
}): Promise<WsServiceResult> => {
  try {
    const chat = await ChatRepository.createChat({
      name,
      userId,
    });

    return {
      success: true,
      data: chat,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};
