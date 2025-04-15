import { WebSocket } from "ws";
import { RedisUtils } from "@/utils/redis.js";
import { WS_PING_INTERVAL } from "@/config/index.js";

/*
 * Pings ws client every WS_PING_INTERVAL ms
 *
 * @param ws {WebSocket} - ws client
 * @param userId {string} - userId with specified client
 * @param token {string} - token for specified userId
 *
 */

export const wsPingHandler = async ({
  ws,
  userId,
  token,
}: {
  ws: WebSocket;
  userId: string;
  token: string;
}) => {
  setInterval(() => ws.ping(), WS_PING_INTERVAL);

  ws.on("pong", async () => {
    await RedisUtils.setUserIdToken({ userId, token });
  });
};
