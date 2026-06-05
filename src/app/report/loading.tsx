import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function ReportLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Nav />
      <main className="flex-grow flex items-center justify-center px-6 py-32">
        <div className="text-center max-w-md">
          {/* Animated pulse rings */}
          <div className="relative w-20 h-20 mx-auto mb-10">
            <span className="absolute inset-0 rounded-full border-2 border-stone-900/30 animate-ping" />
            <span className="absolute inset-0 rounded-full border border-stone-900/15" style={{ animation: "ping 2s cubic-bezier(0,0,0.2,1) 0.4s infinite" }} />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-900" />
            </span>
          </div>

          <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-500 mb-4 block">
            Generating Report
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-light text-stone-900 leading-tight mb-4">
            Reading the city permit records…
          </h1>
          <p className="font-serif text-stone-600 leading-relaxed">
            We&rsquo;re querying the official government registry for this address and decoding every permit on file. This usually takes a few seconds.
          </p>

          {/* Step ticker */}
          <div className="mt-10 flex flex-col gap-3 text-left max-w-xs mx-auto">
            {[
              "Connecting to the city data registry",
              "Matching the property address",
              "Analyzing permit history & risk",
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.1em] text-stone-500">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400" style={{ animation: `pulse 1.4s ease-in-out ${i * 0.3}s infinite` }} />
                {step}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
