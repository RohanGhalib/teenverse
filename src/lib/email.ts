import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY || "";
export const resend = new Resend(resendApiKey);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Teenverse Pakistan <welcome@mail.teenverse.org>";


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
  newStatus: "under_review" | "accepted" | "orientation_scheduled" | "rejected";
  statusMessage?: string;
}

/**
 * Send 6-digit Numeric OTP Email via Resend
 */
export async function sendOtpEmail(toEmail: string, firstName: string, otpCode: string) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #082D19; color: #F0FFF4; margin: 0; padding: 20px; }
          .container { max-width: 500px; margin: 0 auto; background-color: #09341E; border: 4px solid #CCFF00; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); text-align: center; padding: 30px 24px; }
          .title { color: #CCFF00; font-size: 24px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
          .otp-box { background-color: #042113; color: #CCFF00; font-size: 36px; font-weight: 900; font-family: monospace; letter-spacing: 8px; padding: 18px 28px; border-radius: 14px; border: 3px solid #CCFF00; display: inline-block; margin: 24px 0; box-shadow: 0 4px 15px rgba(204,255,0,0.2); }
          .footer { font-size: 12px; color: #6EE7B7; border-top: 1px solid #166B42; pt: 16px; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="title">TEENVERSE VERIFICATION</h1>
          <p style="font-size: 15px; color: #E6FFFA;">Hi ${firstName}! Enter this 6-digit OTP code to verify your email and unlock Phase 2 of your Teenverse application:</p>
          
          <div class="otp-box">${otpCode}</div>

          <p style="font-size: 13px; color: #A7F3D0;">Copy and paste this code into your application window. This code expires in 10 minutes.</p>

          <div class="footer">
            <p>© 2026 TEENVERSE PAKISTAN • "Cool nerds doing fun things." 💚</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: [toEmail],
      subject: `🔑 Your Teenverse OTP Code: ${otpCode}`,
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
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #082D19; color: #F0FFF4; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #09341E; border: 4px solid #CCFF00; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          .header { background-color: #042113; padding: 24px; text-align: center; border-bottom: 2px solid #166B42; }
          .title { color: #CCFF00; font-size: 26px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
          .badge { background-color: #CCFF00; color: #042113; font-weight: 800; font-family: monospace; padding: 4px 12px; border-radius: 20px; font-size: 12px; display: inline-block; margin-top: 10px; }
          .body { padding: 30px 24px; line-height: 1.6; }
          .highlight { color: #CCFF00; font-weight: bold; }
          .card { background-color: #042113; border: 2px solid #166B42; border-radius: 12px; padding: 16px; margin: 20px 0; font-family: monospace; font-size: 13px; }
          .pledge-box { background-color: #062916; border-left: 4px solid #CCFF00; padding: 14px; margin: 20px 0; font-style: italic; font-size: 13px; }
          .footer { background-color: #03170D; padding: 16px; text-align: center; font-size: 12px; color: #6EE7B7; border-top: 1px solid #166B42; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="title">TEENVERSE PAKISTAN</h1>
            <div class="badge">TEENVERSE ACCOUNT ID: ${accountId}</div>
          </div>

          <div class="body">
            <h2>Welcome to the Squad, ${firstName}! 🎉</h2>
            <p>Your application for <span class="highlight">${primaryDomain}</span> has been received and your Teenverse Account is active!</p>
            
            <div class="card">
              <p><strong style="color: #CCFF00;">OFFICIAL ACCOUNT DETAILS:</strong></p>
              <p>• Teenverse Account ID: <strong>${accountId}</strong></p>
              <p>• Application Ref: <strong>${applicationRef}</strong></p>
              <p>• Full Name: ${firstName} ${lastName}</p>
              <p>• City: ${city}</p>
              <p>• Target Domain: ${primaryDomain}</p>
            </div>

            <p>Your Teenverse Account provides you Single Sign-On (SSO) access to future hackathons, build nights, and events!</p>

            <div class="pledge-box">
              "As a volunteer member of Teenverse Pakistan, I pledge to hold myself accountable, act with integrity, respect every member of our squad, and focus on BUILDING real solutions for my community rather than just talking."
            </div>

            <h3>WHAT HAPPENS NEXT?</h3>
            <ol>
              <li>Our team will review your student verification proof and Q/A answers.</li>
              <li>You will receive a WhatsApp message and orientation invitation within 24-48 hours.</li>
              <li>Get ready for our upcoming build sprints and hackathons!</li>
            </ol>
          </div>

          <div class="footer">
            <p>© 2026 TEENVERSE PAKISTAN • "Cool nerds doing fun things." 💚</p>
          </div>
        </div>
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
 * Send Status Update Email via Resend
 */
export async function sendStatusUpdateEmail(params: StatusUpdateEmailParams) {
  const { toEmail, firstName, applicationRef, newStatus, statusMessage } = params;

  const statusTitles = {
    under_review: "Application Under Active Review 🔍",
    accepted: "Congratulations! Application ACCEPTED 🎉",
    orientation_scheduled: "Orientation Scheduled! 🚀",
    rejected: "Update Regarding Your Application",
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: sans-serif; background-color: #082D19; color: #F0FFF4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #09341E; border: 3px solid #CCFF00; border-radius: 12px; padding: 24px;">
          <h2 style="color: #CCFF00; margin-top: 0;">TEENVERSE PAKISTAN STATUS UPDATE</h2>
          <p>Hi ${firstName},</p>
          <p>There is an update on your Teenverse volunteer application (Ref: <strong>${applicationRef}</strong>):</p>
          
          <div style="background: #042113; border: 2px solid #166B42; padding: 16px; border-radius: 8px; font-weight: bold; color: #CCFF00; font-size: 16px;">
            ${statusTitles[newStatus]}
          </div>

          ${statusMessage ? `<p style="margin-top: 16px; font-size: 14px;">${statusMessage}</p>` : ""}

          <p style="margin-top: 24px; font-size: 12px; color: #A7F3D0;">If you have any questions, reach out on our WhatsApp or Discord community!</p>
        </div>
      </body>
    </html>
  `;

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: [toEmail],
      subject: `⚡ Teenverse Status Update: ${statusTitles[newStatus]}`,
      html: htmlContent,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send status update email via Resend:", error);
    return { success: false, error };
  }
}
