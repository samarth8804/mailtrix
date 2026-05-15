import jwt from "jsonwebtoken";

import { User } from "../modules/users/user.model.js";

import { env } from "../config/env.js";

import { asyncHandler } from "../utils/asyncHandler.js";

import { ApiError } from "../utils/apiError.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Not authorized");
  }

  let decoded;

  try {
    decoded = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new ApiError(401, "Invalid");
  }

  const user = await User.findById(decoded.userId).select("-refreshToken");

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  req.user = user;

  next();
});
