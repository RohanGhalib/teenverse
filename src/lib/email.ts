import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY || "";
export const resend = new Resend(resendApiKey);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Teenverse Pakistan <welcome@mail.teenverse.org>";

// Public URLs for links and assets in emails
const LOGO_URL = "https://raw.githubusercontent.com/RohanGhalib/teenverse/main/public/logo.png";
const INSTAGRAM_URL = "https://instagram.com/teenversepk";
const DISCORD_URL = "https://discord.gg/7798S8e4z3";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://teenverse.org";

export interface WelcomeEmailParams {
  toEmail: string;
  firstName: string;
  lastName: string;
  accountId: string;
  applicationRef: string;
  primaryDomain: string;
  city: string;
}

export interface StatusUpdateEmailParams {
  toEmail: string;
  firstName: string;
  applicationRef: string;
  newStatus: "submitted" | "under_review" | "shortlisted" | "accepted" | "orientation_scheduled" | "rejected";
  statusMessage?: string;
  domainName?: string;
}

/**
 * Common Social & Community CTA block for all Teenverse emails
 */
function getEmailSocialFooter(): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 24px; border-top: 1px solid #166B42; padding-top: 20px;">
      <tr>
        <td align="center">
          <p style="margin: 0 0 12px 0; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #CCFF00; font-family: monospace;">
            CONNECT WITH TEENVERSE SQUAD
          </p>
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding: 4px 6px;">
                <a href="${INSTAGRAM_URL}" target="_blank" style="display: inline-block; background: linear-gradient(45deg, #E1306C, #F77737); color: #FFFFFF; text-decoration: none; font-size: 11px; font-weight: 800; padding: 7px 14px; border-radius: 8px; font-family: sans-serif;">
                  📸 Instagram @teenversepk
                </a>
              </td>
              <td style="padding: 4px 6px;">
                <a href="${DISCORD_URL}" target="_blank" style="display: inline-block; background-color: #5865F2; color: #FFFFFF; text-decoration: none; font-size: 11px; font-weight: 800; padding: 7px 14px; border-radius: 8px; font-family: sans-serif;">
                  🎮 Join Discord Community
                </a>
              </td>
              <td style="padding: 4px 6px;">
                <a href="${SITE_URL}/cockpit" target="_blank" style="display: inline-block; background-color: #CCFF00; color: #042113; text-decoration: none; font-size: 11px; font-weight: 900; padding: 7px 14px; border-radius: 8px; font-family: monospace;">
                  ⚡ Cockpit Portal
                </a>
              </td>
            </tr>
          </table>
          <p style="margin: 16px 0 0 0; font-size: 11px; color: #6EE7B7; font-family: monospace;">
            © 2026 TEENVERSE PAKISTAN • "Cool nerds doing fun things." 💚
          </p>
          <p style="margin: 4px 0 0 0; font-size: 10px; color: #34D399; opacity: 0.7; font-family: sans-serif;">
            Empowering Pakistani Teen Builders, Coders & Creators.
          </p>
        </td>
      </tr>
    </table>
  `;
}

/**
 * Send 6-digit Numeric OTP Email via Resend
 */
export async function sendOtpEmail(toEmail: string, firstName: string, otpCode: string) {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Teenverse Verification Code</title>
      </head>
      <body style="margin: 0; padding: 24px 12px; background-color: #041D10; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 520px; background-color: #082D19; border: 3px solid #CCFF00; border-radius: 16px; box-shadow: 0 12px 35px rgba(0,0,0,0.6); overflow: hidden;">
                <!-- Header -->
                <tr>
                  <td align="center" style="background-color: #042113; padding: 24px 20px; border-bottom: 2px solid #166B42;">
                    <img src="${LOGO_URL}" alt="Teenverse Logo" width="130" style="display: block; margin: 0 auto 10px auto; max-width: 130px; height: auto;" />
                    <span style="display: inline-block; background-color: #CCFF00; color: #042113; font-size: 10px; font-weight: 900; font-family: monospace; padding: 3px 10px; border-radius: 12px; text-transform: uppercase; letter-spacing: 1px;">
                      EMAIL VERIFICATION
                    </span>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 28px 24px; text-align: center;">
                    <h2 style="margin: 0 0 12px 0; color: #FFFFFF; font-size: 22px; font-weight: 800; line-height: 1.3;">
                      Hey ${firstName}! 👋
                    </h2>
                    <p style="margin: 0 0 20px 0; color: #E6FFFA; font-size: 14px; line-height: 1.6;">
                      Use the 6-digit one-time passcode below to verify your email address and continue with your Teenverse application:
                    </p>

                    <!-- OTP Code Box -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="padding: 10px 0 20px 0;">
                          <div style="display: inline-block; background-color: #042113; color: #CCFF00; font-size: 38px; font-weight: 900; font-family: 'Courier New', monospace; letter-spacing: 8px; padding: 14px 28px; border-radius: 14px; border: 3px solid #CCFF00; box-shadow: 0 4px 18px rgba(204,255,0,0.25);">
                            ${otpCode}
                          </div>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 0 0 16px 0; color: #A7F3D0; font-size: 12px; line-height: 1.5; font-family: monospace;">
                      ⏳ This verification code expires in <strong>10 minutes</strong>.
                    </p>
                    <p style="margin: 0; color: #6EE7B7; font-size: 11px; line-height: 1.4;">
                      If you didn&apos;t request this verification code, you can safely ignore this email.
                    </p>

                    ${getEmailSocialFooter()}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: [toEmail],
      subject: `🔑 Your Teenverse Verification Code: ${otpCode}`,
      html: htmlContent,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send OTP email via Resend:", error);
    return { success: false, error };
  }
}

/**
 * Send official Welcome & Application Confirmation Email via Resend
 */
export async function sendWelcomeEmail(params: WelcomeEmailParams) {
  const { toEmail, firstName, lastName, accountId, applicationRef, primaryDomain, city } = params;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Teenverse Pakistan</title>
      </head>
      <body style="margin: 0; padding: 24px 12px; background-color: #041D10; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #082D19; border: 3px solid #CCFF00; border-radius: 16px; box-shadow: 0 12px 35px rgba(0,0,0,0.6); overflow: hidden;">
                <!-- Header -->
                <tr>
                  <td align="center" style="background-color: #042113; padding: 26px 20px; border-bottom: 2px solid #166B42;">
                    <img src="${LOGO_URL}" alt="Teenverse Logo" width="140" style="display: block; margin: 0 auto 12px auto; max-width: 140px; height: auto;" />
                    <div style="display: inline-block; background-color: #CCFF00; color: #042113; font-size: 11px; font-weight: 900; font-family: monospace; padding: 4px 12px; border-radius: 14px; text-transform: uppercase; letter-spacing: 1px;">
                      ACCOUNT ID: ${accountId}
                    </div>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding: 30px 24px;">
                    <h1 style="margin: 0 0 12px 0; color: #FFFFFF; font-size: 24px; font-weight: 900; line-height: 1.3;">
                      Welcome to the Squad, ${firstName}! 🚀
                    </h1>
                    <p style="margin: 0 0 18px 0; color: #E6FFFA; font-size: 14px; line-height: 1.6;">
                      Your application for the <strong style="color: #CCFF00;">${primaryDomain}</strong> domain has been successfully submitted and your central Teenverse Account is now active!
                    </p>

                    <!-- Account Details Card -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #042113; border: 2px solid #166B42; border-radius: 12px; margin: 18px 0; padding: 18px;">
                      <tr>
                        <td>
                          <p style="margin: 0 0 10px 0; font-size: 11px; font-weight: 800; color: #CCFF00; font-family: monospace; text-transform: uppercase; letter-spacing: 1px;">
                            📋 OFFICIAL ACCOUNT CREDENTIALS
                          </p>
                          <table width="100%" cellpadding="4" cellspacing="0" border="0" style="font-size: 13px; font-family: monospace; color: #E6FFFA;">
                            <tr>
                              <td style="color: #6EE7B7; width: 40%;">Account ID:</td>
                              <td style="color: #CCFF00; font-weight: bold;">${accountId}</td>
                            </tr>
                            <tr>
                              <td style="color: #6EE7B7;">Application Ref:</td>
                              <td style="color: #00F0FF; font-weight: bold;">${applicationRef}</td>
                            </tr>
                            <tr>
                              <td style="color: #6EE7B7;">Full Name:</td>
                              <td style="color: #FFFFFF; font-weight: bold;">${firstName} ${lastName}</td>
                            </tr>
                            <tr>
                              <td style="color: #6EE7B7;">Target Domain:</td>
                              <td style="color: #FFFFFF; font-weight: bold;">${primaryDomain}</td>
                            </tr>
                            <tr>
                              <td style="color: #6EE7B7;">City:</td>
                              <td style="color: #FFFFFF; font-weight: bold;">${city}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Cockpit Action Button -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
                      <tr>
                        <td align="center">
                          <a href="${SITE_URL}/cockpit" target="_blank" style="display: inline-block; background-color: #CCFF00; color: #042113; text-decoration: none; font-size: 13px; font-weight: 900; padding: 12px 28px; border-radius: 12px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(204,255,0,0.3);">
                            ⚡ OPEN MY COCKPIT &amp; DIGITAL ID &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Volunteer Pledge Box -->
                    <div style="background-color: #052715; border-left: 4px solid #CCFF00; padding: 14px 16px; margin: 20px 0; border-radius: 4px;">
                      <p style="margin: 0; color: #D1FAE5; font-size: 12px; line-height: 1.6; font-style: italic;">
                        &ldquo;As a volunteer member of Teenverse Pakistan, I pledge to act with integrity, support every member of our squad, and focus on BUILDING real solutions for our community.&rdquo;
                      </p>
                    </div>

                    <!-- Next Steps -->
                    <h3 style="margin: 20px 0 10px 0; color: #00F0FF; font-size: 14px; font-weight: 800; text-transform: uppercase; font-family: monospace; letter-spacing: 0.5px;">
                      WHAT HAPPENS NEXT?
                    </h3>
                    <table width="100%" cellpadding="4" cellspacing="0" border="0" style="font-size: 13px; color: #E6FFFA; line-height: 1.6;">
                      <tr>
                        <td style="vertical-align: top; color: #CCFF00; font-weight: bold; width: 22px;">1.</td>
                        <td>Our leadership team will review your student verification and skills.</td>
                      </tr>
                      <tr>
                        <td style="vertical-align: top; color: #CCFF00; font-weight: bold;">2.</td>
                        <td>You will receive status updates via email &amp; Discord onboarding.</td>
                      </tr>
                      <tr>
                        <td style="vertical-align: top; color: #CCFF00; font-weight: bold;">3.</td>
                        <td>Make sure to connect your Discord in Cockpit to claim your roles!</td>
                      </tr>
                    </table>

                    ${getEmailSocialFooter()}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: [toEmail],
      subject: `🚀 Welcome to Teenverse! Account ID: ${accountId}`,
      html: htmlContent,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send welcome email via Resend:", error);
    return { success: false, error };
  }
}

/**
 * Send Application Status Update Email via Resend
 */
export async function sendStatusUpdateEmail(params: StatusUpdateEmailParams) {
  const { toEmail, firstName, applicationRef, newStatus, statusMessage, domainName } = params;

  const statusConfig: Record<string, { title: string; badge: string; color: string; bg: string; subtitle: string }> = {
    submitted: {
      title: "Application Received & Queued 📥",
      badge: "SUBMITTED ⚪",
      color: "#FFFFFF",
      bg: "#166B42",
      subtitle: "Your application is logged in our central database and queued for review.",
    },
    under_review: {
      title: "Application Under Active Review 🔍",
      badge: "UNDER REVIEW 🟡",
      color: "#042113",
      bg: "#FFCC00",
      subtitle: "Our domain squad leads are currently evaluating your profile and motivation answers.",
    },
    shortlisted: {
      title: "You're Shortlisted for Season '26! ✨",
      badge: "SHORTLISTED 🌟",
      color: "#042113",
      bg: "#00F0FF",
      subtitle: "Great news! You have passed the first stage of evaluation.",
    },
    accepted: {
      title: "Congratulations! Application ACCEPTED 🎉",
      badge: "ACCEPTED 🟢",
      color: "#042113",
      bg: "#CCFF00",
      subtitle: "Welcome officially to the Teenverse Pakistan core volunteer squad!",
    },
    orientation_scheduled: {
      title: "Orientation / Onboarding Scheduled! 🚀",
      badge: "ORIENTATION SCHEDULED 🎯",
      color: "#FFFFFF",
      bg: "#FF3366",
      subtitle: "Your domain squad onboarding and orientation session has been scheduled.",
    },
    rejected: {
      title: "Update Regarding Your Application 🤍",
      badge: "APPLICATION UPDATE 📋",
      color: "#FFFFFF",
      bg: "#4B5563",
      subtitle: "Thank you for applying to Teenverse Pakistan. We encourage you to keep building and participate in our open public hackathons.",
    },
  };

  const currentStatus = statusConfig[newStatus] || statusConfig.under_review;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Teenverse Application Status Update</title>
      </head>
      <body style="margin: 0; padding: 24px 12px; background-color: #041D10; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #082D19; border: 3px solid #CCFF00; border-radius: 16px; box-shadow: 0 12px 35px rgba(0,0,0,0.6); overflow: hidden;">
                <!-- Header -->
                <tr>
                  <td align="center" style="background-color: #042113; padding: 24px 20px; border-bottom: 2px solid #166B42;">
                    <img src="${LOGO_URL}" alt="Teenverse Logo" width="130" style="display: block; margin: 0 auto 10px auto; max-width: 130px; height: auto;" />
                    <span style="display: inline-block; background-color: ${currentStatus.bg}; color: ${currentStatus.color}; font-size: 11px; font-weight: 900; font-family: monospace; padding: 4px 12px; border-radius: 12px; text-transform: uppercase; letter-spacing: 1px;">
                      ${currentStatus.badge}
                    </span>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding: 28px 24px;">
                    <h2 style="margin: 0 0 10px 0; color: #FFFFFF; font-size: 22px; font-weight: 900; line-height: 1.3;">
                      Hi ${firstName},
                    </h2>
                    <p style="margin: 0 0 16px 0; color: #E6FFFA; font-size: 14px; line-height: 1.6;">
                      There is an official status update regarding your Teenverse volunteer application (Ref: <strong style="color: #CCFF00; font-family: monospace;">${applicationRef}</strong>)${domainName ? ` for <strong>${domainName}</strong>` : ""}:
                    </p>

                    <!-- Status Display Box -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #042113; border: 2px solid #166B42; border-radius: 12px; margin: 16px 0; padding: 18px;">
                      <tr>
                        <td>
                          <div style="font-size: 16px; font-weight: 900; color: #CCFF00; font-family: monospace; margin-bottom: 6px;">
                            ${currentStatus.title}
                          </div>
                          <div style="font-size: 13px; color: #D1FAE5; line-height: 1.5;">
                            ${currentStatus.subtitle}
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- Custom Reviewer Notes if provided -->
                    ${
                      statusMessage
                        ? `
                        <div style="background-color: #052715; border-left: 4px solid #00F0FF; padding: 14px 16px; margin: 18px 0; border-radius: 6px;">
                          <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 800; color: #00F0FF; font-family: monospace; text-transform: uppercase; letter-spacing: 0.5px;">
                            💬 MESSAGE FROM REVIEWER / SQUAD LEAD:
                          </p>
                          <p style="margin: 0; color: #F0FFF4; font-size: 13px; line-height: 1.6; white-space: pre-wrap;">
                            ${statusMessage}
                          </p>
                        </div>
                      `
                        : ""
                    }

                    <!-- Cockpit Action Button -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0 16px 0;">
                      <tr>
                        <td align="center">
                          <a href="${SITE_URL}/cockpit" target="_blank" style="display: inline-block; background-color: #CCFF00; color: #042113; text-decoration: none; font-size: 13px; font-weight: 900; padding: 12px 28px; border-radius: 12px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(204,255,0,0.3);">
                            ⚡ VIEW STATUS IN COCKPIT &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>

                    ${getEmailSocialFooter()}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: [toEmail],
      subject: `⚡ Teenverse Status Update: ${currentStatus.title}`,
      html: htmlContent,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send status update email via Resend:", error);
    return { success: false, error };
  }
}
