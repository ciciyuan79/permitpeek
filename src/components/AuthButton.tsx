"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, FolderOpen, LogOut, ChevronDown } from "lucide-react";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Loading — render nothing to avoid flicker
  if (status === "loading") {
    return <span className="w-16 h-5" aria-hidden="true" />;
  }

  // Logged out — Sign In link
  if (!session?.user) {
    return (
      <Link
        href="/signin"
        className="hover:text-stone-900 hover-underline pb-0.5"
      >
        Sign in
      </Link>
    );
  }

  // Logged in — account menu
  const email = session.user.email || "Account";
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 hover:text-stone-900 transition-colors cursor-pointer"
      >
        <User size={14} strokeWidth={2} />
        <span className="hidden lg:inline normal-case tracking-normal font-mono text-[11px] max-w-[140px] truncate">
          {email}
        </span>
        <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-stone-900/10 rounded-lg shadow-lg overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-stone-900/8">
            <div className="font-mono text-[9px] uppercase tracking-widest text-stone-400 mb-0.5">Signed in as</div>
            <div className="font-serif text-sm text-stone-900 truncate normal-case">{email}</div>
          </div>
          <Link
            href="/account/downloads"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-3 text-stone-700 hover:bg-stone-50 transition-colors normal-case tracking-normal font-mono text-[12px]"
          >
            <FolderOpen size={15} strokeWidth={1.75} />
            My Downloads
          </Link>
          <button
            type="button"
            onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }}
            className="w-full flex items-center gap-2.5 px-4 py-3 text-stone-700 hover:bg-stone-50 transition-colors normal-case tracking-normal font-mono text-[12px] border-t border-stone-900/8 cursor-pointer"
          >
            <LogOut size={15} strokeWidth={1.75} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
