import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useReducedMotionPref } from "./MotionProvider";

interface CinematicOpeningPortalProps {
  onComplete: (isComplete: boolean) => void;
}

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const LOCATION_LINE = "ZÜRICH · SWITZERLAND";
const SIGNATURE_LINES = ["Not for Everyone,", "For you."];
const WELCOME_VIDEO_SRC = "/videos/alair-noir-welcome-intro.mp4";
const CONTENT_REVEAL_START_SECONDS = 6.2;

export default function CinematicOpeningPortal({ onComplete }: CinematicOpeningPortalProps) {
  const portalRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasReportedComplete = useRef(false);
  const isReduced = useReducedMotionPref();
  const [videoState, setVideoState] = useState<"idle" | "playing" | "ended">("idle");
  const [isContentVisible, setIsContentVisible] = useState(false);

  // The opening occupies exactly one viewport, so the booking hero begins as
  // soon as the intro screen has passed.
  const { scrollYProgress: bootProgress } = useScroll({
    target: portalRef,
    offset: ["start start", "end start"]
  });

  const portalScale = useTransform(bootProgress, [0, 1], [1, 0.955]);
  const scanY = useTransform(bootProgress, [0, 0.5], ["-6%", "106%"]);

  // Fade the opening as the booking hero takes over the viewport.
  const stageDim = useTransform(bootProgress, [0, 1], [0, 0.42]);

  useMotionValueEvent(bootProgress, "change", (latest) => {
    const isComplete = latest > 0.43;
    if (hasReportedComplete.current !== isComplete) {
      hasReportedComplete.current = isComplete;
      onComplete(isComplete);
    }
  });

  useEffect(() => {
    if (isReduced) return;

    const startVideo = () => {
      if (videoState !== "idle") return;

      const video = videoRef.current;
      if (!video) return;

      setIsContentVisible(false);
      video.currentTime = 0;
      setVideoState("playing");
      video.play().catch(() => {
        setVideoState("ended");
        setIsContentVisible(true);
      });
    };

    const onWheel = (event: WheelEvent) => {
      if (videoState === "ended") return;
      event.preventDefault();
      startVideo();
    };

    const onTouchMove = (event: TouchEvent) => {
      if (videoState === "ended") return;
      event.preventDefault();
      startVideo();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const scrollKeys = [" ", "ArrowDown", "PageDown", "End"];
      if (!scrollKeys.includes(event.key) || videoState === "ended") return;
      event.preventDefault();
      startVideo();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isReduced, videoState]);

  useEffect(() => {
    if (videoState !== "playing") return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [videoState]);

  const reveal = (delay: number) =>
    isReduced
      ? {}
      : {
          initial: { opacity: 0, y: 14, filter: "blur(4px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 0.9, delay, ease: EASE_OUT }
        };

  const revealContent = (delay: number) =>
    isReduced
      ? {}
      : {
          initial: { opacity: 0, y: 24, filter: "blur(7px)" },
          animate: isContentVisible
            ? { opacity: 1, y: 0, filter: "blur(0px)" }
            : { opacity: 0, y: 24, filter: "blur(7px)" },
          transition: { duration: 1.65, delay, ease: EASE_OUT }
        };

  return (
    <motion.section
      ref={portalRef}
      aria-label="Alair Noir opening"
      className="relative z-0 h-[100svh] bg-brand-black luxury-noise"
    >
      <motion.div
        className="sticky top-0 h-screen overflow-hidden"
        style={
          isReduced
            ? undefined
            : {
                willChange: "opacity, transform"
              }
        }
      >
        <motion.video
          ref={videoRef}
          aria-hidden="true"
          className="absolute inset-0 z-0 h-full w-full object-cover"
          src={WELCOME_VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          onTimeUpdate={() => {
            const video = videoRef.current;
            if (videoState === "playing" && video && video.currentTime >= CONTENT_REVEAL_START_SECONDS) {
              setIsContentVisible(true);
            }
          }}
          onEnded={() => {
            setVideoState("ended");
            setIsContentVisible(true);
          }}
          animate={{ opacity: videoState === "idle" ? 0 : 1 }}
          transition={{ duration: 0.9, ease: EASE_OUT }}
        />

        <motion.div
          aria-hidden="true"
          className="absolute inset-0 z-[1] bg-brand-black"
          animate={{
            opacity: videoState === "idle" ? 1 : isContentVisible ? 1 : 0.3
          }}
          transition={{ duration: isContentVisible ? 4.2 : 0.8, ease: EASE_OUT }}
        />

        {/* Scroll-linked digital scan sweep */}
        {!isReduced && (
          <motion.div
            aria-hidden="true"
            style={{ top: scanY }}
            className="pointer-events-none absolute left-0 right-0 z-30 h-20 bg-gradient-to-b from-transparent via-brand-ivory/[0.04] to-transparent"
          />
        )}

        <motion.div
          style={isReduced ? undefined : { scale: portalScale }}
          animate={{ opacity: isReduced || isContentVisible ? 1 : 0 }}
          transition={{ duration: isContentVisible ? 1.1 : 0.55, ease: EASE_OUT }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-8 text-center"
        >
          {/* A/N monogram */}
          <div className="mb-10 flex items-center justify-center gap-6 text-brand-cream" aria-label="Alair Noir monogram">
            <motion.span
              {...revealContent(0)}
              className="font-serif text-5xl font-light tracking-[0.08em] md:text-7xl"
            >
              A
            </motion.span>
            <motion.span
              initial={isReduced ? false : { scaleY: 0, opacity: 0 }}
              animate={isContentVisible ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
              transition={{ duration: 1.55, delay: 0.24, ease: EASE_OUT }}
              className="h-16 w-px origin-top bg-brand-ivory shadow-[0_0_12px_rgba(246,242,233,0.2)] md:h-24"
            />
            <motion.span
              {...revealContent(0.35)}
              className="font-serif text-5xl font-light tracking-[0.08em] md:text-7xl"
            >
              N
            </motion.span>
          </div>

          <motion.h1
            {...revealContent(0.95)}
            className="select-none font-serif text-4xl font-light tracking-[0.3em] text-white glow-subtle md:text-7xl"
          >
            ALAIR NOIR
          </motion.h1>

          <motion.p
            {...revealContent(1.45)}
            className="mt-6 text-[11px] font-sans uppercase tracking-[0.32em] text-brand-gold/55 md:text-xs"
          >
            {LOCATION_LINE}
          </motion.p>

          <motion.p
            {...revealContent(1.9)}
            className="mt-9 font-serif text-2xl font-light italic leading-[1.15] text-[#fcf3c8] md:text-4xl"
          >
            {SIGNATURE_LINES.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </motion.p>
        </motion.div>

        {/* Scroll prompt */}
        <motion.div
          animate={{ opacity: videoState === "idle" ? 1 : 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className="absolute bottom-10 left-0 right-0 z-20 flex flex-col items-center gap-4"
        >
          <motion.span
            {...reveal(2.6)}
            className="text-[10px] font-mono uppercase tracking-[0.32em] text-brand-gold/55"
          >
            Enter the arrival
          </motion.span>
          <motion.div {...reveal(2.75)} className="h-12 w-px overflow-hidden bg-brand-cream/10">
            {!isReduced && (
              <motion.div
                className="h-full w-full bg-brand-ivory/70"
                animate={{ y: ["-100%", "100%"] }}
                transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </motion.div>
        </motion.div>

        {/* Cover dim deepens as the hero sheet slides over the stage. */}
        {!isReduced && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-40 bg-brand-black"
            style={{ opacity: stageDim }}
          />
        )}
      </motion.div>
    </motion.section>
  );
}
