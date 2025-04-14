import WebSocket from "ws";
import { getChats } from "@/ws/services/chat/getChats.js";

export const wsOpenHandler = async ({
  ws,
  userId,
}: {
  ws: WebSocket;
  userId: string;
}) => {
  const result = await getChats({ userId });

  if (result.success) {
    ws.send(JSON.stringify(result.data));
  }
};
