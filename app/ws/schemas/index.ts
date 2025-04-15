import { z } from "zod";

export const WsReceivedMessageSchema = z
  .object({
    event: z.enum(["CREATE", "DELETE", "SEARCH"]),
    object: z.enum(["CHAT", "MESSAGE"]),
    chat: z
      .object({
        id: z.string().optional(),
        name: z.string().optional(),
      })
      .optional(),
    message: z
      .object({
        id: z.string().optional(),
        content: z.string().optional(),
      })
      .optional(),
  })
  .superRefine(({ event, object, chat, message }, ctx) => {
    switch (event) {
      case "CREATE":
        switch (object) {
          case "CHAT":
            break;
          case "MESSAGE":
            if (!chat?.id) {
              ctx.addIssue({
                code: "custom",
                path: ["chat", "id"],
                message: "Missing field: chat.id",
              });
            }
            break;
        }
        break;
      case "DELETE":
        switch (object) {
          case "CHAT":
            if (!chat?.id) {
              ctx.addIssue({
                code: "custom",
                path: ["chat", "id"],
                message: "Missing field: chat.id",
              });
            }
            break;
          case "MESSAGE":
            if (!message?.id) {
              ctx.addIssue({
                code: "custom",
                path: ["message", "id"],
                message: "Missing field: message.id",
              });
            }
            break;
        }
        break;
      case "SEARCH":
        switch (object) {
          case "MESSAGE":
            if (!message?.content) {
              ctx.addIssue({
                code: "custom",
                path: ["message", "content"],
                message: "Missing search field: message.content",
              });
            }
            break;
        }
        break;
    }
  });
