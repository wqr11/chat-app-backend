import { ChatRepository } from "@/repository/chat/index.js";
import { ServiceResult } from "@/http/types/service.js";

export const createChat = async ({
  name,
  userId,
}: {
  name?: string;
  userId: string;
}): Promise<ServiceResult> => {
  try {
    const chat = await ChatRepository.createChat({
      name,
      userId,
    });

    return {
      success: true,
      code: 201,
      data: chat,
    };
  } catch (err) {
    return {
      success: false,
      code: 500,
      data: err,
    };
  }
};
