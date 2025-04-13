import { ChatRepository } from "@/repository/chat/index.js";
import { ServiceResult } from "@/types/index.js";

export const getChats = async ({
  userEmail,
}: {
  userEmail: string;
}): Promise<ServiceResult> => {
  try {
    const chats = await ChatRepository.findChatsForUser({
      email: userEmail,
    });
    return {
      success: true,
      code: 200,
      data: chats,
    };
  } catch (error) {
    return {
      success: false,
      code: 500,
      data: error,
    };
  }
};
