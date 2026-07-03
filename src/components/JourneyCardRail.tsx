import { useLayoutEffect, useRef, useState } from "react";
import { motion, MotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { JOURNEY_STEPS } from "../data";
import { CornerMarkers, useMediaQuery, useReducedMotionPref } from "./MotionProvider";
import type { JourneyStep } from "../types";

interface RailMetrics {
  start: number;
  scrollSpan: number;
  viewportWidth: number;
  collapsedWidth: number;
  expandedWidth: number;
  gap: number;
}

const CARD_COUNT = JOURNEY_STEPS.length;
const SECTION_HEIGHT_VH = 700;
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function RailCard({
  step,
  index,
  activeIndex,
  metrics,
  onSelect
}: {
  step: JourneyStep;
  index: number;
  activeIndex: MotionValue<number>;
  metrics: RailMetrics;
  onSelect: (index: number) => void;
}) {
  const { collapsedWidth, expandedWidth, gap } = metrics;
  const cardStep = collapsedWidth + gap;
  const rightX = metrics.viewportWidth - 40 - (CARD_COUNT - 1 - index) * cardStep - collapsedWidth;
  const archiveX = 40 + index * cardStep;
  const activeRightX = metrics.viewportWidth - 40 - (CARD_COUNT - 1 - index) * cardStep;
  const activeX = clamp(
    activeRightX - expandedWidth,
    40,
    Math.max(40, metrics.viewportWidth - expandedWidth - 40)
  );

  const distance = useTransform(activeIndex, (value) => value - index);
  const width = useTransform(distance, [-1, -0.08, 0, 0.72, 1], [
    collapsedWidth,
    expandedWidth,
    expandedWidth,
    collapsedWidth,
    collapsedWidth
  ]);
  const x = useTransform(distance, [-1, -0.08, 0, 0.72, 1], [rightX, activeX, activeX, archiveX, archiveX]);
  const opacity = useTransform(distance, [-2, -1, 0, 1, 2], [0.76, 0.88, 1, 0.9, 0.82]);
  const scale = useTransform(distance, [-1, 0, 1], [0.96, 1, 0.96]);
  const contentOpacity = useTransform(distance, [-0.32, -0.08, 0.48, 0.74], [0, 1, 1, 0]);
  const markerScale = useTransform(distance, [-0.3, -0.05, 0.5, 0.74], [0.6, 1, 1, 0.6]);
  const compactOpacity = useTransform(distance, [-0.25, 0, 0.55, 0.9], [1, 0, 0, 1]);
  const imageOpacity = useTransform(distance, [-1, -0.08, 0, 0.72, 1], [0.55, 0.9, 1, 0.7, 0.55]);
  const imageScale = useTransform(distance, [-1, 0, 1], [1.08, 1.01, 1.06]);
  const imageY = useTransform(distance, [-1, 0, 1], [16, 0, -10]);
  const zIndex = useTransform(distance, (value) => 50 - Math.round(Math.abs(value) * 8) + (CARD_COUNT - index));

  return (
    <motion.article
      role="button"
      tabIndex={0}
      aria-label={`Open journey step ${step.number} — ${step.title}`}
      onClick={() => onSelect(index)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(index);
        }
      }}
      style={{
        width,
        x,
        opacity,
        scale,
        zIndex,
        contain: "layout paint",
        willChange: "transform, opacity, width"
      }}
      className="absolute top-1/2 h-[clamp(430px,60vh,520px)] -translate-y-1/2 cursor-pointer overflow-hidden border border-brand-cream/12 bg-brand-deep-forest outline-none transition-colors duration-300 focus-visible:border-brand-gold"
    >
      <motion.img
        src={step.image}
        alt=""
        aria-hidden="true"
        loading={index < 2 ? "eager" : "lazy"}
        decoding="async"
        style={{ opacity: imageOpacity, scale: imageScale, y: imageY }}
        className="absolute inset-0 h-full w-full object-cover"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/48 to-brand-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-black/55 via-transparent to-brand-deep-forest/25" />

      {/* Compact (stacked / archived) state */}
      <motion.div
        style={{ opacity: compactOpacity }}
        className="absolute inset-0 z-10 flex flex-col justify-between p-5"
      >
        <span className="text-[10px] font-mono tracking-widest text-brand-ivory">{step.number}</span>
        <h3 className="origin-bottom-left -rotate-90 translate-y-4 whitespace-nowrap font-serif text-2xl font-light uppercase tracking-[0.12em] text-brand-ivory">
          {step.title}
        </h3>
      </motion.div>

      {/* Expanded console state */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="absolute inset-0 z-20 flex min-w-[320px] flex-col justify-between p-7"
      >
        <motion.span style={{ opacity: contentOpacity, scale: markerScale }} className="absolute inset-3">
          <CornerMarkers />
        </motion.span>

        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-[0.3em] text-brand-ivory">
              {step.number} / 0{CARD_COUNT}
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-brand-gold animate-pulse motion-safe-pulse" />
              <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-brand-gold">
                {step.status}
              </span>
            </span>
          </div>
          <div className="mt-4 h-px w-full bg-gradient-to-r from-brand-gold/60 via-brand-gold/20 to-transparent" />
        </div>

        <div>
          <span className="mb-4 block text-[10px] font-mono uppercase tracking-[0.24em] text-brand-stone">
            Route status / {step.tag}
          </span>
          <h3 className="font-serif text-4xl font-light uppercase leading-none tracking-[0.08em] text-brand-ivory">
            {step.title}
          </h3>
          <p className="mt-5 max-w-[320px] text-sm font-light leading-relaxed text-brand-ivory/80">
            {step.description}
          </p>

          <div className="mt-6 border-l border-brand-gold/50 bg-brand-black/55 px-4 py-3 backdrop-blur-[2px]">
            <span className="block text-[8px] font-mono uppercase tracking-[0.26em] text-brand-stone">
              Client instruction
            </span>
            <span className="mt-1 block text-[11px] font-light leading-relaxed text-brand-ivory/85">
              {step.instruction}
            </span>
          </div>

          <span className="mt-4 inline-flex items-center gap-2 border border-brand-gold/30 bg-brand-gold-muted px-3 py-1.5">
            <span className="text-[8px] font-mono uppercase tracking-[0.26em] text-brand-gold">
              Private handling / {step.tag}
            </span>
          </span>
        </div>
      </motion.div>
    </motion.article>
  );
}

