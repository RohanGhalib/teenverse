import { NextRequest, NextResponse } from "next/server";
import { verifyOtpCode } from "@/lib/otpStore";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP code are required." },
        { status: 400 }
      );
    }

    const isValid = verifyOtpCode(email, otp);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or expired OTP code. Please check your inbox or resend a new code." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      message: "Email verified successfully!",
    });
  } catch (err: any) {
    console.error("Verify OTP Error:", err);
    return NextResponse.json(
      { error: "Failed to verify OTP code.", details: err.message },
      { status: 500 }
    );
  }
}
