import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import BrandLockup from "./BrandLockup";
import { useReducedMotionPref } from "./MotionProvider";

interface LuxuryHeaderProps {
  onNavClick: (sectionId: string) => void;
  activeSection?: string;
}

const links = [
  { label: "Services", target: "services" },
  { label: "Fleet", target: "fleet" },
  { label: "Routes", target: "routes" },
  { label: "Private Office", target: "office" }
];

const SPRING = { type: "spring" as const, stiffness: 360, damping: 36, mass: 0.8 };

export default function LuxuryHeader({ onNavClick, activeSection = "hero" }: LuxuryHeaderProps) {
  const isReduced = useReducedMotionPref();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const choose = (target: string) => {
    onNavClick(target);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 h-[72px] border-b border-brand-cream/10 bg-brand-black/72 backdrop-blur-xl">
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-4 md:px-8 lg:px-12">
          <motion.button
            type="button"
            onClick={() => choose("hero")}
            whileHover={isReduced ? undefined : { opacity: 0.78 }}
            whileTap={isReduced ? undefined : { scale: 0.985 }}
            transition={SPRING}
            className="cursor-pointer text-left"
            aria-label="ALAIR NOIR — booking"
          >
            <BrandLockup size="nav" />
          </motion.button>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
            {links.map((link) => {
              const active = activeSection === link.target;
              return (
                <motion.button
                  key={link.target}
                  type="button"
                  onClick={() => choose(link.target)}
                  whileHover={isReduced ? undefined : { y: -1, color: "#FAF8F5" }}
                  whileTap={isReduced ? undefined : { scale: 0.98 }}
                  transition={SPRING}
                  className="relative cursor-pointer py-2 text-[10px] font-mono uppercase tracking-[0.18em] text-brand-stone"
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-current"
                      className="absolute inset-x-0 bottom-0 h-px bg-brand-gold"
                      transition={SPRING}
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              onClick={() => choose("hero")}
              whileHover={isReduced ? undefined : { y: -1, backgroundColor: "#FAF8F5" }}
              whileTap={isReduced ? undefined : { scale: 0.985 }}
              transition={SPRING}
              className="h-10 cursor-pointer bg-brand-gold px-4 text-[9px] font-mono font-semibold uppercase tracking-[0.15em] text-brand-black md:px-5 md:text-[10px]"
            >
              Book
              <span className="hidden sm:inline"> a chauffeur</span>
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              whileTap={isReduced ? undefined : { scale: 0.97 }}
              transition={SPRING}
              className="flex h-11 w-11 items-center justify-center border border-brand-cream/15 lg:hidden"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="relative h-4 w-5" aria-hidden="true">
                <motion.span
                  className="absolute left-0 top-1 h-px w-5 bg-brand-ivory"
                  animate={mobileMenuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                  transition={{ duration: isReduced ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
                <motion.span
                  className="absolute bottom-1 left-0 h-px w-5 bg-brand-ivory"
                  animate={mobileMenuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
                  transition={{ duration: isReduced ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              </span>
            </motion.button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col bg-brand-deep-forest px-6 pb-10 pt-28 lg:hidden"
            initial={isReduced ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={isReduced ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: isReduced ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav className="flex flex-1 flex-col justify-center" aria-label="Mobile navigation">
              {links.map((link, index) => (
                <motion.button
                  key={link.target}
                  type="button"
                  onClick={() => choose(link.target)}
                  initial={isReduced ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.42, delay: isReduced ? 0 : 0.08 + index * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className="min-h-16 border-b border-brand-cream/10 text-left font-serif text-3xl font-light text-brand-ivory"
                >
                  {link.label}
                </motion.button>
              ))}
            </nav>
            <div className="grid grid-cols-2 gap-4 border-t border-brand-cream/10 pt-6 text-[10px] font-mono uppercase tracking-[0.12em] text-brand-stone">
              <a href="tel:+41772870956">+41 77 287 09 56</a>
              <a href="mailto:booking@alairnoir.ch" className="text-right">Email booking</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
