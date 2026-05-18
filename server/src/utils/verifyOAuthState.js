import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

import { ApiError } from "./ApiError.js";

export const verifyOAuthState = (state) => {
  if (!state) {
    throw new ApiError(400, "OAuth state missing");
  }

  try {
    const decoded = jwt.verify(state, env.jwtSecret);

    if (decoded.type !== "gmail_oauth_state") {
      throw new ApiError(401, "Invalid OAuth state");
    }

    return decoded;
  } catch {
    throw new ApiError(401, "Invalid or expired OAuth state");
  }
};
