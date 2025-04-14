import { Request, Response, NextFunction } from "express";
import { AuthRepository } from "@/repository/auth/index.js";
import { EncryptionUtils } from "@/utils/encryption.js";
import { JWTUtils } from "@/utils/jwt.js";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/config/index.js";
import { CookiesUtils } from "@/utils/cookies.js";
import { AuthenticationError } from "@/types/errors.js";
import { RedisUtils } from "@/utils/redis.js";
import { refreshTokens } from "@/services/auth/refreshTokens.js";

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
    let accessData: { email: string } | null;

    try {
      accessData = JWTUtils.verifyAccessToken(accessToken);
    } catch {
      accessData = null;
    }

    const activeToken =
      accessData &&
      (await RedisUtils.getEmailToken({ email: accessData.email }));

    if (!accessData || accessToken !== activeToken) {
      const result = await refreshTokens({ refreshToken });

      if (!result.success) {
        next(result.error);
        return;
      }

      await RedisUtils.setEmailToken({
        email: result.data.email,
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
