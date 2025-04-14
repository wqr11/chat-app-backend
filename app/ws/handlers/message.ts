import { Server, WebSocket } from "ws";
import { IncomingMessage } from "http";
import { createChat } from "@/ws/services/chat/createChat.js";
import { createMessage } from "@/ws/services/message/createMessage.js";
import { WsReceivedMessageSchema } from "@/ws/schemas/index.js";
import { deleteMessage } from "@/ws/services/message/deleteMessage.js";
import { WsSentMessage } from "@/ws/types/message.js";

export const wsMessageHandler = async ({
  ws,
  message,
  userId,
}: {
  ws: WebSocket;
  message: WebSocket.RawData;
  userId: string;
}) => {
  let json: string;
  try {
    json = JSON.parse(message.toString());
  } catch {
    ws.close(1003, "Invalid JSON");
    return;
  }

  const parsed = await WsReceivedMessageSchema.safeParseAsync(json);

  if (!parsed.success) {
    ws.close(1003, JSON.stringify(parsed.error.format()));
    return;
  }

  const { event, object, chat, message: msg } = parsed.data;

  let sentMessage: WsSentMessage;

  const wsSendMessage = () => {
    ws.send(JSON.stringify(sentMessage));
  };

  try {
    switch (event) {
      case "CREATE":
        switch (object) {
          case "CHAT":
            const createdChat = await createChat({
              name: chat?.name,
              userId,
            });

            if (!createdChat.success) {
              sentMessage = {
                status: "ERROR",
                error: createdChat.error,
              };

              wsSendMessage();
              break;
            }

            sentMessage = {
              status: "OK",
              event: "CREATE",
              object: "CHAT",
              data: [createdChat.data],
            };

            wsSendMessage();
            break;

          case "MESSAGE":
            const createdMessage = await createMessage({
              content: msg!.content!,
              chatId: chat!.id!,
              userId,
            });

            if (!createdMessage.success) {
              sentMessage = {
                status: "ERROR",
                error: createdMessage.error,
              };

              wsSendMessage();
              break;
            }

            sentMessage = {
              status: "OK",
              event: "CREATE",
              object: "MESSAGE",
              data: [createdMessage.data],
            };

            wsSendMessage();
            break;
        }
        break;
      case "DELETE":
        switch (object) {
          case "MESSAGE":
            const deletedMessage = await deleteMessage({ messageId: msg!.id! });

            if (!deletedMessage.success) {
              sentMessage = {
                status: "ERROR",
                error: deletedMessage.error,
              };

              wsSendMessage();
              break;
            }

            sentMessage = {
              status: "OK",
              event: "DELETE",
              object: "MESSAGE",
              data: [deletedMessage.data],
            };

            wsSendMessage();
            break;
        }
    }
  } catch (error) {
    sentMessage = {
      status: "ERROR",
      error: error,
    };
  }
};
