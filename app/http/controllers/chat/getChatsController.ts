import { NextFunction, Request, Response } from "express";
import { getChats } from "@/services/chat/getChats.js";
import { CookiesUtils } from "@/utils/cookies.js";

export const getChatsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { cookies } = req;

  try {
    const userEmail = CookiesUtils.getEmailFromCookies({ cookies });

    const result = await getChats({ userEmail });

    res.status(result.code).json({
      data: result.data,
    });
  } catch (err) {
    next(err);
  }
};
