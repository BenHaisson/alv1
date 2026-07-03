import { useRef, useState, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  type MotionValue,
  type PanInfo
} from "motion/react";
import { useReducedMotionPref, CornerMarkers } from "../MotionProvider";

const EASE = [0.16, 1, 0.3, 1] as const;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export interface StackedCard {
  id: string;
  number: string;
  title: string;
  tagline?: string;
  description: string;
  image?: string;
}

interface StackedClientCardsProps {
  cards: StackedCard[];
  /** id put on the <section> so nav anchors can target it. */
  sectionId?: string;
  ariaLabel?: string;
  /** Left column content; receives the active index and a goTo(i) scroller. */
  aside: (active: number, goTo: (index: number) => void) => ReactNode;
  /** Optional full-stage backdrop (e.g. an SVG route line), scroll-aware. */
  background?: (progress: MotionValue<number>) => ReactNode;
  /** Scroll length allotted per card, in vh. Default 62. */
  heightPerCardVh?: number;
  /** Tailwind classes for the section background. */
  sectionClassName?: string;
}

/**
 * Scroll-controlled 3D stacked cards — the ALAIR NOIR signature interaction.
 *
 * A tall section pins a full-height stage (CSS sticky, same pattern as
 * CinematicOpeningPortal); vertical scroll maps to the active card. Upcoming
 * cards wait stacked behind on the right; the active card holds the front;
 * previous cards move aside left. Extra controls (aside index, mobile dots,
 * horizontal swipe) all route through goTo(), which scrolls the page — scroll
 * position stays the single source of truth.
 *
 * Reduced motion renders a quiet responsive grid instead: no pin, no 3D.
 */
export default function StackedClientCards({
  cards,
  sectionId,
  ariaLabel,
  aside,
  background,
  heightPerCardVh = 62,
  sectionClassName = "bg-brand-deep-forest"
}: StackedClientCardsProps) {
  const count = cards.length;
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotionPref();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const idx = clamp(Math.round(value * (count - 1)), 0, count - 1);
    setActive((prev) => (prev === idx ? prev : idx));
  });

  const goTo = (index: number) => {
    const el = sectionRef.current;
    const clamped = clamp(index, 0, count - 1);
    if (!el) {
      setActive(clamped);
      return;
    }
    const scrollable = el.offsetHeight - window.innerHeight;
    const target = el.offsetTop + (clamped / (count - 1)) * scrollable;
    window.scrollTo({ top: target, behavior: reduced ? "auto" : "smooth" });
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) goTo(active + 1);
    else if (info.offset.x > 60) goTo(active - 1);
  };

  if (reduced) {
    return (
      <section
        id={sectionId}
        aria-label={ariaLabel}
        className={`relative border-b border-brand-cream/10 px-6 py-24 luxury-noise md:px-12 lg:px-24 ${sectionClassName}`}
      >
        {aside(0, () => {})}
        <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.id}
              className="relative overflow-hidden border border-brand-cream/12 bg-brand-black/50"
            >
              <div className="relative aspect-[4/5]">
                {card.image && (
                  <img
                    src={card.image}
                    alt={card.title}
                    className="absolute inset-0 h-full w-full object-cover opacity-70"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-brand-gold">
                    {card.number}
                  </span>
                  <h3 className="mt-2 font-serif text-2xl font-light text-brand-ivory">{card.title}</h3>
                  <p className="mt-2 text-sm font-light leading-relaxed text-brand-stone">
                    {card.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      id={sectionId}
      ref={sectionRef}
      className={`relative ${sectionClassName}`}
      style={{ height: `${count * heightPerCardVh}vh` }}
      aria-label={ariaLabel}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden border-y border-brand-cream/10 luxury-noise">
        {background && (
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            {background(scrollYProgress)}
          </div>
        )}

        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 md:px-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:px-20">
          <div className="relative z-10">{aside(active, goTo)}</div>

          <div className="relative flex items-center justify-center">
            <div
              className="relative aspect-[4/5] w-[78vw] max-w-[380px] sm:w-[62vw] md:w-[46vw] lg:w-full"
              style={{ perspective: "1600px" }}
            >
              {cards.map((card, index) => {
                const offset = index - active;
                const target = cardTransform(offset);
                const isActive = offset === 0;

                return (
                  <motion.article
                    key={card.id}
                    drag={isActive ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.16}
                    dragSnapToOrigin
                    onDragEnd={handleDragEnd}
                    className="absolute inset-0 origin-center overflow-hidden border border-brand-cream/15 bg-brand-black shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
                    style={{
                      zIndex: target.zIndex,
                      cursor: isActive ? "grab" : "default",
                      transformStyle: "preserve-3d"
                    }}
                    initial={false}
                    animate={{
                      x: target.x,
                      y: target.y,
                      scale: target.scale,
                      opacity: target.opacity,
                      rotateY: target.rotateY,
                      filter: `blur(${target.blur}px)`
                    }}
                    transition={{ duration: 0.9, ease: EASE }}
                    aria-hidden={!isActive}
                  >
                    {card.image && (
                      <img
                        src={card.image}
                        alt={card.title}
                        draggable={false}
                        className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
                        loading={index <= 1 ? "eager" : "lazy"}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/45 to-brand-black/15" />
                    <CornerMarkers tone="cream" />

                    <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-cream/80">
                          {card.number}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-cream/40">
                          ALAIR · SPEC
                        </span>
                      </div>

                      <div>
                        <motion.div
                          className="mb-4 h-px w-10 origin-left bg-brand-gold"
                          animate={{ scaleX: isActive ? 1 : 0 }}
                          transition={{ duration: 0.7, ease: EASE, delay: isActive ? 0.15 : 0 }}
                        />
                        <h3 className="font-serif text-2xl font-light leading-tight text-brand-ivory md:text-3xl">
                          {card.title}
                        </h3>
                        <motion.div
                          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
                          transition={{ duration: 0.6, ease: EASE, delay: isActive ? 0.12 : 0 }}
                        >
                          {card.tagline && (
                            <p className="mt-2 font-serif text-sm italic text-brand-cream/90">{card.tagline}</p>
                          )}
                          <p className="mt-3 max-w-xs text-sm font-light leading-relaxed text-brand-stone">
                            {card.description}
                          </p>
                        </motion.div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            <div className="absolute -bottom-12 left-1/2 flex -translate-x-1/2 items-center gap-2.5 lg:hidden">
              {cards.map((card, index) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`View ${card.title}`}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    index === active ? "w-7 bg-brand-gold" : "w-1.5 bg-brand-cream/25"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Per-card 3D state as a function of its distance from the active card. */
function cardTransform(offset: number) {
  if (offset === 0) {
    return { x: "0%", y: 0, scale: 1, opacity: 1, rotateY: 0, blur: 0, zIndex: 50 };
  }
  if (offset > 0) {
    // Upcoming cards stacked behind and slightly lower/right.
    return {
      x: `${offset * 4}%`,
      y: offset * 22,
      scale: 1 - offset * 0.05,
      opacity: offset > 3 ? 0 : 1 - offset * 0.2,
      rotateY: -5,
      blur: Math.min(offset * 0.6, 2),
      zIndex: 40 - offset
    };
  }
  // Past cards slide left and fade; only the immediate previous stays faintly.
  const distance = -offset;
  return {
    x: `${-72 - (distance - 1) * 16}%`,
    y: 0,
    scale: 0.97,
    opacity: distance === 1 ? 0.25 : 0,
    rotateY: 8,
    blur: 1.4,
    zIndex: 10 - distance
  };
}
