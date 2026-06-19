"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CITIES_LIST } from "@/lib/cities";
import { Search, ChevronDown } from "lucide-react";

export default function SearchCard() {
  const [citySlug, setCitySlug] = useState(CITIES_LIST[0].slug);
  const [address, setAddress] = useState("");
  const router = useRouter();

  const selectedCity = CITIES_LIST.find((c) => c.slug === citySlug) || CITIES_LIST[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;
    router.push(`/report?city=${citySlug}&address=${encodeURIComponent(address)}`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto reveal stagger-2">
      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row gap-0 border border-stone-900/15 bg-white p-1 rounded-[4px] shadow-sm"
      >
        <div className="relative border-b md:border-b-0 md:border-r border-stone-900/10">
          <select
            value={citySlug}
            onChange={(e) => setCitySlug(e.target.value)}
            className="w-full md:w-auto px-4 py-4 pr-9 bg-transparent font-mono text-[11px] uppercase tracking-wider text-stone-900 focus:outline-none appearance-none cursor-pointer"
          >
            {CITIES_LIST.map((city) => (
              <option key={city.slug} value={city.slug}>
                {city.name}, {city.state}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
        </div>

        <div className="relative flex-grow">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter property address (e.g. 350 5th Ave)"
            className="w-full h-full px-6 py-4 font-serif text-lg placeholder:text-stone-400 focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-stone-900 text-stone-50 px-8 py-4 flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors font-light rounded-[2px] m-0.5"
        >
          <Search size={18} strokeWidth={1.5} />
          <span>Search Records</span>
        </button>
      </form>

      <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">
        Searching in {selectedCity.name}, {selectedCity.state} · Only listed cities are covered
      </p>
    </div>
  );
}
