import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";

import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

const allowedOrigins = [env.frontendUrl];

app.use(
  cors({
    origin: env.frontendUrl,

    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],

    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(helmet());

if (env.nodeEnv === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server running",
  });
});

app.use(errorMiddleware);

export default app;
