import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

export const generateOAuthState = (userId) => {
  return jwt.sign(
    {
      userId,
      type: "gmail_oauth_state",
    },

    env.jwtSecret,

    {
      expiresIn: "10m",
    },
  );
};
