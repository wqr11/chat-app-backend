import { NextFunction, Request, Response } from "express";

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next();
  console.log(`[${req.method}] ${req.url} ${res.statusCode}`);
};
