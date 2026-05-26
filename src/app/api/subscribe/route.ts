import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key || key === "re_placeholder") {
    return null;
  }
  return new Resend(key);
}

export async function POST(request: NextRequest) {
  try {
    const { email, city, address } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      );
    }

    const resend = getResend();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Dev fallback when no API key set
    if (!resend) {
      console.log(`[DEV] Subscription: ${email} for ${city}/${address}`);
      return NextResponse.json({ success: true, dev: true });
    }

    await resend.emails.send({
      from: "PermitPeek <reports@permitpeek.com>",
      to: email,
      subject: `Your permit report: ${address}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h1 style="font-size: 28px; font-weight: 300; color: #1c1917;">
            Your PermitPeek report is ready
          </h1>
          <p style="font-size: 16px; line-height: 1.6; color: #44403c;">
            Thanks for using PermitPeek. Your full report for
            <strong>${address}</strong> in ${city} is now unlocked.
          </p>
          <p style="margin: 32px 0;">
            <a href="${baseUrl}/report?city=${city}&address=${encodeURIComponent(address)}&unlocked=true"
               style="background: #1c1917; color: white; padding: 12px 24px; text-decoration: none; display: inline-block;">
              View Full Report →
            </a>
          </p>
          <hr style="margin: 32px 0; border: none; border-top: 1px solid #ddd;" />
          <p style="color: #78716c; font-size: 13px;">
            You'll get our weekly digest of new permits in your area. Unsubscribe anytime.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Subscribe failed" },
      { status: 500 }
    );
  }
}
