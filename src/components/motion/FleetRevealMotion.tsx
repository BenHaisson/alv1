import { useEffect, useRef, useState, type MouseEvent } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  type Variants
} from "motion/react";
import {
  Armchair,
  AudioLines,
  Luggage,
  ShieldCheck,
  Smartphone,
  Snowflake,
  type LucideIcon
} from "lucide-react";
import { useReducedMotionPref } from "../MotionProvider";
import { imageAssets } from "../../assets";
import "./fleet-detail.css";

interface FleetRevealMotionProps {
  onRequestScroll?: (vehicleName?: string) => void;
}

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

// Capacity and the theatre screen moved into the numeric spec band, so the
// feature list stays a curated six — three calm rows, no repetition.
const FEATURES: Feature[] = [
  { icon: Armchair, title: "Executive Rear Lounge", description: "Reclining executive seats with generous legroom." },
  { icon: AudioLines, title: "Ultra Quiet Cabin", description: "Near-silent electric comfort for a calm journey." },
  { icon: ShieldCheck, title: "Privacy Focused", description: "Tinted rear glass and discreet chauffeur service." },
  { icon: Luggage, title: "Luggage Space", description: "Up to 3 large suitcases and 1 cabin bag." },
  { icon: Snowflake, title: "Four-Zone Climate", description: "Individual climate comfort for every passenger." },
  { icon: Smartphone, title: "Rear Touch Control", description: "Control seating, lighting, climate and media." }
];

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

/** What the journey offers the client — comfort, space, entertainment,
 *  availability. No engineering figures; guests are not buying the car. */
const STATS: Stat[] = [
  { value: 4, suffix: "", label: "Guests in Comfort" },
  { value: 3, suffix: "+", label: "Large Suitcases" },
  { value: 31, suffix: "″", label: "Theatre Screen" },
  { value: 24, suffix: "/7", label: "At Your Service" }
];

const PANEL_STAGGER: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.06 }
  }
};

const PANEL_BLOCK: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  }
};

/** Serif numeral that counts from zero the first time it becomes visible. */
function StatValue({ value, isReduced }: { value: number; isReduced: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const startedRef = useRef(false);
  const [display, setDisplay] = useState(isReduced ? value : 0);

  useEffect(() => {
    if (!isInView) return;
    startedRef.current = true;
    if (isReduced) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.5,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v))
    });
    // If animation frames stall (background/throttled tabs), the number must
    // still land on the real value.
    const settle = window.setTimeout(() => setDisplay(value), 2200);
    return () => {
      controls.stop();
      window.clearTimeout(settle);
    };
  }, [isInView, isReduced, value]);

  // Environments where IntersectionObserver never delivers (embedded or
  // heavily throttled views) must still show the real figure. Off-screen this
  // snap is invisible; when observation works, the count-up runs as designed.
  useEffect(() => {
    const guard = window.setTimeout(() => {
      if (!startedRef.current) setDisplay(value);
    }, 5000);
    return () => window.clearTimeout(guard);
  }, [value]);

  return <span ref={ref}>{display}</span>;
}

interface Chapter {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  /** Focal point for the cover crop, e.g. "center 62%". */
  focus: string;
  /** Exterior beauty shots get the deep cinematic zoom; cabins drift gently. */
  cinematic?: boolean;
}

/** Dwell time per chapter before the stage advances on its own. */
const CHAPTER_DWELL_MS = 7000;

