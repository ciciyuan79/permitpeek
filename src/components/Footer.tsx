import { CITIES_LIST } from "@/lib/cities";

export default function Footer() {
  return (
    <footer className="border-t border-stone-900/10 py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h3 className="font-display text-2xl font-light mb-6">PermitPeek</h3>
            <p className="font-serif text-stone-600 max-w-sm mb-8">
              A serious civic records publication dedicated to property transparency. 
              We index public building permit data to help homebuyers, owners, 
              and professionals make informed decisions.
            </p>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400">
              © {new Date().getFullYear()} PermitPeek · Data provided by Socrata Open Data APIs
            </div>
          </div>
          
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-900 mb-6 font-bold">
              Coverage
            </h4>
            <ul className="space-y-3">
              {CITIES_LIST.map((city) => (
                <li key={city.slug}>
                  <a 
                    href={city.endpoint} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-serif text-sm text-stone-600 hover:text-stone-900 hover-underline"
                  >
                    {city.name} Source
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-900 mb-6 font-bold">
              Legal
            </h4>
            <ul className="space-y-3 font-serif text-sm text-stone-600">
              <li><span className="hover-underline cursor-pointer">Terms of Service</span></li>
              <li><span className="hover-underline cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover-underline cursor-pointer">Data Policy</span></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
