import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LuxuryHeaderProps {
  onNavClick: (sectionId: string) => void;
  activeSection?: string;
}

const links = [
  { label: "Chauffeur", target: "hero" },
  { label: "Services", target: "services" },
  { label: "Fleet", target: "fleet" },
  { label: "Standard", target: "standards" },
  { label: "Routes", target: "routes" },
  { label: "Booking", target: "request" }
];

export default function LuxuryHeader({ onNavClick, activeSection = "" }: LuxuryHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (target: string) => {
    onNavClick(target);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-40 h-20 border-b border-brand-cream/10 bg-brand-black/95 backdrop-blur-lg transition-all duration-300 supports-[backdrop-filter]:bg-brand-black/80 luxury-noise">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 md:px-12 lg:px-24">
          <div
            onClick={() => handleLinkClick("hero")}
            className="group flex cursor-pointer flex-col items-start"
          >
            <span className="block text-xl font-serif font-light leading-none tracking-[0.2em] text-white transition-all duration-300 group-hover:tracking-[0.25em] md:text-2xl">
              ALAIR NOIR
            </span>
            <span className="mt-1 text-[8px] font-mono uppercase tracking-[0.25em] text-brand-stone">
              Zürich · Switzerland
            </span>
          </div>

          <nav className="hidden items-center space-x-7 lg:flex" aria-label="Primary journey">
            {links.map((link) => {
              const isActive = activeSection === link.target;

              return (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => handleLinkClick(link.target)}
                  aria-current={isActive ? "page" : undefined}
                  className={`group relative cursor-pointer py-2 text-[10px] font-mono uppercase tracking-widest transition-colors duration-300 ${
                    isActive ? "text-brand-cream" : "text-brand-stone hover:text-brand-cream"
                  }`}
                >
                  <span>{link.label}</span>
                  <span
                    className={`absolute bottom-0 left-1/2 h-px -translate-x-1/2 bg-brand-gold transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-4"
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          <div className="hidden lg:block">
            <button
              type="button"
              onClick={() => handleLinkClick("request")}
              className={`cursor-pointer border px-5 py-2.5 text-[10px] font-mono uppercase tracking-[0.2em] transition-all duration-300 ${
                activeSection === "request"
                  ? "border-brand-gold bg-brand-gold-muted text-brand-cream"
                  : "border-brand-gold/30 text-brand-gold hover:border-brand-gold hover:bg-brand-gold-muted"
              }`}
            >
              Request Chauffeur
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex flex-col items-end space-y-1.5 p-2 focus:outline-none lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className={`h-px bg-brand-cream transition-all duration-300 ${mobileMenuOpen ? "w-6 rotate-45 translate-y-2" : "w-6"}`} />
            <span className={`h-px bg-brand-cream transition-all duration-300 ${mobileMenuOpen ? "w-0 opacity-0" : "w-4"}`} />
            <span className={`h-px bg-brand-cream transition-all duration-300 ${mobileMenuOpen ? "w-6 -rotate-45 -translate-y-1.5" : "w-5"}`} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-30 flex flex-col justify-between bg-brand-black px-6 pb-8 pt-24 lg:hidden luxury-noise"
          >
            <div className="flex flex-col space-y-5 pt-8">
              {links.map((link) => {
                const isActive = activeSection === link.target;

                return (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => handleLinkClick(link.target)}
                    className={`border-b border-brand-cream/5 py-2 text-left text-xl font-serif tracking-wider transition-colors ${
                      isActive ? "text-brand-gold" : "text-brand-ivory hover:text-brand-cream"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>

            <div className="space-y-4 border-t border-brand-cream/10 pt-12">
              <button
                type="button"
                onClick={() => handleLinkClick("request")}
                className="w-full bg-brand-gold py-4 text-center text-xs font-mono font-semibold uppercase tracking-[0.2em] text-brand-black transition-colors duration-300 hover:bg-brand-ivory"
              >
                Request Chauffeur
              </button>
              <div className="flex justify-between text-[9px] font-mono uppercase text-brand-stone">
                <span>booking@alairnoir.ch</span>
                <span>+41 77 287 09 56</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
