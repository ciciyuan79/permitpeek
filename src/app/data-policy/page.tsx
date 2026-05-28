// src/app/data-policy/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Data Policy | PermitPeek",
  description: "Where PermitPeek's building permit data comes from and how we handle it.",
};

export default function DataPolicyPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#fafaf9", color: "#1c1917", fontFamily: "Georgia, 'Source Serif 4', serif" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "80px 24px" }}>
        <Link href="/" style={{ fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#78716c", textDecoration: "none" }}>
          ← Back to PermitPeek
        </Link>

        <h1 style={{ fontSize: "48px", fontWeight: 300, lineHeight: 1.1, marginTop: "32px", marginBottom: "8px" }}>
          Data Policy
        </h1>
        <p style={{ color: "#78716c", fontSize: "14px", marginBottom: "48px" }}>
          Where our data comes from and how we handle it
        </p>

        <Section title="Our Data Sources">
          All building permit data on PermitPeek comes directly from official municipal open-data portals.
          These are public records published by city governments. We currently source data from:
        </Section>

        <ul style={{ fontSize: "16px", lineHeight: 1.9, color: "#44403c", marginBottom: "36px", paddingLeft: "20px" }}>
          <li>New York City — NYC Open Data (Department of Buildings)</li>
          <li>San Francisco — DataSF (Department of Building Inspection)</li>
          <li>Chicago — Chicago Data Portal (Department of Buildings)</li>
          <li>Austin — City of Austin Open Data</li>
          <li>Seattle — Seattle Open Data (SDCI)</li>
          <li>Los Angeles — Los Angeles Open Data (LADBS)</li>
        </ul>

        <Section title="How We Retrieve Data">
          When you search an address, PermitPeek queries the relevant city&apos;s public open-data API in real time
          and displays the results. We cache results briefly to improve speed, but the underlying data always
          originates from the official government source.
        </Section>

        <Section title="Data Accuracy">
          We present permit data as it appears in the government source. We do not alter the underlying records.
          Because the original data may contain gaps, delays, or errors, we cannot guarantee that any record is
          complete or current. Permit records can lag behind real-world activity by weeks or months depending on
          the municipality. Always verify with the official building authority before making decisions.
        </Section>

        <Section title="What Our Analysis Adds">
          PermitPeek adds value by organizing, summarizing, and analyzing public records — for example, flagging
          open permits or summarizing permit history. This analysis is informational and based solely on the
          data available in the public source.
        </Section>

        <Section title="Data Updates">
          City open-data portals update on their own schedules — some daily, some weekly, some less frequently.
          The freshness of our data depends entirely on how often each city publishes updates.
        </Section>

        <Section title="Requesting Corrections">
          We cannot correct errors in government data — those must be addressed with the issuing municipality.
          If you believe PermitPeek is displaying data incorrectly (a technical issue on our end), please contact us.
        </Section>

        <div style={{ marginTop: "64px", paddingTop: "32px", borderTop: "1px solid rgba(0,0,0,0.1)", fontSize: "13px", color: "#a8a29e" }}>
          © {new Date().getFullYear()} PermitPeek · Data provided by municipal open-data sources
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
