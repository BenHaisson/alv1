import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import BrandLockup from "./BrandLockup";

interface LuxuryHeaderProps {
  onNavClick: (sectionId: string) => void;
  activeSection?: string;
}

const links = [
  { label: "Book", target: "hero" },
  { label: "Fleet", target: "fleet" },
  { label: "Routes", target: "routes" },
  { label: "Standard", target: "standards" }
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function LuxuryHeader({ onNavClick, activeSection = "" }: LuxuryHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (target: string) => {
    onNavClick(target);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-40 h-[76px] border-b border-brand-cream/10 bg-[linear-gradient(180deg,rgba(5,12,8,0.78),rgba(5,12,8,0.46))] shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-md md:h-14 md:bg-[linear-gradient(180deg,rgba(5,12,8,0.7),rgba(5,12,8,0.38))] luxury-noise">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 md:px-8 lg:px-14">
          <motion.button
            type="button"
            onClick={() => handleLinkClick("hero")}
            whileHover={{ opacity: 0.82 }}
            whileTap={{ scale: 0.985 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            className="flex cursor-pointer flex-col items-start text-left focus:outline-none"
          >
            <BrandLockup size="nav" />
          </motion.button>

          <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary journey">
            {links.map((link) => {
              const isActive = activeSection === link.target;

              return (
                <motion.button
                  key={link.label}
                  type="button"
                  onClick={() => handleLinkClick(link.target)}
                  aria-current={isActive ? "page" : undefined}
                  whileHover={{ y: -1, opacity: 0.92 }}
                  whileTap={{ scale: 0.975 }}
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className={`relative cursor-pointer py-1.5 text-[10px] font-mono uppercase tracking-[0.16em] focus:outline-none ${
                    isActive ? "text-brand-cream" : "text-brand-stone hover:text-brand-cream"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-line"
                      className="absolute bottom-0 left-0 right-0 h-px bg-brand-gold"
                      transition={{ type: "spring", stiffness: 420, damping: 38, mass: 0.75 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          <div className="hidden lg:block">
            <motion.button
              type="button"
              onClick={() => handleLinkClick("hero")}
              whileHover={{ y: -1, borderColor: "rgba(205, 162, 80, 0.9)" }}
              whileTap={{ scale: 0.975 }}
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
              className="cursor-pointer border border-brand-gold bg-brand-gold px-4 py-2 text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-brand-black hover:bg-brand-ivory hover:border-brand-ivory"
            >
              Request Chauffeur
            </motion.button>
          </div>

          <motion.button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.96 }}
            className="flex flex-col items-end space-y-1.5 p-1.5 focus:outline-none lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <motion.span
              className="h-px bg-brand-cream"
              animate={mobileMenuOpen ? { width: 24, rotate: 45, y: 7 } : { width: 24, rotate: 0, y: 0 }}
              transition={{ duration: 0.32, ease: EASE }}
            />
            <motion.span
              className="h-px bg-brand-cream"
              animate={mobileMenuOpen ? { width: 0, opacity: 0 } : { width: 16, opacity: 1 }}
              transition={{ duration: 0.28, ease: EASE }}
            />
            <motion.span
              className="h-px bg-brand-cream"
              animate={mobileMenuOpen ? { width: 24, rotate: -45, y: -7 } : { width: 20, rotate: 0, y: 0 }}
              transition={{ duration: 0.32, ease: EASE }}
            />
          </motion.button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-0 z-30 flex flex-col justify-between bg-brand-black px-6 pb-8 pt-20 lg:hidden luxury-noise"
          >
            <div className="flex flex-col space-y-5 pt-8">
              {links.map((link) => {
                const isActive = activeSection === link.target;

                return (
                  <motion.button
                    key={link.label}
                    type="button"
                    onClick={() => handleLinkClick(link.target)}
                    whileHover={{ x: 6 }}
                    whileTap={{ scale: 0.985 }}
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    className={`border-b border-brand-cream/5 py-2 text-left text-xl font-serif tracking-wider ${
                      isActive ? "text-brand-gold" : "text-brand-ivory hover:text-brand-cream"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </motion.button>
                );
              })}
            </div>

            <div className="space-y-4 border-t border-brand-cream/10 pt-12">
              <motion.button
                type="button"
                onClick={() => handleLinkClick("hero")}
                whileTap={{ scale: 0.985 }}
                className="w-full bg-brand-gold py-4 text-center text-xs font-mono font-semibold uppercase tracking-[0.2em] text-brand-black hover:bg-brand-ivory"
              >
                Request Chauffeur
              </motion.button>
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
