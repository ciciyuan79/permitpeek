"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

function SignInForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const searchParams = useSearchParams();
  const checkEmail = searchParams.get("check") === "email";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn("email", { email, redirect: false, callbackUrl: "/account/downloads" });
      setSent(true);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (sent || checkEmail) {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={24} strokeWidth={1.5} />
        </div>
        <h1 className="font-display text-3xl font-light mb-3">Check your email</h1>
        <p className="font-serif text-stone-600 leading-relaxed">
          We&rsquo;ve sent a secure sign-in link to your inbox. Click it to access your account. The link expires in 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-4 block">
          Account Access
        </span>
        <h1 className="font-display text-4xl font-light mb-3">Sign in to PermitPeek</h1>
        <p className="font-serif text-stone-600 leading-relaxed">
          Enter your email and we&rsquo;ll send you a secure sign-in link. No password needed.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          required
          className="w-full px-4 py-3 border border-stone-900/15 font-serif text-base focus:outline-none focus:border-stone-900/40 rounded-[3px]"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-stone-900 text-stone-50 py-3.5 font-mono text-[11px] uppercase tracking-[0.12em] hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 rounded-[3px]"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Mail size={15} />}
          Send sign-in link
        </button>
      </form>

      <p className="text-center font-serif text-xs text-stone-400 mt-6 leading-relaxed">
        We&rsquo;ll create an account automatically if you don&rsquo;t have one yet.
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Nav />
      <main className="flex-grow flex items-center justify-center px-6 py-20">
        <Suspense fallback={<div className="font-mono text-xs uppercase tracking-widest text-stone-400">Loading…</div>}>
          <SignInForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
