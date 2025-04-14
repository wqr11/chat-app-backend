import { NextFunction, Request, Response } from "express";
import { login } from "@/http/services/auth/login.js";
import { CookiesUtils } from "@/utils/cookies.js";

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = req.body;

  const result = await login(body);

  if (result.success) {
    CookiesUtils.setTokenCookies({
      res,
      next,
      access: result.data.access,
      refresh: result.data.refresh,
    });
  }

  res.status(result.code).json({
    ...(result.success
      ? {
          result: result.data,
        }
      : {
          error: result.error,
        }),
  });
};
