import { Request, Response } from "express";

import { signUpService } from "@/services/auth/signUpService.js";

export const signUpController = async (req: Request, res: Response) => {
  const body = req.body;

  const data = await signUpService(body);

  res.status(data.code).json({
    ...(data.success
      ? {
          data: data.data,
        }
      : {
          error: data.data,
        }),
  });
};
