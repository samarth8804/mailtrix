import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

export const generateAccessToken = (userId) => {
  return jwt.sign(
    {
      userId,
    },

    env.jwtSecret,

    {
      expiresIn: "15m",
    },
  );
};
