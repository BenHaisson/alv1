import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { imageAssets } from "../assets";
import { useReducedMotionPref } from "./MotionProvider";

interface ServiceCard {
  label: string;
  title: string;
  description: string;
  image: string;
  mobileImage?: string;
  imagePosition?: string;
}

const SERVICE_CARDS: ServiceCard[] = [
  {
    label: "Private",
    title: "Private arrivals",
    description: "Your chauffeur is already waiting. No queues, no uncertainty, no delay.",
    image: imageAssets.privateArrivalsDesktop,
    mobileImage: imageAssets.privateArrivalsMobile,
    imagePosition: "center"
  },
  {
    label: "Precision",
    title: "Executive schedules",
    description: "Built around your agenda, with discreet waiting and flexible departures.",
    image: imageAssets.executiveSchedulesDesktop,
    mobileImage: imageAssets.executiveSchedulesMobile,
    imagePosition: "62% center"
  },
  {
    label: "Flight-aware",
    title: "Airport transfers",
    description: "Flight-aware pickups with seamless transfers from terminal to destination.",
    image: imageAssets.airportTransfersDesktop,
    mobileImage: imageAssets.airportTransfersMobile,
    imagePosition: "center"
  },
  {
    label: "Europe",
    title: "Long-distance routes",
    description: "Private journeys across Switzerland and throughout Europe, without compromise.",
    image: imageAssets.longDistanceRoutesDesktop,
    mobileImage: imageAssets.longDistanceRoutesMobile,
    imagePosition: "center"
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
      <picture className="absolute inset-0 block">
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
          className="h-full w-full object-cover brightness-[0.82] contrast-[1.06]"
          style={{ objectPosition: card.imagePosition }}
        />
      </picture>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(5,8,6,0.96)_0%,rgba(5,8,6,0.72)_22%,rgba(5,8,6,0.18)_52%,transparent_72%)]"
      />

      <motion.div
        className="absolute inset-x-0 bottom-0 w-full max-w-none px-6 pb-8 md:max-w-[35%] md:px-12 md:pb-12 lg:px-14"
        whileHover={isReduced ? undefined : { y: -5 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="font-sans text-[11px] font-medium uppercase tracking-[0.24em] text-brand-gold">
          {card.label}
        </span>
        <h3 className="mt-3 font-editorial text-[2.2rem] font-normal leading-[0.98] text-brand-ivory md:text-[3.25rem]">
          {card.title}
        </h3>
        <span className="mt-6 block h-px w-12 bg-brand-gold" aria-hidden="true" />
        <p className="mt-5 max-w-[360px] text-[15px] font-light leading-[1.55] text-brand-cream/72 md:text-[18px]">
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
        zIndex: SERVICE_CARDS.length - index
      }}
      whileHover={isReduced ? undefined : { borderColor: "rgba(234, 222, 206, 0.28)" }}
      transition={{ duration: 0.82, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 isolate overflow-hidden rounded-[26px] border border-brand-cream/16 bg-brand-deep-forest shadow-[0_28px_90px_rgba(0,0,0,0.48)] md:rounded-[28px]"
    >
      <ServiceCardContent card={card} />
    </motion.article>
  );
}

function SectionHeading() {
  return (
    <div className="shrink-0 border-b border-brand-cream/10 pb-5 md:pb-6">
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
    <section className="relative border-b border-brand-cream/10 bg-brand-black px-5 pb-16 pt-20 md:px-10 md:pb-24 md:pt-24 lg:px-16">
      <div className="mx-auto max-w-[90rem]">
        <SectionHeading />
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {SERVICE_CARDS.map((card) => (
            <article
              key={card.title}
              className="relative isolate min-h-[620px] aspect-[3/4] overflow-hidden rounded-[26px] border border-brand-cream/16 bg-brand-deep-forest md:aspect-[16/7] md:rounded-[28px]"
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
  const sectionRef = useRef<HTMLElement>(null);
  const isReduced = useReducedMotionPref();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
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
    <section
      ref={sectionRef}
      className="relative h-[400svh] border-b border-brand-cream/10 bg-brand-black luxury-noise"
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-brand-gold/35" />

      <div className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-visible px-5 pb-4 pt-5 md:top-16 md:h-[calc(100svh-4rem)] md:px-10 md:pb-7 md:pt-6 lg:px-16">
        <div className="mx-auto flex h-full max-w-[90rem] flex-col">
          <SectionHeading />

          <div className="relative mt-4 min-h-[620px] flex-1 aspect-[3/4] md:mt-6 md:aspect-[16/7]">
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
    </section>
  );
}
