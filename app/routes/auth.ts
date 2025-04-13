import { Router } from "express";
import { signUpController } from "@/controllers/auth/signupController.js";
import { loginController } from "@/controllers/auth/loginController.js";

const router = Router();

router.route("/signup").post(signUpController);
router.route("/login").post(loginController);

export { router as authRoutes };
