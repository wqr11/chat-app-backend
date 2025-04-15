import { NextFunction, Request, Response } from "express";

export const refreshController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send(200);
};
