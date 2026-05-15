import { asyncHandler } from "../../utils/asyncHandler.js";

import { apiResponse } from "../../utils/apiResponse.js";

import {
  loginUser,
  logoutUser,
  refreshUserAccessToken,
} from "./auth.service.js";

export const googleAuthSuccess = asyncHandler(async (req, res) => {
  const authData = await loginUser(req.user);

  res.cookie(
    "refreshToken",
    authData.refreshToken,
    authData.refreshTokenCookieOptions,
  );

  return res.status(200).json(
    apiResponse({
      message: "Authentication successful",

      data: {
        accessToken: authData.accessToken,

        user: authData.updatedUser,
      },
    }),
  );
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  const data = await refreshUserAccessToken(refreshToken);

  return res.status(200).json(
    apiResponse({
      message: "Access token refreshed",

      data,
    }),
  );
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  await logoutUser(refreshToken);

  res.clearCookie("refreshToken");

  return res.status(200).json(
    apiResponse({
      message: "Logged out successfully",
    }),
  );
});
