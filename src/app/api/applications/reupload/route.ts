import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to re-upload documents." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { applicationId, studentProofUrl, studentProofName } = body;

    if (!applicationId || !studentProofUrl) {
      return NextResponse.json(
        { error: "Application ID and student proof document URL are required." },
        { status: 400 }
      );
    }

    // 1. Update volunteer_applications status back to under_review
    const { data: updatedApp, error: appErr } = await supabase
      .from("volunteer_applications")
      .update({
        application_status: "under_review",
        reviewer_notes: "Document re-uploaded by applicant. Pending re-evaluation.",
        updated_at: new Date().toISOString(),
      })
      .eq("id", applicationId)
      .select()
      .single();

    if (appErr) {
      console.error("Failed to update application status on reupload:", appErr);
      return NextResponse.json(
        { error: "Failed to update application record.", details: appErr.message },
        { status: 500 }
      );
    }

    // 2. Update teenverse_users student_proof_url
    if (session.id) {
      await supabase
        .from("teenverse_users")
        .update({
          student_proof_url: studentProofUrl || studentProofName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.id);
    }

    return NextResponse.json({
      success: true,
      application: updatedApp,
      message: "Document re-uploaded successfully! Your application is back under review.",
    });
  } catch (err: any) {
    console.error("Re-upload API error:", err);
    return NextResponse.json(
      { error: "Internal server error during document re-upload.", details: err.message },
      { status: 500 }
    );
  }
}
