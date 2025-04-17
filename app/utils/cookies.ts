import { NextFunction, Response } from "express";
import {
  ACCESS_TOKEN_COOKIE,
  JWT_ACCESS_EX,
  JWT_REFRESH_EX,
  REFRESH_TOKEN_COOKIE,
} from "@/config/index.js";
import { SetCookiesError } from "@/http/types/errors.js";

export class CookiesUtils {
  static setTokenCookies({
    res,
    next,
    access,
    refresh,
  }: {
    res: Response;
    next: NextFunction;
    access: string;
    refresh: string;
  }) {
    try {
      res.cookie(ACCESS_TOKEN_COOKIE, access, {
        maxAge: JWT_ACCESS_EX * 1000,
      });
      res.cookie(REFRESH_TOKEN_COOKIE, refresh, {
        maxAge: JWT_REFRESH_EX * 1000,
      });
    } catch {
      next(new SetCookiesError("Unable to set cookies"));
    }
  }
}
