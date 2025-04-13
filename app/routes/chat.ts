import { Router } from "express";
import { createChatController } from "@/controllers/chat/createChatController.js";
import { patchChatController } from "@/controllers/chat/patchChatController.js";
import { getChatsController } from "@/controllers/chat/getChatsController.js";
import { getChatMessagesController } from "@/controllers/chat/getChatMessagesController.js";

const router = Router();

router.route("/").get(getChatsController).post(createChatController);

router.route("/:id").patch(patchChatController);

router.route("/:id/messages").get(getChatMessagesController);

export { router as chatRoutes };
