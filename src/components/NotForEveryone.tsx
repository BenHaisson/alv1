import { BriefcaseBusiness, MapPin, Plane, Users, type LucideIcon } from "lucide-react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, type CSSProperties } from "react";
import { imageAssets } from "../assets";
import "../mobility-showcase.css";
import { CornerMarkers, useReducedMotionPref } from "./MotionProvider";

interface ServiceCard {
  title: string;
  description: string;
  image: string;
  mobileImage?: string;
  /** Accessible + SEO alt describing the service the frame represents. */
  alt: string;
  desktopPosition: string;
  mobilePosition: string;
  icon: LucideIcon;
}

const SERVICE_CARDS: ServiceCard[] = [
  {
    title: "Private Arrival",
    description: "Flight-tracked airport transfers with your chauffeur waiting before you arrive.",
    image: imageAssets.privateArrivalsDesktop,
    mobileImage: imageAssets.privateArrivalsMobile,
    alt: "Alair Noir private airport arrival chauffeur service in Zürich.",
    desktopPosition: "58% 42%",
    mobilePosition: "68% 50%",
    icon: Plane
  },
  {
    title: "Executive Day",
    description: "Your private driver remains available throughout meetings, appointments, and changing schedules.",
    image: imageAssets.executiveSchedulesDesktop,
    mobileImage: imageAssets.executiveSchedulesMobile,
    alt: "Alair Noir executive chauffeur on call through a full day in Zürich.",
    desktopPosition: "center 42%",
    mobilePosition: "58% 50%",
    icon: BriefcaseBusiness
  },
  {
    title: "Private Routes",
    description: "Long-distance travel across Switzerland and Europe without compromise.",
    image: imageAssets.longDistanceRoutesDesktop,
    mobileImage: imageAssets.longDistanceRoutesMobile,
    alt: "Alair Noir long-distance chauffeur travel across Switzerland and Europe.",
    desktopPosition: "center 58%",
    mobilePosition: "center 48%",
    icon: MapPin
  },
  {
    title: "Group & Family",
    description: "Spacious executive travel prepared for families, colleagues, and private groups.",
    image: imageAssets.airportTransfersDesktop,
    mobileImage: imageAssets.airportTransfersMobile,
    alt: "Alair Noir spacious executive transfer for groups and families in Zürich.",
    desktopPosition: "center 58%",
    mobilePosition: "center 45%",
    icon: Users
  }
];

const HEADLINE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const REVEAL_VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;

interface SectionHeadingProps {
  isReduced: boolean;
}

/**
 * Staggered top-to-bottom unveiling: line 1 fades up, "For you." follows a
 * beat later, the underline draws in left-to-right once the text has landed,
 * and the two supporting lines arrive last, slower and with less movement.
 */
