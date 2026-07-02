import { useLayoutEffect, useRef, useState } from "react";
import { motion, MotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { imageAssets } from "../assets";

interface EditorialChapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

interface JourneyMetrics {
  start: number;
  scrollSpan: number;
  viewportWidth: number;
  collapsedWidth: number;
  expandedWidth: number;
  gap: number;
}

const CHAPTERS: EditorialChapter[] = [
  {
    id: "01",
    number: "01",
    title: "The Standard",
    subtitle: "Absolute Calibration",
    description:
      "Routes, timing, cabin preparation, and handover are aligned before the vehicle arrives.",
    image: imageAssets.bmwI7Departure,
  },
  {
    id: "02",
    number: "02",
    title: "The Silence",
    subtitle: "Acoustic Isolation",
    description:
      "Electric motion and acoustic glass create a quiet interval between obligations.",
    image: imageAssets.bmwI7AlpineCruise,
  },
  {
    id: "03",
    number: "03",
    title: "The Journey",
    subtitle: "Executive Sanctuary",
    description:
      "A protected cabin for confidential calls, preparation, rest, and reset.",
    image: imageAssets.bmwI7RearWorkspace,
  },
  {
    id: "04",
    number: "04",
    title: "The Arrival",
    subtitle: "Impeccable Presence",
    description:
      "Positioning and chauffeur choreography keep the arrival precise and quiet.",
    image: imageAssets.bmwI7StMoritzDusk,
  },
  {
    id: "05",
    number: "05",
    title: "The Discretion",
    subtitle: "Unmarked Privilege",
    description:
      "No public markers, no unnecessary conversation, and no careless digital trace.",
    image: imageAssets.bmwI7TarmacMeet,
  },
];

const CARD_COUNT = CHAPTERS.length;
const SECTION_HEIGHT_VH = 560;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function JourneyCard({
  chapter,
  index,
  activeIndex,
  metrics,
  onSelect,
}: {
  chapter: EditorialChapter;
  index: number;
  activeIndex: MotionValue<number>;
  metrics: JourneyMetrics;
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
    collapsedWidth,
  ]);
  const x = useTransform(distance, [-1, -0.08, 0, 0.72, 1], [
    rightX,
    activeX,
    activeX,
    archiveX,
    archiveX,
  ]);
  const opacity = useTransform(distance, [-2, -1, 0, 1, 2], [0.76, 0.88, 1, 0.9, 0.82]);
  const scale = useTransform(distance, [-1, 0, 1], [0.96, 1, 0.96]);
  const contentOpacity = useTransform(distance, [-0.32, -0.08, 0.48, 0.74], [0, 1, 1, 0]);
  const compactOpacity = useTransform(distance, [-0.25, 0, 0.55, 0.9], [1, 0, 0, 1]);
  const imageOpacity = useTransform(distance, [-1, -0.08, 0, 0.72, 1], [0.58, 0.92, 1, 0.72, 0.56]);
  const imageScale = useTransform(distance, [-1, 0, 1], [1.08, 1.01, 1.06]);
  const imageY = useTransform(distance, [-1, 0, 1], [16, 0, -10]);
  const zIndex = useTransform(distance, (value) => 50 - Math.round(Math.abs(value) * 8) + (CARD_COUNT - index));

  return (
    <motion.article
      role="button"
      tabIndex={0}
      aria-label={`Open ${chapter.title}`}
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
        willChange: "transform, opacity, width",
      }}
      className="absolute top-1/2 h-[clamp(420px,58vh,500px)] -translate-y-1/2 cursor-pointer overflow-hidden border border-brand-cream/12 bg-brand-deep-forest outline-none transition-colors duration-300 focus:border-brand-cream/50"
    >
      <motion.img
        src={chapter.image}
        alt={chapter.title}
        loading={index < 2 ? "eager" : "lazy"}
        decoding="async"
        style={{ opacity: imageOpacity, scale: imageScale, y: imageY }}
        className="absolute inset-0 h-full w-full object-cover"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/42 to-brand-black/18" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-black/50 via-transparent to-brand-deep-forest/20" />

      <motion.div
        style={{ opacity: compactOpacity }}
        className="absolute inset-0 z-10 flex flex-col justify-between p-5"
      >
        <span className="text-[10px] font-mono tracking-widest text-brand-ivory">
          {chapter.number}
        </span>
        <h3 className="origin-bottom-left -rotate-90 translate-y-4 whitespace-nowrap text-2xl font-serif font-light uppercase tracking-[0.12em] text-brand-ivory">
          {chapter.title}
        </h3>
      </motion.div>

      <motion.div
        style={{ opacity: contentOpacity }}
        className="absolute inset-0 z-20 flex min-w-[320px] flex-col justify-between p-8"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-[0.3em] text-brand-ivory">
            {chapter.number}
          </span>
          <span className="h-px w-10 bg-brand-gold/20" />
        </div>

        <div>
          <span className="mb-4 block text-[10px] font-mono uppercase tracking-[0.24em] text-brand-stone">
            {chapter.subtitle}
          </span>
          <h3 className="text-4xl font-serif font-light uppercase leading-none tracking-[0.08em] text-brand-ivory">
            {chapter.title}
          </h3>
          <p className="mt-5 max-w-[300px] text-sm font-light leading-relaxed text-brand-ivory/80">
            {chapter.description}
          </p>
        </div>
      </motion.div>
    </motion.article>
  );
}

