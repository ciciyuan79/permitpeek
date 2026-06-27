"use client";

import { useEffect, useRef, useState } from "react";

const CITIES = [
  { n: "Seattle", st: "WA", lat: 47.61, lon: -122.33, r: "410K" },
  { n: "San Francisco", st: "CA", lat: 37.77, lon: -122.42, r: "1.2M" },
  { n: "Los Angeles", st: "CA", lat: 34.05, lon: -118.24, r: "2.1M" },
  { n: "San Diego County", st: "CA", lat: 32.83, lon: -116.77, r: "100K" },
  { n: "Phoenix Metro", st: "AZ", lat: 33.45, lon: -112.07, r: "100K", dx: -34, dy: -12 },
  { n: "Mesa", st: "AZ", lat: 33.42, lon: -111.83, r: "300K", dx: 28, dy: 4 },
  { n: "Tempe", st: "AZ", lat: 33.43, lon: -111.94, r: "200K", dx: 4, dy: 18 },
  { n: "Denver", st: "CO", lat: 39.74, lon: -104.99, r: "150K" },
  { n: "Kansas City", st: "MO", lat: 39.10, lon: -94.58, r: "200K" },
  { n: "Austin", st: "TX", lat: 30.27, lon: -97.74, r: "620K" },
  { n: "Chicago", st: "IL", lat: 41.88, lon: -87.63, r: "890K" },
  { n: "Cincinnati", st: "OH", lat: 39.10, lon: -84.51, r: "300K" },
  { n: "Nashville", st: "TN", lat: 36.16, lon: -86.78, r: "250K" },
  { n: "Miami-Dade", st: "FL", lat: 25.76, lon: -80.19, r: "100K" },
  { n: "Buffalo", st: "NY", lat: 42.89, lon: -78.88, r: "200K" },
  { n: "Pittsburgh", st: "PA", lat: 40.44, lon: -79.99, r: "62K" },
  { n: "Washington", st: "DC", lat: 38.90, lon: -77.04, r: "150K" },
  { n: "Virginia Beach", st: "VA", lat: 36.85, lon: -75.98, r: "100K" },
  { n: "Philadelphia", st: "PA", lat: 39.95, lon: -75.16, r: "880K" },
  { n: "New York City", st: "NY", lat: 40.71, lon: -74.01, r: "4.8M" },
  { n: "Boston", st: "MA", lat: 42.36, lon: -71.06, r: "728K" },
];

declare global {
  interface Window {
    d3?: typeof import("d3");
    topojson?: typeof import("topojson-client");
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

export default function CoverageMap() {
  const ref = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [count, setCount] = useState(0);
  const [hover, setHover] = useState<{ n: string; st: string; r: string } | null>(null);
  const [ready, setReady] = useState(false);
  const startedRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js");
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js");
        if (cancelled) return;

        const d3 = window.d3!;
        const topojson = window.topojson!;
        const W = 960, H = 560;
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const projection = d3.geoAlbersUsa().scale(1180).translate([W / 2, H / 2]);
        const path = d3.geoPath().projection(projection as any);

        const us: any = await d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json");
        if (cancelled) return;

        const states = topojson.feature(us, us.objects.states) as any;
        const mesh = topojson.mesh(us, us.objects.states, (a: any, b: any) => a !== b);
        const nation = topojson.feature(us, us.objects.nation) as any;

        svg.append("g").selectAll("path").data(states.features).join("path")
          .attr("d", path as any).attr("fill", "#e7e5e4").attr("stroke", "none");
        svg.append("path").datum(mesh).attr("d", path as any).attr("fill", "none")
          .attr("stroke", "rgba(28,25,23,0.14)").attr("stroke-width", 0.6);
        svg.append("path").datum(nation).attr("d", path as any).attr("fill", "none")
          .attr("stroke", "rgba(28,25,23,0.32)").attr("stroke-width", 1.2);

        setReady(true);

        const observer = new IntersectionObserver(([e]) => {
          if (e.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            runCascade(d3, projection);
            observer.disconnect();
          }
        }, { threshold: 0.3 });
        if (ref.current) observer.observe(ref.current);
      } catch {
        // CDN failed; map just won't render. Silent.
      }
    }

    function runCascade(d3: any, projection: any) {
      const svg = d3.select(svgRef.current);
      const pts = CITIES
        .map((c) => {
          const p = projection([c.lon, c.lat]);
          return p ? { ...c, x: p[0], y: p[1] } : null;
        })
        .filter(Boolean) as Array<{ n: string; st: string; r: string; x: number; y: number }>;
      pts.sort((a, b) => a.x - b.x);

      let lit = 0;
      pts.forEach((c, i) => {
        const t = window.setTimeout(() => {
          const g = svg.append("g").attr("class", "cm-city").style("cursor", "pointer");

          g.on("mouseenter", () => setHover({ n: c.n, st: c.st, r: c.r }))
            .on("mouseleave", () => setHover(null));

          g.append("circle").attr("cx", c.x).attr("cy", c.y).attr("r", 18).attr("fill", "transparent");

          const halo = g.append("circle").attr("cx", c.x).attr("cy", c.y).attr("r", 4)
            .attr("fill", "none").attr("stroke", "rgba(28,25,23,0.4)").attr("stroke-width", 1.5).attr("opacity", 0.55);

          g.append("circle").attr("cx", c.x).attr("cy", c.y).attr("r", 4)
            .attr("fill", "#1c1917").attr("stroke", "#f5f5f4").attr("stroke-width", 0.8)
            .attr("opacity", 0).transition().duration(300).attr("opacity", 1).attr("r", 6.5)
            .transition().duration(160).attr("r", 4.5);

         const ldx = (c as any).dx ?? 0;
          const ldy = (c as any).dy ?? -9;
          const anchor = (c as any).dx ? ((c as any).dx < 0 ? "end" : "start") : "middle";
          g.append("text").attr("x", c.x + ldx).attr("y", c.y + ldy).attr("text-anchor", anchor)
            .attr("font-family", "monospace").attr("font-size", 11.5).attr("fill", "#44403c")
            .attr("letter-spacing", "0.2").attr("opacity", 0).text(c.n)
            .transition().duration(300).attr("opacity", 1);

          const pulse = () => {
            halo.attr("r", 4).attr("opacity", 0.5)
              .transition().duration(2600).ease(d3.easeQuadOut)
              .attr("r", 16).attr("opacity", 0)
              .on("end", pulse);
          };
          pulse();

          lit++;
          setCount(lit);
        }, i * 130);
        timersRef.current.push(t);
      });
    }

    init();

    return () => {
      cancelled = true;
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <div ref={ref} className="relative bg-stone-100 border border-stone-900/10 rounded-2xl p-6 overflow-hidden">
      <div className="flex justify-between items-baseline mb-2">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400">United States · Coverage</div>
        <div className="font-mono text-[11px] text-stone-600">{count} / {CITIES.length} cities online</div>
      </div>

      <div className="relative">
        <svg ref={svgRef} viewBox="0 0 960 560" className="w-full block" />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-400">Loading map…</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-5 font-mono text-[11px] text-stone-400 pt-2 border-t border-stone-900/10 min-h-[30px]">
        {hover ? (
          <span className="text-stone-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-stone-900" />
            {hover.n}, {hover.st} — Live now · ~{hover.r} records
          </span>
        ) : (
          <>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-stone-900" /> Live now</span>
            <span className="ml-auto">Hover a city for detail</span>
          </>
        )}
      </div>
    </div>
  );
}
