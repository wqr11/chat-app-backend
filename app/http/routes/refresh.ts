import { Router } from "express";
import { refreshController } from "@/http/controllers/auth/refreshController.js";

const router = Router();

router.route("/refresh").get(refreshController);

export { router as refreshRoutes };
