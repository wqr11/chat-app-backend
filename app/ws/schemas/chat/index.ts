import { z } from "zod";

export const ChatSchema = z.object({
  name: z.string().optional(),
});

export type ChatType = z.infer<typeof ChatSchema>;
