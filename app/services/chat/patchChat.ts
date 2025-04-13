import { ChatRepository } from "@/repository/chat/index.js";
import { ChatSchema, ChatType } from "@/schemas/chat/index.js";
import { NotFoundError } from "@/types/errors.js";
import { ServiceResult } from "@/types/index.js";

export const patchChat = async ({
  id,
  body,
  userEmail,
}: {
  id: string;
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
    const chat = await ChatRepository.patchChat({
      name: parsed.data.name,
      chatId: id,
      email: userEmail,
    });

    return {
      success: true,
      code: 200,
      data: chat,
    };
  } catch (err) {
    return {
      success: false,
      code: 404,
      data: new NotFoundError("Chat with this ID does NOT exist!"),
    };
  }
};
