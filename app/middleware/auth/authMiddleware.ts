import { Request, Response, NextFunction } from "express";
import { JWTUtils } from "@/utils/jwt.js";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/config/index.js";
import { redis } from "@/db/index.js";
import { AuthRepository } from "@/repository/auth/index.js";
import { EncryptionUtils } from "@/utils/encryption.js";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.cookies;

  const accessToken = cookies[ACCESS_TOKEN_COOKIE];
  const refreshToken = cookies[REFRESH_TOKEN_COOKIE];

  if (!accessToken && !refreshToken) {
    next(new Error("Unauthorized: no cookies present"));
    return;
  }

  try {
    const accessData = JWTUtils.verifyAccessToken(accessToken);

    const activeToken = await redis.get(accessData.email);

    if (accessToken !== activeToken) {
      const refreshData = JWTUtils.verifyRefreshToken(refreshToken);

      const user = await AuthRepository.findUserByEmail(refreshData.email);

      if (!user) {
        next(new Error("Unauthorized: no such user"));
      }

      const passwordsAlign = await EncryptionUtils.compareHash({
        plain: refreshData.password,
        encrypted: user!.password,
      });

      if (!passwordsAlign) {
        next(new Error("Unauthorized: passwords mismatch"));
      }

      const newAccessToken = JWTUtils.signAccessToken({
        email: refreshData.email,
      });
      const newRefreshToken = JWTUtils.signRefreshToken(refreshData);

      await redis.set(user!.email, newAccessToken);

      res.cookie(ACCESS_TOKEN_COOKIE, newAccessToken);
      res.cookie(REFRESH_TOKEN_COOKIE, newRefreshToken);
    }

    next();
  } catch (error) {
    next(error);
  }
};
