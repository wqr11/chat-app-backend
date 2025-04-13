import { NextFunction, Request, Response } from "express";
import { loginService } from "@/services/auth/loginService.js";
import { setTokenCookies } from "@/utils/cookies.js";

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = req.body;

  const result = await loginService(body);

  if (result.success) {
    setTokenCookies({
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
