import { motion } from "motion/react";
import { useReducedMotionPref, CornerMarkers } from "./MotionProvider";
import CinematicVideoBackground from "./motion/CinematicVideoBackground";
import { HERO_VIDEO } from "../data/visualJourney";
import { VEHICLE_META, whatsappLink, emailLink, type BookingState } from "../lib/bookingRequest";

interface HeroCommandDeckProps {
  booking: BookingState;
  onBookingChange: (patch: Partial<BookingState>) => void;
  onRequestScroll: () => void;
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const TRUST_LINE = [
  "Zürich-based",
  "BMW i7",
  "Mercedes V-Class",
  "Switzerland & selected European routes"
];

/**
 * Section 01 — the Booking Hero. First screen exists only for the order: a
 * clean cinematic background (slow breathe) behind a booking panel that is the
 * visual focus. No manifesto, no long positioning paragraph — the client lands,
 * understands it is private chauffeur booking in Zürich, and sends the request
 * by WhatsApp or email. The panel shares App-level booking state, so anything
 * entered here is already prefilled in the final request form.
 */
export default function HeroCommandDeck({
  booking,
  onBookingChange,
  onRequestScroll
}: HeroCommandDeckProps) {
  const isReduced = useReducedMotionPref();

  const labelClass =
    "mb-2 block text-[10px] font-mono uppercase tracking-[0.22em] text-brand-stone";
  const fieldClass =
    "w-full border border-brand-cream/12 bg-brand-black/60 px-4 py-3.5 text-sm font-light text-brand-ivory transition-colors placeholder:text-brand-stone/50 focus:border-brand-gold/60 focus:outline-none";

  const reveal = (delay: number) =>
    isReduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: EASE }
        };

  return (
    <section className="relative min-h-[100svh] overflow-hidden border-b border-brand-cream/10 bg-brand-black luxury-noise">
      {/* Cinematic background — the outer layer holds a gentle infinite breathe
          so the frame is never static; the inner layer is the poster-first
          video. Clean by design: car / airport / arrival, no clutter. */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={isReduced ? undefined : { scale: [1.04, 1.12, 1.04] }}
        transition={
          isReduced
            ? undefined
            : { duration: 22, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <CinematicVideoBackground
          slot={HERO_VIDEO}
          overlay={false}
          priority
          mediaClassName="object-center grayscale-[0.04] brightness-[0.92] contrast-[1.12]"
        />
      </motion.div>

      {/* Legibility gradients — anchor the panel in the darker left/bottom. */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-brand-black/88 via-brand-black/45 to-brand-black/10" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-brand-black/92 via-transparent to-brand-black/40" />

      <div className="relative z-20 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center gap-12 px-6 pb-16 pt-28 md:px-12 lg:flex-row lg:items-center lg:gap-16 lg:px-24 lg:pt-24">
        {/* Left — the short headline and supporting line only. */}
        <div className="max-w-xl lg:flex-1">
          <motion.span
            {...reveal(0.05)}
            className="mb-5 block font-mono text-[11px] uppercase tracking-[0.32em] text-brand-gold"
          >
            Private Chauffeur Service Zürich
          </motion.span>

          <motion.h1
            {...reveal(0.15)}
            className="font-serif text-[clamp(2.4rem,5.5vw,4rem)] font-light leading-[1.08] text-brand-ivory"
          >
            Private Chauffeur
            <br />
            <span className="italic text-brand-stone">Service Zürich</span>
          </motion.h1>

          <motion.p
            {...reveal(0.28)}
            className="mt-6 max-w-md text-base font-light leading-relaxed text-brand-body lg:text-lg"
          >
            Book a discreet transfer with ALAIR NOIR.
          </motion.p>

          <motion.div
            {...reveal(0.4)}
            className="mt-8 flex flex-wrap gap-x-5 gap-y-2.5"
          >
            {TRUST_LINE.map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-brand-cream/40" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-ivory/80">
                  {item}
                </span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right — the booking panel, the focus of the screen. Soft upward
            reveal on load. */}
        <motion.aside
          initial={isReduced ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: isReduced ? 0 : 0.5, ease: EASE }}
          className="relative w-full max-w-md self-center border border-brand-cream/15 bg-brand-deep-forest/55 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-md md:p-8 lg:w-[420px]"
          aria-label="Booking request"
        >
          <CornerMarkers />

          <div className="mb-6 flex items-center justify-between border-b border-brand-cream/10 pb-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-brand-cream">
              Request a Transfer
            </span>
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-brand-stone">
              Zürich
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="hero-route" className={labelClass}>
                Route
              </label>
              <input
                id="hero-route"
                type="text"
                placeholder="Zürich Airport → Baur au Lac"
                value={booking.route}
                onChange={(e) => onBookingChange({ route: e.target.value })}
                className={fieldClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="hero-date" className={labelClass}>
                  Date
                </label>
                <input
                  id="hero-date"
                  type="date"
                  value={booking.date}
                  onChange={(e) => onBookingChange({ date: e.target.value })}
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="hero-time" className={labelClass}>
                  Time
                </label>
                <input
                  id="hero-time"
                  type="time"
                  value={booking.time}
                  onChange={(e) => onBookingChange({ time: e.target.value })}
                  className={fieldClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="hero-passengers" className={labelClass}>
                  Passengers
                </label>
                <select
                  id="hero-passengers"
                  value={booking.passengers}
                  onChange={(e) => onBookingChange({ passengers: e.target.value })}
                  className={`${fieldClass} cursor-pointer`}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5+</option>
                </select>
              </div>
              <div>
                <label htmlFor="hero-vehicle" className={labelClass}>
                  Vehicle
                </label>
                <select
                  id="hero-vehicle"
                  value={booking.vehicle}
                  onChange={(e) => onBookingChange({ vehicle: e.target.value })}
                  className={`${fieldClass} cursor-pointer`}
                >
                  {Object.entries(VEHICLE_META).map(([id, meta]) => (
                    <option key={id} value={id}>
                      {meta.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-7 space-y-3">
            <a
              href={whatsappLink(booking)}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-brand-gold py-4 text-center text-xs font-mono font-semibold uppercase tracking-[0.18em] text-brand-black transition-colors duration-200 hover:bg-brand-ivory"
            >
              Request by WhatsApp
            </a>
            <a
              href={emailLink(booking)}
              className="block w-full border border-brand-cream/30 py-4 text-center text-xs font-mono uppercase tracking-[0.18em] text-brand-cream transition-colors duration-200 hover:border-brand-cream/60 hover:bg-brand-cream/5"
            >
              Request by Email
            </a>
          </div>

          <button
            type="button"
            onClick={onRequestScroll}
            className="mt-4 flex w-full items-center justify-center gap-2 text-[9px] font-mono uppercase tracking-[0.24em] text-brand-stone transition-colors duration-200 hover:text-brand-cream focus:outline-none"
          >
            Add luggage, contact &amp; notes
            <span aria-hidden="true">↓</span>
          </button>
        </motion.aside>
      </div>
    </section>
  );
}
