import { WebSocket } from "ws";
import { WsReceivedMessageSchema } from "@/ws/schemas/index.js";
import { createChat } from "@/ws/services/chat/createChat.js";
import { createMessage } from "@/ws/services/message/createMessage.js";
import { deleteMessage } from "@/ws/services/message/deleteMessage.js";
import { WsBroadcastFunction, WsSentMessage } from "@/ws/types/message.js";
import { WsConnections } from "@/ws/types/connection.js";
import { findChatsByName } from "@/ws/services/chat/findChatsByName.js";

export const wsMessageHandler = async ({
  ws,
  message,
  userId,
  wsConnections,
  wsBroadcastMessage,
}: {
  ws: WebSocket;
  message: WebSocket.RawData;
  userId: string;
  wsConnections: WsConnections;
  wsBroadcastMessage: WsBroadcastFunction;
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

            const connectionData = wsConnections.get(userId)!;
            const newConnectionData = {
              chatIds: [...connectionData.chatIds, createdChat.data.id],
              ws,
            };

            wsConnections.set(userId, newConnectionData);

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

            wsBroadcastMessage({
              chatId: chat!.id!,
              message: JSON.stringify(sentMessage),
            });
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

            wsBroadcastMessage({
              chatId: deletedMessage.data.chatId,
              message: JSON.stringify(sentMessage),
            });
            break;
        }
        break;
      case "SEARCH":
        switch (object) {
          case "CHAT":
            const foundChats = await findChatsByName({ search: chat?.name });

            if (!foundChats.success) {
              sentMessage = {
                status: "ERROR",
                error: foundChats.error,
              };

              wsSendMessage();
              break;
            }

            sentMessage = {
              status: "OK",
              event: "CREATE",
              object: "SEARCH_CHATS",
              data: foundChats.data,
            };

            wsSendMessage();
            break;
        }
        break;
    }
  } catch (error) {
    sentMessage = {
      status: "ERROR",
      error: error,
    };
  }
};
