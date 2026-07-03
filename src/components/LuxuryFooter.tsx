interface LuxuryFooterProps {
  onNavClick: (sectionId: string) => void;
}

export default function LuxuryFooter({ onNavClick }: LuxuryFooterProps) {
  const company = [
    { label: "Services", target: "services" },
    { label: "Fleet", target: "fleet" },
    { label: "Standards", target: "standards" },
    { label: "Routes", target: "routes" },
    { label: "Booking", target: "request" },
    { label: "Contact", target: "request" }
  ];

  const services = [
    "Private Chauffeur Zürich",
    "Executive Chauffeur Zürich",
    "Zürich Airport Transfer",
    "Private Driver Zürich",
    "Luxury Chauffeur Zürich",
    "BMW i7 Chauffeur Zürich",
    "Mercedes V-Class Chauffeur Zürich",
    "Family Office Chauffeur Switzerland",
    "Hotel Transfer Zürich",
    "Long-Distance Chauffeur Switzerland"
  ];

  const routes = [
    "Zürich Airport",
    "Zürich City",
    "Zürich to Zug",
    "Zürich to Lucerne",
    "Zürich to Basel",
    "Zürich to Bern",
    "Zürich to Geneva",
    "Zürich to Davos",
    "Zürich to St. Moritz",
    "Zürich to Gstaad",
    "Zürich to Lugano"
  ];

  return (
    <footer className="relative bg-brand-black pt-24 pb-12 px-6 md:px-12 lg:px-24 border-t border-brand-cream/10 luxury-noise">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-3">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-brand-gold tracking-[0.2em] mb-4">
              ALAIR NOIR
            </h2>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-brand-stone block mb-6">
              NOT FOR EVERYONE · FOR YOU
            </span>
            <p className="text-xs text-brand-stone font-light leading-relaxed max-w-sm">
              ALAIR NOIR GmbH is a Zürich-based private chauffeur service for executives, private
              clients, family offices, hotels, diplomatic guests, airport transfers, and
              Switzerland-wide journeys.
            </p>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <h3 className="text-[10px] font-mono tracking-widest text-brand-cream uppercase mb-6">
              Company
            </h3>
            <ul className="space-y-3">
              {company.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => onNavClick(link.target)}
                    className="text-xs font-mono tracking-wider text-brand-stone hover:text-brand-cream transition-colors duration-300 uppercase cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="md:col-span-4">
            <h3 className="text-[10px] font-mono tracking-widest text-brand-cream uppercase mb-6">
              Services
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <button
                    onClick={() => onNavClick("request")}
                    className="text-[11px] font-mono tracking-wider text-brand-stone hover:text-brand-cream transition-colors duration-300 cursor-pointer text-left"
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Routes */}
          <div className="md:col-span-3">
            <h3 className="text-[10px] font-mono tracking-widest text-brand-cream uppercase mb-6">
              Routes
            </h3>
            <ul className="space-y-3">
              {routes.map((route) => (
                <li key={route}>
                  <button
                    onClick={() => onNavClick("routes")}
                    className="text-[11px] font-mono tracking-wider text-brand-stone hover:text-brand-cream transition-colors duration-300 cursor-pointer text-left"
                  >
                    {route}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact strip */}
        <div className="grid grid-cols-1 gap-6 border-t border-brand-cream/10 pt-10 mb-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-brand-stone block mb-2">Email</span>
            <a href="mailto:booking@alairnoir.ch" className="text-xs font-mono text-brand-cream hover:text-brand-gold transition-colors">
              booking@alairnoir.ch
            </a>
          </div>
          <div>
            <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-brand-stone block mb-2">Phone</span>
            <a href="tel:+41772870956" className="text-xs font-mono text-brand-cream hover:text-brand-gold transition-colors">
              +41 77 287 09 56
            </a>
          </div>
          <div>
            <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-brand-stone block mb-2">WhatsApp</span>
            <a href="https://wa.me/41772870956" target="_blank" rel="noopener noreferrer" className="text-xs font-mono font-medium text-brand-gold hover:text-white transition-colors">
              +41 77 287 09 56
            </a>
          </div>
          <div>
            <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-brand-stone block mb-2">Instagram</span>
            <a href="https://instagram.com/alairnoir" target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-brand-cream hover:text-brand-gold transition-colors">
              @alairnoir
            </a>
          </div>
        </div>

        {/* Sub-Footer Legal & Closing */}
        <div className="border-t border-brand-cream/10 pt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="text-[10px] font-mono text-brand-stone uppercase tracking-widest leading-relaxed">
            ALAIR NOIR GmbH<br />
            Private Chauffeur Service Zürich<br />
            Switzerland
          </div>
          <div className="text-right">
            <span className="block font-serif text-lg font-light italic text-brand-cream mb-2">
              Not for everyone. For you.
            </span>
            <div className="flex justify-start gap-4 text-[10px] font-mono text-brand-stone uppercase tracking-widest sm:justify-end">
              <span className="cursor-pointer hover:text-brand-cream transition-colors">Impressum</span>
              <span>·</span>
              <span className="cursor-pointer hover:text-brand-cream transition-colors">Privacy Policy</span>
              <span>·</span>
              <span>© 2026 ALAIR NOIR GmbH</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
