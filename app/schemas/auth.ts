import { z } from "zod";

export const AuthEmailPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type AuthEmailPasswordType = z.infer<typeof AuthEmailPasswordSchema>;
