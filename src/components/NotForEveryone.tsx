import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef, type CSSProperties } from "react";
import { imageAssets } from "../assets";
import { useReducedMotionPref } from "./MotionProvider";

interface ServiceCard {
  label: string;
  title: string;
  description: string;
  image: string;
  mobileImage?: string;
  desktopPosition: string;
  mobilePosition: string;
}

const SERVICE_CARDS: ServiceCard[] = [
  {
    label: "Private",
    title: "Private arrivals",
    description: "Your chauffeur is already waiting. No queues, no uncertainty, no delay.",
    image: imageAssets.privateArrivalsDesktop,
    mobileImage: imageAssets.privateArrivalsMobile,
    // Keep the chauffeur and the BMW together in the wide crop; on portrait
    // screens bias right so the driver's face and open rear door remain clear.
    desktopPosition: "58% 38%",
    mobilePosition: "68% 50%"
  },
  {
    label: "Precision",
    title: "Executive schedules",
    description: "Built around your agenda, with discreet waiting and flexible departures.",
    image: imageAssets.executiveSchedulesDesktop,
    mobileImage: imageAssets.executiveSchedulesMobile,
    desktopPosition: "center 42%",
    mobilePosition: "58% 50%"
  },
  {
    label: "Flight-aware",
    title: "Airport transfers",
    description: "Flight-aware pickups with seamless transfers from terminal to destination.",
    image: imageAssets.airportTransfersDesktop,
    mobileImage: imageAssets.airportTransfersMobile,
    desktopPosition: "center 58%",
    mobilePosition: "center 45%"
  },
  {
    label: "Europe",
    title: "Long-distance routes",
    description: "Private journeys across Switzerland and throughout Europe, without compromise.",
    image: imageAssets.longDistanceRoutesDesktop,
    mobileImage: imageAssets.longDistanceRoutesMobile,
    desktopPosition: "center 58%",
    mobilePosition: "center 48%"
  }
];

const FINAL_CARD_HOLD = 0.16;

interface ServiceCardContentProps {
  card: ServiceCard;
}

