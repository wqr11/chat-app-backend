import { WebSocket } from "ws";
import { IncomingMessage } from "http";
import { JWTUtils } from "@/utils/jwt.js";
import { RedisUtils } from "@/utils/redis.js";
import { ACCESS_TOKEN_COOKIE } from "@/config/index.js";
import { WebSocketAuthenticationResult } from "@/ws/types/auth.js";

export const wsAuthentication = async (
  ws: WebSocket,
  req: IncomingMessage
): Promise<WebSocketAuthenticationResult> => {
  const cookies: Record<string, string> = {};
  if (req.headers.cookie) {
    req.headers.cookie.split(";").forEach((cookie) => {
      const parts = cookie.split("=");
      const name = parts[0].trim();
      const value = parts[1].trim();
      cookies[name] = value;
    });
  }

  const accessCookie = cookies[ACCESS_TOKEN_COOKIE];
  const accessHeader = req.headers.authorization?.split(" ")[1];

  const accessToken = accessCookie ?? accessHeader;

  if (!accessToken) {
    ws.close(3000, "Authorization Error: No AccessToken cookie present");
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
      token: accessToken,
    };
  } catch (error) {
    ws.close(3000, "Authorization Error: AccessToken is NOT valid");
    return {
      success: false,
    };
  }
};
