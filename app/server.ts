import express from "express";
import cookieParser from "cookie-parser";

import { loggerMiddleware } from "@/middleware/logger.js";
import { authRoutes } from "@/routes/auth.js";

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

app.listen(PORT, () => {
  console.log(`[SERVER STARTED] Listening on http://localhost:${PORT}`);
});
