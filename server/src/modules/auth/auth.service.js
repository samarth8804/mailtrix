import jwt from "jsonwebtoken";

import { User } from "../users/user.model.js";

import { env } from "../../config/env.js";

import { generateAccessToken } from "../../utils/generateAccessToken.js";

import { generateRefreshToken } from "../../utils/generateRefreshToken.js";

import { ApiError } from "../../utils/apiError.js";

import { refreshTokenCookieOptions } from "../../utils/cookieOption.js";

export const findOrCreateUser = async (profile) => {
  if (!profile?.id) {
    throw new ApiError(400, "Invalid Google profile");
  }

  const email = profile.emails?.[0]?.value;

  if (!email) {
    throw new ApiError(400, "Email not provided by Google");
  }

  let user = await User.findOne({
    googleId: profile.id,
  });

  if (user) {
    return user;
  }

  user = await User.create({
    name: profile.displayName?.trim() || "User",

    email: email.toLowerCase().trim(),

    avatar: profile.photos?.[0]?.value || "",

    googleId: profile.id,
  });

  return user;
};

export const loginUser = async (user) => {
  const accessToken = generateAccessToken(user._id);

  const refreshToken = generateRefreshToken(user._id);

  await User.findByIdAndUpdate(user._id, {
    refreshToken,
  });

  return {
    accessToken,

    refreshToken,

    user,

    refreshTokenCookieOptions,
  };
};

export const refreshUserAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token missing");
  }

  let decoded;

  try {
    decoded = jwt.verify(refreshToken, env.jwtSecret);
  } catch {
    throw new ApiError(401, "Invalid refresh token");
  }

  const user = await User.findById(decoded.userId);

  if (!user || user.refreshToken !== refreshToken) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const accessToken = generateAccessToken(user._id);

  return {
    accessToken,
  };
};

export const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    return;
  }

  await User.findOneAndUpdate(
    { refreshToken },
    {
      refreshToken: null,
    },
  );
};
