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
const EASE = [0.16, 1, 0.3, 1] as const;

export default function LuxuryHeader({ onNavClick, activeSection = "hero" }: LuxuryHeaderProps) {
  const isReduced = useReducedMotionPref();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHero = activeSection === "booking" && !mobileMenuOpen;
  const tone = isHero ? "light" : "dark";

  const choose = (target: string) => {
    onNavClick(target);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 h-[72px] border-b backdrop-blur-xl"
        animate={{
          backgroundColor: isHero ? "rgba(239, 228, 216, 0.76)" : "rgba(10, 10, 10, 0.72)",
          borderColor: isHero ? "rgba(10, 10, 10, 0.1)" : "rgba(234, 222, 206, 0.1)"
        }}
        transition={{ duration: isReduced ? 0 : 0.44, ease: EASE }}
      >
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-4 md:px-8 lg:px-12">
          <motion.button
            type="button"
            onClick={() => choose("booking")}
            whileHover={isReduced ? undefined : { opacity: 0.78 }}
            whileTap={isReduced ? undefined : { scale: 0.985 }}
            transition={SPRING}
            className="cursor-pointer text-left"
            aria-label="ALAIR NOIR home"
          >
            <BrandLockup size="nav" tone={tone} />
          </motion.button>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
            {links.map((link) => {
              const active = activeSection === link.target;
              return (
                <motion.button
                  key={link.target}
                  type="button"
                  onClick={() => choose(link.target)}
                  whileHover={isReduced ? undefined : { y: -1, color: isHero ? "#0A0A0A" : "#FAF8F5" }}
                  whileTap={isReduced ? undefined : { scale: 0.98 }}
                  transition={SPRING}
                  className={`relative cursor-pointer py-2 text-[10px] font-mono uppercase tracking-[0.18em] ${isHero ? "text-brand-black/62" : "text-brand-stone"}`}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-current"
                      className={`absolute inset-x-0 bottom-0 h-px ${isHero ? "bg-brand-forest" : "bg-brand-gold"}`}
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
              onClick={() => choose("booking")}
              whileHover={
                isReduced
                  ? undefined
                  : {
                      y: -1,
                      backgroundColor: isHero ? "#0E1F16" : "#FAF8F5",
                      color: isHero ? "#FAF8F5" : "#0A0A0A"
                    }
              }
              whileTap={isReduced ? undefined : { scale: 0.985 }}
              transition={SPRING}
              className={`h-10 cursor-pointer px-4 text-[9px] font-mono font-semibold uppercase tracking-[0.15em] md:px-5 md:text-[10px] ${isHero ? "bg-brand-forest text-brand-ivory" : "bg-brand-gold text-brand-black"}`}
            >
              Book
              <span className="hidden sm:inline"> a chauffeur</span>
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              whileTap={isReduced ? undefined : { scale: 0.97 }}
              transition={SPRING}
              className={`flex h-11 w-11 items-center justify-center border lg:hidden ${isHero ? "border-brand-black/15" : "border-brand-cream/15"}`}
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="relative h-4 w-5" aria-hidden="true">
                <motion.span
                  className={`absolute left-0 top-1 h-px w-5 ${isHero ? "bg-brand-black" : "bg-brand-ivory"}`}
                  animate={mobileMenuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                  transition={{ duration: isReduced ? 0 : 0.3, ease: EASE }}
                />
                <motion.span
                  className={`absolute bottom-1 left-0 h-px w-5 ${isHero ? "bg-brand-black" : "bg-brand-ivory"}`}
                  animate={mobileMenuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
                  transition={{ duration: isReduced ? 0 : 0.3, ease: EASE }}
                />
              </span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col bg-brand-deep-forest px-6 pb-10 pt-28 lg:hidden"
            initial={isReduced ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={isReduced ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: isReduced ? 0 : 0.5, ease: EASE }}
          >
            <nav className="flex flex-1 flex-col justify-center" aria-label="Mobile navigation">
              {links.map((link, index) => (
                <motion.button
                  key={link.target}
                  type="button"
                  onClick={() => choose(link.target)}
                  initial={isReduced ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: isReduced ? 0 : 0.42, delay: isReduced ? 0 : 0.08 + index * 0.07, ease: EASE }}
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
