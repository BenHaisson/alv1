import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";

interface BrandOpeningProps {
  onComplete: (isComplete: boolean) => void;
}

export default function BrandOpening({ onComplete }: BrandOpeningProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const hasReportedComplete = useRef(false);
  const [hasStartedScroll, setHasStartedScroll] = useState(false);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const introOpacity = useTransform(scrollYProgress, [0, 0.88, 1], [1, 1, 0]);
  const introScale = useTransform(scrollYProgress, [0, 0.88, 1], [0.98, 1, 1.04]);
  const promptOpacity = useTransform(scrollYProgress, [0, 0.01, 0.035], [1, 0.35, 0]);
  const promptY = useTransform(scrollYProgress, [0, 0.035], [0, -18]);
  const markY = useTransform(scrollYProgress, [0.12, 0.28, 0.86], [38, 0, -16]);
  const markOpacity = useTransform(scrollYProgress, [0.1, 0.24, 0.86], [0, 1, 0.75]);
  const titleY = useTransform(scrollYProgress, [0.26, 0.42, 0.88], [38, 0, -24]);
  const titleOpacity = useTransform(scrollYProgress, [0.24, 0.38, 0.88], [0, 1, 0.7]);
  const ruleWidth = useTransform(scrollYProgress, [0.34, 0.48, 0.82], ["0px", "150px", "220px"]);
  const sloganY = useTransform(scrollYProgress, [0.42, 0.56], [24, 0]);
  const sloganOpacity = useTransform(scrollYProgress, [0.4, 0.54, 0.88], [0, 1, 0.7]);
  const locationY = useTransform(scrollYProgress, [0.56, 0.68], [20, 0]);
  const locationOpacity = useTransform(scrollYProgress, [0.54, 0.66, 0.88], [0, 1, 0.72]);
  const serviceY = useTransform(scrollYProgress, [0.68, 0.8], [24, 0]);
  const serviceOpacity = useTransform(scrollYProgress, [0.66, 0.78, 0.9], [0, 1, 0.55]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setHasStartedScroll(latest > 0.015);

    const isComplete = latest > 0.94;
    if (hasReportedComplete.current !== isComplete) {
      hasReportedComplete.current = isComplete;
      onComplete(isComplete);
    }
  });

  return (
    <section ref={sectionRef} className="relative h-[245vh] bg-brand-black luxury-noise">
      <div className="sticky top-0 h-screen overflow-hidden">
        {!hasStartedScroll && (
          <motion.div
            style={{ opacity: promptOpacity, y: promptY }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center px-8 text-center"
          >
            <p className="text-[11px] md:text-xs font-mono uppercase tracking-[0.32em] text-brand-stone">
              Welcome to Alair Noir
            </p>
            <p className="mt-5 max-w-sm text-base md:text-lg font-serif italic text-brand-ivory/85">
              Scroll slowly to begin the arrival.
            </p>
            <div className="mt-8 h-14 w-px overflow-hidden bg-brand-cream/10">
              <motion.div
                className="h-full w-full bg-brand-gold"
                animate={{ y: ["-100%", "100%"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        )}

        <motion.div
          style={{ opacity: introOpacity, scale: introScale }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 md:p-12"
        >
          <div className="flex flex-col items-center text-center">
            <motion.div
              style={{ y: markY, opacity: markOpacity }}
              className="mb-8 flex items-center justify-center gap-5 text-brand-cream"
              aria-label="ALair Noir AN monogram"
            >
              <span className="font-serif text-4xl md:text-6xl font-light tracking-[0.08em]">A</span>
              <span className="h-12 md:h-16 w-px bg-brand-gold/70 shadow-[0_0_18px_rgba(205,162,80,0.35)]" />
              <span className="font-serif text-4xl md:text-6xl font-light tracking-[0.08em]">N</span>
            </motion.div>

            <motion.p
              style={{ y: titleY, opacity: titleOpacity }}
              className="text-4xl md:text-7xl lg:text-8xl tracking-[0.3em] font-serif font-light text-white glow-subtle select-none"
            >
              ALAIR NOIR
            </motion.p>

            <motion.div
              style={{ width: ruleWidth }}
              className="h-px bg-brand-gold/55 my-8"
            />

            <motion.p
              style={{ opacity: sloganOpacity, y: sloganY }}
              className="text-xs md:text-sm font-mono tracking-[0.4em] uppercase text-brand-gold font-light select-none"
            >
              NOT FOR EVERYONE / FOR YOU
            </motion.p>

            <motion.p
              style={{ opacity: locationOpacity, y: locationY }}
              className="mt-10 text-[11px] md:text-xs font-mono uppercase tracking-[0.34em] text-brand-stone"
            >
              Zürich / Switzerland
            </motion.p>

            <motion.p
              style={{ opacity: serviceOpacity, y: serviceY }}
              className="mt-5 max-w-xl text-lg md:text-2xl font-serif text-brand-ivory/88 font-light leading-relaxed"
            >
              Private chauffeur service Zürich — prepared, discreet, and precise.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
