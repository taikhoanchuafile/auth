import crypto from "crypto";
export const cryptoRandomString = crypto.randomBytes(64).toString("hex");
export const hashedCryptoString = (tokenPlaintext) => {
  if (!tokenPlaintext || typeof tokenPlaintext !== "string") return;
  return crypto.createHash("sha256").update(tokenPlaintext).digest("hex");
};
