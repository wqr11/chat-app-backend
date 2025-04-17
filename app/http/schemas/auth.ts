import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const SignUpSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;

export type LoginSchemaType = z.infer<typeof LoginSchema>;
