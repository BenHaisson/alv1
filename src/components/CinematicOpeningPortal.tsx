import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { useReducedMotionPref } from "./MotionProvider";
import { MOTION_DURATION, MOTION_EASE } from "../lib/motion";
import { scrollWindowTo } from "../lib/smoothScroll";
import { HERO_VIDEO } from "../data/visualJourney";

interface CinematicOpeningPortalProps {
  onComplete: (isComplete: boolean) => void;
}

const LOCATION_LINE = "ZÜRICH · SWITZERLAND";
const SIGNATURE_LINES = ["Not for Everyone.", "For you."];

export default function CinematicOpeningPortal({ onComplete }: CinematicOpeningPortalProps) {
  const isReduced = useReducedMotionPref();
  const lenis = useLenis();
  const [isPortalVisible, setIsPortalVisible] = useState(true);
  const hasAutoAdvancedRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);

  useEffect(() => {
    const advanceToBooking = () => {
      if (hasAutoAdvancedRef.current) return;
      hasAutoAdvancedRef.current = true;
      onComplete(true);
      setIsPortalVisible(false);
      const hero = document.getElementById("hero-section");
      const target = hero
        ? Math.max(0, hero.getBoundingClientRect().top + window.scrollY)
        : window.innerHeight;
      if (lenis && !isReduced) {
        lenis.scrollTo(target, {
          duration: 1.15,
          force: true,
          lock: false,
          programmatic: true
        });
      } else {
        scrollWindowTo(target, { immediate: isReduced, duration: isReduced ? 0 : 1.15 });
      }
    };

    const handleScroll = () => {
      if (window.scrollY > 8 && !hasAutoAdvancedRef.current) {
        advanceToBooking();
        return;
      }

      onComplete(window.scrollY > window.innerHeight * 0.42);
      setIsPortalVisible(window.scrollY < window.innerHeight * 0.92);
    };

    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY <= 0 || hasAutoAdvancedRef.current) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      advanceToBooking();
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const startY = touchStartYRef.current;
      const currentY = event.touches[0]?.clientY;
      if (startY === null || currentY === undefined || startY - currentY < 8) return;
      event.preventDefault();
      touchStartYRef.current = null;
      advanceToBooking();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "PageDown" || event.key === " ") {
        event.preventDefault();
        advanceToBooking();
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isReduced, lenis, onComplete]);

  const reveal = (delay: number, y = 22) =>
    isReduced
      ? {}
      : {
          initial: { opacity: 0, y, filter: "blur(8px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: MOTION_DURATION.cinematic, delay, ease: MOTION_EASE }
        };

  return (
    <div aria-label="Alair Noir welcome" className="pointer-events-none fixed inset-0 z-[5] h-[100svh] bg-brand-black">
      <AnimatePresence initial={false}>
        {isPortalVisible && (
          <motion.div
            key="opening-portal-visual"
            exit={isReduced ? undefined : { opacity: 0, scale: 1.04, filter: "blur(10px)" }}
            transition={{ duration: 0.9, ease: MOTION_EASE }}
            className="fixed inset-0 z-[5] h-[100svh] overflow-hidden bg-brand-black"
          >
            <motion.img
              src={HERO_VIDEO.poster}
              alt=""
              aria-hidden="true"
              loading="eager"
              fetchPriority="high"
              initial={isReduced ? false : { opacity: 0, scale: 1.08 }}
              animate={isReduced ? undefined : { opacity: 0.34, scale: 1 }}
              transition={{ duration: 2.4, ease: MOTION_EASE }}
              className="absolute inset-0 h-full w-full object-cover object-center grayscale-[0.2] brightness-[0.58]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,6,0.72)_0%,rgba(5,7,6,0.28)_42%,rgba(5,7,6,0.9)_100%)]"
            />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-7 text-center">
              <motion.div
                initial={isReduced ? false : { opacity: 0, y: 16, scale: 0.82, filter: "blur(8px)" }}
                animate={isReduced ? undefined : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.92, delay: 0.04, ease: MOTION_EASE }}
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
                {...reveal(0.32, 24)}
                className="select-none font-serif text-4xl font-light tracking-[0.3em] text-white glow-subtle md:text-7xl"
              >
                ALAIR NOIR
              </motion.h1>

              <motion.p
                {...reveal(0.56, 24)}
                className="mt-6 text-[11px] font-sans uppercase tracking-[0.32em] text-brand-gold/55 md:text-xs"
              >
                {LOCATION_LINE}
              </motion.p>

              <motion.p
                {...reveal(0.78, 24)}
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
              {...reveal(1.04, 10)}
              className="absolute bottom-8 left-0 right-0 z-30 flex flex-col items-center gap-3"
            >
              <span className="text-[10px] font-mono uppercase tracking-[0.32em] text-brand-gold/65">
                Scroll to enter
              </span>
              <motion.span
                aria-hidden="true"
                animate={isReduced ? undefined : { y: [0, 5, 0], opacity: [0.45, 1, 0.45] }}
                transition={isReduced ? undefined : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="h-8 w-px bg-brand-gold/60"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
