import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef, type CSSProperties } from "react";
import { imageAssets } from "../assets";
import { useReducedMotionPref } from "./MotionProvider";
import { MOTION_EASE } from "../lib/motion";

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

const introGroup = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.08
    }
  }
};

const introReveal = {
  hidden: { opacity: 0, y: 58, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: MOTION_EASE }
  }
};

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
  const isReduced = useReducedMotionPref();

  return (
    <motion.div
      className="mobility-section__header flex shrink-0 flex-col items-center justify-center text-center"
      initial={isReduced ? false : "hidden"}
      whileInView={isReduced ? undefined : "visible"}
      viewport={{ once: true, amount: 0.5 }}
      variants={introGroup}
    >
      <motion.div
        className="mx-auto max-w-[92rem]"
        variants={introReveal}
      >
        <h2 className="font-serif text-[clamp(3.25rem,6.4vw,6.75rem)] font-light leading-[0.86] tracking-[-0.015em] text-brand-ivory md:whitespace-nowrap">
          Not for everyone. <span className="italic text-brand-stone">For you.</span>
        </h2>
        <motion.p
          className="mx-auto mt-8 max-w-2xl text-base font-light leading-8 text-brand-cream/86 md:text-lg"
          variants={introReveal}
        >
          Four ways to move with certainty, prepared around your time, privacy, and destination.
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

function ReducedMotionCards() {
  return (
    <section className="mobility-section mobility-section--static relative border-b border-brand-cream/10 bg-brand-deep-forest">
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
  const introRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotionPref();
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
  const introOpacity = useTransform(easedIntroProgress, [0, 0.24, 0.62, 1], [0, 1, 1, 0]);
  const introY = useTransform(easedIntroProgress, [0, 0.24, 0.72, 1], [64, 0, 0, -72]);
  const introScale = useTransform(easedIntroProgress, [0, 0.28, 0.72, 1], [0.96, 1, 1, 0.985]);
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
      <div ref={introRef} className="mobility-section__entry bg-brand-deep-forest">
        <motion.div
          className="mx-auto w-full max-w-[90rem]"
          style={isReduced ? undefined : { opacity: introOpacity, y: introY, scale: introScale }}
        >
          <SectionHeading />
        </motion.div>
      </div>

      <div ref={galleryRef} className="mobility-section__gallery relative h-[400svh]">
        <div className="mobility-section__viewport mobility-section__viewport--gallery sticky top-[76px] h-[calc(100svh-76px)] overflow-hidden md:top-14 md:h-[calc(100svh-56px)]">
          <div className="mobility-section__layout mobility-section__layout--gallery relative mx-auto h-full max-w-[90rem]">
            <motion.div
              className="mobility-card-stage relative"
              initial={{ opacity: 0, y: 64 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.05, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              {SERVICE_CARDS.map((card, index) => (
                <StackedServiceCard
                  key={card.title}
                  card={card}
                  index={index}
                  progress={progress}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
