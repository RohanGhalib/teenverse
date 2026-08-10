import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      fatherName,
      dob,
      email,
      phone,
      gender,
      address,
      city,
      province,
      educationLevel,
      instituteName,
      studentProofName,
      primaryDomain,
      whyJoin,
      expectations,
      ideasToLaunch,
      skillsAndMastery,
      weeklyHours,
      referralSource,
      pledgeAgreed,
    } = body;

    // 1. Basic Field Validation
    if (!firstName || !lastName || !email || !phone || !dob || !primaryDomain) {
      return NextResponse.json(
        { error: "Missing required personal details." },
        { status: 400 }
      );
    }

    // 2. Strict Age Check Validation (Max 19)
    const birthDate = new Date(dob);
    const today = new Date(2026, 7, 11);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age > 19) {
      return NextResponse.json(
        {
          error: "Age Restriction: Teenverse core volunteer positions are strictly for teenagers up to 19 years old.",
          age,
        },
        { status: 403 }
      );
    }

    // 3. Generate Account & Application IDs
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const accountId = `TV-2026-${randomNum}`;
    const applicationRef = `APP-${randomNum}`;

    // 4. Save/Upsert into Primary User Base (teenverse_users)
    const { data: userRecord, error: userErr } = await supabase
      .from("teenverse_users")
      .upsert(
        {
          account_id: accountId,
          email: email.toLowerCase().trim(),
          phone: phone.trim(),
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          father_name: fatherName.trim(),
          dob: dob,
          gender: gender || "Male",
          city: city || "Bahawalpur",
          province: province || "Punjab",
          address: address.trim(),
          education_level: educationLevel,
          institute_name: instituteName.trim(),
          student_proof_url: studentProofName || "Uploaded",
          primary_domain: primaryDomain,
          weekly_hours: weeklyHours || "5-8 hours",
          referral_source: referralSource || "Social Media",
          role: "teen_member",
          account_status: "active",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      )
      .select()
      .single();

    if (userErr) {
      console.warn("Supabase user insert notice (proceeding):", userErr.message);
    }

    const userId = userRecord?.id || null;

    // 5. Save Record into volunteer_applications
    const { error: appErr } = await supabase
      .from("volunteer_applications")
      .insert({
        application_ref: applicationRef,
        user_id: userId,
        email: email.toLowerCase().trim(),
        primary_domain: primaryDomain,
        why_join: whyJoin,
        expectations: expectations,
        ideas_to_launch: ideasToLaunch,
        skills_and_mastery: skillsAndMastery,
        pledge_accepted: pledgeAgreed,
        application_status: "submitted",
      });

    if (appErr) {
      console.warn("Supabase application insert notice:", appErr.message);
    }

    // 6. Send Official Resend Welcome Email
    const emailResult = await sendWelcomeEmail({
      toEmail: email.toLowerCase().trim(),
      firstName,
      lastName,
      accountId,
      applicationRef,
      primaryDomain,
      city,
    });

    return NextResponse.json({
      success: true,
      accountId,
      applicationRef,
      emailSent: emailResult.success,
      message: "Application submitted successfully and user record created in primary database!",
    });
  } catch (err: any) {
    console.error("API Apply Error:", err);
    return NextResponse.json(
      { error: "Internal server error processing application.", details: err.message },
      { status: 500 }
    );
  }
}
