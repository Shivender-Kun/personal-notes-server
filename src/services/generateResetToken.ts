import crypto from "crypto";

export const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex"); // 64-char secure token
};
