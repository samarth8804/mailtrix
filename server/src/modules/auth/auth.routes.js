import express from "express";

import passport from "passport";

import {
  googleAuthSuccess,
  logout,
  refreshAccessToken,
} from "./auth.controller.js";

import { authRateLimiter } from "../../middleware/rateLimit.middleware.js";

const router = express.Router();

router.get(
  "/google",
  authRateLimiter,
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get(
  "/google/callback",

  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),

  googleAuthSuccess,
);

router.post("/refresh", authRateLimiter, refreshAccessToken);

router.post("/logout", authRateLimiter, logout);

export default router;
