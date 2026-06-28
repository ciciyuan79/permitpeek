// src/app/account/downloads/page.tsx

import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";
import { CITIES } from "@/lib/cities";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { FileText, ArrowRight, FolderOpen } from "lucide-react";

export const metadata = {
  title: "My Downloads | PermitPeek",
  robots: { index: false, follow: false },
};

interface Purchase {
  id: string;
  city_slug: string;
  city_name: string | null;
  address: string;
  created_at: string;
}

export default async function DownloadsPage() {
  const user = await getCurrentUser();

  if (!user?.email) {
    redirect("/signin");
  }

  // Fetch this user's purchases by email (covers purchases made before/after login)
  let purchases: Purchase[] = [];
  try {
    const { data } = await supabaseAdmin
      .from("purchases")
      .select("id, city_slug, city_name, address, created_at")
      .eq("email", user.email)
      .order("created_at", { ascending: false });
    purchases = (data as Purchase[]) || [];
  } catch (e) {
    console.error("Failed to load purchases:", e);
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Nav />

      <main className="flex-grow">
        <section className="pt-16 pb-10 border-b border-stone-900/10">
          <div className="max-w-5xl mx-auto px-6 lg:px-10">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-4 block">
              Your Account
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-light text-stone-900">
              My Downloads
            </h1>
            <p className="font-serif text-stone-600 mt-3">
              Signed in as {user.email}. Every report you unlock is saved here.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-5xl mx-auto px-6 lg:px-10">
            {purchases.length > 0 ? (
              <div className="border border-stone-900/10 rounded-lg overflow-hidden bg-white divide-y divide-stone-900/8">
                {purchases.map((p) => {
                  const city = CITIES[p.city_slug];
                  const stateSlug = city?.stateSlug || "";
                  const href = `/report?city=${p.city_slug}&address=${encodeURIComponent(p.address)}&unlocked=true`;
                  const date = new Date(p.created_at).toLocaleDateString("en-US", {
                    year: "numeric", month: "short", day: "numeric",
                  });
                  return (
                    <Link
                      key={p.id}
                      href={href}
                      className="flex items-center gap-4 px-6 py-5 hover:bg-stone-50 transition-colors group"
                    >
                      <span className="shrink-0 w-10 h-10 rounded-md bg-stone-100 text-stone-500 flex items-center justify-center">
                        <FileText size={18} strokeWidth={1.5} />
                      </span>
                      <div className="flex-grow min-w-0">
                        <div className="font-serif text-lg text-stone-900 truncate">
                          {p.address}
                        </div>
                        <div className="font-mono text-[11px] uppercase tracking-wider text-stone-400 mt-0.5">
                          {p.city_name || city?.name || p.city_slug} · Unlocked {date}
                        </div>
                      </div>
                      <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-stone-900 flex items-center gap-1.5">
                        View Report
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="border border-stone-900/10 rounded-lg bg-white p-16 text-center">
                <span className="w-14 h-14 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FolderOpen size={24} strokeWidth={1.5} />
                </span>
                <h2 className="font-display text-2xl font-light text-stone-900 mb-3">
                  No reports yet
                </h2>
                <p className="font-serif text-stone-600 max-w-md mx-auto mb-8 leading-relaxed">
                  When you unlock a full property report, it&rsquo;ll be saved here so you can return to it anytime.
                </p>
                <Link
                  href="/#search"
                  className="inline-flex items-center gap-2 bg-stone-900 text-stone-50 px-6 py-3 rounded-md font-mono text-[11px] uppercase tracking-[0.12em] hover:bg-stone-800 transition-colors"
                >
                  Search a property
                  <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
