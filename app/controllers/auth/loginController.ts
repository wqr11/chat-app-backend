import { Request, Response } from "express";
import { loginService } from "@/services/auth/loginService.js";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/config/index.js";

export const loginController = async (req: Request, res: Response) => {
  const body = req.body;

  const result = await loginService(body);

  if (result.success) {
    res.cookie(ACCESS_TOKEN_COOKIE, result.data.access);
    res.cookie(REFRESH_TOKEN_COOKIE, result.data.refresh);
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
