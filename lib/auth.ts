import { pbkdf2Sync, randomBytes } from "crypto";

// Hash password
export const hashPassword = (password: string) => {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
};

// Verify password
export const verifyPassword = (password: string, storedHash: string) => {
  const [salt, hash] = storedHash.split(":");
  const newHash = pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return newHash === hash;
};

// Generate verification token
export const generateVerificationToken = () => {
  return randomBytes(32).toString("hex");
};