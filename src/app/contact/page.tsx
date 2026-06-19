"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSent(true);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
      setLoading(false);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <main className="flex-grow">
        <section className="pt-20 pb-12 md:pb-16 border-b border-stone-900/10 dot-grain">
          <div className="max-w-4xl mx-auto px-6 lg:px-10">
            <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-500 mb-5 block">
              Contact · We&rsquo;re Here To Help
            </span>
            <h1 className="font-display font-light text-stone-900 leading-[1.02] tracking-[-0.02em]" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
              Get in touch.
            </h1>
            <p className="font-serif text-lg md:text-xl text-stone-600 max-w-2xl mt-6 leading-relaxed">
              Questions about a report, a payment, our data, or just want to say hello? Send us a message and we&rsquo;ll get back to you.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-2xl mx-auto px-6 lg:px-10">
            {sent ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-stone-900 text-stone-50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 size={26} strokeWidth={1.5} />
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-light text-stone-900 mb-4">Message sent</h2>
                <p className="font-serif text-lg text-stone-600">
                  Thanks for reaching out. We&rsquo;ll reply to your email as soon as we can.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500 mb-2 block">
                    Your name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-stone-900/15 rounded-md font-serif text-stone-900 focus:outline-none focus:border-stone-900/50 transition-colors"
                    placeholder="Jane Doe"
                  />
                </div>

                <div>
                  <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500 mb-2 block">
                    Your email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-stone-900/15 rounded-md font-serif text-stone-900 focus:outline-none focus:border-stone-900/50 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500 mb-2 block">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-stone-900/15 rounded-md font-serif text-stone-900 focus:outline-none focus:border-stone-900/50 transition-colors resize-none"
                    placeholder="How can we help?"
                  />
                </div>

                {error && (
                  <p className="font-serif text-sm text-red-800">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2.5 bg-stone-900 text-stone-50 px-8 py-4 rounded-md font-mono text-[12px] uppercase tracking-[0.12em] hover:bg-stone-800 transition-colors disabled:opacity-60"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                  Send message
                </button>
              </form>
            )}

            <p className="font-serif text-sm text-stone-500 mt-12 pt-8 border-t border-stone-900/10 leading-relaxed">
              You can also email us directly at{" "}
              <a href="mailto:citypermitpeek@gmail.com" className="text-stone-900 hover-underline">citypermitpeek@gmail.com</a>.
              For official permit questions, contact your city&rsquo;s building department directly. We typically reply within 1&ndash;2 business days.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
