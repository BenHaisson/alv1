import { useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  VEHICLE_META,
  buildRequestText,
  durationLabelFor,
  emailLink,
  locationText,
  whatsappLink,
  type BookingState
} from "../lib/bookingRequest";
import { CornerMarkers, useReducedMotionPref } from "./MotionProvider";

interface BookingOptionsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingState;
  onBookingChange: (patch: Partial<BookingState>) => void;
  /** Optional bridge to the full request section further down the page. */
  onViewFullForm?: () => void;
}

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * "View options" — the bottom sheet the hero booking bar opens instead of
 * navigating anywhere. Shows the route/pickup, date, flight, and time already
 * entered in the bar as a read-only summary, then lets the client finish the
 * request: vehicle, passengers, luggage, contact, and notes, ending in the
 * same WhatsApp/email actions used everywhere else in the booking flow.
 */
export default function BookingOptionsSheet({
  isOpen,
  onClose,
  booking,
  onBookingChange,
  onViewFullForm
}: BookingOptionsSheetProps) {
  const isReduced = useReducedMotionPref();
  const [isCopied, setIsCopied] = useState(false);

  const isHourly = booking.tripType === "hourly";
  const requestText = buildRequestText(booking);

  const handleCopy = () => {
    navigator.clipboard.writeText(requestText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const labelClass = "mb-2 block text-[10px] font-mono uppercase tracking-widest text-brand-stone";
  const inputClass =
    "w-full border border-brand-cream/12 bg-brand-black/60 p-3.5 text-sm font-light text-brand-ivory transition-colors placeholder:text-brand-stone/55 focus:border-brand-gold/60 focus:outline-none";

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[9995] bg-black/75 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Booking options"
            initial={isReduced ? { opacity: 0 } : { y: "100%" }}
            animate={isReduced ? { opacity: 1 } : { y: 0 }}
            exit={isReduced ? { opacity: 0 } : { y: "100%" }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="fixed inset-x-0 bottom-0 z-[9996] flex max-h-[92vh] flex-col border-t border-brand-cream/15 bg-brand-deep-forest shadow-[0_-20px_70px_rgba(0,0,0,0.6)] luxury-noise md:inset-x-auto md:left-1/2 md:bottom-6 md:w-[560px] md:-translate-x-1/2 md:border"
          >
            <div className="relative flex items-center justify-between border-b border-brand-cream/10 px-6 py-4">
              <CornerMarkers tone="cream" />
              <span className="text-[11px] font-mono uppercase tracking-[0.24em] text-brand-cream">
                View Options
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="cursor-pointer text-brand-stone transition-colors duration-150 hover:text-brand-cream"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* Read-only summary of what's already in the booking bar. */}
              <div className="mb-6 grid grid-cols-2 gap-4 border-b border-brand-cream/10 pb-6 sm:grid-cols-4">
                <div>
                  <span className={labelClass}>{isHourly ? "Pickup" : "Route"}</span>
                  <p className="text-xs font-light leading-snug text-brand-ivory">
                    {isHourly
                      ? locationText(booking.pickup) || "—"
                      : `${locationText(booking.pickup) || "—"} → ${
                          locationText(booking.destination) || "—"
                        }`}
                  </p>
                </div>
                {isHourly && (
                  <div>
                    <span className={labelClass}>Duration</span>
                    <p className="text-xs font-light text-brand-ivory">
                      {durationLabelFor(booking.duration)}
                    </p>
                  </div>
                )}
                <div>
                  <span className={labelClass}>Date</span>
                  <p className="text-xs font-light text-brand-ivory">{booking.date || "—"}</p>
                </div>
                <div>
                  <span className={labelClass}>Pickup time</span>
                  <p className="text-xs font-light text-brand-ivory">{booking.time || "—"}</p>
                </div>
                {booking.flightNumber.trim() && (
                  <div>
                    <span className={labelClass}>Flight number</span>
                    <p className="text-xs font-light text-brand-ivory">{booking.flightNumber}</p>
                  </div>
                )}
              </div>

              <div className="space-y-5">
                {/* Vehicle — a visual choice, two cards. */}
                <div>
                  <span className={labelClass}>Vehicle</span>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {Object.entries(VEHICLE_META).map(([id, meta]) => {
                      const isActive = booking.vehicle === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => onBookingChange({ vehicle: id })}
                          aria-pressed={isActive}
                          className={`flex cursor-pointer flex-col justify-between border p-3.5 text-left transition-all duration-300 focus:outline-none focus-visible:border-brand-gold ${
                            isActive
                              ? "border-brand-gold bg-brand-gold-muted"
                              : "border-brand-cream/12 hover:border-brand-cream/30"
                          }`}
                        >
                          <span className="font-serif text-sm text-brand-ivory">{meta.label}</span>
                          <span className="mt-1 text-[9px] font-mono uppercase tracking-[0.18em] text-brand-stone">
                            {meta.caption}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="sheet-passengers" className={labelClass}>
                      Passengers
                    </label>
                    <select
                      id="sheet-passengers"
                      value={booking.passengers}
                      onChange={(event) => onBookingChange({ passengers: event.target.value })}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="1">1 Passenger</option>
                      <option value="2">2 Passengers</option>
                      <option value="3">3 Passengers</option>
                      <option value="4">4 Passengers</option>
                      <option value="5">5+ Passengers</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="sheet-luggage" className={labelClass}>
                      Luggage
                    </label>
                    <select
                      id="sheet-luggage"
                      value={booking.luggage}
                      onChange={(event) => onBookingChange({ luggage: event.target.value })}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="0">No luggage</option>
                      <option value="1">1 bag</option>
                      <option value="2">2 bags</option>
                      <option value="3">3 bags</option>
                      <option value="4">4 bags</option>
                      <option value="5+">5+ bags</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="sheet-contact" className={labelClass}>
                    Contact (Email / Phone)
                  </label>
                  <input
                    id="sheet-contact"
                    type="text"
                    placeholder="name@office.com or +41…"
                    value={booking.contact}
                    onChange={(event) => onBookingChange({ contact: event.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="sheet-notes" className={labelClass}>
                    Notes / planned stops
                  </label>
                  <textarea
                    id="sheet-notes"
                    rows={3}
                    placeholder="Additional stops, waiting time, or handover instructions…"
                    value={booking.notes}
                    onChange={(event) => onBookingChange({ notes: event.target.value })}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div>
                  <span className={labelClass}>Trip Summary</span>
                  <div className="max-h-[180px] overflow-y-auto whitespace-pre-wrap rounded border border-brand-cream/5 bg-brand-black/90 p-4 font-mono text-[11px] leading-relaxed text-brand-stone select-all">
                    {requestText}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t border-brand-cream/10 px-6 py-5">
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={whatsappLink(booking)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-brand-gold py-3.5 text-center text-xs font-mono font-semibold uppercase tracking-[0.14em] text-brand-black transition-colors duration-200 hover:bg-brand-ivory"
                >
                  Request by WhatsApp
                </a>
                <a
                  href={emailLink(booking)}
                  className="block border border-brand-cream/30 py-3.5 text-center text-xs font-mono uppercase tracking-[0.14em] text-brand-cream transition-colors duration-200 hover:border-brand-cream/60 hover:bg-brand-cream/5"
                >
                  Request by Email
                </a>
              </div>
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="cursor-pointer text-[10px] font-mono uppercase tracking-[0.18em] text-brand-stone transition-colors duration-200 hover:text-brand-cream focus:outline-none"
                >
                  {isCopied ? "Request Copied" : "Copy Request"}
                </button>
                {onViewFullForm && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onViewFullForm();
                    }}
                    className="cursor-pointer text-[10px] font-mono uppercase tracking-[0.18em] text-brand-stone transition-colors duration-200 hover:text-brand-cream focus:outline-none"
                  >
                    View full form ↓
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
