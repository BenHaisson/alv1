import { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { imageAssets } from "../assets";

const SECTION_IMAGE = imageAssets.sectionNotForEveryoneZurich;

const AUDIENCE_BEATS = [
  "For the principal arriving without exposure",
  "For the founder between rooms that matter",
  "For the family office that values silence",
  "For the guest who should never ask twice",
];

export default function NotForEveryoneScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const [timeline, setTimeline] = useState({ start: 0, vh: 720 });
  const { scrollY } = useScroll();

  useLayoutEffect(() => {
    const measure = () => {
      setTimeline({
        start: sectionRef.current?.offsetTop ?? 0,
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

  const imageOpacity = useTransform(
    scrollY,
    [start - vh * 0.25, start + vh * 0.15, start + vh * 0.82, start + vh * 1.55, start + vh * 2.45],
    [0, 0.94, 0.98, 0.78, 0.68]
  );
  const imageScale = useTransform(scrollY, [start - vh * 0.1, start + vh * 0.82, start + vh * 2.45], [1.16, 1.04, 1]);
  const imageX = useTransform(scrollY, [start, start + vh * 2.2], ["0%", "-2%"]);
  const imageY = useTransform(scrollY, [start - vh * 0.18, start + vh * 0.82], ["16%", "0%"]);
  const warmScrim = useTransform(scrollY, [start + vh * 0.75, start + vh * 1.75], [0.02, 0.2]);
  const forestWash = useTransform(scrollY, [start + vh * 0.7, start + vh * 1.75], [0.04, 0.28]);

  const eyebrowOpacity = useTransform(scrollY, [start + vh * 0.88, start + vh * 1.08], [0, 1]);
  const eyebrowY = useTransform(scrollY, [start + vh * 0.88, start + vh * 1.08], [18, 0]);
  const notOpacity = useTransform(scrollY, [start + vh * 1.12, start + vh * 1.42], [0, 1]);
  const notY = useTransform(scrollY, [start + vh * 1.12, start + vh * 1.42], [48, 0]);
  const youOpacity = useTransform(scrollY, [start + vh * 1.44, start + vh * 1.74], [0, 1]);
  const youY = useTransform(scrollY, [start + vh * 1.44, start + vh * 1.74], [48, 0]);
  const copyOpacity = useTransform(scrollY, [start + vh * 1.78, start + vh * 2.08], [0, 1]);
  const copyY = useTransform(scrollY, [start + vh * 1.78, start + vh * 2.08], [28, 0]);
  const beatsOpacity = useTransform(scrollY, [start + vh * 2.12, start + vh * 2.42], [0, 1]);
  const beatsY = useTransform(scrollY, [start + vh * 2.12, start + vh * 2.42], [28, 0]);
  const progress = useTransform(scrollY, [start, start + vh * 2.75], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="standard-section"
      className="relative h-[300vh] bg-brand-black border-y border-brand-cream/10"
    >
      <div className="sticky top-0 min-h-screen overflow-hidden luxury-noise">
        <motion.div
          style={{ opacity: imageOpacity, scale: imageScale, x: imageX, y: imageY, willChange: "transform, opacity" }}
          className="absolute inset-0 z-0"
        >
          <img
            src={SECTION_IMAGE}
            alt="Black BMW i7 waiting outside a luxury Zurich hotel at dusk"
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover object-[58%_50%]"
          />
        </motion.div>

        <motion.div
          style={{ opacity: warmScrim }}
          className="absolute inset-0 z-10 bg-brand-black"
        />
        <motion.div
          style={{ opacity: forestWash }}
          className="absolute inset-0 z-10 bg-brand-deep-forest"
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-brand-deep-forest/86 via-brand-black/50 to-brand-black/8" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-brand-black/86 via-transparent to-brand-deep-forest/42" />

        <div className="relative z-20 flex min-h-screen flex-col justify-center px-6 py-24 md:px-12 lg:px-24">
          <div className="max-w-3xl">
            <motion.div
              style={{ opacity: eyebrowOpacity, y: eyebrowY }}
              className="mb-7 flex items-center gap-4"
            >
              <span className="text-brand-stone font-mono text-sm tracking-widest">02 / THE STANDARD</span>
              <span className="h-px w-10 bg-brand-gold/20" />
              <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-[0.25em] text-brand-stone">
                Zurich hotel arrival
              </span>
            </motion.div>

            <h2 className="font-serif text-5xl font-light uppercase leading-[0.95] tracking-[0.12em] text-brand-ivory md:text-7xl lg:text-8xl">
              <motion.span style={{ opacity: notOpacity, y: notY }} className="block">
                Not for everyone.
              </motion.span>
              <motion.span
                style={{ opacity: youOpacity, y: youY }}
                className="mt-5 block italic text-brand-cream"
              >
                For you.
              </motion.span>
            </h2>

            <motion.p
              style={{ opacity: copyOpacity, y: copyY }}
              className="mt-10 max-w-2xl text-base font-light leading-relaxed text-brand-ivory/82 md:text-xl"
            >
              For clients who value privacy, timing, and the quiet certainty of being
              expected before they arrive.
            </motion.p>

            <motion.div
              style={{ opacity: beatsOpacity, y: beatsY }}
              className="mt-12 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2"
            >
              {AUDIENCE_BEATS.map((beat, index) => (
                <div
                  key={beat}
                  className="border-l border-brand-moss/70 bg-brand-deep-forest/55 px-4 py-3 backdrop-blur-[2px]"
                >
                  <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-brand-stone/80">
                    0{index + 1}
                  </span>
                  <span className="mt-1 block text-sm font-serif italic text-brand-ivory/78">
                    {beat}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-30 h-[2px] bg-brand-cream/8">
          <motion.div
            className="h-full bg-brand-moss"
            style={{ scaleX: progress, transformOrigin: "0% 50%" }}
          />
        </div>
      </div>
    </section>
  );
}
