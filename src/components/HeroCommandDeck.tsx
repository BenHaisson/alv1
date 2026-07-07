import { motion } from "motion/react";
import { useReducedMotionPref, CornerMarkers } from "./MotionProvider";
import CinematicVideoBackground from "./motion/CinematicVideoBackground";
import { HERO_VIDEO } from "../data/visualJourney";
import {
  whatsappLink,
  emailLink,
  DURATION_OPTIONS,
  type BookingState,
  type TripType
} from "../lib/bookingRequest";

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
  "Private & pre-arranged"
];

const TRIP_TABS: { id: TripType; label: string }[] = [
  { id: "one-way", label: "One way" },
  { id: "hourly", label: "By the hour" }
];

/**
 * Section 01 — the Booking Hero. One full-screen cinematic image with a dark
 * readable overlay behind a centered headline and a compact horizontal booking
 * bar — the single instrument the client needs to start a request. No
 * side-panel, no manifesto. The bar shares App-level booking state, so
 * anything entered here is already prefilled in the final request form.
 */
export default function HeroCommandDeck({
  booking,
  onBookingChange,
  onRequestScroll
}: HeroCommandDeckProps) {
  const isReduced = useReducedMotionPref();

  const reveal = (delay: number) =>
    isReduced
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: EASE }
        };

  const fieldLabelClass =
    "text-[9px] font-mono uppercase tracking-[0.22em] text-brand-stone transition-colors duration-200 group-focus-within:text-brand-gold";
  const fieldInputClass =
    "w-full bg-transparent text-sm font-light text-brand-ivory placeholder:text-brand-stone/45 focus:outline-none";

  return (
    <section className="relative min-h-[100svh] overflow-hidden border-b border-brand-cream/10 bg-brand-black luxury-noise">
      {/* Cinematic background — one full-bleed image/video with a gentle
          infinite breathe so the frame is never static. Clean by design: car /
          airport / arrival, no clutter. */}
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
          mediaClassName="object-center grayscale-[0.04] brightness-[0.82] contrast-[1.12]"
        />
      </motion.div>

      {/* Dark readable overlay — uniform enough to hold centered text over any
          part of the frame, deepened toward the edges for the header and bar. */}
      <div className="absolute inset-0 z-10 bg-black/42" />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-brand-black/72 via-transparent to-brand-black/85" />

      <div className="relative z-20 flex min-h-[100svh] flex-col items-center justify-center px-6 pb-14 pt-32 text-center md:px-12">
        <motion.h1
          {...reveal(0.1)}
          className="font-serif text-[clamp(2.6rem,6vw,4.5rem)] font-light leading-[1.08] text-brand-ivory"
        >
          Your chauffeur
          <br />
          <span className="italic text-brand-stone">is ready.</span>
        </motion.h1>

        <motion.p
          {...reveal(0.24)}
          className="mx-auto mt-6 max-w-xl text-base font-light leading-relaxed text-brand-body lg:text-lg"
        >
          Private transfers in Zürich, tailored for airport arrivals, business travel, and
          discreet city movements.
        </motion.p>

        {/* Booking bar — the single compact instrument. Tabs on top, four
            fields and the primary CTA in one hairline-divided row. */}
        <motion.div
          {...reveal(0.42)}
          className="relative mt-10 w-full max-w-5xl border border-brand-cream/15 bg-brand-deep-forest/60 text-left shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-md"
          aria-label="Booking request"
        >
          <CornerMarkers />

          {/* Trip type tabs */}
          <div className="flex items-center gap-2 px-4 pt-4 md:px-5">
            {TRIP_TABS.map((tab) => {
              const isActive = booking.tripType === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onBookingChange({ tripType: tab.id })}
                  aria-pressed={isActive}
                  className={`cursor-pointer px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-[0.18em] transition-colors duration-200 focus:outline-none focus-visible:text-brand-gold ${
                    isActive
                      ? "bg-brand-gold text-brand-black"
                      : "text-brand-stone hover:text-brand-cream"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Fields + CTA — one continuous instrument, hairline-divided. The
              second slot swaps between Destination (one-way) and Duration
              (hourly) with the trip type tabs above. */}
          <div className="mt-4 grid grid-cols-1 divide-y divide-brand-cream/10 border-t border-brand-cream/10 md:grid-cols-[1.05fr_1.05fr_0.8fr_0.9fr_0.8fr_auto] md:divide-x md:divide-y-0">
            <div className="group px-4 py-3.5 transition-colors duration-200 focus-within:bg-brand-cream/[0.03] md:px-5 md:py-4">
              <label htmlFor="hero-pickup" className={fieldLabelClass}>
                Pickup location
              </label>
              <input
                id="hero-pickup"
                type="text"
                placeholder="Zürich Airport (ZRH)"
                value={booking.pickup}
                onChange={(e) => onBookingChange({ pickup: e.target.value })}
                className={`${fieldInputClass} mt-1.5`}
              />
            </div>

            {booking.tripType === "hourly" ? (
              <div className="group px-4 py-3.5 transition-colors duration-200 focus-within:bg-brand-cream/[0.03] md:px-5 md:py-4">
                <label htmlFor="hero-duration" className={fieldLabelClass}>
                  Duration
                </label>
                <select
                  id="hero-duration"
                  value={booking.duration}
                  onChange={(e) => onBookingChange({ duration: e.target.value })}
                  className={`${fieldInputClass} mt-1.5 cursor-pointer`}
                >
                  {DURATION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="bg-brand-deep-forest text-brand-ivory">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="group px-4 py-3.5 transition-colors duration-200 focus-within:bg-brand-cream/[0.03] md:px-5 md:py-4">
                <label htmlFor="hero-destination" className={fieldLabelClass}>
                  Destination
                </label>
                <input
                  id="hero-destination"
                  type="text"
                  placeholder="Hotel, address, or landmark"
                  value={booking.destination}
                  onChange={(e) => onBookingChange({ destination: e.target.value })}
                  className={`${fieldInputClass} mt-1.5`}
                />
              </div>
            )}

            <div className="group px-4 py-3.5 transition-colors duration-200 focus-within:bg-brand-cream/[0.03] md:px-5 md:py-4">
              <label htmlFor="hero-date" className={fieldLabelClass}>
                Date
              </label>
              <input
                id="hero-date"
                type="date"
                placeholder="Select date"
                value={booking.date}
                onChange={(e) => onBookingChange({ date: e.target.value })}
                className={`${fieldInputClass} mt-1.5`}
              />
            </div>

            <div className="group px-4 py-3.5 transition-colors duration-200 focus-within:bg-brand-cream/[0.03] md:px-5 md:py-4">
              <label htmlFor="hero-flight" className={fieldLabelClass}>
                Flight number
              </label>
              <input
                id="hero-flight"
                type="text"
                placeholder="e.g. LX 225"
                value={booking.flightNumber}
                onChange={(e) => onBookingChange({ flightNumber: e.target.value })}
                className={`${fieldInputClass} mt-1.5`}
              />
            </div>

            <div className="group px-4 py-3.5 transition-colors duration-200 focus-within:bg-brand-cream/[0.03] md:px-5 md:py-4">
              <label htmlFor="hero-time" className={fieldLabelClass}>
                Pickup time
              </label>
              <input
                id="hero-time"
                type="time"
                placeholder="Select time"
                value={booking.time}
                onChange={(e) => onBookingChange({ time: e.target.value })}
                className={`${fieldInputClass} mt-1.5`}
              />
            </div>

            <div className="flex items-center p-3 md:p-2.5">
              <a
                href={whatsappLink(booking)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center whitespace-nowrap bg-brand-gold px-6 py-3.5 text-center text-xs font-mono font-semibold uppercase tracking-[0.16em] text-brand-black transition-colors duration-200 hover:bg-brand-ivory md:w-auto md:py-4"
              >
                Request by WhatsApp
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div {...reveal(0.56)} className="mt-5 flex flex-col items-center gap-3">
          <a
            href={emailLink(booking)}
            className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-cream/85 transition-colors duration-200 hover:text-brand-cream"
          >
            Request by Email
          </a>
          <button
            type="button"
            onClick={onRequestScroll}
            className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.24em] text-brand-stone transition-colors duration-200 hover:text-brand-cream focus:outline-none"
          >
            Add passengers, luggage, vehicle &amp; contact
            <span aria-hidden="true">↓</span>
          </button>
        </motion.div>

        <motion.div {...reveal(0.68)} className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2.5">
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
    </section>
  );
}
