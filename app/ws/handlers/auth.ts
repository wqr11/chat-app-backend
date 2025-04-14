import { WebSocket } from "ws";
import { IncomingMessage } from "http";
import { JWTUtils } from "@/utils/jwt.js";
import { RedisUtils } from "@/utils/redis.js";
import { WebSocketAuthenticationResult } from "@/ws/types/auth.js";

export const wsAuthentication = async (
  ws: WebSocket,
  req: IncomingMessage
): Promise<WebSocketAuthenticationResult> => {
  const headers = req.headers;

  if (!headers.authorization) {
    ws.close(3000, "Authorization Error: AccessToken is NOT valid");
    return {
      success: false,
    };
  }

  const [accessType, accessToken] = headers.authorization?.split(" ") as [
    string,
    string
  ];

  if (accessType !== "Bearer") {
    ws.close(3000, "Authorization Error: AccessToken is NOT valid");
    return {
      success: false,
    };
  }

  try {
    const { userId } = JWTUtils.verifyAccessToken(accessToken);

    const activeToken = await RedisUtils.getUserIdToken({ userId });

    if (!activeToken || accessToken !== activeToken) {
      ws.close(3000, "Authorization Error: AccessToken is NOT valid");
      return {
        success: false,
      };
    }

    return {
      success: true,
      userId,
    };
  } catch (error) {
    ws.close(3000, "Authorization Error: AccessToken is NOT valid");
    return {
      success: false,
    };
  }
};
