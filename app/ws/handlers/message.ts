import { WebSocket } from "ws";
import { IncomingMessage } from "http";

export const wsMessageHandler = (
  ws: WebSocket,
  message: WebSocket.RawData,
  req: IncomingMessage
) => {
  ws.send(message.toString());
};
