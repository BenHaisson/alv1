import type { LucideIcon } from "lucide-react";
import { CalendarClock, DoorOpen, PlaneLanding, Route } from "lucide-react";
import { motion, type Variants } from "motion/react";
import { imageAssets } from "../assets";
import { useReducedMotionPref } from "./MotionProvider";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface ServiceCard {
  label: string;
  title: string;
  description: string;
  image: string;
  icon: LucideIcon;
  imagePosition?: string;
}

const SERVICE_CARDS: ServiceCard[] = [
  {
    label: "Private",
    title: "Private arrivals",
    description: "Your chauffeur is already waiting. No queues, no uncertainty, no delay.",
    image: imageAssets.chauffeurDoorHotelNight,
    icon: DoorOpen,
    imagePosition: "center"
  },
  {
    label: "Precision",
    title: "Executive schedules",
    description: "Built around your agenda, with discreet waiting and flexible departures.",
    image: imageAssets.bmwI7Departure,
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

const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.12
    }
  }
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 34,
    clipPath: "inset(0 0 12% 0)"
  },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.9, ease: EASE }
  }
};

const imageVariants: Variants = {
  rest: { scale: 1.02, y: "0%" },
  hover: {
    scale: 1.075,
    y: "-1.2%",
    transition: {
      type: "spring",
      stiffness: 105,
      damping: 24,
      mass: 1.05
    }
  }
};

const accentVariants: Variants = {
  rest: { scaleX: 0.22, opacity: 0.72 },
  hover: {
    scaleX: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 135,
      damping: 27,
      mass: 0.9
    }
  }
};

export default function NotForEveryone() {
  const isReduced = useReducedMotionPref();

  return (
    <section className="relative overflow-hidden border-b border-brand-cream/10 bg-brand-black px-6 py-24 md:px-12 md:py-32 lg:px-24 lg:py-36 luxury-noise">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 border-t border-brand-cream/12 pt-7 md:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] md:gap-12 md:pt-9">
          <motion.div
            initial={isReduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.72, ease: EASE }}
            className="flex items-center gap-4 self-start"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand-gold">
              02
            </span>
            <span className="h-px w-10 bg-brand-cream/25" aria-hidden="true" />
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand-stone">
              Private mobility
            </span>
          </motion.div>

          <div>
            <motion.h2
              initial={isReduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.82, ease: EASE }}
              className="max-w-3xl font-serif text-[clamp(2.75rem,5.2vw,5rem)] font-light leading-[0.98] text-brand-ivory"
            >
              Not for everyone.
              <br />
              <span className="italic text-brand-stone">For you.</span>
            </motion.h2>
            <motion.p
              initial={isReduced ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.76, delay: isReduced ? 0 : 0.1, ease: EASE }}
              className="mt-6 max-w-xl text-sm font-light leading-7 text-brand-body md:text-base"
            >
              Four ways to move with certainty. Each journey is prepared around your time,
              privacy, and destination.
            </motion.p>
          </div>
        </div>

        <motion.div
          variants={isReduced ? undefined : gridVariants}
          initial={isReduced ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          className="mt-14 grid gap-5 md:mt-20 md:grid-cols-2 md:gap-6 lg:grid-cols-4"
        >
          {SERVICE_CARDS.map((card) => {
            const Icon = card.icon;

            return (
              <motion.article
                key={card.title}
                variants={isReduced ? undefined : cardVariants}
                className="group relative isolate min-h-[31rem] overflow-hidden border border-brand-cream/14 bg-brand-deep-forest md:min-h-[34rem]"
              >
                <motion.div
                  initial="rest"
                  animate="rest"
                  whileHover={isReduced ? undefined : "hover"}
                  className="absolute inset-0"
                >
                  <motion.img
                    src={card.image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    variants={isReduced ? undefined : imageVariants}
                    className="absolute inset-0 h-full w-full object-cover brightness-[0.74] contrast-[1.06]"
                    style={{ objectPosition: card.imagePosition }}
                  />

                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,8,6,0.08)_0%,rgba(5,8,6,0.12)_34%,rgba(5,8,6,0.82)_68%,rgba(5,8,6,0.98)_100%)]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(250,248,245,0.02)]"
                  />

                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                    <div className="flex items-center gap-3">
                      <motion.span
                        aria-hidden="true"
                        variants={isReduced ? undefined : accentVariants}
                        className="h-px w-12 origin-left bg-brand-gold"
                      />
                      <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-brand-cream/65">
                        {card.label}
                      </span>
                    </div>

                    <div className="mt-5 flex items-start gap-3.5">
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-brand-cream/22 bg-brand-black/35 text-brand-cream backdrop-blur-sm">
                        <Icon aria-hidden="true" size={17} strokeWidth={1.35} />
                      </span>
                      <h3 className="max-w-[12ch] font-serif text-2xl font-light leading-[1.05] text-brand-ivory md:text-[1.7rem]">
                        {card.title}
                      </h3>
                    </div>
                    <p className="mt-4 max-w-[30ch] text-[13px] font-light leading-6 text-brand-body">
                      {card.description}
                    </p>
                  </div>
                </motion.div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
