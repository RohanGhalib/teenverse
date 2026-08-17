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

    // 1. Fetch applications
    const { data: applications, error } = await supabase
      .from("volunteer_applications")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch applications error:", error);
      return NextResponse.json(
        { error: "Failed to fetch applications from database.", details: error.message },
        { status: 500 }
      );
    }

    // 2. Fetch corresponding users to join safely
    const { data: users } = await supabase.from("teenverse_users").select("*");
    const userMapByEmail = new Map<string, any>();
    const userMapById = new Map<string, any>();

    (users || []).forEach((u) => {
      if (u.email) userMapByEmail.set(u.email.toLowerCase().trim(), u);
      if (u.id) userMapById.set(u.id, u);
    });

    const enrichedApplications = (applications || []).map((app) => {
      const matchedUser =
        (app.user_id ? userMapById.get(app.user_id) : null) ||
        (app.email ? userMapByEmail.get(app.email.toLowerCase().trim()) : null) ||
        null;

      return {
        ...app,
        teenverse_users: matchedUser,
      };
    });

    return NextResponse.json({
      success: true,
      applications: enrichedApplications,
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

    // Attempt update with application_status and reviewer_notes
    let updatedApp: any = null;

    const { data: firstTry, error: firstErr } = await supabase
      .from("volunteer_applications")
      .update({
        application_status,
        reviewer_notes: reviewer_notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (firstErr) {
      // Fallback update without updated_at column in case table schema lacks it
      const { data: secondTry, error: secondErr } = await supabase
        .from("volunteer_applications")
        .update({
          application_status,
          reviewer_notes: reviewer_notes || null,
        })
        .eq("id", id)
        .select()
        .single();

      if (secondErr) {
        console.error("Failed to update application:", secondErr);
        return NextResponse.json(
          { error: "Failed to update application status in database.", details: secondErr.message },
          { status: 500 }
        );
      }
      updatedApp = secondTry;
    } else {
      updatedApp = firstTry;
    }

    // Look up applicant user record
    let applicantUser: any = null;
    if (updatedApp?.user_id) {
      const { data: u } = await supabase
        .from("teenverse_users")
        .select("*")
        .eq("id", updatedApp.user_id)
        .single();
      applicantUser = u;
    }

    if (!applicantUser && updatedApp?.email) {
      const { data: u } = await supabase
        .from("teenverse_users")
        .select("*")
        .eq("email", updatedApp.email.toLowerCase().trim())
        .single();
      applicantUser = u;
    }

    // Merge user metadata
    const fullApp = {
      ...updatedApp,
      teenverse_users: applicantUser,
    };

    // Dispatch status update email if requested
    let emailSent = false;
    if (sendEmailNotification && updatedApp?.email) {
      const firstName = applicantUser?.first_name || "Applicant";
      const toEmail = updatedApp.email.toLowerCase().trim();

      try {
        const emailResult = await sendStatusUpdateEmail({
          toEmail,
          firstName,
          applicationRef: updatedApp.application_ref || "APP-REF",
          newStatus: application_status,
          statusMessage: reviewer_notes || undefined,
          domainName: updatedApp.primary_domain || undefined,
        });
        emailSent = emailResult.success;
      } catch (mailErr) {
        console.warn("Notice: Failed to dispatch status update email:", mailErr);
      }
    }

    return NextResponse.json({
      success: true,
      application: fullApp,
      emailSent,
      message: `Application ${updatedApp.application_ref || id} status updated to "${application_status}".`,
    });
  } catch (err: any) {
    console.error("Admin Applications API PATCH error:", err);
    return NextResponse.json(
      { error: "Internal server error updating application.", details: err.message },
      { status: 500 }
    );
  }
}
