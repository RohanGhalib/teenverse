import { NextRequest, NextResponse } from "next/server";
import { storeOtp } from "@/lib/otpStore";
import { sendOtpEmail } from "@/lib/email";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Safely check if user exists in primary user base
    let firstName = "Teen";
    let userExists = false;

    try {
      const { data: userRecord } = await supabase
        .from("teenverse_users")
        .select("first_name")
        .eq("email", cleanEmail)
        .maybeSingle();

      if (userRecord) {
        userExists = true;
        if (userRecord.first_name) {
          firstName = userRecord.first_name;
        }
      }
    } catch (dbErr) {
      console.warn("Supabase user check notice in login-otp:", dbErr);
    }

    // 2. Generate 6-digit numeric OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Store OTP in memory store
    storeOtp(cleanEmail, otpCode);

    // 4. Send Email via Resend
    let emailSent = false;
    try {
      const result = await sendOtpEmail(cleanEmail, firstName, otpCode);
      emailSent = result.success;
      if (!result.success) {
        console.warn("Resend email dispatch notice:", result.error);
      }
    } catch (mailErr) {
      console.warn("Email dispatch error:", mailErr);
    }

    return NextResponse.json({
      success: true,
      userExists,
      emailSent,
      message: `OTP verification code sent to ${cleanEmail}`,
      devCode: process.env.NODE_ENV === "development" ? otpCode : undefined,
    });
  } catch (err: any) {
    console.error("Login OTP API Error:", err);
    return NextResponse.json(
      { error: "Internal server error generating login OTP.", details: err.message },
      { status: 500 }
    );
  }
}
