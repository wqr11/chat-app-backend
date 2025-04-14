import { NextFunction, Request, Response } from "express";
import { createChat } from "@/ws/services/chat/createChat.js";
import { CookiesUtils } from "@/utils/cookies.js";

export const createChatController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = req.body;

  const { cookies } = req;

  try {
    const userEmail = CookiesUtils.getEmailFromCookies({ cookies });

    const result = await createChat({ body, userEmail });

    res.status(result.code).json({
      data: result.data,
    });
  } catch (err) {
    next(err);
  }
};
