import mongoose from "mongoose";

const gmailTokensSchema = new mongoose.Schema(
  {
    access_token: String,
    refresh_token: String,
    expiry_date: Number,
  },
  {
    _id: false,
  },
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    avatar: {
      type: String,
    },

    googleId: {
      type: String,
      required: true,
      unique: true,
    },

    refreshToken: {
      type: String,
    },

    gmailConnected: {
      type: Boolean,
      default: false,
    },

    gmailTokens: gmailTokensSchema,

    credits: {
      type: Number,
      default: 100,
    },

    plan: {
      type: String,
      enum: ["FREE", "PRO"],
      default: "FREE",
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model("User", userSchema);
