import { z } from "zod";
import { WsReceivedMessageSchema } from "@/ws/schemas/index.js";
import { IChat, IMessage } from "@/ws/types/db.js";

export type WsSentMessage =
  | ({
      status: "OK";
      event: "CREATE" | "DELETE";
    } & (
      | {
          object: "CHAT";
          data: IChat[];
        }
      | {
          object: "MESSAGE";
          data: IMessage[];
        }
    ))
  | {
      status: "ERROR";
      error: unknown;
    };

export type WsReceivedMessage = z.infer<typeof WsReceivedMessageSchema>;
