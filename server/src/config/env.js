import dotenv from "dotenv";
import { google } from "googleapis";

dotenv.config();

const requiredEnvVariables = [
  "PORT",
  "MONGO_URI",
  "JWT_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_CALLBACK_URL",
  "FRONTEND_URL",
  "GOOGLE_GMAIL_CALLBACK_URL",
];

requiredEnvVariables.forEach((key) => {
  if (!process.env[key]?.trim()) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

export const env = {
  port: process.env.PORT,

  mongoUri: process.env.MONGO_URI,

  jwtSecret: process.env.JWT_SECRET,

  googleClientId: process.env.GOOGLE_CLIENT_ID,

  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,

  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,

  googleGmailCallbackUrl: process.env.GOOGLE_GMAIL_CALLBACK_URL,

  nodeEnv: process.env.NODE_ENV || "development",

  frontendUrl: process.env.FRONTEND_URL,
};
