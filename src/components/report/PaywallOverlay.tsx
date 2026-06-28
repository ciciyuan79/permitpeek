"use client";

import { useState } from "react";
import { Lock, Mail, CreditCard, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";

interface PaywallOverlayProps {
  hiddenCount: number;
  address: string;
  city: string;
}

export default function PaywallOverlay({ hiddenCount, address, city }: PaywallOverlayProps) {
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleStripe = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, address }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const handleLeadCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, city, address }),
      });
      // Do NOT unlock the report. Just confirm the lead was captured.
      setEmailSent(true);
      setEmailLoading(false);
    } catch (e) {
      console.error(e);
      setEmailLoading(false);
    }
  };

  return (
    <div className="absolute inset-x-0 bottom-0 top-[20%] bg-gradient-to-t from-stone-50 via-stone-50/95 to-transparent flex items-end justify-center pb-24 px-6">
      <div className="bg-white border border-stone-900/10 p-10 max-w-2xl w-full shadow-xl text-center">
        <div className="w-16 h-16 bg-stone-900 text-stone-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <Lock size={24} strokeWidth={1.5} />
        </div>

        <h3 className="font-display text-4xl font-light mb-4">
          Unlock {hiddenCount} more <span className="italic">records</span>
        </h3>
        <p className="font-serif text-stone-600 mb-8 max-w-md mx-auto">
          The complete filing history for this address is restricted.
          Unlock the full report to see every permit, the risk breakdown, and the contractor details.
        </p>

        {/* Confidence guarantee */}
        <div className="max-w-md mx-auto mb-10 bg-stone-50 border border-stone-900/8 rounded-lg px-4 py-3 flex items-start gap-2 text-left">
          <ShieldCheck size={16} strokeWidth={1.75} className="shrink-0 mt-0.5 text-emerald-700" />
          <p className="font-serif text-[13px] text-stone-600 leading-relaxed">
            <span className="text-stone-900">Our guarantee:</span> if our records for this address turn out incomplete or stale, your report is free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Primary: paid unlock */}
          <div className="p-8 border border-stone-900 bg-stone-50 flex flex-col justify-between relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.1em] bg-stone-900 text-stone-50 px-3 py-1 rounded-sm">
              Full Access
            </span>
            <div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-stone-400 mb-4 block">
                Complete Report
              </div>
              <div className="text-3xl font-display font-light mb-2">$9.00</div>
              <p className="font-serif text-xs text-stone-500 mb-8 leading-relaxed">
                One-time unlock for this property. All permits, full risk analysis, contractor details, and PDF download.
              </p>
            </div>
            <button
              onClick={handleStripe}
              disabled={loading}
              className="w-full bg-stone-900 text-stone-50 py-3 font-mono text-[10px] uppercase tracking-widest hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <CreditCard size={14} />}
              Unlock for $9
            </button>
          </div>

          {/* Secondary: lead capture only (does NOT unlock) */}
          <div className="p-8 border border-stone-900/10 bg-white flex flex-col justify-between">
            <div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-stone-400 mb-4 block">
                Not ready yet?
              </div>
              <div className="text-3xl font-display font-light mb-2">Save it</div>
              <p className="font-serif text-xs text-stone-500 mb-8 leading-relaxed">
                We&apos;ll email you a link to this property so you can come back and unlock the full report later.
              </p>
            </div>
            {emailSent ? (
              <div className="w-full border border-emerald-900/20 bg-emerald-50 text-emerald-900 py-3 font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                <CheckCircle2 size={14} /> Link sent — check your inbox
              </div>
            ) : (
              <form onSubmit={handleLeadCapture} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  className="w-full px-4 py-2 border border-stone-900/10 font-serif text-sm focus:outline-none focus:border-stone-900/40"
                />
                <button
                  disabled={emailLoading}
                  className="w-full border border-stone-900/90 text-stone-900 py-3 font-mono text-[10px] uppercase tracking-widest hover:bg-stone-900 hover:text-stone-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {emailLoading ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                  Email me the link
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
