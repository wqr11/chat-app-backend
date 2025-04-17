import WebSocket from "ws";
import { getChats } from "@/ws/services/chat/getChats.js";
import { getUserData } from "@/ws/services/user/getUserData.js";
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
  const userResult = await getUserData({ userId });

  if (userResult.success) {
    const initializeMessage: WsSentMessage = {
      status: "OK",
      event: "INITIALIZE",
      object: "USER",
      data: userResult.data,
    };

    ws.send(JSON.stringify(initializeMessage));
  }

  const chatsResult = await getChats({ userId });

  if (chatsResult.success) {
    const message: WsSentMessage = {
      status: "OK",
      event: "CREATE",
      object: "CHAT",
      data: chatsResult.data,
    };

    const connection: WsConnection = {
      chatIds: (chatsResult.data as IChat[]).map((d) => d.id),
      ws,
    };

    wsConnections.set(userId, connection);

    ws.send(JSON.stringify(message));
  }
};
