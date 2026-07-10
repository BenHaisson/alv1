import { useEffect } from "react";
import { motion } from "motion/react";
import { useReducedMotionPref } from "./MotionProvider";
import { MOTION_DURATION, MOTION_EASE } from "../lib/motion";

interface CinematicOpeningPortalProps {
  onComplete: (isComplete: boolean) => void;
}

const LOCATION_LINE = "ZÜRICH · SWITZERLAND";
const SIGNATURE_LINES = ["Not for Everyone,", "For you."];

export default function CinematicOpeningPortal({ onComplete }: CinematicOpeningPortalProps) {
  const isReduced = useReducedMotionPref();

  useEffect(() => {
    const handleScroll = () => {
      onComplete(window.scrollY > window.innerHeight * 0.42);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [onComplete]);

  const reveal = (delay: number, y = 22) =>
    isReduced
      ? {}
      : {
          initial: { opacity: 0, y, filter: "blur(8px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: MOTION_DURATION.cinematic, delay, ease: MOTION_EASE }
        };

  return (
    <section aria-label="Alair Noir welcome" className="relative z-0 h-[100svh] bg-brand-black">
      <div className="fixed inset-0 z-0 h-screen overflow-hidden bg-brand-black">
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-7 text-center">
          <motion.div
            {...reveal(0.12, 12)}
            className="mb-10 flex items-center justify-center gap-6 text-brand-cream"
            aria-label="Alair Noir monogram"
          >
            <span className="font-serif text-5xl font-light tracking-[0.08em] md:text-7xl">A</span>
            <motion.span
              initial={isReduced ? false : { scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: MOTION_DURATION.settle, delay: 0.24, ease: MOTION_EASE }}
              className="h-16 w-px origin-top bg-brand-ivory shadow-[0_0_12px_rgba(246,242,233,0.2)] md:h-24"
            />
            <span className="font-serif text-5xl font-light tracking-[0.08em] md:text-7xl">N</span>
          </motion.div>

          <motion.h1
            {...reveal(0.62, 24)}
            className="select-none font-serif text-4xl font-light tracking-[0.3em] text-white glow-subtle md:text-7xl"
          >
            ALAIR NOIR
          </motion.h1>

          <motion.p
            {...reveal(0.96, 24)}
            className="mt-6 text-[11px] font-sans uppercase tracking-[0.32em] text-brand-gold/55 md:text-xs"
          >
            {LOCATION_LINE}
          </motion.p>

          <motion.p
            {...reveal(1.28, 24)}
            className="mt-9 font-serif text-2xl font-light italic leading-[1.15] text-[#fcf3c8] md:text-4xl"
          >
            {SIGNATURE_LINES.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </motion.p>
        </div>

        <motion.div
          {...reveal(1.7, 10)}
          className="absolute bottom-9 left-0 right-0 z-30 flex flex-col items-center gap-4"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.32em] text-brand-gold/55">
            Enter the arrival
          </span>
        </motion.div>
      </div>
    </section>
  );
}