function DesktopRail() {
  const sectionRef = useRef<HTMLElement>(null);
  const [metrics, setMetrics] = useState<RailMetrics>({
    start: 0,
    scrollSpan: 1,
    viewportWidth: 1280,
    collapsedWidth: 72,
    expandedWidth: 420,
    gap: 12
  });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });
  const activeIndexRaw = useTransform(scrollYProgress, [0.06, 0.92, 1], [-1, CARD_COUNT - 1, CARD_COUNT - 0.01]);
  const activeIndexSmooth = useSpring(activeIndexRaw, {
    stiffness: 92,
    damping: 24,
    mass: 0.24
  });
  const stageOpacity = useTransform(scrollYProgress, [0, 0.03, 0.96, 1], [0, 1, 1, 0.92]);
  const stageY = useTransform(scrollYProgress, [0, 0.04, 0.96, 1], [18, 0, 0, -10]);

  useLayoutEffect(() => {
    const measure = () => {
      const viewport = window.innerWidth;
      const collapsedWidth = clamp(Math.round(viewport * 0.052), 58, 84);
      const expandedWidth = clamp(Math.round(viewport * 0.34), 350, 470);
      const sectionTop = sectionRef.current?.offsetTop ?? 0;
      const sectionHeight = sectionRef.current?.offsetHeight ?? window.innerHeight;

      setMetrics({
        start: sectionTop,
        scrollSpan: Math.max(1, sectionHeight - window.innerHeight),
        viewportWidth: viewport,
        collapsedWidth,
        expandedWidth,
        gap: 12
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

  const scrollToCard = (index: number) => {
    const targetProgress = 0.06 + ((index + 1) / CARD_COUNT) * 0.86;
    window.scrollTo({
      top: metrics.start + metrics.scrollSpan * targetProgress,
      behavior: "smooth"
    });
  };

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    const currentIndex = Math.round(activeIndexRaw.get());
    if (Math.abs(info.offset.x) < 48) return;
    scrollToCard(clamp(currentIndex + (info.offset.x < 0 ? 1 : -1), 0, CARD_COUNT - 1));
  };

  return (
    <section
      ref={sectionRef}
      className="relative border-b border-brand-cream/10 bg-[#030504] luxury-noise"
      style={{ height: `${SECTION_HEIGHT_VH}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#030504] via-brand-deep-forest to-brand-black" />

        <div className="absolute left-6 right-6 top-20 z-30 flex flex-col gap-5 border-b border-brand-cream/10 pb-6 md:left-12 md:right-12 lg:left-24 lg:right-24 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-6 bg-brand-gold/20" />
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-brand-stone">
                How It Works
              </span>
            </div>
            <h2 className="font-serif text-2xl font-light tracking-[0.16em] text-brand-ivory md:text-3xl">
              Private booking. Quiet execution.
            </h2>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-brand-stone">
            01 - 05 / Request to Journey
          </span>
        </div>

        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.08}
          onDragEnd={handleDragEnd}
          style={{ opacity: stageOpacity, y: stageY, willChange: "transform, opacity" }}
          className="absolute bottom-[8vh] left-0 right-0 top-[23vh] z-20 overflow-visible"
        >
          {JOURNEY_STEPS.map((step, index) => (
            <div key={step.id}>
              <RailCard
                step={step}
                index={index}
                activeIndex={activeIndexSmooth}
                metrics={metrics}
                onSelect={scrollToCard}
              />
            </div>
          ))}
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 z-30 h-[2px] bg-brand-cream/8">
          <motion.div
            className="h-full bg-brand-gold/70"
            style={{ scaleX: scrollYProgress, transformOrigin: "0% 50%" }}
          />
        </div>
      </div>
    </section>
  );
}

function MobileTimeline({ isReduced }: { isReduced: boolean }) {
  return (
    <section className="relative border-b border-brand-cream/10 bg-[#030504] px-6 py-24 luxury-noise md:px-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-12">
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-6 bg-brand-gold/20" />
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-brand-stone">
              How It Works
            </span>
          </div>
          <h2 className="font-serif text-2xl font-light tracking-[0.16em] text-brand-ivory md:text-3xl">
            Private booking. Quiet execution.
          </h2>
        </div>

        <div className="relative border-l border-brand-gold/25 pl-6">
          {JOURNEY_STEPS.map((step, index) => (
            <motion.article
              key={step.id}
              initial={isReduced ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              className={`relative ${index === JOURNEY_STEPS.length - 1 ? "" : "pb-12"}`}
            >
              <span className="absolute -left-[30.5px] top-1.5 h-2 w-2 rounded-full border border-brand-gold bg-brand-black" />

              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-[0.3em] text-brand-ivory">
                  {step.number} / 0{CARD_COUNT}
                </span>
                <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-brand-gold">
                  {step.status}
                </span>
              </div>

              <div className="relative mb-4 h-44 overflow-hidden border border-brand-cream/12">
                <img
                  src={step.image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover brightness-[0.85]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 to-transparent" />
              </div>

              <h3 className="font-serif text-2xl font-light uppercase tracking-[0.08em] text-brand-ivory">
                {step.title}
              </h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-brand-ivory/78">{step.description}</p>
              <p className="mt-3 border-l border-brand-gold/50 pl-3 text-[11px] font-light text-brand-ivory/70">
                {step.instruction}
              </p>
              <span className="mt-3 inline-block border border-brand-gold/30 bg-brand-gold-muted px-3 py-1 text-[8px] font-mono uppercase tracking-[0.26em] text-brand-gold">
                {step.tag}
              </span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function JourneyCardRail() {
  const isReduced = useReducedMotionPref();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (!isDesktop || isReduced) {
    return <MobileTimeline isReduced={isReduced} />;
  }

  return <DesktopRail />;
}
