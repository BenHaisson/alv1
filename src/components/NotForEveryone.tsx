import type { LucideIcon } from "lucide-react";
import { CalendarClock, DoorOpen, PlaneLanding, Route } from "lucide-react";
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
  icon: LucideIcon;
  imagePosition?: string;
}

const SERVICE_CARDS: ServiceCard[] = [
  {
    label: "Private",
    title: "Private arrivals",
    description: "Your chauffeur is already waiting. No queues, no uncertainty, no delay.",
    image: imageAssets.privateArrivalsDesktop,
    mobileImage: imageAssets.privateArrivalsMobile,
    icon: DoorOpen,
    imagePosition: "center"
  },
  {
    label: "Precision",
    title: "Executive schedules",
    description: "Built around your agenda, with discreet waiting and flexible departures.",
    image: imageAssets.executiveSchedulesDesktop,
    mobileImage: imageAssets.executiveSchedulesMobile,
    icon: CalendarClock,
    imagePosition: "62% center"
  },
  {
    label: "Flight-aware",
    title: "Airport transfers",
    description: "Flight-aware pickups with seamless transfers from terminal to destination.",
    image: imageAssets.zurichAirportArrival,
    icon: PlaneLanding,
    imagePosition: "center"
  },
  {
    label: "Europe",
    title: "Long-distance routes",
    description: "Private journeys across Switzerland and throughout Europe, without compromise.",
    image: imageAssets.bmwI7AlpineCruise,
    icon: Route,
    imagePosition: "center"
  }
];

const FINAL_CARD_HOLD = 0.16;

interface ServiceCardContentProps {
  card: ServiceCard;
}

function ServiceCardContent({ card }: ServiceCardContentProps) {
  const Icon = card.icon;

  return (
    <>
      <picture className="absolute inset-0">
        {card.mobileImage && <source media="(max-width: 767px)" srcSet={card.mobileImage} />}
        <motion.img
          src={card.image}
          alt=""
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          whileInView={{ clipPath: "inset(0 0 0% 0)" }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-full object-cover brightness-[0.82] contrast-[1.06]"
          style={{ objectPosition: card.imagePosition }}
        />
      </picture>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(4,7,5,0.03)_0%,rgba(4,7,5,0.1)_42%,rgba(4,7,5,0.68)_100%)]"
      />

      <div className="absolute inset-x-0 bottom-0 border-t border-brand-cream/18 bg-[rgba(4,7,5,0.9)] px-5 py-5 shadow-[0_-18px_54px_rgba(0,0,0,0.3)] backdrop-blur-md md:px-8 md:py-6 lg:px-10">
        <div className="grid items-end gap-4 md:grid-cols-[minmax(0,1fr)_minmax(20rem,0.72fr)] md:gap-10">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-gold/82">
              {card.label}
            </span>

            <div className="mt-2.5 flex items-center gap-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-cream/20 bg-brand-black/64 text-brand-cream">
                <Icon aria-hidden="true" size={17} strokeWidth={1.35} />
              </span>
              <h3 className="font-serif text-[1.75rem] font-light leading-none text-brand-ivory md:text-[2.15rem]">
                {card.title}
              </h3>
            </div>
          </div>

          <p className="max-w-[46ch] text-sm font-light leading-6 text-brand-cream/72 md:justify-self-end md:text-[15px]">
            {card.description}
          </p>
        </div>
      </div>
    </>
  );
}

interface StackedServiceCardProps {
  card: ServiceCard;
  index: number;
  progress: MotionValue<number>;
}

function StackedServiceCard({ card, index, progress }: StackedServiceCardProps) {
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
      className="absolute inset-0 isolate overflow-hidden rounded-2xl border border-brand-cream/16 bg-brand-deep-forest shadow-[0_28px_90px_rgba(0,0,0,0.48)]"
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
              className="relative isolate h-[30rem] overflow-hidden rounded-2xl border border-brand-cream/16 bg-brand-deep-forest"
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

      <div className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-hidden px-5 pb-4 pt-5 md:top-16 md:h-[calc(100svh-4rem)] md:px-10 md:pb-7 md:pt-6 lg:px-16">
        <div className="mx-auto flex h-full max-w-[90rem] flex-col">
          <SectionHeading />

          <div className="relative mt-4 min-h-0 flex-1 md:mt-6">
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
