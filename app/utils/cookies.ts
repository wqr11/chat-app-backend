import { NextFunction, Response } from "express";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/config/index.js";
import { SetCookiesError } from "@/types/errors.js";

export const setTokenCookies = ({
  res,
  next,
  access,
  refresh,
}: {
  res: Response;
  next: NextFunction;
  access: string;
  refresh: string;
}) => {
  try {
    res.cookie(ACCESS_TOKEN_COOKIE, access, {
      httpOnly: true,
      sameSite: "lax",
    });
    res.cookie(REFRESH_TOKEN_COOKIE, refresh, {
      httpOnly: true,
      sameSite: "lax",
    });
  } catch {
    next(new SetCookiesError("Unable to set cookies"));
  }
};