function SectionHeading({ isReduced }: SectionHeadingProps) {
  const reveal = (delay: number, y: number, duration: number) => ({
    initial: isReduced ? false : { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: REVEAL_VIEWPORT,
    transition: { duration, delay, ease: HEADLINE_EASE }
  });

  return (
    <div className="mx-auto flex max-w-[92rem] flex-col items-center px-5 text-center">
      <h2 className="section-heading max-w-[min(100%,78rem)] overflow-visible pb-[0.1em] text-[clamp(2.9rem,5.8vw,6.2rem)] leading-[1.05]">
        <motion.span className="block" {...reveal(0, 20, 0.6)}>
          Not for everyone.
        </motion.span>
        <motion.span className="services-heading-foryou mt-1 block pb-[0.1em]" {...reveal(0.18, 20, 0.6)}>
          For you.
        </motion.span>
      </h2>
      <motion.span
        className="mt-6 block h-px w-14 bg-brand-gold/60"
        style={{ transformOrigin: "left center" }}
        initial={isReduced ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={REVEAL_VIEWPORT}
        transition={{ duration: 0.4, delay: 0.82, ease: "easeOut" }}
        aria-hidden="true"
      />
      <p className="section-subtitle mx-auto mt-6 max-w-3xl tracking-[0.02em]">
        <motion.span className="block" {...reveal(1.05, 10, 0.85)}>
          Every journey begins with a different purpose.
        </motion.span>
        <motion.span className="block" {...reveal(1.2, 10, 0.85)}>
          Each one is prepared with the same discretion, precision, and quiet attention.
        </motion.span>
      </p>
    </div>
  );
}

interface EditorialServiceCardProps {
  card: ServiceCard;
  index: number;
  isReduced: boolean;
  onRequest?: () => void;
}

function EditorialServiceCard({ card, index, isReduced, onRequest }: EditorialServiceCardProps) {
  const Icon = card.icon;
  const cardDelay = index * 0.13;
  const [firstWord, ...restWords] = card.title.split(" ");
  const remainder = restWords.join(" ");

  return (
    <motion.article
      className="service-card-block"
      style={{
        "--desktop-position": card.desktopPosition,
        "--mobile-position": card.mobilePosition
      } as CSSProperties}
      initial={isReduced ? false : { opacity: 0, y: 24 }}
      whileInView={isReduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.8, delay: cardDelay, ease: HEADLINE_EASE }}
    >
      <div className="service-card">
        <picture className="service-card__media">
          {card.mobileImage && <source media="(max-width: 767px)" srcSet={card.mobileImage} />}
          <img
            src={card.image}
            alt={card.alt}
            loading={index < 2 ? "eager" : "lazy"}
            decoding="async"
            referrerPolicy="no-referrer"
            className="service-card__image"
          />
        </picture>

        <div className="service-card__scrim" aria-hidden="true" />

        {/* Quiet viewfinder corners replace a solid edge — the same framing
            motif used on the fleet cards. Draws in a beat after the content
            settles, once the card has landed. */}
        <motion.div
          className="service-card__corners"
          initial={isReduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px -8% 0px" }}
          transition={{ duration: 0.6, delay: cardDelay + 0.35, ease: "easeOut" }}
        >
          <CornerMarkers tone="cream" />
        </motion.div>

        <span className="service-card__icon" aria-hidden="true">
          <Icon strokeWidth={1.25} />
        </span>
      </div>

      <div className="service-card__caption">
        <h3 className="service-card__title font-serif">
          {firstWord}
          {remainder && (
            <>
              {" "}
              <span className="service-card__title-accent">{remainder}</span>
            </>
          )}
        </h3>
        <p className="service-card__description font-sans">{card.description}</p>
        {onRequest && (
          <button
            type="button"
            className="service-card__cta font-mono"
            onClick={onRequest}
            aria-label={`Request ${card.title}`}
          >
            Request this service
            <span className="service-card__cta-arrow" aria-hidden="true">
              →
            </span>
          </button>
        )}
      </div>
    </motion.article>
  );
}

interface NotForEveryoneProps {
  onRequest?: () => void;
}

export default function NotForEveryone({ onRequest }: NotForEveryoneProps) {
  const introRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotionPref();

  // Full-screen brand-phrase stage: zooms up as it enters, holds, then
  // shrinks and dims as the user scrolls on toward the cards.
  const { scrollYProgress: introProgress } = useScroll({
    target: introRef,
    offset: ["start 78%", "end 18%"]
  });
  const easedIntroProgress = useSpring(introProgress, {
    stiffness: 88,
    damping: 28,
    mass: 0.9,
    restDelta: 0.001
  });
  const introOpacity = useTransform(easedIntroProgress, [0, 0.2, 0.76, 1], [0.52, 1, 1, 0.68]);
  const introY = useTransform(easedIntroProgress, [0, 0.28, 0.76, 1], [42, 0, 0, -34]);
  const introScale = useTransform(easedIntroProgress, [0, 0.34, 0.76, 1], [0.62, 1.1, 1.1, 0.78]);

  // Ambient shift: warm forest behind the phrase cools to pure black by the
  // time the card grid is in view. Gold accents stay the fixed anchor.
  const { scrollYProgress: bgProgress } = useScroll({
    target: gridRef,
    offset: ["start 96%", "start 42%"]
  });
  const sectionBackground = useTransform(bgProgress, [0, 1], ["#0E1F16", "#0A0A0A"]);

  return (
    <motion.section
      className="mobility-section relative bg-brand-deep-forest luxury-noise"
      style={isReduced ? undefined : { backgroundColor: sectionBackground }}
    >
      <div ref={introRef} className="services-editorial__intro">
        <motion.div
          className="relative z-[1] mx-auto w-full max-w-[90rem]"
          style={
            isReduced
              ? undefined
              : { opacity: introOpacity, y: introY, scale: introScale, transformOrigin: "center center" }
          }
        >
          <SectionHeading isReduced={isReduced} />
        </motion.div>
      </div>

      <div ref={gridRef} className="services-editorial">
        <div className="services-editorial__grid">
          {SERVICE_CARDS.map((card, index) => (
            <EditorialServiceCard
              key={card.title}
              card={card}
              index={index}
              isReduced={isReduced}
              onRequest={onRequest}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
