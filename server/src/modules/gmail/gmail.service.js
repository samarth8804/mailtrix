import { google } from "googleapis";
import { User } from "../users/user.model.js";
import { env } from "../../config/env.js";
import { ApiError } from "../../utils/apiError.js";
import { generateOAuthState } from "../../utils/generateOAuthState.js";

export const createOAuth2Client = () => {
  return new google.auth.OAuth2(
    env.googleClientId,

    env.googleClientSecret,

    env.googleGmailCallbackUrl,
  );
};

export const generateGmailAuthUrl = (userId) => {
  const state = generateOAuthState(userId);

  const oauth2Client = createOAuth2Client();

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/gmail.send"],
    state,
  });
};

export const exchangeCodeForTokens = async (code) => {
  const oauth2Client = createOAuth2Client();

  if (!code || typeof code !== "string") {
    throw new ApiError(400, "Invalid authorization code");
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);

    return tokens;
  } catch (error) {
    const status = error?.response?.status;

    if (status === 400) {
      throw new ApiError(400, "Invalid or expired authorization code");
    }

    if (status === 401) {
      throw new ApiError(401, "Google authorization failed");
    }

    if (status >= 500) {
      throw new ApiError(503, "Google OAuth service unavailable");
    }

    throw new ApiError(500, "Failed to exchange authorization code");
  }
};

export const saveGmailTokens = async (userId, tokens) => {
  if (!tokens || typeof tokens !== "object") {
    throw new ApiError(400, "Invalid Gmail tokens");
  }

  const { access_token, refresh_token, expiry_date } = tokens;

  if (!access_token || typeof access_token !== "string") {
    throw new ApiError(400, "Invalid Gmail access token");
  }

  if (refresh_token && typeof refresh_token !== "string") {
    throw new ApiError(400, "Invalid Gmail refresh token");
  }

  if (expiry_date && typeof expiry_date !== "number") {
    throw new ApiError(400, "Invalid Gmail token expiry");
  }
  await User.findByIdAndUpdate(userId, {
    gmailConnected: true,
    gmailTokens: {
      access_token: access_token.trim(),
      refresh_token: refresh_token?.trim(),
      expiry_date,
    },
  });
};

export const disconnectUserGmail = async (userId) => {
  const user = await User.findById(userId);

  const oauth2Client = createOAuth2Client();

  if (!user || !user.gmailTokens) {
    return;
  }

  const { access_token, refresh_Token } = user.gmailTokens;

  try {
    if (refresh_Token) {
      await oauth2Client.revokeToken(refresh_Token);
    }

    if (access_token) {
      await oauth2Client.revokeToken(access_token);
    }
  } catch (error) {
    console.error("Failed to revoke Gmail token:", error.message);
  }

  await User.findByIdAndUpdate(userId, {
    gmailConnected: false,

    gmailTokens: null,
  });
};

export const getAuthorizedGmailClient = async (userId) => {
  const oauth2Client = createOAuth2Client();

  const user = await User.findById(userId);

  if (!user || !user.gmailConnected || !user.gmailTokens) {
    throw new ApiError(400, "Gmail account not connected");
  }

  const { access_token, refresh_token, expiry_date } = user.gmailTokens;

  if (!refresh_token) {
    throw new ApiError(400, "Missing Gmail refresh token");
  }

  oauth2Client.setCredentials({
    access_token,

    refresh_token,

    expiry_date,
  });

  const isExpired = !expiry_date || Date.now() >= expiry_date - 60000;

  if (isExpired) {
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();

      oauth2Client.setCredentials(credentials);

      await User.findByIdAndUpdate(userId, {
        gmailTokens: {
          access_token: credentials.access_token,

          refresh_token: credentials.refresh_token || refresh_token,

          expiry_date: credentials.expiry_date,
        },
      });
    } catch {
      throw new ApiError(401, "Failed to refresh Gmail token");
    }
  }

  return google.gmail({
    version: "v1",

    auth: oauth2Client,
  });
};
