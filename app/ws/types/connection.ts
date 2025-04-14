import { WebSocket } from "ws";

export type WsConnection = {
  chatIds: string[];
  ws: WebSocket;
};

export type WsConnections = Map<string, WsConnection>;
