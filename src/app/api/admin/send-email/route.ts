import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { sendBatchBroadcastEmails, sendCustomBroadcastEmail } from "@/lib/email";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const authenticated = await isAdminAuthenticated(req);
    if (!authenticated) {
      return NextResponse.json(
        { error: "Unauthorized access. Admin authentication required." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const {
      recipients,
      subject,
      headline,
      badgeText,
      htmlBody,
      ctaButton,
      isTest,
      testEmail,
    } = body;

    if (!subject || typeof subject !== "string" || !subject.trim()) {
      return NextResponse.json(
        { error: "Email Subject is required." },
        { status: 400 }
      );
    }

    if (!htmlBody || typeof htmlBody !== "string" || !htmlBody.trim()) {
      return NextResponse.json(
        { error: "Email Body content is required." },
        { status: 400 }
      );
    }

    // Handle single test email
    if (isTest) {
      const targetTestEmail = (testEmail || "").trim().toLowerCase();
      if (!targetTestEmail || !EMAIL_REGEX.test(targetTestEmail)) {
        return NextResponse.json(
          { error: "A valid test email address is required." },
          { status: 400 }
        );
      }

      const testResult = await sendCustomBroadcastEmail({
        toEmail: targetTestEmail,
        subject: `[TEST] ${subject.trim()}`,
        headline: headline?.trim() || subject.trim(),
        badgeText: badgeText?.trim() || "TEST EMAIL PREVIEW",
        htmlBody,
        ctaButton:
          ctaButton?.text && ctaButton?.url
            ? { text: ctaButton.text.trim(), url: ctaButton.url.trim() }
            : undefined,
      });

      if (!testResult.success) {
        return NextResponse.json(
          { error: "Failed to send test email.", details: testResult.error },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        isTest: true,
        recipient: targetTestEmail,
        message: `Test email successfully sent to ${targetTestEmail}!`,
      });
    }

    // Validate broadcast recipients
    if (!Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json(
        { error: "At least one recipient email address is required." },
        { status: 400 }
      );
    }

    const validRecipients = Array.from(
      new Set(
        recipients
          .map((r) => (typeof r === "string" ? r.trim().toLowerCase() : ""))
          .filter((email) => EMAIL_REGEX.test(email))
      )
    );

    if (validRecipients.length === 0) {
      return NextResponse.json(
        { error: "No valid recipient email addresses found in the request." },
        { status: 400 }
      );
    }

    // Dispatch broadcast emails
    const result = await sendBatchBroadcastEmails(validRecipients, {
      subject: subject.trim(),
      headline: headline?.trim() || subject.trim(),
      badgeText: badgeText?.trim() || "TEENVERSE BROADCAST",
      htmlBody,
      ctaButton:
        ctaButton?.text && ctaButton?.url
          ? { text: ctaButton.text.trim(), url: ctaButton.url.trim() }
          : undefined,
    });

    return NextResponse.json({
      success: result.success,
      total: result.total,
      sentCount: result.sentCount,
      failedCount: result.failedCount,
      errors: result.errors,
      message: `Dispatched to ${result.sentCount} out of ${result.total} recipients.${
        result.failedCount > 0 ? ` (${result.failedCount} failed)` : ""
      }`,
    });
  } catch (err: any) {
    console.error("Admin Send Email API error:", err);
    return NextResponse.json(
      { error: "Internal server error while sending email.", details: err.message },
      { status: 500 }
    );
  }
}
