import { NextRequest, NextResponse } from "next/server";
import { storeOtp } from "@/lib/otpStore";
import { sendOtpEmail } from "@/lib/email";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Check if user exists in primary user base
    const { data: user } = await supabase
      .from("teenverse_users")
      .select("first_name")
      .eq("email", cleanEmail)
      .maybeSingle();

    const firstName = user?.first_name || "Teen";

    // 2. Generate 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Store OTP in memory store
    storeOtp(cleanEmail, otpCode);

    // 4. Send Email via Resend
    const result = await sendOtpEmail(cleanEmail, firstName, otpCode);

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to deliver OTP email. Please verify your email and try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      userExists: !!user,
      message: `OTP verification code sent to ${cleanEmail}`,
    });
  } catch (err: any) {
    console.error("Login OTP API Error:", err);
    return NextResponse.json(
      { error: "Internal server error generating login OTP.", details: err.message },
      { status: 500 }
    );
  }
}
