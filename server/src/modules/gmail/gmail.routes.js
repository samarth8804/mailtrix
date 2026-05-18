import express from "express";
import passport from "passport";
import { protect } from "../../middleware/auth.middleware.js";
import { gmailOAuthRateLimiter } from "../../middleware/rateLimit.middleware.js";

import {
  gmailConnect,
  gmailCallback,
  disconnectGmail,
  gmailStatus,
} from "./gmail.controller.js";

const router = express.Router();

router.get("/connect", protect, gmailOAuthRateLimiter, gmailConnect);

router.get("/callback", gmailOAuthRateLimiter, gmailCallback);

router.post("/disconnect", protect, disconnectGmail);

router.get("/status", protect, gmailStatus);

export default router;
