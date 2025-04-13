import express from "express";
import cookieParser from "cookie-parser";

import { loggerMiddleware } from "@/middleware/logger.js";
import { authMiddleware } from "@/middleware/auth/authMiddleware.js";
import { errorHandler } from "@/middleware/errorHandler.js";

import { authRoutes } from "@/routes/auth.js";
import { pingRoutes } from "@/routes/ping.js";
import { chatRoutes } from "@/routes/chat.js";
import { PORT } from "@/config/index.js";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(loggerMiddleware);
app.use("/auth", authRoutes);

// secured endpoints
app.use(authMiddleware);

// chat
app.use("/chat", chatRoutes);

app.use("/ping", pingRoutes);

// error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[SERVER STARTED] Listening on http://localhost:${PORT}`);
});
