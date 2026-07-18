import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { useReducedMotionPref } from "./MotionProvider";
import { MOTION_EASE } from "../lib/motion";
import { scrollWindowTo } from "../lib/smoothScroll";
import { HERO_VIDEO } from "../data/visualJourney";

interface CinematicOpeningPortalProps {
  onComplete: (isComplete: boolean) => void;
}

const LOCATION_LINE = "ZÜRICH · SWITZERLAND";
const SIGNATURE_LINES = ["Not for Everyone.", "For you."];
const QUART_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

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
      if (hasAutoAdvancedRef.current) {
        onComplete(true);
        setIsPortalVisible(false);
        return;
      }

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
      if (hasAutoAdvancedRef.current) return;
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

  const maskReveal = (delay: number, duration = 0.78, direction: "left" | "right" = "left") =>
    isReduced
      ? {}
      : {
          initial: {
            clipPath: direction === "left" ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)",
            opacity: 0,
            filter: "blur(8px) brightness(1)"
          },
          animate: {
            clipPath: "inset(0 0 0 0)",
            opacity: 1,
            filter: ["blur(8px) brightness(1)", "blur(0px) brightness(1.05)", "blur(0px) brightness(1)"]
          },
          transition: {
            clipPath: { duration, delay, ease: QUART_EASE },
            opacity: { duration: Math.min(duration, 0.45), delay, ease: QUART_EASE },
            filter: { duration: duration + 0.16, delay, times: [0, 0.84, 1], ease: QUART_EASE }
          }
        };

  const softFade = (delay: number, duration = 0.5) =>
    isReduced
      ? {}
      : {
          initial: { opacity: 0, letterSpacing: "0.9em", filter: "blur(3px)" },
          animate: { opacity: 1, letterSpacing: "0.32em", filter: "blur(0px)" },
          transition: { duration, delay, ease: QUART_EASE }
        };

  return (
    <AnimatePresence initial={false}>
      {isPortalVisible && (
        <motion.div
          key="opening-portal-visual"
          aria-label="Alair Noir welcome"
          exit={isReduced ? undefined : { opacity: 0, scale: 1.02, filter: "blur(8px)" }}
          transition={{ duration: 0.85, ease: MOTION_EASE }}
          className="pointer-events-none fixed inset-0 z-[5] h-[100svh] overflow-hidden bg-brand-black"
        >
          <motion.img
            src={HERO_VIDEO.poster}
            alt=""
            aria-hidden="true"
            loading="eager"
            fetchPriority="high"
            initial={isReduced ? false : { opacity: 0, scale: 1.08 }}
            animate={isReduced ? undefined : { opacity: 0.34, scale: 1 }}
            transition={{ duration: 1.4, ease: QUART_EASE }}
            className="absolute inset-0 h-full w-full object-cover object-center grayscale-[0.2] brightness-[0.58]"
          />
          {!isReduced && (
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_42%_45%,rgba(246,242,233,0.055),transparent_38%),linear-gradient(115deg,transparent_18%,rgba(246,242,233,0.035)_42%,transparent_66%)]"
              initial={{ opacity: 0, x: "-3%" }}
              animate={{ opacity: [0, 0.5, 0.22], x: ["-3%", "2%", "4%"] }}
              transition={{ duration: 2.8, ease: "easeOut" }}
            />
          )}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,6,0.82)_0%,rgba(5,7,6,0.3)_42%,rgba(5,7,6,0.92)_100%)]"
          />

          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-7 text-center">
            <motion.div
              className="mb-10 flex items-center justify-center gap-6 text-brand-cream md:gap-10"
              aria-label="Alair Noir monogram"
              animate={isReduced ? undefined : { filter: ["brightness(1)", "brightness(1.03)", "brightness(1)"] }}
              transition={isReduced ? undefined : { duration: 0.24, delay: 0.85, ease: "easeInOut" }}
            >
              <motion.span
                {...maskReveal(0.3, 0.55, "left")}
                className="relative overflow-hidden font-serif text-5xl font-light tracking-[0.18em] md:text-7xl"
              >
                A
              </motion.span>
              <motion.span
                initial={isReduced ? false : { scaleY: 0, opacity: 0 }}
                animate={isReduced ? undefined : { scaleY: 1, opacity: 1 }}
                transition={isReduced ? undefined : { duration: 0.45, delay: 0.15, ease: QUART_EASE }}
                className="h-16 w-px origin-center bg-brand-ivory/60 md:h-[70px]"
              />
              <motion.span
                {...maskReveal(0.55, 0.55, "right")}
                className="relative overflow-hidden font-serif text-5xl font-light tracking-[0.18em] md:text-7xl"
              >
                N
              </motion.span>
            </motion.div>

            <motion.h1
              {...maskReveal(0.8, 0.8, "left")}
              className="select-none overflow-hidden font-serif text-4xl font-light tracking-[0.18em] text-brand-cream md:text-7xl"
            >
              ALAIR NOIR
            </motion.h1>

            <motion.p
              {...softFade(1.5, 0.5)}
              className="mt-6 text-[11px] font-sans uppercase text-brand-gold/55 md:text-xs"
            >
              {LOCATION_LINE}
            </motion.p>

            <div className="mt-9 font-serif text-2xl font-light italic leading-[1.15] text-[#fcf3c8] md:text-4xl">
              <motion.span {...maskReveal(1.8, 0.6, "left")} className="block overflow-hidden opacity-85">
                {SIGNATURE_LINES[0]}
              </motion.span>
              <motion.span {...maskReveal(2.34, 0.6, "left")} className="block overflow-hidden opacity-100">
                {SIGNATURE_LINES[1]}
              </motion.span>
            </div>
          </div>

          <motion.div
            initial={isReduced ? false : { opacity: 0, y: 8 }}
            animate={isReduced ? undefined : { opacity: 1, y: 0 }}
            transition={isReduced ? undefined : { duration: 0.55, delay: 2.35, ease: QUART_EASE }}
            className="absolute bottom-8 left-0 right-0 z-30 flex flex-col items-center gap-3"
          >
            <span className="text-[10px] font-sans uppercase tracking-[0.24em] text-brand-gold/65">
              Scroll to enter
            </span>
            <motion.span
              aria-hidden="true"
              animate={isReduced ? undefined : { y: [0, 5, 0], opacity: [0.35, 0.8, 0.35] }}
              transition={isReduced ? undefined : { duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
              className="h-8 w-px bg-brand-gold/45"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}