// Branded ALAIR NOIR studio + cabin photography (client upload, Jul 2026).
// Every frame renders identically: a full-bleed cover crop of the same stage,
// so mixed source ratios never change the composition.
const CHAPTERS: Chapter[] = [
  {
    id: "exterior-front",
    title: "Exterior Front",
    subtitle: "Bold presence. Iconic details.",
    image: imageAssets.bmwI7StudioFront,
    focus: "center 68%",
    cinematic: true
  },
  {
    id: "exterior-rear",
    title: "Exterior Rear",
    subtitle: "Elegant proportions.",
    image: imageAssets.bmwI7StudioRear,
    focus: "center 62%",
    cinematic: true
  },
  {
    id: "cabin-welcome",
    title: "Doors Open",
    subtitle: "A private room, prepared.",
    image: imageAssets.bmwI7StudioDoorsOpen,
    focus: "center 55%",
    cinematic: true
  },
  {
    id: "executive-lounge",
    title: "Executive Lounge",
    subtitle: "Maximum space and comfort.",
    image: imageAssets.bmwI7RearWorkspaceZurich,
    focus: "center 45%"
  },
  {
    id: "theatre-experience",
    title: "Theatre Experience",
    subtitle: "Immersive rear entertainment.",
    image: imageAssets.bmwI7TheatreAppleTv,
    focus: "center 40%"
  },
  {
    id: "rear-touch-control",
    title: "Rear Touch Control",
    subtitle: "Everything at your fingertips.",
    image: imageAssets.bmwI7DoorTouchControl,
    focus: "center 45%"
  }
];

function TravelHeadline() {
  return (
    <div className="fleet-headline max-w-2xl">
      <h2 className="section-heading">Travel, Refined</h2>
      <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-brand-stone md:text-lg">
        Whether travelling alone or together, every cabin is prepared with the same discreet service, exceptional comfort, and quiet precision.
      </p>
    </div>
  );
}

/**
 * The immersive vehicle stage: one fixed full-bleed canvas where every chapter
 * crossfades in as a cover crop with a slow Ken Burns drift. Chapters are
 * switched from the editorial rail (numbered list + auto-advance progress
 * hairline) instead of a conventional thumbnail strip.
 */
