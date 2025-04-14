import { getChatMessages } from "@/services/chat/getChatMessages.js";
import { BadRequestError } from "@/http/types/errors.js";
import { CookiesUtils } from "@/utils/cookies.js";
import { NextFunction, Request, Response } from "express";

export const getChatMessagesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const { cookies } = req;

  try {
    const userEmail = CookiesUtils.getEmailFromCookies({ cookies });

    if (!id) {
      next(new BadRequestError("No ID specified"));
      return;
    }

    const result = await getChatMessages({ chatId: id, userEmail });

    res.status(result.code).json({
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};
