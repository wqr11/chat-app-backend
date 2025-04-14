import { MessageRepository } from "@/repository/message/index.js";
import { IMessage } from "@/ws/types/db.js";

export type WsDeleteMessageResult =
  | {
      success: true;
      data: IMessage;
    }
  | {
      success: false;
      error: unknown;
    };

export const deleteMessage = async ({
  messageId,
}: {
  messageId: string;
}): Promise<WsDeleteMessageResult> => {
  try {
    const deletedMessage = await MessageRepository.deleteMessage({ messageId });
    return {
      success: true,
      data: deletedMessage,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};
