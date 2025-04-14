import { Server, WebSocket } from "ws";
import { IncomingMessage } from "http";
import { createChat } from "@/ws/services/chat/createChat.js";
import { createMessage } from "@/ws/services/message/createMessage.js";
import { ReceivedMessageSchema } from "@/ws/schemas/index.js";

export const wsMessageHandler = async ({
  ws,
  message,
  req,
  userId,
}: {
  ws: WebSocket;
  message: WebSocket.RawData;
  req: IncomingMessage;
  userId: string;
  wss: Server<typeof WebSocket, typeof IncomingMessage>;
}) => {
  let json: string;
  try {
    json = JSON.parse(message.toString());
  } catch {
    ws.close(1003, "Invalid JSON");
    return;
  }

  const parsed = await ReceivedMessageSchema.safeParseAsync(json);

  if (!parsed.success) {
    ws.close(1003, JSON.stringify(parsed.error.format()));
    return;
  }

  const { event, object, chat, message: msg } = parsed.data;

  switch (event) {
    case "CREATE":
      switch (object) {
        case "CHAT":
          const createdChat = await createChat({
            name: chat?.name,
            userId,
          });
          ws.send(JSON.stringify(createdChat));
          break;
        case "MESSAGE":
          const createdMessage = await createMessage({
            content: msg!.content!,
            chatId: chat!.id!,
            userId,
          });

          if (!createdMessage.success) {
            ws.close(1003, "Invalid chat.id");
            break;
          }

          ws.send(JSON.stringify(createdMessage));
          break;
      }
  }
};
