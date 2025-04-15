import { WebSocket } from "ws";
import { IncomingMessage } from "http";

import { wsMessageHandler } from "@/ws/handlers/message.js";
import { wsAuthentication } from "@/ws/handlers/auth.js";
import { wsOpenHandler } from "@/ws/handlers/open.js";
import { wsPingHandler } from "@/ws/handlers/ping.js";
import { WsConnections } from "@/ws/types/connection.js";

const wsConnections: WsConnections = new Map();

export const wsConnectionHandler = async ({
  ws,
  req,
}: {
  ws: WebSocket;
  req: IncomingMessage;
}) => {
  const auth = await wsAuthentication(ws, req);

  if (!auth.success) {
    return;
  }

  const { userId, token } = auth;

  await wsOpenHandler({ ws, userId, wsConnections });

  await wsPingHandler({ ws, userId, token });

  const wsBroadcastMessage = ({
    chatId,
    message,
  }: {
    chatId: string;
    message: string;
  }) => {
    wsConnections.forEach((connection) => {
      if (connection.chatIds.includes(chatId)) {
        connection.ws.send(message);
      }
    });
  };

  ws.on("message", (message) =>
    wsMessageHandler({ ws, userId, message, wsConnections, wsBroadcastMessage })
  );

  ws.on("close", () => {
    wsConnections.delete(userId);
  });

  ws.on("error", () => {
    wsConnections.delete(userId);
  });
};
