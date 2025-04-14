import { WebSocket } from "ws";
import { IncomingMessage } from "http";
import { JWTUtils } from "@/utils/jwt.js";
import { RedisUtils } from "@/utils/redis.js";

export const wsOpenHandler = async (ws: WebSocket, req: IncomingMessage) => {
  const headers = req.headers;

  if (!headers.authorization) {
    ws.send("Authorization Error: No 'Authorizarion' header provided");
    ws.terminate();
  }

  const [accessType, accessToken] = headers.authorization?.split(" ") as [
    string,
    string
  ];

  if (accessType !== "Bearer") {
    ws.send("Authorization Error: 'Authorization' is not Bearer");
    ws.terminate();
  }

  try {
    const { email } = JWTUtils.verifyAccessToken(accessToken);

    const activeToken = await RedisUtils.getEmailToken({ email });

    if (!activeToken || accessToken !== activeToken) {
      ws.send("Authorization Error: AccessToken is NOT valid");
      ws.terminate();
    }
  } catch (error) {
    ws.send("Authorization Error: AccessToken is NOT valid");
    ws.terminate();
  }
};
