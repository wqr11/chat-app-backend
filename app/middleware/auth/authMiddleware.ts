import { Request, Response, NextFunction } from "express";
import { redis } from "@/db/index.js";
import { AuthRepository } from "@/repository/auth/index.js";
import { EncryptionUtils } from "@/utils/encryption.js";
import { JWTUtils } from "@/utils/jwt.js";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/config/index.js";
import { CookiesUtils } from "@/utils/cookies.js";
import { AuthenticationError } from "@/types/errors.js";

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

    const activeToken = accessData && (await redis.get(accessData.email));

    if (!accessData || accessToken !== activeToken) {
      let refreshData: { email: string; password: string };

      try {
        refreshData = JWTUtils.verifyRefreshToken(refreshToken);
      } catch {
        next(new AuthenticationError("Invalid refresh token"));
        return;
      }

      const user = await AuthRepository.findUserByEmail(refreshData.email);

      if (!user) {
        next(new AuthenticationError("No such user"));
      }

      const passwordsAlign = await EncryptionUtils.compareHash({
        plain: refreshData.password,
        encrypted: user!.password,
      });

      if (!passwordsAlign) {
        next(new AuthenticationError("Passwords mismatch"));
      }

      const newAccessToken = JWTUtils.signAccessToken({
        email: refreshData.email,
      });
      const newRefreshToken = JWTUtils.signRefreshToken({
        email: refreshData.email,
        password: refreshData.password,
      });

      await redis.set(user!.email, newAccessToken);

      CookiesUtils.setTokenCookies({
        res,
        next,
        access: newAccessToken,
        refresh: newRefreshToken,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
