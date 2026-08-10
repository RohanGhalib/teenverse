import { NextRequest, NextResponse } from "next/server";
import { storeOtp } from "@/lib/otpStore";
import { sendOtpEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email, firstName } = await req.json();

    if (!email || !firstName) {
      return NextResponse.json(
        { error: "Email and First Name are required to send OTP." },
        { status: 400 }
      );
    }

    // Generate 6-digit numeric OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in OTP memory store
    storeOtp(email, otpCode);

    // Send email via Resend
    const result = await sendOtpEmail(email.toLowerCase().trim(), firstName, otpCode);

    if (!result.success) {
      console.warn("Failed to dispatch OTP email via Resend:", result.error);
    }

    return NextResponse.json({
      success: true,
      message: `OTP code sent to ${email}`,
      // For local development testing convenience, logging code in development mode:
      devCode: process.env.NODE_ENV === "development" ? otpCode : undefined,
    });
  } catch (err: any) {
    console.error("Send OTP Error:", err);
    return NextResponse.json(
      { error: "Failed to send OTP email.", details: err.message },
      { status: 500 }
    );
  }
}
