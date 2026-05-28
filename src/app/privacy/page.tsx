// src/app/privacy/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | PermitPeek",
  description: "PermitPeek Privacy Policy — how we handle your information.",
};

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#fafaf9", color: "#1c1917", fontFamily: "Georgia, 'Source Serif 4', serif" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "80px 24px" }}>
        <Link href="/" style={{ fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#78716c", textDecoration: "none" }}>
          ← Back to PermitPeek
        </Link>

        <h1 style={{ fontSize: "48px", fontWeight: 300, lineHeight: 1.1, marginTop: "32px", marginBottom: "8px" }}>
          Privacy Policy
        </h1>
        <p style={{ color: "#78716c", fontSize: "14px", marginBottom: "48px" }}>
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>

        <Section title="1. Information We Collect">
          We collect minimal information needed to operate the Service:
          (a) the addresses you search (to return permit results);
          (b) your email address, if you choose to provide it for reports or our newsletter;
          (c) payment information, which is processed securely by our payment provider (Stripe) — we never see or store your full card details;
          (d) basic analytics data such as pages visited and general location, collected automatically.
        </Section>

        <Section title="2. How We Use Your Information">
          We use your information to: provide permit search results; deliver reports you purchase;
          send you the email reports or newsletter you requested; improve the Service; and process payments.
          We do not sell your personal information to third parties.
        </Section>

        <Section title="3. Public Records">
          The permit data displayed on PermitPeek comes from publicly available government open-data sources.
          This information is already public record, published by municipal governments. We aggregate and present it;
          we do not generate it.
        </Section>

        <Section title="4. Cookies & Analytics">
          We use cookies and analytics tools to understand how visitors use the Service and to improve it.
          You can disable cookies in your browser settings, though some features may not work as intended.
        </Section>

        <Section title="5. Third-Party Services">
          We rely on trusted third-party services including Stripe (payments), Resend (email delivery),
          and Vercel (hosting). Each has its own privacy practices. Permit data is retrieved live from
          government open-data APIs.
        </Section>

        <Section title="6. Data Retention">
          We retain your email and account information for as long as you use the Service or until you
          request deletion. You may request deletion of your personal information at any time by contacting us.
        </Section>

        <Section title="7. Your Rights">
          Depending on your location, you may have rights to access, correct, or delete your personal
          information. To exercise these rights, contact us through the email on our website.
        </Section>

        <Section title="8. Children's Privacy">
          PermitPeek is not directed at children under 13 and we do not knowingly collect information from them.
        </Section>

        <Section title="9. Changes to This Policy">
          We may update this Privacy Policy periodically. The &quot;last updated&quot; date at the top reflects
          the most recent revision.
        </Section>

        <Section title="10. Contact">
          For privacy questions or requests, contact us through the email address listed on our website.
        </Section>

        <div style={{ marginTop: "64px", paddingTop: "32px", borderTop: "1px solid rgba(0,0,0,0.1)", fontSize: "13px", color: "#a8a29e" }}>
          © {new Date().getFullYear()} PermitPeek · We respect your privacy
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "36px" }}>
      <h2 style={{ fontSize: "22px", fontWeight: 400, marginBottom: "12px" }}>{title}</h2>
      <p style={{ fontSize: "16px", lineHeight: 1.7, color: "#44403c" }}>{children}</p>
    </div>
  );
}
