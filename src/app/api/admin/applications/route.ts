import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { supabase } from "@/lib/supabase";
import { sendStatusUpdateEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  try {
    const authenticated = await isAdminAuthenticated(req);
    if (!authenticated) {
      return NextResponse.json(
        { error: "Unauthorized access. Admin authentication required." },
        { status: 401 }
      );
    }

    // Fetch applications joined with user metadata
    const { data: applications, error } = await supabase
      .from("volunteer_applications")
      .select("*, teenverse_users(*)")
      .order("submitted_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch applications error:", error);
      return NextResponse.json(
        { error: "Failed to fetch applications from database.", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      applications: applications || [],
    });
  } catch (err: any) {
    console.error("Admin Applications API GET error:", err);
    return NextResponse.json(
      { error: "Internal server error fetching applications.", details: err.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authenticated = await isAdminAuthenticated(req);
    if (!authenticated) {
      return NextResponse.json(
        { error: "Unauthorized access. Admin authentication required." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { id, application_status, reviewer_notes, sendEmailNotification } = body;

    if (!id || !application_status) {
      return NextResponse.json(
        { error: "Application ID and application_status are required." },
        { status: 400 }
      );
    }

    // Update application in Supabase
    const { data: updatedApp, error: updateErr } = await supabase
      .from("volunteer_applications")
      .update({
        application_status,
        reviewer_notes: reviewer_notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*, teenverse_users(*)")
      .single();

    if (updateErr) {
      console.error("Failed to update application:", updateErr);
      return NextResponse.json(
        { error: "Failed to update application status.", details: updateErr.message },
        { status: 500 }
      );
    }

    // Optionally dispatch Resend email notification
    let emailSent = false;
    if (sendEmailNotification && updatedApp) {
      const user = updatedApp.teenverse_users;
      const firstName = user?.first_name || "Applicant";
      const toEmail = updatedApp.email;

      if (toEmail && ["under_review", "accepted", "orientation_scheduled", "rejected"].includes(application_status)) {
        try {
          const emailResult = await sendStatusUpdateEmail({
            toEmail,
            firstName,
            applicationRef: updatedApp.application_ref,
            newStatus: application_status as any,
            statusMessage: reviewer_notes || undefined,
          });
          emailSent = emailResult.success;
        } catch (mailErr) {
          console.warn("Notice: Failed to dispatch status update email:", mailErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      application: updatedApp,
      emailSent,
      message: `Application ${updatedApp.application_ref} status updated to ${application_status}.`,
    });
  } catch (err: any) {
    console.error("Admin Applications API PATCH error:", err);
    return NextResponse.json(
      { error: "Internal server error updating application.", details: err.message },
      { status: 500 }
    );
  }
}
