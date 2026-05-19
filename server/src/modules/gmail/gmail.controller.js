import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { verifyOAuthState } from "../../utils/verifyOAuthState.js";
import {
  generateGmailAuthUrl,
  exchangeCodeForTokens,
  saveGmailTokens,
  disconnectUserGmail,
} from "./gmail.service.js";

export const gmailConnect = asyncHandler(async (req, res) => {
  const authUrl = generateGmailAuthUrl(req.user._id);

  // return res.redirect(authUrl);
  return res.status(200).json(
    apiResponse({
      data: {
        authUrl,
      },
    }),
  );
});

export const gmailCallback = asyncHandler(async (req, res) => {
  const { code, state } = req.query;

  const decoded = verifyOAuthState(state);

  const tokens = await exchangeCodeForTokens(code);

  await saveGmailTokens(decoded.userId, tokens);

  return res.status(200).json(
    apiResponse({
      message: "Gmail connected successfully",
    }),
  );
});

export const disconnectGmail = asyncHandler(async (req, res) => {
  await disconnectUserGmail(req.user._id);

  return res.status(200).json(
    apiResponse({
      message: "Gmail disconnected successfully",
    }),
  );
});

export const gmailStatus = asyncHandler(async (req, res) => {
  return res.status(200).json(
    apiResponse({
      message: "Gmail Connected",
      data: {
        gmailConnected: req.user.gmailConnected,
      },
    }),
  );
});
