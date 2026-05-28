"use client";

import { useState } from "react";
import { Lock, Mail, CreditCard, Loader2 } from "lucide-react";

interface PaywallOverlayProps {
  hiddenCount: number;
  address: string;
  city: string;
}

export default function PaywallOverlay({ hiddenCount, address, city }: PaywallOverlayProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSuccess, setEmailSuccess] = useState(false);

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

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, city, address }),
      });
      setEmailSuccess(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
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
        <p className="font-serif text-stone-600 mb-12 max-w-md mx-auto">
          The complete filing history for this address is restricted.
          Choose an option below to view all historical permits.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 border border-stone-900/10 bg-stone-50 flex flex-col justify-between">
            <div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-stone-400 mb-4 block">
                Option 01 · Full Access
              </div>
              <div className="text-3xl font-display font-light mb-2">$9.00</div>
              <p className="font-serif text-xs text-stone-500 mb-8 leading-relaxed">
                One-time unlock for this property report. PDF download included.
              </p>
            </div>
            <button
              onClick={handleStripe}
              disabled={loading}
              className="w-full bg-stone-900 text-stone-50 py-3 font-mono text-[10px] uppercase tracking-widest hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <CreditCard size={14} />}
              Unlock via Stripe
            </button>
          </div>

          <div className="p-8 border border-stone-900/10 bg-white flex flex-col justify-between">
            {emailSuccess ? (
              <div className="h-full flex flex-col items-center justify-center py-4">
                <div className="text-emerald-600 mb-4">✓</div>
                <p className="font-serif text-sm">Check your inbox. Report sent.</p>
              </div>
            ) : (
              <>
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-stone-400 mb-4 block">
                    Option 02 · Registration
                  </div>
                  <div className="text-3xl font-display font-light mb-2">Free</div>
                  <p className="font-serif text-xs text-stone-500 mb-8 leading-relaxed">
                    Get this report sent to your email. We&apos;ll send you weekly property insights.
                  </p>
                </div>
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    required
                    className="w-full px-4 py-2 border border-stone-900/10 font-serif text-sm focus:outline-none"
                  />
                  <button
                    disabled={loading}
                    className="w-full border border-stone-900/90 text-stone-900 py-3 font-mono text-[10px] uppercase tracking-widest hover:bg-stone-900 hover:text-stone-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                    Get via Email
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
