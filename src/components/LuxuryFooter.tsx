interface LuxuryFooterProps {
  onNavClick: (sectionId: string) => void;
}

export default function LuxuryFooter({ onNavClick }: LuxuryFooterProps) {
  const links = [
    { label: "Arrival", target: "hero" },
    { label: "Access", target: "access" },
    { label: "Services", target: "services" },
    { label: "Fleet", target: "fleet" },
    { label: "Journey", target: "journey" },
    { label: "Routes", target: "routes" },
    { label: "Protocol", target: "protocol" },
    { label: "Request", target: "request" }
  ];

  const services = [
    "Private Chauffeur Service Zürich",
    "Executive Chauffeur Zürich",
    "Airport Transfer Zürich",
    "Private Driver Zürich",
    "BMW i7 Chauffeur Zürich",
    "Mercedes V-Class Chauffeur Zürich",
    "Family Office Chauffeur Switzerland",
    "Luxury Hotel Transfer Zürich",
    "Long-Distance Chauffeur Switzerland"
  ];

  return (
    <footer className="relative bg-brand-black pt-24 pb-12 px-6 md:px-12 lg:px-24 border-t border-brand-cream/10 luxury-noise">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Footer Layout (Grid of 4 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Col 1: Brand & Slogan (4 columns) */}
          <div className="md:col-span-4 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-light text-brand-gold tracking-[0.2em] mb-4">
                ALAIR NOIR
              </h2>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-brand-stone block mb-6">
                NOT FOR EVERYONE · FOR YOU
              </span>
              <p className="text-xs text-brand-stone font-light leading-relaxed max-w-sm">
                Private chauffeur service in Zürich for executives, private clients, family offices, premium hospitality, diplomatic guests, airport arrivals, and long-distance journeys across Switzerland.
              </p>
            </div>
          </div>

          {/* Col 2: Navigation Links (2 columns) */}
          <div className="md:col-span-2">
            <h3 className="text-[10px] font-mono tracking-widest text-brand-cream uppercase mb-6">
              Directory
            </h3>
            <ul className="space-y-3">
              {links.map((link) => (
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

          {/* Col 3: Services (2 columns) */}
          <div className="md:col-span-2">
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

          {/* Col 4: Direct Communication (2 columns) */}
          <div className="md:col-span-2">
            <h3 className="text-[10px] font-mono tracking-widest text-brand-cream uppercase mb-6">
              Booking Office
            </h3>
            <ul className="space-y-3 text-xs font-mono tracking-wider text-brand-stone">
              <li>
                <a
                  href="mailto:booking@alairnoir.ch"
                  className="hover:text-brand-cream transition-colors duration-300 block"
                >
                  booking@alairnoir.ch
                </a>
              </li>
              <li>
                <a
                  href="tel:+41772870956"
                  className="hover:text-brand-cream transition-colors duration-300 block"
                >
                  +41 77 287 09 56
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/41772870956"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-300 block text-brand-gold font-medium"
                >
                  WhatsApp Direct
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/alairnoir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-cream transition-colors duration-300 block"
                >
                  Instagram @alairnoir
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Operations hub (2 columns) */}
          <div className="md:col-span-2">
            <h3 className="text-[10px] font-mono tracking-widest text-brand-cream uppercase mb-6">
              Base Coordinates
            </h3>
            <p className="text-xs font-mono text-brand-stone leading-relaxed">
              ALAIR NOIR GmbH<br />
              Private Chauffeur Service Zürich<br />
              Zürich, Switzerland
            </p>
          </div>

        </div>

        {/* Sub-Footer Dividers & Legals */}
        <div className="border-t border-brand-cream/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-brand-stone uppercase tracking-widest">
          <div className="flex space-x-6 mb-4 sm:mb-0">
            <span className="cursor-pointer hover:text-brand-cream transition-colors">Impressum</span>
            <span>·</span>
            <span className="cursor-pointer hover:text-brand-cream transition-colors">Privacy Policy</span>
          </div>
          <div>
            © 2026 ALAIR NOIR GmbH · All rights reserved
          </div>
        </div>

      </div>
    </footer>
  );
}
