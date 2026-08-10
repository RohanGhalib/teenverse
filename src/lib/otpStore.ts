// Server-side OTP store with expiration
interface OtpEntry {
  code: string;
  expiresAt: number;
}

const otpMap = new Map<string, OtpEntry>();

export function storeOtp(email: string, code: string) {
  const cleanEmail = email.toLowerCase().trim();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes valid
  otpMap.set(cleanEmail, { code, expiresAt });
}

export function verifyOtpCode(email: string, inputCode: string): boolean {
  const cleanEmail = email.toLowerCase().trim();
  const entry = otpMap.get(cleanEmail);

  if (!entry) return false;

  if (Date.now() > entry.expiresAt) {
    otpMap.delete(cleanEmail);
    return false;
  }

  if (entry.code === inputCode.trim()) {
    otpMap.delete(cleanEmail); // One-time use
    return true;
  }

  return false;
}
