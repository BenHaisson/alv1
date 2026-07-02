import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import MagneticButton from "./MagneticButton";
import { imageAssets } from "../assets";
import { CornerMarkers, useReducedMotionPref } from "./MotionProvider";

interface HeroCommandDeckProps {
  onRequestScroll: () => void;
}

const HERO_IMAGE = imageAssets.alairNoirHero;

function FloatingCard({
  progress,
  range,
  from,
  className,
  label,
  lines,
  isReduced
}: {
  progress: MotionValue<number>;
  range: [number, number];
  from: { x?: number; y?: number };
  className: string;
  label: string;
  lines: string[];
  isReduced: boolean;
}) {
  // Hold keyframe at progress 1 so motion's scroll-linked WAAPI keeps the
  // revealed state instead of fading back out past the input range.
  const opacity = useTransform(progress, [range[0], range[1], 1], [0, 1, 1]);
  const x = useTransform(progress, [range[0], range[1], 1], [from.x ?? 0, 0, 0]);
  const y = useTransform(progress, [range[0], range[1], 1], [from.y ?? 0, 0, -14]);

  return (
    <motion.aside
      style={isReduced ? undefined : { opacity, x, y }}
      className={`glass-panel pointer-events-none absolute z-30 hidden px-5 py-4 lg:block ${className}`}
    >
      <CornerMarkers />
      <span className="mb-2 flex items-center gap-2">
        <span className="h-1 w-1 rounded-full bg-brand-gold" />
        <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-brand-gold/90">{label}</span>
      </span>
      {lines.map((line) => (
        <span
          key={line}
          className="block text-[10px] font-mono uppercase leading-relaxed tracking-[0.22em] text-brand-ivory/85"
        >
          {line}
        </span>
      ))}
    </motion.aside>
  );
}

