import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,

  frontendUrl: process.env.FRONTEND_URL,

  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,

  geminiApiKey: process.env.GEMINI_API_KEY,

  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
};
