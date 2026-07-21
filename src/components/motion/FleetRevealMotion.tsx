import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform, useSpring } from "motion/react";
import {
  Armchair,
  AudioLines,
  Luggage,
  Monitor,
  ShieldCheck,
  Smartphone,
  Snowflake,
  UserRound,
  type LucideIcon
} from "lucide-react";
import { useReducedMotionPref } from "../MotionProvider";
import "./fleet-detail.css";

interface FleetRevealMotionProps {
  onRequestScroll?: (vehicleName?: string) => void;
}

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  { icon: Armchair, title: "Executive Rear Lounge", description: "Reclining executive seats with generous legroom." },
  { icon: AudioLines, title: "Ultra Quiet Cabin", description: "Near-silent electric comfort for a calm journey." },
  { icon: UserRound, title: "Passenger Capacity", description: "Up to 4 passengers." },
  { icon: ShieldCheck, title: "Privacy Focused", description: "Tinted rear glass and discreet chauffeur service." },
  { icon: Luggage, title: "Luggage Space", description: "Up to 3 large suitcases and 1 cabin bag." },
  { icon: Monitor, title: "BMW Theatre Screen", description: "31-inch rear entertainment experience." },
  { icon: Snowflake, title: "Four-Zone Climate", description: "Individual climate comfort for every passenger." },
  { icon: Smartphone, title: "Rear Touch Control", description: "Control seating, lighting, climate and media." }
];

interface GalleryItem {
  id: string;
  title: string;
  subtitle: string;
  /** Left undefined until the final photography is delivered — frames stay empty. */
  image?: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  { id: "exterior-front", title: "Exterior Front", subtitle: "Bold presence. Iconic details.", image: undefined },
  { id: "exterior-side", title: "Exterior Side", subtitle: "Elegant proportions.", image: undefined },
  { id: "exterior-rear", title: "Exterior Rear", subtitle: "Distinctive and modern.", image: undefined },
  { id: "executive-lounge", title: "Executive Lounge", subtitle: "Maximum space and comfort.", image: undefined },
  { id: "theatre-experience", title: "Theatre Experience", subtitle: "Immersive rear entertainment.", image: undefined },
  { id: "rear-touch-control", title: "Rear Touch Control", subtitle: "Everything at your fingertips.", image: undefined }
];

// No real vehicle photography yet — the main frame stays empty until the
// correct image is uploaded. Keep this undefined, never a placeholder photo.
const MAIN_VEHICLE_IMAGE: string | undefined = undefined;

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

interface FleetDetailProps {
  activeGalleryId: string;
  onSelectGallery: (id: string) => void;
  onRequestScroll?: (vehicleName?: string) => void;
  isReduced: boolean;
}

/**
 * The BMW i7 composition, sized to fill its section — vehicle presentation
 * with an empty studio frame and thumb strip on the left, the "Your Journey"
 * passenger panel on the right. It sits in normal page flow (no entrance
 * animation, no scaling) so it reads as part of the page. Every image slot
 * stays empty until real assets are dropped in.
 */
function FleetDetail({ activeGalleryId, onSelectGallery, onRequestScroll, isReduced }: FleetDetailProps) {
  const active = GALLERY_ITEMS.find((item) => item.id === activeGalleryId) ?? GALLERY_ITEMS[0];
  const activeIndex = GALLERY_ITEMS.indexOf(active);

  return (
    <div className="fleet-detail">
      <div className="bmw-layout">
        {/* ── Left: vehicle presentation with empty frame + thumb strip ── */}
        <div className="bmw-vehicle">
          <span className="bmw-section-label">Our Fleet</span>
          <div className="bmw-vehicle__heading">
            <h3 className="bmw-vehicle-title">BMW i7 xDrive60</h3>
            <span className="bmw-vehicle-year">2026</span>
          </div>
          <p className="bmw-vehicle-subtitle">All-electric. Ultra silent. Exceptionally refined.</p>
          <span className="bmw-vehicle__divider" aria-hidden="true" />

          <div className="main-vehicle-frame" aria-label={`BMW i7 ${active.title} image placeholder`}>
            {(active.image ?? MAIN_VEHICLE_IMAGE) && (
              <img src={active.image ?? MAIN_VEHICLE_IMAGE} alt={`BMW i7 xDrive60 — ${active.title}`} />
            )}
          </div>

          <div className="fleet-caption-row">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={active.id}
                className="fleet-caption"
                initial={isReduced ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={isReduced ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="fleet-caption__index">
                  0{activeIndex + 1} / 0{GALLERY_ITEMS.length}
                </span>
                <span className="fleet-caption__title">{active.title}</span>
                <span className="fleet-caption__subtitle">{active.subtitle}</span>
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="fleet-thumbs" role="tablist" aria-label="BMW i7 gallery">
            {GALLERY_ITEMS.map((item) => {
              const isActive = item.id === activeGalleryId;
              return (
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  key={item.id}
                  className={`fleet-thumb${isActive ? " fleet-thumb--active" : ""}`}
                  onClick={() => onSelectGallery(item.id)}
                  aria-label={`${item.title} image placeholder`}
                >
                  {item.image && <img src={item.image} alt="" loading="lazy" decoding="async" draggable={false} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Right: passenger experience panel ── */}
        <div className="bmw-journey bmw-divider">
          <span className="bmw-section-label">Your Journey</span>
          <h3 className="bmw-journey-heading">
            Executive comfort,
            <br />
            without compromise.
          </h3>
          <p className="bmw-journey-description">
            Every BMW i7 in our fleet is prepared to deliver a quiet, spacious and refined travel experience for
            business and private journeys alike.
          </p>

          <div className="features-grid">
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
          </div>

          <div className="bmw-journey__footer">
            <p className="bmw-journey__footer-line">
              Quiet Cabin &bull; Executive Seating &bull; Climate Comfort &bull; Premium Audio
            </p>
            <p className="bmw-journey__footer-line--muted">
              Designed for airport transfers, executive travel and private journeys.
            </p>
          </div>

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
        </div>
      </div>
    </div>
  );
}

/**
 * Section 03 — the fleet. One "Travel, Refined" headline reveals with the
 * same scroll-linked zoom used by section 02's "Not for everyone." phrase;
 * beneath it the BMW i7 composition sits in normal page flow, filling the
 * screen as a plain section — no floating, no scale-in.
 */
export default function FleetRevealMotion({ onRequestScroll }: FleetRevealMotionProps) {
  const introRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotionPref();
  const [activeGalleryId, setActiveGalleryId] = useState(GALLERY_ITEMS[0].id);

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
        <FleetDetail
          activeGalleryId={activeGalleryId}
          onSelectGallery={setActiveGalleryId}
          onRequestScroll={onRequestScroll}
          isReduced={isReduced}
        />
      </div>
    </section>
  );
}