export default function HeroCommandDeck({ onRequestScroll }: HeroCommandDeckProps) {
  const heroRef = useRef<HTMLElement>(null);
  const isReduced = useReducedMotionPref();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"]
  });

  const imageOpacity = useTransform(scrollYProgress, [0, 0.05, 0.35, 0.7, 1], [0.82, 0.9, 0.85, 0.58, 0.46]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);
  const imageX = useTransform(scrollYProgress, [0, 1], ["2.5%", "0%"]);

  // Every reveal carries an explicit hold keyframe at progress 1 ([a, b, 1])
  // so motion's scroll-linked WAAPI keeps the revealed state through the end
  // of the pinned range instead of fading back to the start value.
  const eyebrowOpacity = useTransform(scrollYProgress, [0.02, 0.1, 1], [0, 1, 1]);
  const eyebrowY = useTransform(scrollYProgress, [0.02, 0.1, 1], [18, 0, 0]);
  const titleOneOpacity = useTransform(scrollYProgress, [0.1, 0.22, 1], [0, 1, 1]);
  const titleOneY = useTransform(scrollYProgress, [0.1, 0.22, 1], [42, 0, 0]);
  const titleTwoOpacity = useTransform(scrollYProgress, [0.2, 0.32, 1], [0, 1, 1]);
  const titleTwoY = useTransform(scrollYProgress, [0.2, 0.32, 1], [42, 0, 0]);
  const copyOpacity = useTransform(scrollYProgress, [0.3, 0.42, 1], [0, 1, 1]);
  const copyY = useTransform(scrollYProgress, [0.3, 0.42, 1], [28, 0, 0]);
  const actionsOpacity = useTransform(scrollYProgress, [0.4, 0.52, 1], [0, 1, 1]);
  const actionsY = useTransform(scrollYProgress, [0.4, 0.52, 1], [24, 0, 0]);
  const detailOpacity = useTransform(scrollYProgress, [0.52, 0.66, 1], [0, 1, 1]);
  const detailY = useTransform(scrollYProgress, [0.52, 0.66, 1], [22, 0, 0]);

  return (
    <section ref={heroRef} className="relative h-[260vh] border-b border-brand-cream/10 bg-brand-black">
      <div className="sticky top-0 min-h-screen overflow-hidden luxury-noise">
        <motion.div
          className="absolute inset-0 z-0"
          style={isReduced ? undefined : { opacity: imageOpacity, scale: imageScale, x: imageX }}
        >
          <img
            src={HERO_IMAGE}
            alt="Black BMW i7 in a dark cinematic studio for Alair Noir"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-[62%_50%] grayscale-[0.04] brightness-[0.94] contrast-[1.12]"
          />
        </motion.div>

        <div className="absolute inset-0 z-10 bg-gradient-to-r from-brand-black/82 via-brand-black/34 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-brand-black/88 via-transparent to-brand-black/46" />

        {/* Floating command-deck interface cards */}
        <FloatingCard
          progress={scrollYProgress}
          range={[0.3, 0.42]}
          from={{ x: -44 }}
          className="left-10 top-32 xl:left-16"
          label="Service Status"
          lines={["Private chauffeur service", "Zürich based", "Switzerland ready"]}
          isReduced={isReduced}
        />
        <FloatingCard
          progress={scrollYProgress}
          range={[0.38, 0.5]}
          from={{ x: 44 }}
          className="right-10 top-40 xl:right-16"
          label="Primary Cabin"
          lines={["BMW i7 xDrive60", "Silent executive cabin", "Electric luxury sedan"]}
          isReduced={isReduced}
        />
        <FloatingCard
          progress={scrollYProgress}
          range={[0.46, 0.58]}
          from={{ y: 30 }}
          className="bottom-[38%] right-10 xl:right-16"
          label="Journey Classes"
          lines={["Airport / Executive / Private", "Diplomatic / Hotel"]}
          isReduced={isReduced}
        />

        <div className="relative z-20 flex min-h-screen flex-col justify-end px-6 pb-10 pt-28 md:px-12 lg:px-24">
          <div className="max-w-4xl">
            <motion.div
              style={isReduced ? undefined : { opacity: eyebrowOpacity, y: eyebrowY }}
              className="mb-5 flex flex-wrap items-center gap-4"
            >
              <span className="font-mono text-sm tracking-widest text-brand-gold">01 / COMMAND DECK</span>
              <span className="h-px w-10 bg-brand-gold/35" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-stone">
                BMW i7 xDrive60 / Zürich private chauffeur
              </span>
            </motion.div>

            <h1 className="mb-8 font-serif text-3xl font-light leading-[1.08] text-brand-ivory md:text-5xl lg:text-7xl">
              <motion.span
                style={isReduced ? undefined : { opacity: titleOneOpacity, y: titleOneY }}
                className="block"
              >
                Private chauffeur service
              </motion.span>
              <motion.span
                style={isReduced ? undefined : { opacity: titleTwoOpacity, y: titleTwoY }}
                className="block font-light italic text-brand-stone"
              >
                in Zürich, revealed by the road ahead.
              </motion.span>
            </h1>

            <motion.p
              style={isReduced ? undefined : { opacity: copyOpacity, y: copyY }}
              className="mb-10 max-w-2xl text-sm font-light leading-relaxed text-brand-ivory/80 md:text-base lg:text-lg"
            >
              ALAIR NOIR arranges discreet private mobility for CEOs, founders, executives,
              private clients, family offices, diplomatic guests, and high-level airport
              arrivals across Switzerland and selected European routes.
            </motion.p>

            <motion.div
              style={isReduced ? undefined : { opacity: actionsOpacity, y: actionsY }}
              className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-8"
            >
              <MagneticButton
                onClick={onRequestScroll}
                className="cursor-pointer rounded-sm bg-brand-cream px-8 py-4 text-center text-xs font-mono font-medium uppercase tracking-[0.2em] text-brand-black shadow-lg shadow-brand-gold/5 transition-all duration-300 hover:bg-brand-ivory hover:text-brand-deep-forest"
              >
                Request Private Mobility
              </MagneticButton>

              <a
                href="https://wa.me/41772870956"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center space-x-3 text-xs font-mono uppercase tracking-[0.2em] text-brand-gold transition-colors duration-300 hover:text-white"
              >
                <span>WhatsApp Direct</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">-&gt;</span>
              </a>
            </motion.div>
          </div>

          <motion.div
            style={isReduced ? undefined : { opacity: detailOpacity, y: detailY }}
            className="mt-12 grid grid-cols-1 gap-5 border-t border-brand-cream/10 pt-7 text-brand-stone/85 md:grid-cols-3"
          >
            <div>
              <span className="mb-1 block text-[10px] font-mono uppercase tracking-[0.2em] text-brand-stone">
                01 / Primary Cabin
              </span>
              <span className="font-serif text-sm tracking-wide text-brand-ivory">BMW i7 xDrive60</span>
            </div>
            <div>
              <span className="mb-1 block text-[10px] font-mono uppercase tracking-[0.2em] text-brand-stone">
                02 / Presence
              </span>
              <span className="font-serif text-sm tracking-wide text-brand-ivory">Silent black arrival</span>
            </div>
            <div>
              <span className="mb-1 block text-[10px] font-mono uppercase tracking-[0.2em] text-brand-stone">
                03 / Core Ethos
              </span>
              <span className="font-serif text-sm italic tracking-wide text-brand-ivory">
                Timing, privacy & cabin composure.
              </span>
            </div>
          </motion.div>
        </div>

        {/* Gold progress hairline */}
        <motion.div
          style={isReduced ? undefined : { opacity: detailOpacity }}
          className="absolute bottom-0 left-0 right-0 z-40 h-[3px] bg-brand-cream/10"
        >
          <motion.div
            className="h-full bg-brand-gold"
            style={{ scaleX: scrollYProgress, transformOrigin: "0% 50%" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
