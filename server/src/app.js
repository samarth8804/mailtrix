import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import passport from "passport";
import { env } from "./config/env.js";
import "./config/passport.js";

import { errorMiddleware } from "./middleware/error.middleware.js";

import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";

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

app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server running",
  });
});

app.use(errorMiddleware);

export default app;
