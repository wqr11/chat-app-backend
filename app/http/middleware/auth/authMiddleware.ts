import { Request, Response, NextFunction } from "express";

import { JWTUtils } from "@/utils/jwt.js";
import { CookiesUtils } from "@/utils/cookies.js";
import { RedisUtils } from "@/utils/redis.js";

import { refreshTokens } from "@/http/services/auth/refreshTokens.js";

import { AuthenticationError } from "@/http/types/errors.js";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/config/index.js";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.cookies;

  const accessToken = cookies[ACCESS_TOKEN_COOKIE];
  const refreshToken = cookies[REFRESH_TOKEN_COOKIE];

  if (!accessToken && !refreshToken) {
    next(new AuthenticationError("No cookies present"));
    return;
  }

  try {
    let accessData: { userId: string } | null;

    try {
      accessData = JWTUtils.verifyAccessToken(accessToken);
    } catch {
      accessData = null;
    }

    const activeToken =
      accessData &&
      (await RedisUtils.getUserIdToken({ userId: accessData.userId }));

    if (!accessData || accessToken !== activeToken) {
      const result = await refreshTokens({ refreshToken });

      if (!result.success) {
        next(result.error);
        return;
      }

      await RedisUtils.setUserIdToken({
        userId: result.data.userId,
        token: result.data.access,
      });

      CookiesUtils.setTokenCookies({
        res,
        next,
        access: result.data.access,
        refresh: result.data.refresh,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