function ServiceCardContent({ card }: ServiceCardContentProps) {
  const isReduced = useReducedMotionPref();

  return (
    <>
      <picture className="mobility-card__media absolute inset-0 block">
        {card.mobileImage && <source media="(max-width: 767px)" srcSet={card.mobileImage} />}
        <motion.img
          src={card.image}
          alt=""
          loading="eager"
          decoding="async"
          referrerPolicy="no-referrer"
          initial={isReduced ? false : { clipPath: "inset(0 0 100% 0)" }}
          animate={isReduced ? undefined : { clipPath: "inset(0 0 0% 0)" }}
          whileHover={isReduced ? undefined : { scale: 1.025, filter: "brightness(0.9) contrast(1.06)" }}
          transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
          className="mobility-card__image h-full w-full object-cover brightness-[0.82] contrast-[1.06]"
        />
      </picture>

      <motion.div
        className="mobility-card__content"
        whileHover={isReduced ? undefined : { y: -5 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="mobility-card__eyebrow font-sans font-medium uppercase text-brand-gold">
          {card.label}
        </span>
        <h3 className="mobility-card__title font-editorial font-normal text-brand-ivory">
          {card.title}
        </h3>
        <span className="mobility-card__divider block h-px bg-brand-gold" aria-hidden="true" />
        <p className="mobility-card__description font-light text-brand-cream/72">
          {card.description}
        </p>
      </motion.div>
    </>
  );
}

interface StackedServiceCardProps {
  card: ServiceCard;
  index: number;
  progress: MotionValue<number>;
}

function StackedServiceCard({ card, index, progress }: StackedServiceCardProps) {
  const isReduced = useReducedMotionPref();
  const outgoingCards = SERVICE_CARDS.length - 1;
  const movementRange = 1 - FINAL_CARD_HOLD;
  const segment = movementRange / outgoingCards;
  const start = index * segment;
  const end = start + segment;
  const isFinalCard = index === SERVICE_CARDS.length - 1;
  const y = useTransform(
    progress,
    isFinalCard ? [0, 1] : [start, end],
    isFinalCard ? ["0%", "0%"] : ["0%", "-125%"]
  );
  const visibility = useTransform(progress, (value) =>
    isFinalCard || value < end ? ("visible" as const) : ("hidden" as const)
  );

  return (
    <motion.article
      style={{
        y,
        visibility,
        zIndex: SERVICE_CARDS.length - index,
        ...({
          "--desktop-position": card.desktopPosition,
          "--mobile-position": card.mobilePosition
        } as CSSProperties)
      }}
      whileHover={isReduced ? undefined : { borderColor: "rgba(234, 222, 206, 0.28)" }}
      transition={{ duration: 0.82, ease: [0.16, 1, 0.3, 1] }}
      className="mobility-card absolute inset-0 isolate overflow-hidden rounded-[26px] border border-brand-cream/16 bg-brand-deep-forest shadow-[0_28px_90px_rgba(0,0,0,0.48)] md:rounded-[28px]"
    >
      <ServiceCardContent card={card} />
    </motion.article>
  );
}

function SectionHeading() {
  return (
    <div className="mobility-section__header shrink-0 border-b border-brand-cream/10 pb-5 md:pb-6">
      <div className="flex items-center gap-4 self-start md:pt-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand-gold">
          02
        </span>
        <span className="h-px w-12 bg-brand-cream/25" aria-hidden="true" />
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand-stone">
          Private mobility
        </span>
      </div>

      <div className="mt-4 max-w-3xl text-left md:mt-5">
        <h2 className="font-serif text-[2.65rem] font-light leading-[0.94] text-brand-ivory md:text-5xl lg:text-[3.35rem]">
          Not for everyone. <span className="italic text-brand-stone">For you.</span>
        </h2>
        <p className="mt-3 max-w-[48ch] text-[13px] font-light leading-5 text-brand-body md:text-sm md:leading-6">
          Four ways to move with certainty, prepared around your time, privacy, and destination.
        </p>
      </div>
    </div>
  );
}

function ReducedMotionCards() {
  return (
    <section className="mobility-section mobility-section--static relative border-b border-brand-cream/10 bg-brand-black">
      <div className="mx-auto max-w-[90rem]">
        <SectionHeading />
        <div className="mobility-card-grid mt-0 grid gap-5 md:grid-cols-2">
          {SERVICE_CARDS.map((card) => (
            <article
              key={card.title}
              className="mobility-card relative isolate overflow-hidden rounded-[26px] border border-brand-cream/16 bg-brand-deep-forest md:rounded-[28px]"
              style={{
                "--desktop-position": card.desktopPosition,
                "--mobile-position": card.mobilePosition
              } as CSSProperties}
            >
              <ServiceCardContent card={card} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function NotForEveryone() {
  const galleryRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotionPref();
  const { scrollYProgress } = useScroll({
    target: galleryRef,
    offset: ["start start", "end end"]
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 118,
    damping: 30,
    mass: 0.72,
    restDelta: 0.001
  });
  if (isReduced) return <ReducedMotionCards />;

  return (
    <section className="mobility-section relative border-b border-brand-cream/10 bg-brand-black luxury-noise">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-brand-gold/35" />

      <div className="mobility-section__entry">
        <div className="mx-auto w-full max-w-[90rem]">
          <SectionHeading />
        </div>
      </div>

      <div ref={galleryRef} className="mobility-section__gallery relative h-[400svh]">
        <div className="mobility-section__viewport mobility-section__viewport--gallery sticky top-0 h-[100svh] overflow-hidden">
          <div className="mobility-section__layout mobility-section__layout--gallery relative mx-auto h-full max-w-[90rem]">
            <div className="mobility-card-stage relative">
              {SERVICE_CARDS.map((card, index) => (
                <StackedServiceCard
                  key={card.title}
                  card={card}
                  index={index}
                  progress={progress}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