function FleetStage({ isReduced }: { isReduced: boolean }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const active = CHAPTERS[activeIdx];

  // Auto-advance. Restarts whenever the chapter changes (including manual
  // selection), pauses while the pointer rests on the stage.
  useEffect(() => {
    if (isReduced || isPaused) return;
    const timer = window.setTimeout(
      () => setActiveIdx((idx) => (idx + 1) % CHAPTERS.length),
      CHAPTER_DWELL_MS
    );
    return () => window.clearTimeout(timer);
  }, [activeIdx, isPaused, isReduced]);

  // Decode every frame up front so crossfades never reveal a half-loaded image.
  useEffect(() => {
    CHAPTERS.forEach((chapter) => {
      const img = new Image();
      img.src = chapter.image;
    });
  }, []);

  // The rail tiles lean toward the pointer — a few degrees of perspective
  // driven by CSS vars, so the effect stays on the compositor.
  const handleRailTilt = (event: MouseEvent<HTMLButtonElement>) => {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const ry = ((event.clientX - rect.left) / rect.width - 0.5) * 9;
    const rx = -((event.clientY - rect.top) / rect.height - 0.5) * 7;
    el.style.setProperty("--rail-rx", `${rx.toFixed(2)}deg`);
    el.style.setProperty("--rail-ry", `${ry.toFixed(2)}deg`);
  };

  const resetRailTilt = (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.style.setProperty("--rail-rx", "0deg");
    event.currentTarget.style.setProperty("--rail-ry", "0deg");
  };

  return (
    <div
      className="fleet-stage"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="fleet-stage__media" aria-hidden="true">
        <AnimatePresence initial={false}>
          <motion.img
            key={active.id}
            src={active.image}
            alt=""
            style={{ objectPosition: active.focus }}
            initial={
              isReduced
                ? false
                : {
                    clipPath: "inset(0% 100% 0% 0%)",
                    scale: active.cinematic ? 1.26 : 1.1
                  }
            }
            animate={
              isReduced
                ? { opacity: 1 }
                : {
                    clipPath: "inset(0% 0% 0% 0%)",
                    // Exteriors: a deep zoom that settles, then pushes slowly
                    // back in. Cabins: a calm drift.
                    scale: active.cinematic ? [1.26, 1.07, 1.13] : [1.1, 1.04, 1.08],
                    transition: {
                      clipPath: { duration: 1.05, ease: [0.76, 0, 0.24, 1] },
                      scale: {
                        duration: CHAPTER_DWELL_MS / 1000 + 1.2,
                        times: [0, 0.34, 1],
                        ease: ["easeOut", "linear"]
                      }
                    }
                  }
            }
            exit={isReduced ? undefined : { opacity: 0, transition: { duration: 0.55 } }}
          />
        </AnimatePresence>
      </div>

      {/* Shade pass: each reveal starts under a veil of shadow that lifts. */}
      {!isReduced && (
        <motion.div
          key={`${active.id}-shade`}
          className="fleet-stage__shade"
          aria-hidden="true"
          initial={{ opacity: 0.65 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
      )}

      <div className="fleet-stage__scrim" aria-hidden="true" />

      {/* Vehicle identity + the active chapter title, top-left on the image. */}
      <div className="fleet-stage__head">
        <span className="bmw-section-label">Our Fleet</span>
        <div className="fleet-stage__title-row">
          <h3 className="bmw-vehicle-title">BMW i7 xDrive60</h3>
          <span className="bmw-vehicle-year">2026</span>
        </div>
        <p className="fleet-stage__subtitle">All-electric. Ultra silent. Exceptionally refined.</p>

        {/* A single keyed block — remounts on chapter change so the title
            always matches the active image (no exit-animation dependency). */}
        <div className="fleet-stage__chapter">
          <motion.div
            key={active.id}
            initial={isReduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="fleet-stage__chapter-index">
              {String(activeIdx + 1).padStart(2, "0")} — {String(CHAPTERS.length).padStart(2, "0")}
            </span>
            <h4 className="fleet-stage__chapter-title">{active.title}</h4>
            <p className="fleet-stage__chapter-sub">{active.subtitle}</p>
          </motion.div>
        </div>
      </div>

      {/* Editorial chapter rail: image tiles that tilt toward the pointer.
          The active tile is lit; resting tiles sit dimmed under a low shadow. */}
      <div className="fleet-rail" role="tablist" aria-label="BMW i7 chapters">
        {CHAPTERS.map((chapter, index) => {
          const isActive = index === activeIdx;
          return (
            <button
              key={chapter.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={chapter.title}
              className={`fleet-rail__item${isActive ? " fleet-rail__item--active" : ""}`}
              onClick={() => setActiveIdx(index)}
              onMouseMove={isReduced ? undefined : handleRailTilt}
              onMouseLeave={isReduced ? undefined : resetRailTilt}
            >
              <span className="fleet-rail__tile">
                <img src={chapter.image} alt="" loading="lazy" decoding="async" draggable={false} />
                <span className="fleet-rail__num" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </span>
              <span className="fleet-rail__bar" aria-hidden="true">
                {isActive && !isReduced && (
                  <span
                    key={`${chapter.id}-${isPaused ? "held" : "run"}`}
                    className="fleet-rail__progress"
                    style={{
                      animationDuration: `${CHAPTER_DWELL_MS}ms`,
                      animationPlayState: isPaused ? "paused" : "running"
                    }}
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
}

interface FleetDetailProps {
  onRequestScroll?: (vehicleName?: string) => void;
  isReduced: boolean;
}

/**
 * The BMW i7 composition: the immersive stage on the left, the "Your Journey"
 * passenger panel on the right. Sized so the pair fills one viewport below the
 * pinned headline.
 */
function FleetDetail({ onRequestScroll, isReduced }: FleetDetailProps) {
  return (
    <div className="fleet-detail">
      <div className="bmw-layout">
        <FleetStage isReduced={isReduced} />

        {/* ── Right: passenger experience panel ── */}
        <motion.div
          className="bmw-journey bmw-divider"
          initial={isReduced ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={PANEL_STAGGER}
        >
          <motion.div variants={PANEL_BLOCK}>
            <span className="bmw-section-label">Your Journey</span>
            <h3 className="bmw-journey-heading">
              Executive comfort,
              <br />
              without compromise.
            </h3>
            <p className="bmw-journey-description">
              Every BMW i7 in our fleet is prepared to deliver a quiet, spacious and refined travel
              experience for business and private journeys alike.
            </p>
          </motion.div>

          {/* The defining numbers — the spec band. */}
          <motion.dl className="journey-stats" variants={PANEL_BLOCK}>
            {STATS.map((stat) => (
              <div className="journey-stat" key={stat.label}>
                <dd className="journey-stat__value">
                  <StatValue value={stat.value} isReduced={isReduced} />
                  {stat.suffix && <span className="journey-stat__suffix">{stat.suffix}</span>}
                </dd>
                <dt className="journey-stat__label">{stat.label}</dt>
              </div>
            ))}
          </motion.dl>

          <motion.div className="features-grid" variants={PANEL_BLOCK}>
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div className="feature-item" key={feature.title}>
                  <span className="feature-icon" aria-hidden="true">
                    <Icon strokeWidth={1.2} />
                  </span>
                  <div>
                    <div className="feature-title">{feature.title}</div>
                    <p className="feature-description">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>

          <motion.div className="bmw-journey__footer" variants={PANEL_BLOCK}>
            <p className="bmw-journey__footer-line--muted">
              Designed for airport transfers, executive travel and private journeys.
            </p>

            {onRequestScroll && (
              <button
                type="button"
                className="bmw-journey__cta font-mono"
                onClick={() => onRequestScroll("BMW i7")}
              >
                Reserve this vehicle
                <span className="bmw-journey__cta-arrow" aria-hidden="true">
                  →
                </span>
              </button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Section 03 — the fleet. One "Travel, Refined" headline reveals with the
 * same scroll-linked zoom used by section 02's "Not for everyone." phrase;
 * beneath it the BMW i7 composition fills the screen as one immersive spread.
 */
export default function FleetRevealMotion({ onRequestScroll }: FleetRevealMotionProps) {
  const introRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotionPref();

  // Progress across the whole intro track — from the headline entering at the
  // bottom (0) to the track fully scrolled past the top (1). The headline is
  // pinned to the top by CSS sticky; this only drives the zoom: it grows in as
  // it rises, then shrinks (zooms out) as it settles pinned at the top, and
  // holds small until the BMW body scrolls up and pushes it away.
  const { scrollYProgress: introProgress } = useScroll({
    target: introRef,
    offset: ["start end", "end start"]
  });
  const easedIntroProgress = useSpring(introProgress, {
    stiffness: 90,
    damping: 30,
    mass: 0.8,
    restDelta: 0.0005
  });
  const introOpacity = useTransform(easedIntroProgress, [0, 0.16, 0.9, 1], [0, 1, 1, 0.6]);
  const introScale = useTransform(easedIntroProgress, [0, 0.28, 0.46, 1], [0.72, 1.1, 0.82, 0.82]);

  return (
    <section
      className="relative border-b border-brand-cream/10 bg-brand-deep-forest luxury-noise"
      aria-label="The ALAIR NOIR fleet"
    >
      <div ref={introRef} className="fleet-intro">
        <div className="fleet-intro__pin">
          <motion.div
            className="fleet-intro__inner"
            style={
              isReduced
                ? undefined
                : { opacity: introOpacity, scale: introScale, transformOrigin: "left top" }
            }
          >
            <TravelHeadline />
          </motion.div>
        </div>
      </div>

      <div className="fleet-body">
        <FleetDetail onRequestScroll={onRequestScroll} isReduced={isReduced} />
      </div>
    </section>
  );
}
