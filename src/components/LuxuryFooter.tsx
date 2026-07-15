import { motion } from "motion/react";
import BrandLockup from "./BrandLockup";
import { useReducedMotionPref } from "./MotionProvider";

interface LuxuryFooterProps {
  onNavClick: (sectionId: string) => void;
}

const links = [
  ["Services", "services"],
  ["Fleet", "fleet"],
  ["Routes", "routes"],
  ["Private Office", "office"]
];

export default function LuxuryFooter({ onNavClick }: LuxuryFooterProps) {
  const isReduced = useReducedMotionPref();
  const spring = { type: "spring" as const, stiffness: 360, damping: 34 };

  return (
    <footer className="bg-brand-black px-4 pb-28 pt-14 md:px-8 md:pb-14 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-10 border-b border-brand-cream/12 pb-12 md:grid-cols-[1.4fr_1fr_1fr] md:items-start">
          <div>
            <BrandLockup size="footer" />
            <p className="mt-5 max-w-sm text-xs font-light leading-relaxed text-brand-stone">
              Zürich-based private chauffeur service for airport arrivals, executives, families and private offices.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-5 gap-y-4" aria-label="Footer navigation">
            {links.map(([label, target]) => (
              <motion.button
                key={target}
                type="button"
                onClick={() => onNavClick(target)}
                whileHover={isReduced ? undefined : { x: 2, color: "#FAF8F5" }}
                transition={spring}
                className="text-left text-[10px] font-mono uppercase tracking-[0.14em] text-brand-stone"
              >
                {label}
              </motion.button>
            ))}
          </nav>

          <div className="grid gap-3 text-[10px] font-mono uppercase tracking-[0.12em] text-brand-stone md:text-right">
            <motion.a href="tel:+41772870956" whileHover={isReduced ? undefined : { color: "#FAF8F5" }} transition={spring}>+41 77 287 09 56</motion.a>
            <motion.a href="mailto:booking@alairnoir.ch" whileHover={isReduced ? undefined : { color: "#FAF8F5" }} transition={spring}>booking@alairnoir.ch</motion.a>
            <motion.a href="https://instagram.com/alairnoir" target="_blank" rel="noopener noreferrer" whileHover={isReduced ? undefined : { color: "#FAF8F5" }} transition={spring}>@alairnoir</motion.a>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-7 text-[9px] font-mono uppercase tracking-[0.13em] text-brand-muted-stone sm:flex-row sm:items-center sm:justify-between">
          <span>ALAIR NOIR GmbH · Zürich · Switzerland</span>
          <div className="flex flex-wrap gap-5">
            <span>Impressum</span>
            <span>Privacy</span>
            <span>© 2026 ALAIR NOIR GmbH</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
