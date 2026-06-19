import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key || key === "re_placeholder") {
    return null;
  }
  return new Resend(key);
}

// Where contact messages are delivered
const CONTACT_INBOX = "citypermitpeek@gmail.com";

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !email.includes("@") || !message || message.trim().length < 3) {
      return NextResponse.json(
        { error: "Please fill in your name, a valid email, and a message." },
        { status: 400 }
      );
    }

    const resend = getResend();

    // Dev fallback when no API key set
    if (!resend) {
      console.log(`[DEV] Contact message from ${name} <${email}>: ${message}`);
      return NextResponse.json({ success: true, dev: true });
    }

    await resend.emails.send({
      from: "PermitPeek Contact <reports@citypermitpeek.com>",
      to: CONTACT_INBOX,
      replyTo: email,
      subject: `New contact message from ${name}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="font-weight: 300; color: #1c1917;">New message via PermitPeek</h2>
          <p style="color: #44403c;"><strong>Name:</strong> ${name}</p>
          <p style="color: #44403c;"><strong>Email:</strong> ${email}</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
          <p style="color: #1c1917; white-space: pre-wrap; line-height: 1.6;">${message}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json({ error: "Failed to send. Please try again." }, { status: 500 });
  }
}
