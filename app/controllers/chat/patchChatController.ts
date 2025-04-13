import { NextFunction, Request, Response } from "express";
import { CookiesUtils } from "@/utils/cookies.js";
import { patchChat } from "@/services/chat/patchChat.js";

export const patchChatController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const body = req.body;

  const { cookies } = req;

  try {
    const userEmail = CookiesUtils.getEmailFromCookies({ cookies });

    const result = await patchChat({ id, body, userEmail });

    res.status(result.code).json({
      data: result.data,
    });
  } catch (err) {
    next(err);
  }
};
