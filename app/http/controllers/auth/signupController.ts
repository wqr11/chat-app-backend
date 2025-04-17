import { Request, Response } from "express";

import { signUp } from "@/http/services/auth/signUp.js";

export const signUpController = async (req: Request, res: Response) => {
  const body = req.body;

  const data = await signUp(body);

  res.status(data.code).json({
    ...(data.success
      ? {
          ...data.data,
        }
      : {
          error: data.data,
        }),
  });
};
