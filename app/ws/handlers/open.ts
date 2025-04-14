import WebSocket from "ws";
import { getChats } from "@/ws/services/chat/getChats.js";
import { WsSentMessage } from "@/ws/types/message.js";
import { WsConnection, WsConnections } from "@/ws/types/connection.js";
import { IChat } from "@/ws/types/db.js";

export const wsOpenHandler = async ({
  ws,
  userId,
  wsConnections,
}: {
  ws: WebSocket;
  userId: string;
  wsConnections: WsConnections;
}) => {
  const result = await getChats({ userId });

  if (result.success) {
    const message: WsSentMessage = {
      status: "OK",
      event: "CREATE",
      object: "CHAT",
      data: result.data,
    };

    const connection: WsConnection = {
      chatIds: (result.data as IChat[]).map((d) => d.id),
      ws,
    };

    wsConnections.set(userId, connection);

    ws.send(JSON.stringify(message));
  }
};
