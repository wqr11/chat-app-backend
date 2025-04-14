import { ChatRepository } from "@/repository/chat/index.js";
import { IChat } from "@/ws/types/db.js";

export type WsCreateChatResult =
  | {
      success: true;
      data: IChat;
    }
  | {
      success: false;
      error: unknown;
    };

export const createChat = async ({
  name,
  userId,
}: {
  name?: string;
  userId: string;
}): Promise<WsCreateChatResult> => {
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
