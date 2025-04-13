import { ChatRepository } from "@/repository/chat/index.js";
import { NotFoundError } from "@/types/errors.js";
import { ServiceResult } from "@/types/index.js";

export const getChatMessages = async ({
  chatId,
  userEmail,
}: {
  chatId: string;
  userEmail: string;
}): Promise<ServiceResult> => {
  try {
    const messages = await ChatRepository.getChatMessages({
      chatId,
      email: userEmail,
    });

    return {
      success: true,
      code: 200,
      data: messages,
    };
  } catch (err) {
    return {
      success: false,
      code: 404,
      data: new NotFoundError("Chat with specified ID was NOT found"),
    };
  }
};
