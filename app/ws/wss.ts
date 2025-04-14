import { WebSocket } from "ws";
import { IncomingMessage } from "http";

import { wsMessageHandler } from "@/ws/handlers/message.js";
import { wsOpenHandler } from "./handlers/open.js";

export const wsConnectionHandler = async (
  ws: WebSocket,
  req: IncomingMessage
) => {
  ws.on("message", (message) => wsMessageHandler(ws, message, req));

  await wsOpenHandler(ws, req);
};
