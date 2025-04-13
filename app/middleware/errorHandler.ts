import { Request, Response, NextFunction, Errback } from "express";

export const errorHandler = (
  err: Errback,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(401).json({
    error: err.toString(),
  });
  next();
};
