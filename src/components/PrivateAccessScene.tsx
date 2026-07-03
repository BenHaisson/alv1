import { useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  type MotionStyle,
  type MotionValue
} from "motion/react";
import { imageAssets } from "../assets";
import { ACCESS_CLASSES } from "../data";
import { CornerMarkers, useMediaQuery, useReducedMotionPref } from "./MotionProvider";

const SECTION_IMAGE = imageAssets.sectionNotForEveryoneZurich;
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

function SceneBlock({
  pinned,
  isReduced,
  style,
  className,
  delay = 0,
  as = "div",
  children
}: {
  pinned: boolean;
  isReduced: boolean;
  style?: MotionStyle;
  className?: string;
  delay?: number;
  as?: "div" | "span";
  children: ReactNode;
}) {
  const Tag = as === "span" ? motion.span : motion.div;
  const baseClass = as === "span" ? `block ${className ?? ""}` : className;

  if (pinned) {
    return (
      <Tag style={style} className={baseClass}>
        {children}
      </Tag>
    );
  }

  if (isReduced) {
    return <Tag className={baseClass}>{children}</Tag>;
  }

  return (
    <Tag
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.85, delay, ease: EASE_OUT }}
      className={baseClass}
    >
      {children}
    </Tag>
  );
}

function AccessCard({
  index,
  isSelected,
  onSelect,
  progress,
  pinned,
  isReduced
}: {
  index: number;
  isSelected: boolean;
  onSelect: (index: number) => void;
  progress: MotionValue<number>;
  pinned: boolean;
  isReduced: boolean;
}) {
  const item = ACCESS_CLASSES[index];
  const rangeStart = 0.5 + index * 0.05;
  // Hold keyframe at progress 1 keeps the card revealed through the pinned tail.
  const opacity = useTransform(progress, [rangeStart, rangeStart + 0.1, 1], [0, 1, 1]);
  const x = useTransform(progress, [rangeStart, rangeStart + 0.1, 1], [72, 0, 0]);

  return (
    <motion.div style={pinned ? { opacity, x } : undefined} className="relative">
      {/* Gold connector from the selected access class back to "For you." */}
      {isSelected && (
        <motion.span
          layoutId="access-connector"
          transition={{ duration: isReduced ? 0 : 0.6, ease: EASE_OUT }}
          className="absolute right-full top-1/2 mr-3 hidden h-px w-[9vw] bg-gradient-to-l from-brand-gold via-brand-gold/50 to-transparent lg:block"
          aria-hidden="true"
        />
      )}

      <button
        type="button"
        onClick={() => onSelect(index)}
        aria-expanded={isSelected}
        className={`group relative w-full cursor-pointer border px-5 py-4 text-left transition-colors duration-500 focus:outline-none focus-visible:border-brand-gold ${
          isSelected
            ? "border-brand-gold/60 bg-brand-black/70 shadow-[0_0_30px_rgba(205,162,80,0.08)]"
            : "border-brand-cream/12 bg-brand-deep-forest/45 hover:border-brand-cream/30"
        }`}
      >
        {isSelected && <CornerMarkers />}

        <span className="flex items-center justify-between gap-4">
          <span className="flex items-baseline gap-4">
            <span
              className={`text-[10px] font-mono tracking-[0.24em] ${
                isSelected ? "text-brand-gold" : "text-brand-stone/70"
              }`}
            >
              {item.number} /
            </span>
            <span className="font-serif text-lg font-light tracking-wide text-brand-ivory md:text-xl">
              {item.title}
            </span>
          </span>
          <span
            className={`text-[9px] font-mono uppercase tracking-[0.24em] transition-colors duration-500 ${
              isSelected ? "text-brand-gold" : "text-brand-stone/50 group-hover:text-brand-stone"
            }`}
          >
            {isSelected ? "GRANTED" : "CLASS"}
          </span>
        </span>

        <AnimatePresence initial={false}>
          {isSelected && (
            <motion.div
              initial={isReduced ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={isReduced ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.55, ease: EASE_OUT }}
              className="overflow-hidden"
            >
              <span className="mt-3 block max-w-md text-sm font-light leading-relaxed text-brand-ivory/78">
                {item.description}
              </span>
              <span className="mt-3 flex items-center gap-2">
                <span className={`h-1 w-1 rounded-full bg-brand-gold ${isReduced ? "" : "animate-pulse"}`} />
                <span className="text-[9px] font-mono uppercase tracking-[0.28em] text-brand-gold/80">
                  Private access class
                </span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}

export default function PrivateAccessScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isReduced = useReducedMotionPref();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const pinned = isDesktop && !isReduced;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const imageOpacity = useTransform(scrollYProgress, [0, 0.14, 0.55, 1], [0, 0.95, 0.8, 0.66]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.14, 1.04, 1]);
  const imageX = useTransform(scrollYProgress, [0, 1], ["0%", "-2%"]);
  const forestWash = useTransform(scrollYProgress, [0.2, 0.7, 1], [0.05, 0.3, 0.3]);

  // Hold keyframes at progress 1 keep the pinned copy revealed through the tail
  // (motion's scroll-linked WAAPI otherwise fades a 2-point range past its end).
  const eyebrowOpacity = useTransform(scrollYProgress, [0.2, 0.3, 1], [0, 1, 1]);
  const eyebrowY = useTransform(scrollYProgress, [0.2, 0.3, 1], [18, 0, 0]);
  const notOpacity = useTransform(scrollYProgress, [0.28, 0.4, 1], [0, 1, 1]);
  const notY = useTransform(scrollYProgress, [0.28, 0.4, 1], [48, 0, 0]);
  const youOpacity = useTransform(scrollYProgress, [0.38, 0.5, 1], [0, 1, 1]);
  const youY = useTransform(scrollYProgress, [0.38, 0.5, 1], [48, 0, 0]);
  const copyOpacity = useTransform(scrollYProgress, [0.46, 0.56, 1], [0, 1, 1]);
  const copyY = useTransform(scrollYProgress, [0.46, 0.56, 1], [28, 0, 0]);
  const progress = useTransform(scrollYProgress, [0, 0.92, 1], [0, 1, 1]);

  return (
    <section
      ref={sectionRef}
      id="access-section"
      className={`relative border-y border-brand-cream/10 bg-brand-black ${pinned ? "h-[300vh]" : ""}`}
    >
      <div className={`${pinned ? "sticky top-0 h-screen" : "relative"} overflow-hidden luxury-noise`}>
        <motion.div
          style={
            pinned
              ? { opacity: imageOpacity, scale: imageScale, x: imageX, willChange: "transform, opacity" }
              : undefined
          }
          className={`absolute inset-0 z-0 ${pinned ? "" : "opacity-70"}`}
        >
          <img
            src={SECTION_IMAGE}
            alt="Black BMW i7 waiting outside a luxury Zürich hotel at dusk"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-[58%_50%]"
          />
        </motion.div>

        <motion.div
          style={pinned ? { opacity: forestWash } : undefined}
          className={`absolute inset-0 z-10 bg-brand-deep-forest ${pinned ? "" : "opacity-30"}`}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-brand-deep-forest/86 via-brand-black/55 to-brand-black/30" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-brand-black/86 via-transparent to-brand-deep-forest/42" />

        <div className="relative z-20 flex min-h-screen flex-col justify-center px-6 py-24 md:px-12 lg:px-24">
          <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Left: the brand statement */}
            <div className="lg:col-span-7">
              <SceneBlock
                pinned={pinned}
                isReduced={isReduced}
                style={{ opacity: eyebrowOpacity, y: eyebrowY }}
                className="mb-7 flex items-center gap-4"
              >
                <span className="font-mono text-sm tracking-widest text-brand-stone">The Brand</span>
                <span className="h-px w-10 bg-brand-gold/20" />
                <span className="hidden text-[10px] font-mono uppercase tracking-[0.25em] text-brand-stone sm:inline">
                  Not built for volume
                </span>
              </SceneBlock>

              <h2 className="font-serif text-4xl font-light uppercase leading-[0.95] tracking-[0.12em] text-brand-ivory md:text-6xl lg:text-7xl">
                <SceneBlock
                  pinned={pinned}
                  isReduced={isReduced}
                  style={{ opacity: notOpacity, y: notY }}
                  delay={0.1}
                  as="span"
                >
                  Not for everyone.
                </SceneBlock>
                <SceneBlock
                  pinned={pinned}
                  isReduced={isReduced}
                  style={{ opacity: youOpacity, y: youY }}
                  delay={0.2}
                  as="span"
                  className="mt-5 italic text-brand-cream"
                >
                  <span className="relative inline-block">
                    For you.
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-3 left-0 h-px w-full bg-gradient-to-r from-brand-gold via-brand-gold/60 to-transparent"
                    />
                  </span>
                </SceneBlock>
              </h2>

              <SceneBlock
                pinned={pinned}
                isReduced={isReduced}
                style={{ opacity: copyOpacity, y: copyY }}
                delay={0.3}
                className="mt-10 max-w-xl"
              >
                <p className="text-base font-light leading-relaxed text-brand-ivory/82 md:text-xl">
                  ALAIR NOIR is not built for volume, shortcuts, or anonymous transport. It is
                  built for clients who expect calm execution, discreet handling, and a vehicle
                  that arrives already aligned with the day ahead.
                </p>
                <p className="mt-6 max-w-xl font-serif text-lg italic text-brand-cream md:text-xl">
                  Luxury is not noise. It is control.
                </p>
              </SceneBlock>
            </div>

            {/* Right: private access classes */}
            <div className="lg:col-span-5">
              <SceneBlock
                pinned={pinned}
                isReduced={isReduced}
                style={{ opacity: copyOpacity }}
                delay={0.35}
                className="mb-4 flex items-center justify-between"
              >
                <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-brand-stone">
                  Access Classes
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-brand-gold/70">
                  0{selectedIndex + 1} / 05
                </span>
              </SceneBlock>

              <div className="flex flex-col gap-3">
                {ACCESS_CLASSES.map((item, index) => (
                  <div key={item.id}>
                    <AccessCard
                      index={index}
                      isSelected={selectedIndex === index}
                      onSelect={setSelectedIndex}
                      progress={scrollYProgress}
                      pinned={pinned}
                      isReduced={isReduced}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-30 h-[2px] bg-brand-cream/8">
          <motion.div
            className="h-full bg-brand-moss"
            style={pinned ? { scaleX: progress, transformOrigin: "0% 50%" } : { scaleX: 1 }}
          />
        </div>
      </div>
    </section>
  );
}
