import express from "express";
import { WebSocketServer } from "ws";
import { wsConnectionHandler } from "@/ws/wss.js";

import cors from "cors";
import cookieParser from "cookie-parser";

import { loggerMiddleware } from "@/http/middleware/logger.js";
import { authMiddleware } from "@/http/middleware/auth/authMiddleware.js";
import { errorHandler } from "@/http/middleware/errorHandler.js";

import { authRoutes } from "@/http/routes/auth.js";
import { refreshRoutes } from "@/http/routes/refresh.js";
import { PORT, WS_PORT } from "@/config/index.js";

const app = express();

const wss = new WebSocketServer({
  path: "/ws",
  port: WS_PORT,
  autoPong: true,
});

wss.on("connection", (ws, req) => wsConnectionHandler({ ws, req }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    exposedHeaders: "Set-Cookie",
  })
);

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
app.use("/", refreshRoutes);

// error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[SERVER STARTED] Listening on http://localhost:${PORT}`);
});
