import { z } from "zod";

export const ChatSchema = z.object({
  name: z.string(),
});

export type ChatType = z.infer<typeof ChatSchema>;
