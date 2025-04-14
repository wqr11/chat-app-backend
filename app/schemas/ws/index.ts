import { z } from "zod";

export const ReceivedMessageType = z.object({
  event: z.string(),
});
