import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { useMediaQuery, useReducedMotionPref } from "./MotionProvider";
import { HERO_VIDEO } from "../data/visualJourney";

interface CinematicOpeningPortalProps {
  onComplete: (isComplete: boolean) => void;
}

const WORDMARK = "ALAIR NOIR";
const PREMIUM_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const FULL_INTRO_DURATION = 6200;
const REDUCED_INTRO_DURATION = 1800;

export default function CinematicOpeningPortal({ onComplete }: CinematicOpeningPortalProps) {
  const isReduced = useReducedMotionPref();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const lenis = useLenis();
  const portalRef = useRef<HTMLDivElement>(null);
  const skipButtonRef = useRef<HTMLButtonElement>(null);
  const [isPortalVisible, setIsPortalVisible] = useState(true);
  const [isHeroImageReady, setIsHeroImageReady] = useState(false);
  const heroPoster = isMobile && HERO_VIDEO.mobilePoster ? HERO_VIDEO.mobilePoster : HERO_VIDEO.poster;
  const letterTravel = isMobile ? "22vw" : "36vw";
  const letterLift = isMobile ? "-24vh" : "-30vh";

  const completeIntro = useCallback(() => {
    onComplete(true);
    setIsPortalVisible(false);
  }, [onComplete]);

  useEffect(() => {
    if (!isPortalVisible) return;

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    const previousActiveElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    lenis?.stop();
    portalRef.current?.focus({ preventScroll: true });

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      lenis?.start();

      if (
        previousActiveElement &&
        previousActiveElement !== document.body &&
        document.contains(previousActiveElement)
      ) {
        previousActiveElement.focus({ preventScroll: true });
      }
    };
  }, [isPortalVisible, lenis]);

  useEffect(() => {
    if (!isHeroImageReady) return;

    const timer = window.setTimeout(
      completeIntro,
      isReduced ? REDUCED_INTRO_DURATION : FULL_INTRO_DURATION
    );

    return () => window.clearTimeout(timer);
  }, [completeIntro, isHeroImageReady, isReduced]);

  useEffect(() => {
    if (!isPortalVisible) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        completeIntro();
        return;
      }

      if (event.key === "Tab") {
        event.preventDefault();
        skipButtonRef.current?.focus({ preventScroll: true });
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [completeIntro, isPortalVisible]);

  return (
    <AnimatePresence initial={false}>
      {isPortalVisible && (
        <motion.div
          ref={portalRef}
          key="opening-portal-visual"
          role="dialog"
          aria-modal="true"
          aria-label="ALAIR NOIR welcome animation"
          tabIndex={-1}
          initial={false}
          exit={{ opacity: 0 }}
          transition={{ duration: isReduced ? 0.35 : 0.7, ease: PREMIUM_EASE }}
          className="pointer-events-auto fixed inset-0 z-[80] h-[100svh] overflow-hidden bg-[#050505] outline-none"
        >
          <button
            ref={skipButtonRef}
            type="button"
            onClick={completeIntro}
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:border focus:border-brand-cream/45 focus:bg-brand-black focus:px-4 focus:py-3 focus:text-xs focus:font-sans focus:font-medium focus:uppercase focus:tracking-[0.12em] focus:text-brand-cream focus:outline-none"
          >
            Skip welcome animation
          </button>

          <motion.div
            aria-hidden="true"
            className="absolute inset-0"
            initial={false}
            animate={
              isReduced
                ? { opacity: isHeroImageReady ? 1 : 0.08 }
                : isHeroImageReady
                  ? { opacity: [0.08, 0.08, 1], scale: [1.025, 1.025, 1] }
                  : { opacity: 0.08, scale: 1.025 }
            }
            transition={
              isReduced
                ? { duration: 0.7, ease: PREMIUM_EASE }
                : { duration: 6.1, times: [0, 0.835, 1], ease: PREMIUM_EASE }
            }
          >
            <img
              src={heroPoster}
              alt=""
              loading="eager"
              fetchPriority="high"
              decoding="async"
              onLoad={() => setIsHeroImageReady(true)}
              onError={() => setIsHeroImageReady(true)}
              className="absolute inset-0 h-full w-full scale-[1.14] object-cover object-[50%_58%] grayscale-[0.12] brightness-[0.82] contrast-[1.06] md:scale-[1.12] md:object-[50%_54%]"
            />
          </motion.div>

          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-[#050505]"
            initial={false}
            animate={
              isReduced
                ? { opacity: isHeroImageReady ? 0.42 : 1 }
                : isHeroImageReady
                  ? { opacity: [1, 1, 0.18] }
                  : { opacity: 1 }
            }
            transition={
              isReduced
                ? { duration: 0.7, ease: PREMIUM_EASE }
                : { duration: 6.1, times: [0, 0.835, 1], ease: PREMIUM_EASE }
            }
          />

          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.48)_0%,rgba(5,5,5,0.12)_44%,rgba(5,5,5,0.62)_100%)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHeroImageReady ? 1 : 0 }}
            transition={{ duration: isReduced ? 0.4 : 1, delay: isReduced ? 0 : 5.1, ease: PREMIUM_EASE }}
          />

          <motion.div
            aria-hidden="true"
            className="absolute left-1/2 top-[39%] z-20 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-6 text-brand-ivory md:top-[40%] md:gap-10"
            initial={false}
            animate={
              isReduced
                ? { opacity: isHeroImageReady ? 1 : 0 }
                : isHeroImageReady
                  ? { opacity: [1, 1, 0] }
                  : { opacity: 0 }
            }
            transition={
              isReduced
                ? { duration: 0.35, ease: PREMIUM_EASE }
                : { duration: 5.65, times: [0, 0.91, 1], ease: PREMIUM_EASE }
            }
          >
            <motion.span
              initial={{ x: `-${letterTravel}`, y: letterLift, opacity: 0, filter: "blur(9px)" }}
              animate={
                isReduced
                  ? { x: 0, y: 0, opacity: isHeroImageReady ? 1 : 0, filter: "blur(0px)" }
                  : isHeroImageReady
                    ? { x: 0, y: 0, opacity: 1, filter: "blur(0px)" }
                    : { x: `-${letterTravel}`, y: letterLift, opacity: 0, filter: "blur(9px)" }
              }
              transition={
                isReduced
                  ? { duration: 0.35, ease: PREMIUM_EASE }
                  : {
                      x: { duration: 1.2, delay: 0.82, ease: PREMIUM_EASE },
                      y: { duration: 1.2, delay: 0.82, ease: PREMIUM_EASE },
                      opacity: { duration: 0.6, delay: 0.3, ease: PREMIUM_EASE },
                      filter: { duration: 0.6, delay: 0.3, ease: PREMIUM_EASE }
                    }
              }
              className="font-serif text-5xl font-light leading-none md:text-7xl"
            >
              A
            </motion.span>

            <motion.span
              aria-hidden="true"
              initial={{ scaleY: 0, opacity: 0 }}
              animate={
                isReduced
                  ? { scaleY: isHeroImageReady ? 1 : 0, opacity: isHeroImageReady ? 1 : 0 }
                  : isHeroImageReady
                    ? { scaleY: 1, opacity: 1 }
                    : { scaleY: 0, opacity: 0 }
              }
              transition={{ duration: isReduced ? 0.3 : 0.6, delay: isReduced ? 0 : 1.72, ease: PREMIUM_EASE }}
              className="h-16 w-px origin-top bg-brand-ivory/65 md:h-[70px]"
            />

            <motion.span
              initial={{ x: letterTravel, y: letterLift, opacity: 0, filter: "blur(9px)" }}
              animate={
                isReduced
                  ? { x: 0, y: 0, opacity: isHeroImageReady ? 1 : 0, filter: "blur(0px)" }
                  : isHeroImageReady
                    ? { x: 0, y: 0, opacity: 1, filter: "blur(0px)" }
                    : { x: letterTravel, y: letterLift, opacity: 0, filter: "blur(9px)" }
              }
              transition={
                isReduced
                  ? { duration: 0.35, ease: PREMIUM_EASE }
                  : {
                      x: { duration: 1.2, delay: 0.82, ease: PREMIUM_EASE },
                      y: { duration: 1.2, delay: 0.82, ease: PREMIUM_EASE },
                      opacity: { duration: 0.6, delay: 0.3, ease: PREMIUM_EASE },
                      filter: { duration: 0.6, delay: 0.3, ease: PREMIUM_EASE }
                    }
              }
              className="font-serif text-5xl font-light leading-none md:text-7xl"
            >
              N
            </motion.span>
          </motion.div>

          <motion.h1
            aria-hidden="true"
            className="absolute left-1/2 top-[calc(39%+86px)] z-20 flex -translate-x-1/2 items-center whitespace-nowrap font-serif text-[clamp(2rem,9vw,3.4rem)] font-light tracking-[0.18em] text-brand-ivory md:top-[calc(40%+108px)] md:text-7xl"
            initial={false}
            animate={
              isReduced
                ? { opacity: isHeroImageReady ? 1 : 0 }
                : isHeroImageReady
                  ? {
                      opacity: [1, 1, 1, 0],
                      filter: ["brightness(1)", "brightness(1)", "brightness(1.04)", "brightness(1)"]
                    }
                  : { opacity: 0, filter: "brightness(1)" }
            }
            transition={
              isReduced
                ? { duration: 0.35, ease: PREMIUM_EASE }
                : { duration: 5.8, times: [0, 0.84, 0.91, 1], ease: PREMIUM_EASE }
            }
          >
            <span>
              {WORDMARK.split("").map((character, index) => (
                <motion.span
                  key={`${character}-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHeroImageReady ? 1 : 0 }}
                  transition={{
                    duration: isReduced ? 0.01 : 0.055,
                    delay: isReduced ? 0 : 2.24 + index * 0.095,
                    ease: "linear"
                  }}
                  className="inline-block"
                >
                  {character === " " ? "\u00a0" : character}
                </motion.span>
              ))}
            </span>
            {!isReduced && (
              <motion.span
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHeroImageReady ? [0, 0.78, 0, 0.78, 0] : 0 }}
                transition={{
                  duration: 1.35,
                  delay: 2.18,
                  times: [0, 0.15, 0.38, 0.66, 1],
                  ease: "linear"
                }}
                className="ml-1 h-[0.9em] w-px bg-brand-ivory/70"
              />
            )}
          </motion.h1>

          <motion.p
            aria-hidden="true"
            className="absolute left-1/2 top-[calc(39%+150px)] z-20 w-[calc(100%-32px)] -translate-x-1/2 whitespace-nowrap text-center font-serif text-[clamp(1.08rem,4.8vw,2rem)] font-light text-brand-stone md:top-[calc(40%+196px)]"
            initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
            animate={
              isReduced
                ? { opacity: isHeroImageReady ? 1 : 0, y: 0, filter: "blur(0px)" }
                : isHeroImageReady
                  ? {
                      opacity: [0, 1, 1, 0],
                      y: [18, 0, 0, -6],
                      filter: ["blur(8px)", "blur(0px)", "blur(0px)", "blur(3px)"]
                    }
                  : { opacity: 0, y: 18, filter: "blur(8px)" }
            }
            transition={
              isReduced
                ? { duration: 0.35, ease: PREMIUM_EASE }
                : { duration: 2.45, delay: 3.55, times: [0, 0.25, 0.65, 1], ease: PREMIUM_EASE }
            }
          >
            <span className="opacity-80">Not for everyone. </span>
            <span className="italic">For you.</span>
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
