// src/app/terms/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | PermitPeek",
  description: "PermitPeek Terms of Service — the rules for using our building permit lookup service.",
};

export default function TermsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#fafaf9", color: "#1c1917", fontFamily: "Georgia, 'Source Serif 4', serif" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "80px 24px" }}>
        <Link href="/" style={{ fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#78716c", textDecoration: "none" }}>
          ← Back to PermitPeek
        </Link>

        <h1 style={{ fontSize: "48px", fontWeight: 300, lineHeight: 1.1, marginTop: "32px", marginBottom: "8px" }}>
          Terms of Service
        </h1>
        <p style={{ color: "#78716c", fontSize: "14px", marginBottom: "48px" }}>
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>

        <Section title="1. Acceptance of Terms">
          By accessing or using PermitPeek (&quot;the Service&quot;), you agree to be bound by these Terms of Service.
          If you do not agree to these terms, do not use the Service.
        </Section>

        <Section title="2. What PermitPeek Provides">
          PermitPeek aggregates publicly available building permit records from municipal open-data sources
          and presents them in a searchable format. We provide informational summaries and analysis of these
          public records. We do not create, own, or guarantee the accuracy of the underlying government data.
        </Section>

        <Section title="3. Not Professional Advice">
          PermitPeek is an informational tool only. Nothing on the Service constitutes legal, financial,
          real estate, or professional advice. Permit records may be incomplete, outdated, or contain errors
          present in the original government sources. Always verify permit information directly with the
          relevant municipal building authority before making any property, purchase, legal, or financial decision.
        </Section>

        <Section title="4. No Guarantee of Accuracy">
          We strive to present accurate information, but we make no warranties regarding the completeness,
          accuracy, timeliness, or reliability of any data on the Service. Permit data is sourced from
          third-party government databases and is provided &quot;as is.&quot;
        </Section>

        <Section title="5. Paid Reports">
          Certain features require payment. All fees are clearly displayed before purchase. Reports provide
          access to aggregated public record information. Because reports deliver digital information
          immediately, all sales are final unless otherwise required by law. If you experience a technical
          issue accessing a paid report, contact us for assistance.
        </Section>

        <Section title="6. Acceptable Use">
          You agree not to: (a) use the Service for any unlawful purpose; (b) attempt to scrape, bulk-download,
          or resell data from the Service; (c) use the Service to harass, stalk, or harm any individual;
          (d) misrepresent permit information; or (e) interfere with the Service&apos;s operation.
        </Section>

        <Section title="7. Privacy">
          Your use of the Service is also governed by our{" "}
          <Link href="/privacy" style={{ color: "#1c1917", textDecoration: "underline" }}>Privacy Policy</Link>.
        </Section>

        <Section title="8. Limitation of Liability">
          To the fullest extent permitted by law, PermitPeek and its operators shall not be liable for any
          indirect, incidental, or consequential damages arising from your use of the Service or reliance on
          any information provided. Our total liability for any claim shall not exceed the amount you paid us
          in the 12 months preceding the claim.
        </Section>

        <Section title="9. Changes to These Terms">
          We may update these Terms from time to time. Continued use of the Service after changes constitutes
          acceptance of the revised Terms.
        </Section>

        <Section title="10. Contact">
          For questions about these Terms, contact us through the email address listed on our website.
        </Section>

        <div style={{ marginTop: "64px", paddingTop: "32px", borderTop: "1px solid rgba(0,0,0,0.1)", fontSize: "13px", color: "#a8a29e" }}>
          © {new Date().getFullYear()} PermitPeek · Data provided by public open-data sources · Not legal advice
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
