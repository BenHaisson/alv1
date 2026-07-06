import { useRef } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useReducedMotionPref } from "./MotionProvider";

interface CinematicOpeningPortalProps {
  onComplete: (isComplete: boolean) => void;
}

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const BOOT_LINES = [
  { text: "PRIVATE CHAUFFEUR SERVICE", delay: 1.5 },
  { text: "ZÜRICH / SWITZERLAND", delay: 1.75 }
];

export default function CinematicOpeningPortal({ onComplete }: CinematicOpeningPortalProps) {
  const spacerRef = useRef<HTMLDivElement>(null);
  const hasReportedComplete = useRef(false);
  const isReduced = useReducedMotionPref();

  // The stage is a page-level sticky sheet (StackedChapter shape), so both
  // progresses target the flow spacer instead — never a sticky element, whose
  // measured offsets are unreliable while pinned.
  //
  // Boot phase: spacer top travels viewport bottom -> top (scroll 0 -> 100vh).
  const { scrollYProgress: bootProgress } = useScroll({
    target: spacerRef,
    offset: ["start end", "start start"]
  });
  // Cover phase: spacer end == the hero's flow top, traveling viewport
  // bottom -> top — exactly the window in which the hero slides over the
  // pinned stage.
  const { scrollYProgress: coverProgress } = useScroll({
    target: spacerRef,
    offset: ["end end", "end start"]
  });

  const portalOpacity = useTransform(coverProgress, [0, 0.35, 0.9], [1, 1, 0]);
  const portalScale = useTransform(bootProgress, [0, 0.5], [1, 1.04]);
  const promptOpacity = useTransform(bootProgress, [0, 0.08, 1], [1, 0, 0]);
  const scanY = useTransform(bootProgress, [0, 0.5], ["-6%", "106%"]);

  // Same cover treatment as StackedChapter: recede, dim, then stop painting.
  const stageScale = useTransform(coverProgress, [0, 1], [1, 0.955]);
  const stageDim = useTransform(coverProgress, [0, 1], [0, 0.42]);
  const stageVisibility = useTransform(coverProgress, (v) =>
    v >= 0.999 ? ("hidden" as const) : ("visible" as const)
  );

  useMotionValueEvent(bootProgress, "change", (latest) => {
    const isComplete = latest > 0.43;
    if (hasReportedComplete.current !== isComplete) {
      hasReportedComplete.current = isComplete;
      onComplete(isComplete);
    }
  });

  const reveal = (delay: number) =>
    isReduced
      ? {}
      : {
          initial: { opacity: 0, y: 14, filter: "blur(4px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 0.9, delay, ease: EASE_OUT }
        };

  return (
    <>
      <motion.div
        className="sticky top-0 z-0 h-screen overflow-hidden bg-brand-black luxury-noise"
        style={
          isReduced
            ? undefined
            : {
                scale: stageScale,
                visibility: stageVisibility,
                transformOrigin: "50% 0%",
                willChange: "transform"
              }
        }
      >
        {/* Scroll-linked digital scan sweep */}
        {!isReduced && (
          <motion.div
            aria-hidden="true"
            style={{ top: scanY }}
            className="pointer-events-none absolute left-0 right-0 z-30 h-20 bg-gradient-to-b from-transparent via-brand-gold/[0.05] to-transparent"
          />
        )}

        {/* HUD frame */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-5 z-20 hidden md:block">
          <motion.span
            {...reveal(2.2)}
            className="absolute left-0 top-0 text-[9px] font-mono uppercase tracking-[0.3em] text-brand-stone/70"
          >
            ALAIR NOIR
          </motion.span>
          <motion.span
            {...reveal(2.35)}
            className="absolute right-0 top-0 text-[9px] font-mono uppercase tracking-[0.3em] text-brand-stone/70"
          >
            EST. ZÜRICH
          </motion.span>
          <motion.span
            {...reveal(2.5)}
            className="absolute bottom-0 left-0 text-[9px] font-mono uppercase tracking-[0.3em] text-brand-stone/70"
          >
            47.3769° N / 8.5417° E
          </motion.span>
        </div>

        <motion.div
          style={isReduced ? undefined : { opacity: portalOpacity, scale: portalScale }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-8 text-center"
        >
          {/* A/N monogram — thin luminous lines with gold scan separator */}
          <div className="mb-10 flex items-center justify-center gap-6 text-brand-cream" aria-label="Alair Noir monogram">
            <motion.span
              {...reveal(0.35)}
              className="font-serif text-5xl font-light tracking-[0.08em] md:text-7xl"
            >
              A
            </motion.span>
            <motion.span
              initial={isReduced ? false : { scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1.2, delay: 0.15, ease: EASE_OUT }}
              className="h-16 w-px origin-top bg-brand-gold shadow-[0_0_12px_rgba(205,162,80,0.18)] md:h-24"
            />
            <motion.span
              {...reveal(0.55)}
              className="font-serif text-5xl font-light tracking-[0.08em] md:text-7xl"
            >
              N
            </motion.span>
          </div>

          <motion.h1
            {...reveal(0.85)}
            className="select-none font-serif text-4xl font-light tracking-[0.3em] text-white glow-subtle md:text-7xl"
          >
            ALAIR NOIR
          </motion.h1>

          <motion.div
            initial={isReduced ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, delay: 1.2, ease: EASE_OUT }}
            className="my-8 h-px w-44 bg-brand-gold/50 md:w-56"
          />

          {/* Access-system boot lines */}
          <div className="flex flex-col items-center gap-3">
            {BOOT_LINES.map((line) => (
              <motion.p
                key={line.text}
                {...reveal(line.delay)}
                className="text-[11px] font-mono uppercase tracking-[0.38em] text-brand-stone md:text-xs"
              >
                {line.text}
              </motion.p>
            ))}

            <motion.div
              {...reveal(2.05)}
              className="mt-4 flex items-center gap-3 border border-brand-gold/30 bg-brand-gold-muted px-5 py-2.5"
            >
              <span className={`h-1.5 w-1.5 rounded-full bg-brand-gold ${isReduced ? "" : "animate-pulse"}`} />
              <span className="text-[10px] font-mono uppercase tracking-[0.34em] text-brand-gold">
                By Arrangement
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll prompt */}
        <motion.div
          style={isReduced ? undefined : { opacity: promptOpacity }}
          className="absolute bottom-10 left-0 right-0 z-20 flex flex-col items-center gap-4"
        >
          <motion.span
            {...reveal(2.6)}
            className="text-[10px] font-mono uppercase tracking-[0.32em] text-brand-stone"
          >
            Enter the arrival
          </motion.span>
          <motion.div {...reveal(2.75)} className="h-12 w-px overflow-hidden bg-brand-cream/10">
            {!isReduced && (
              <motion.div
                className="h-full w-full bg-brand-gold"
                animate={{ y: ["-100%", "100%"] }}
                transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </motion.div>
        </motion.div>

        {/* Cover dim — deepens as the hero sheet slides over the stage. */}
        {!isReduced && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-40 bg-brand-black"
            style={{ opacity: stageDim }}
          />
        )}
      </motion.div>

      {/* Boot runway: keeps the original 150vh of intro scroll; both scroll
          progresses are measured against this in-flow element. */}
      <div ref={spacerRef} aria-hidden="true" className="relative h-[50vh]" />
    </>
  );
}
