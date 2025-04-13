import { ChatRepository } from "@/repository/chat/index.js";
import { ChatSchema, ChatType } from "@/schemas/chat/index.js";
import { ServiceResult } from "@/types/index.js";

export const createChat = async ({
  body,
  userEmail,
}: {
  body: ChatType;
  userEmail: string;
}): Promise<ServiceResult> => {
  const parsed = ChatSchema.safeParse(body);

  if (!parsed.success) {
    return {
      success: false,
      code: 400,
      data: parsed.error.errors,
    };
  }

  try {
    const chat = await ChatRepository.createChat({
      name: parsed.data.name,
      email: userEmail,
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
