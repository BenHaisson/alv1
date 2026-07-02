import { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import MagneticButton from "./MagneticButton";

interface HeroArrivalProps {
  onRequestScroll: () => void;
}

const HERO_IMAGE = "/src/assets/images/alair_noir_hero.png";

export default function HeroArrival({ onRequestScroll }: HeroArrivalProps) {
  const heroRef = useRef<HTMLElement>(null);
  const [timeline, setTimeline] = useState({ start: 0, vh: 720 });
  const { scrollY } = useScroll();

  useLayoutEffect(() => {
    const measure = () => {
      setTimeline({
        start: heroRef.current?.offsetTop ?? 0,
        vh: window.innerHeight || 720,
      });
    };

    measure();
    const frame = window.requestAnimationFrame(measure);
    window.addEventListener("resize", measure);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const start = timeline.start;
  const vh = timeline.vh;

  const heroProgress = useTransform(scrollY, [start, start + vh * 2.35], [0, 1]);
  const imageOpacity = useTransform(
    scrollY,
    [start - vh * 0.15, start + vh * 0.08, start + vh * 0.8, start + vh * 1.55, start + vh * 2.45],
    [0, 0.88, 0.84, 0.54, 0.44]
  );
  const imageScale = useTransform(scrollY, [start, start + vh * 2.4], [1.1, 1]);
  const imageX = useTransform(scrollY, [start, start + vh * 2.4], ["2%", "0%"]);
  const blackFade = useTransform(scrollY, [start, start + vh * 0.25], [0.08, 0]);

  const eyebrowOpacity = useTransform(scrollY, [start + vh * 0.05, start + vh * 0.25, start + vh * 2.1], [0, 1, 1]);
  const eyebrowY = useTransform(scrollY, [start + vh * 0.05, start + vh * 0.25], [18, 0]);
  const titleOneOpacity = useTransform(scrollY, [start + vh * 0.38, start + vh * 0.68, start + vh * 2.1], [0, 1, 1]);
  const titleOneY = useTransform(scrollY, [start + vh * 0.38, start + vh * 0.68], [42, 0]);
  const titleTwoOpacity = useTransform(scrollY, [start + vh * 0.7, start + vh * 1, start + vh * 2.1], [0, 1, 1]);
  const titleTwoY = useTransform(scrollY, [start + vh * 0.7, start + vh * 1], [42, 0]);
  const copyOpacity = useTransform(scrollY, [start + vh * 1.05, start + vh * 1.35, start + vh * 2.2], [0, 1, 1]);
  const copyY = useTransform(scrollY, [start + vh * 1.05, start + vh * 1.35], [28, 0]);
  const actionsOpacity = useTransform(scrollY, [start + vh * 1.38, start + vh * 1.68, start + vh * 2.25], [0, 1, 1]);
  const actionsY = useTransform(scrollY, [start + vh * 1.38, start + vh * 1.68], [24, 0]);
  const detailOpacity = useTransform(scrollY, [start + vh * 1.72, start + vh * 2.02, start + vh * 2.35], [0, 1, 1]);
  const detailY = useTransform(scrollY, [start + vh * 1.72, start + vh * 2.02], [22, 0]);

  return (
    <section ref={heroRef} className="relative h-[260vh] bg-brand-black border-b border-brand-cream/10">
      <div className="sticky top-0 min-h-screen overflow-hidden luxury-noise">
        <motion.div className="absolute inset-0 z-0" style={{ opacity: imageOpacity, scale: imageScale, x: imageX }}>
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
        <motion.div className="absolute inset-0 z-20 bg-brand-black" style={{ opacity: blackFade }} />

        <div className="relative z-30 flex min-h-screen flex-col justify-end px-6 pb-10 pt-28 md:px-12 lg:px-24">
          <div className="max-w-4xl">
            <motion.div
              style={{ opacity: eyebrowOpacity, y: eyebrowY }}
              className="mb-5 flex flex-wrap items-center gap-4"
            >
              <span className="text-brand-gold font-mono text-sm tracking-widest">01 / THE ARRIVAL</span>
              <span className="h-px w-10 bg-brand-gold/35" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-stone">
                BMW i7 2026 / Zurich private chauffeur
              </span>
            </motion.div>

            <h1 className="text-3xl md:text-5xl lg:text-7xl font-serif font-light text-brand-ivory leading-[1.08] mb-8">
              <motion.span
                style={{ opacity: titleOneOpacity, y: titleOneY }}
                className="block"
              >
                Private chauffeur service
              </motion.span>
              <motion.span
                style={{ opacity: titleTwoOpacity, y: titleTwoY }}
                className="block italic text-brand-stone font-light"
              >
                in Zurich, revealed by the road ahead.
              </motion.span>
            </h1>

            <motion.p
              style={{ opacity: copyOpacity, y: copyY }}
              className="text-sm md:text-base lg:text-lg text-brand-ivory/80 font-light leading-relaxed max-w-2xl mb-10"
            >
              ALAIR NOIR arranges discreet private mobility for CEOs, founders, executives,
              private clients, family offices, corporate guests, and high-level airport arrivals
              across Switzerland and selected European routes.
            </motion.p>

            <motion.div
              style={{ opacity: actionsOpacity, y: actionsY }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-8"
            >
              <MagneticButton
                onClick={onRequestScroll}
                className="px-8 py-4 bg-brand-cream text-brand-black text-xs font-mono uppercase tracking-[0.2em] font-medium hover:bg-brand-ivory hover:text-brand-deep-forest transition-all duration-300 text-center rounded-sm cursor-pointer shadow-lg shadow-brand-gold/5"
              >
                Request Private Mobility
              </MagneticButton>

              <a
                href="https://wa.me/41772870956"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center space-x-3 text-xs font-mono uppercase tracking-[0.2em] text-brand-gold hover:text-white transition-colors duration-300"
              >
                <span>WhatsApp Direct</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">-&gt;</span>
              </a>
            </motion.div>
          </div>

          <motion.div
            style={{ opacity: detailOpacity, y: detailY }}
            className="mt-12 grid grid-cols-1 gap-5 border-t border-brand-cream/10 pt-7 text-brand-stone/85 md:grid-cols-3"
          >
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-stone block mb-1">
                01 / Primary Cabin
              </span>
              <span className="text-sm font-serif text-brand-ivory tracking-wide">
                BMW i7 2026
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-stone block mb-1">
                02 / Presence
              </span>
              <span className="text-sm font-serif text-brand-ivory tracking-wide">
                Silent black arrival
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-stone block mb-1">
                03 / Core Ethos
              </span>
              <span className="text-sm font-serif text-brand-ivory tracking-wide italic">
                Timing, privacy & cabin composure.
              </span>
            </div>
          </motion.div>
        </div>

        <motion.div
          style={{ opacity: detailOpacity }}
          className="absolute bottom-0 left-0 right-0 z-40 h-[3px] bg-brand-cream/10"
        >
          <motion.div
            className="h-full bg-brand-gold"
            style={{ scaleX: heroProgress, transformOrigin: "0% 50%" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
