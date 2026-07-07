import { motion } from "motion/react";
import { imageAssets } from "../assets";
import { CornerMarkers, useReducedMotionPref } from "./MotionProvider";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Section 02 — "NOT FOR EVERYONE. FOR YOU."
 * The short emotional identity that gives premium positioning. One sentence and
 * four small visual cards — no paragraphs. Kept deliberately calm so the booking
 * flow stays the focus.
 */
const BRAND_CARDS = [
  { title: "Private arrivals", image: imageAssets.chauffeurDoorHotelNight },
  { title: "Executive schedules", image: imageAssets.bmwI7Departure },
  { title: "Airport transfers", image: imageAssets.zurichAirportArrival },
  { title: "Long-distance routes", image: imageAssets.bmwI7AlpineCruise }
];

export default function NotForEveryone() {
  const isReduced = useReducedMotionPref();

  return (
    <section className="relative overflow-hidden border-b border-brand-cream/10 bg-brand-black px-6 py-24 md:px-12 md:py-32 lg:px-24 luxury-noise">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <motion.h2
            initial={isReduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="font-serif text-4xl font-light leading-[1.05] tracking-tight text-brand-ivory md:text-5xl lg:text-6xl"
          >
            Not for everyone.
            <br />
            <span className="italic text-brand-stone">For you.</span>
          </motion.h2>
          <motion.p
            initial={isReduced ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="mt-6 max-w-lg text-base font-light leading-relaxed text-brand-body"
          >
            For clients who value timing, privacy, and quiet control before they arrive.
          </motion.p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 md:mt-16 md:gap-6 lg:grid-cols-4">
          {BRAND_CARDS.map((card, index) => (
            <motion.article
              key={card.title}
              initial={isReduced ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: isReduced ? 0 : index * 0.08, ease: EASE }}
              className="group relative aspect-[4/5] overflow-hidden border border-brand-cream/12 bg-brand-black"
            >
              <img
                src={card.image}
                alt={card.title}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="absolute inset-0 h-full w-full object-cover brightness-[0.72] transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/30 to-transparent" />
              <CornerMarkers tone="cream" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-serif text-lg font-light leading-tight text-brand-ivory md:text-xl">
                  {card.title}
                </h3>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