export default function EditorialGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const [metrics, setMetrics] = useState<JourneyMetrics>({
    start: 0,
    scrollSpan: 1,
    viewportWidth: 1280,
    collapsedWidth: 84,
    expandedWidth: 410,
    gap: 14,
  });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const activeIndexRaw = useTransform(
    scrollYProgress,
    [0.08, 0.92, 1],
    [-1, CARD_COUNT - 1, CARD_COUNT - 0.01]
  );
  const activeIndexSmooth = useSpring(activeIndexRaw, {
    stiffness: 92,
    damping: 24,
    mass: 0.24
  });
  const stageOpacity = useTransform(scrollYProgress, [0, 0.035, 0.96, 1], [0, 1, 1, 0.92]);
  const stageY = useTransform(scrollYProgress, [0, 0.04, 0.96, 1], [18, 0, 0, -10]);

  useLayoutEffect(() => {
    const measure = () => {
      const viewport = window.innerWidth;
      const collapsedWidth = clamp(Math.round(viewport * 0.064), 72, 96);
      const expandedWidth = clamp(Math.round(viewport * 0.34), 360, 460);
      const sectionTop = sectionRef.current?.offsetTop ?? 0;
      const sectionHeight = sectionRef.current?.offsetHeight ?? window.innerHeight;

      setMetrics({
        start: sectionTop,
        scrollSpan: Math.max(1, sectionHeight - window.innerHeight),
        viewportWidth: viewport,
        collapsedWidth,
        expandedWidth,
        gap: 14,
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
    const targetProgress = 0.08 + ((index + 1) / CARD_COUNT) * 0.84;
    window.scrollTo({
      top: metrics.start + metrics.scrollSpan * targetProgress,
      behavior: "smooth",
    });
  };

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    const currentProgress = activeIndexRaw.get();
    const currentIndex = Math.round(currentProgress);

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

        <div className="journeyHeader absolute left-6 right-6 top-20 z-30 flex flex-col gap-5 border-b border-brand-cream/10 pb-6 md:left-12 md:right-12 lg:left-24 lg:right-24 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-6 bg-brand-gold/20" />
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-brand-stone">
                Editorial Portfolio
              </span>
            </div>
            <h2 className="text-2xl font-serif font-light tracking-[0.16em] text-brand-ivory md:text-3xl">
              Alair Noir Client Journey
            </h2>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-brand-stone">
            01 - 05 / Discreet Chapters
          </span>
        </div>

        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.08}
          onDragEnd={handleDragEnd}
          style={{ opacity: stageOpacity, y: stageY, willChange: "transform, opacity" }}
          className="journeyStage absolute bottom-[9vh] left-0 right-0 top-[24vh] z-20 overflow-visible"
        >
          {CHAPTERS.map((chapter, index) => (
            <div key={chapter.id}>
              <JourneyCard
                chapter={chapter}
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
            className="h-full bg-brand-moss"
            style={{ scaleX: scrollYProgress, transformOrigin: "0% 50%" }}
          />
        </div>
      </div>
    </section>
  );
}
