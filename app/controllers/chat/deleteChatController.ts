import { BadRequestError } from "@/types/errors.js";
import { NextFunction, Request, Response } from "express";

export const deleteChatController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).json({
      data: new BadRequestError("No ID was provided"),
    });
  }
};
