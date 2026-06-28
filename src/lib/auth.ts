// src/lib/auth.ts

import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const authOptions: NextAuthOptions = {
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  }),
  providers: [
    EmailProvider({
      // We send the magic-link email ourselves via Resend.
      async sendVerificationRequest({ identifier: email, url }) {
        try {
          await resend.emails.send({
            from: "PermitPeek <reports@citypermitpeek.com>",
            to: email,
            subject: "Sign in to PermitPeek",
            html: `
              <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #1c1917;">
                <p style="font-family: monospace; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #78716c; margin-bottom: 24px;">PermitPeek</p>
                <h1 style="font-size: 24px; font-weight: 300; margin-bottom: 16px;">Sign in to your account</h1>
                <p style="font-size: 15px; line-height: 1.6; color: #57534e; margin-bottom: 28px;">Click the button below to securely sign in. This link expires in 24 hours and can only be used once.</p>
                <a href="${url}" style="display: inline-block; background: #1c1917; color: #fafaf9; text-decoration: none; padding: 14px 28px; font-family: monospace; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; border-radius: 3px;">Sign in to PermitPeek</a>
                <p style="font-size: 13px; line-height: 1.6; color: #a8a29e; margin-top: 28px;">If you didn't request this, you can safely ignore this email.</p>
              </div>
            `,
          });
        } catch (error) {
          console.error("Failed to send verification email:", error);
          throw new Error("Failed to send verification email");
        }
      },
    }),
  ],
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/signin",
    verifyRequest: "/signin?check=email",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
