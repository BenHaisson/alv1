import BrandLockup from "./BrandLockup";

interface LuxuryFooterProps {
  onNavClick: (sectionId: string) => void;
}

export default function LuxuryFooter({ onNavClick }: LuxuryFooterProps) {
  const company = [
    { label: "Book", target: "hero" },
    { label: "Fleet", target: "fleet" },
    { label: "Routes", target: "routes" },
    { label: "Standard", target: "standards" }
  ];

  const services = [
    "Private Chauffeur Zurich",
    "Executive Chauffeur Zurich",
    "Zurich Airport Transfer",
    "BMW i7 Chauffeur Zurich",
    "Mercedes V-Class Chauffeur Zurich"
  ];

  const routes = [
    "Zurich Airport",
    "Zurich City",
    "Zurich to Zug",
    "Zurich to Lucerne",
    "Zurich to Basel"
  ];

  return (
    <footer className="relative border-t border-brand-cream/10 bg-brand-black px-6 pb-16 pt-16 md:px-12 md:pb-20 md:pt-20 lg:px-24 luxury-noise">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4">
            <BrandLockup size="footer" tone="white" className="mb-5" />
            <p className="max-w-sm text-sm font-light leading-relaxed text-brand-stone">
              ALAIR NOIR GmbH is a Zurich-based private chauffeur service for executives,
              private clients, airport transfers, and Switzerland-wide journeys.
            </p>
          </div>

          <div className="md:col-span-2">
            <h3 className="mb-5 text-[10px] font-mono uppercase tracking-widest text-brand-cream">
              Company
            </h3>
            <ul className="space-y-2.5">
              {company.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => onNavClick(link.target)}
                    className="cursor-pointer text-left text-[13px] font-mono uppercase tracking-wider text-brand-stone transition-colors duration-300 hover:text-brand-cream"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="mb-5 text-[10px] font-mono uppercase tracking-widest text-brand-cream">
              Services
            </h3>
            <ul className="space-y-2.5">
              {services.map((service) => (
                <li key={service}>
                  <button
                    onClick={() => onNavClick("hero")}
                    className="cursor-pointer text-left text-xs font-mono tracking-wider text-brand-stone transition-colors duration-300 hover:text-brand-cream"
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="mb-5 text-[10px] font-mono uppercase tracking-widest text-brand-cream">
              Routes
            </h3>
            <ul className="space-y-2.5">
              {routes.map((route) => (
                <li key={route}>
                  <button
                    onClick={() => onNavClick("routes")}
                    className="cursor-pointer text-left text-xs font-mono tracking-wider text-brand-stone transition-colors duration-300 hover:text-brand-cream"
                  >
                    {route}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 border-t border-brand-cream/10 pt-8 text-center sm:grid-cols-3">
          <div className="flex flex-col items-center">
            <span className="mb-2 block text-[9px] font-mono uppercase tracking-[0.24em] text-brand-stone">
              Email
            </span>
            <a
              href="mailto:booking@alairnoir.ch"
              className="text-sm font-mono text-brand-cream transition-colors hover:text-brand-ivory"
            >
              booking@alairnoir.ch
            </a>
          </div>
          <div className="flex flex-col items-center">
            <span className="mb-2 block text-[9px] font-mono uppercase tracking-[0.24em] text-brand-stone">
              Phone / WhatsApp
            </span>
            <a
              href="https://wa.me/41772870956"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-mono font-medium text-brand-cream transition-colors hover:text-white"
            >
              +41 77 287 09 56
            </a>
          </div>
          <div className="flex flex-col items-center">
            <span className="mb-2 block text-[9px] font-mono uppercase tracking-[0.24em] text-brand-stone">
              Instagram
            </span>
            <a
              href="https://instagram.com/alairnoir"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-mono text-brand-cream transition-colors hover:text-brand-ivory"
            >
              @alairnoir
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-6 border-t border-brand-cream/10 pt-7 sm:flex-row sm:items-end sm:justify-between">
          <div className="text-[11px] font-mono leading-relaxed tracking-widest text-brand-stone">
            ALAIR NOIR GmbH<br />
            Private Chauffeur Service Zurich<br />
            Switzerland
          </div>
          <div className="text-right">
            <BrandLockup size="compact" tone="white" align="right" className="mb-3" />
            <div className="flex justify-start gap-4 text-[10px] font-mono tracking-widest text-brand-stone sm:justify-end">
              <span className="cursor-pointer uppercase transition-colors hover:text-brand-cream">Impressum</span>
              <span>.</span>
              <span className="cursor-pointer uppercase transition-colors hover:text-brand-cream">Privacy Policy</span>
              <span>.</span>
              <span>© 2026 ALAIR NOIR GmbH</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
