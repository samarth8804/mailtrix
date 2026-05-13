import passport from "passport";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { env } from "./env.js";

import { findOrCreateUser } from "../modules/auth/auth.service.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.googleClientId,

      clientSecret: env.googleClientSecret,

      callbackURL: env.googleCallbackUrl,
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateUser(profile);

        done(null, user);
      } catch (error) {
        console.error("Google OAuth Error:", error);
        done(error, null);
      }
    },
  ),
);
