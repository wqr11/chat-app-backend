import { Server, WebSocket } from "ws";
import { IncomingMessage } from "http";

import { wsMessageHandler } from "@/ws/handlers/message.js";
import { wsAuthentication } from "@/ws/handlers/auth.js";
import { wsOpenHandler } from "@/ws/handlers/open.js";

export const wsConnectionHandler = async ({
  ws,
  req,
  wss,
}: {
  ws: WebSocket;
  req: IncomingMessage;
  wss: Server<typeof WebSocket, typeof IncomingMessage>;
}) => {
  const auth = await wsAuthentication(ws, req);

  if (!auth.success) {
    return;
  }

  const { userId } = auth;

  await wsOpenHandler({ ws, userId });

  ws.on("message", (message) =>
    wsMessageHandler({ ws, userId, message, req, wss })
  );
};
