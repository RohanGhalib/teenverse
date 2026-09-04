import crypto from "crypto";

/**
 * AuthMe SHA256 format: $SHA$salt$hash
 * where hash = sha256(sha256(password) + salt)
 */
export function hashAuthMeSha256(password: string): string {
  const salt = crypto.randomBytes(8).toString("hex");
  const sha256Pass = crypto.createHash("sha256").update(password).digest("hex");
  const hash = crypto.createHash("sha256").update(sha256Pass + salt).digest("hex");
  return `$SHA$${salt}$${hash}`;
}

/**
 * Verify AuthMe SHA256 password hash
 */
export function verifyAuthMeSha256(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.startsWith("$SHA$")) return false;
  const parts = storedHash.split("$");
  if (parts.length !== 4) return false;
  const salt = parts[2];
  const expectedHash = parts[3];

  const sha256Pass = crypto.createHash("sha256").update(password).digest("hex");
  const computedHash = crypto.createHash("sha256").update(sha256Pass + salt).digest("hex");
  return computedHash.toLowerCase() === expectedHash.toLowerCase();
}
