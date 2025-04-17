import { z } from "zod";
import { WsReceivedMessageSchema } from "@/ws/schemas/index.js";
import { IChat, IMessage, IUser } from "@/ws/types/db.js";

type WsSentMessageGenericFields = {
  status: "OK";
  event: "CREATE" | "DELETE" | "INITIALIZE";
};

type WsSentMessageObjectFiedls =
  | {
      object: "CHAT" | "SEARCH_CHATS";
      data: IChat[];
    }
  | {
      object: "MESSAGE";
      data: IMessage[];
    }
  | {
      object: "USER";
      data: IUser;
    };

type WsSentMessageErrorFields = {
  status: "ERROR";
  error: unknown;
};

export type WsSentMessage =
  | (WsSentMessageGenericFields & WsSentMessageObjectFiedls)
  | WsSentMessageErrorFields;

export type WsReceivedMessage = z.infer<typeof WsReceivedMessageSchema>;

export type WsBroadcastFunction = ({
  chatId,
  message,
}: {
  chatId: string;
  message: string;
}) => void;
