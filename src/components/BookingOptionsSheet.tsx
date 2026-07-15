import { useEffect, useRef, useState, type WheelEvent } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { X } from "lucide-react";
import {
  VEHICLE_META,
  durationLabelFor,
  emailLink,
  locationText,
  whatsappLink,
  type BookingState
} from "../lib/bookingRequest";
import { CornerMarkers, useMediaQuery, useReducedMotionPref } from "./MotionProvider";
import { MOTION_DURATION, MOTION_EASE, PREMIUM_SPRING } from "../lib/motion";
import BrandLockup from "./BrandLockup";

interface BookingOptionsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingState;
  onBookingChange: (patch: Partial<BookingState>) => void;
}

const TO_BE_CONFIRMED = "To be confirmed";

function passengerLabel(value: string): string {
  return `${value} ${value === "1" ? "Passenger" : "Passengers"}`;
}

function luggageLabel(value: string): string {
  if (value === "0") return "No luggage";
  return `${value} ${value === "1" ? "bag" : "bags"}`;
}

/**
 * "View options" — a full booking-results panel that slides up over the
 * hero, app-style. Not a centered popup: near-full-height, full-width,
 * scrollable, with a sticky trip summary up top and (on desktop) a sticky
 * request-review rail on the right. Vehicle choice, passenger details, and
 * the WhatsApp/email actions all live here — no navigation, no reload.
 */
export default function BookingOptionsSheet({
  isOpen,
  onClose,
  booking,
  onBookingChange
}: BookingOptionsSheetProps) {
  const isReduced = useReducedMotionPref();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [isCopied, setIsCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollBodyRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const isHourly = booking.tripType === "hourly";
  const pickupText = locationText(booking.pickup) || TO_BE_CONFIRMED;
  const destinationText = locationText(booking.destination) || TO_BE_CONFIRMED;
  const routeText = isHourly ? pickupText : `${pickupText} → ${destinationText}`;
  const dateText = booking.date || TO_BE_CONFIRMED;
  const timeText = booking.time || TO_BE_CONFIRMED;
  const vehicleMeta = VEHICLE_META[booking.vehicle] ?? VEHICLE_META["bmw-i7"];

  // Lock page scroll behind the panel while it's open; internal scroll stays local.
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // ESC closes, same as clicking the backdrop or the close button.
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => !element.hasAttribute("aria-hidden"));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const previousActive = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();
    return () => previousActive?.focus();
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(buildTransferSummary());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  function buildTransferSummary() {
    const lines = [
      `Route      : ${routeText}`,
      isHourly ? `Duration   : ${durationLabelFor(booking.duration)}` : null,
      `Date       : ${dateText}`,
      `Pickup time: ${timeText}`,
      booking.flightNumber.trim() ? `Flight     : ${booking.flightNumber.trim()}` : null,
      `Vehicle    : ${vehicleMeta.label}`,
      `Passengers : ${passengerLabel(booking.passengers)}`,
      `Luggage    : ${luggageLabel(booking.luggage)}`
    ].filter((line): line is string => Boolean(line));
    return lines.join("\n");
  }

  // Best-effort swipe-down-to-close on mobile — the drag zone is the header
  // only, so the panel's internal content keeps native touch scrolling.
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 90 || info.velocity.y > 600) onClose();
  };

  const handleDialogWheel = (event: WheelEvent<HTMLDivElement>) => {
    const scrollBody = scrollBodyRef.current;
    if (!scrollBody || scrollBody.contains(event.target as Node)) return;
    event.preventDefault();
    event.stopPropagation();
    scrollBody.scrollTop += event.deltaY;
  };

  const labelClass = "mb-2 block text-[10px] font-mono uppercase tracking-widest text-brand-stone";
  const inputClass =
    "w-full border border-brand-cream/12 bg-brand-black/60 p-3.5 text-sm font-light text-brand-ivory placeholder:text-brand-stone/55 focus:border-brand-gold/60 focus:outline-none";

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
            className="fixed inset-0 z-[9995] bg-black/80 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Choose your ALAIR NOIR experience"
            data-lenis-prevent
            data-lenis-prevent-wheel
            data-lenis-prevent-touch
            onWheel={handleDialogWheel}
            initial={isReduced ? { opacity: 0 } : { y: "100%" }}
            animate={isReduced ? { opacity: 1 } : { y: 0 }}
            exit={isReduced ? { opacity: 0 } : { y: "100%" }}
            transition={{ duration: MOTION_DURATION.base, ease: MOTION_EASE }}
            className="fixed inset-x-0 bottom-0 z-[9996] flex h-[94vh] flex-col overflow-hidden border-t border-brand-cream/15 bg-brand-deep-forest shadow-[0_-30px_90px_rgba(0,0,0,0.65)] luxury-noise md:h-[90vh]"
          >
            {/* Header — drag handle (mobile swipe-to-close), Hide options, close. */}
            <motion.div
              drag={!isDesktop && !isReduced ? "y" : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={handleDragEnd}
              className="relative flex flex-col border-b border-brand-cream/10 bg-brand-deep-forest"
            >
              <div className="flex justify-center pt-2.5 md:hidden" aria-hidden="true">
                <span className="h-1 w-10 rounded-full bg-brand-cream/25" />
              </div>
              <div className="flex items-center justify-between gap-4 px-6 py-4 md:px-10">
                <CornerMarkers tone="cream" />
                <BrandLockup size="compact" align="center" />
                <div className="flex items-center gap-5">
                  <motion.button
                    type="button"
                    onClick={onClose}
                    whileHover={isReduced ? undefined : { color: "#EADECE" }}
                    transition={PREMIUM_SPRING}
                    className="hidden cursor-pointer text-[10px] font-mono uppercase tracking-[0.2em] text-brand-stone sm:inline"
                  >
                    Hide options
                  </motion.button>
                  <motion.button
                    ref={closeButtonRef}
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    whileHover={isReduced ? undefined : { y: -1, borderColor: "rgba(205,162,80,0.9)", color: "#CDA250" }}
                    whileTap={isReduced ? undefined : { scale: 0.96 }}
                    transition={PREMIUM_SPRING}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center border border-brand-cream/20 text-brand-cream"
                  >
                    <X aria-hidden="true" size={15} strokeWidth={1.7} />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Sticky trip summary — what's already in the booking bar. */}
            <div className="sticky top-0 z-10 border-b border-brand-cream/10 bg-brand-deep-forest/95 px-6 py-4 backdrop-blur-md md:px-10">
              <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="col-span-2 sm:col-span-1">
                  <span className={labelClass}>{isHourly ? "Pickup" : "Route"}</span>
                  <p className="text-xs font-light leading-snug text-brand-ivory">{routeText}</p>
                </div>
                <div>
                  <span className={labelClass}>Date</span>
                  <p className="text-xs font-light text-brand-ivory">{dateText}</p>
                </div>
                <div>
                  <span className={labelClass}>Pickup time</span>
                  <p className="text-xs font-light text-brand-ivory">{timeText}</p>
                </div>
                {booking.flightNumber.trim() && (
                  <div>
                    <span className={labelClass}>Flight number</span>
                    <p className="text-xs font-light text-brand-ivory">{booking.flightNumber}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Scrollable body. */}
            <div
              ref={scrollBodyRef}
              data-lenis-prevent
              data-lenis-prevent-wheel
              data-lenis-prevent-touch
              onWheel={(event) => event.stopPropagation()}
              onTouchMove={(event) => event.stopPropagation()}
              className="flex-1 overflow-y-auto overscroll-contain"
            >
              <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-10">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
                  {/* Left — vehicle choice + passenger details. */}
                  <div>
                    <h2 className="font-serif text-2xl font-light tracking-tight text-brand-ivory md:text-4xl">
                      Requirements and quotation
                    </h2>
                    <p className="mt-3 max-w-xl text-sm font-light leading-relaxed text-brand-body md:text-base">
                      Add the passenger details, choose the vehicle and send the route for a fixed quotation.
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-px border border-brand-cream/12 bg-brand-cream/12 sm:grid-cols-4">
                      {["Airport handling included", "Flight monitoring included", "Complimentary waiting period", "Taxes & standard fees included"].map((item) => (
                        <div key={item} className="bg-brand-deep-forest px-3 py-4 text-[9px] font-mono uppercase leading-relaxed tracking-[0.12em] text-brand-cream/72">
                          {item}
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                      {Object.entries(VEHICLE_META).map(([id, meta]) => {
                        const isActive = booking.vehicle === id;
                        return (
                          <article
                            key={id}
                            className={`flex flex-col overflow-hidden border bg-brand-black/40 ${
                              isActive ? "border-brand-gold" : "border-brand-cream/12"
                            }`}
                          >
                            <div className="relative aspect-[16/10] overflow-hidden">
                              <img
                                src={meta.image}
                                alt={meta.label}
                                loading="lazy"
                                decoding="async"
                                referrerPolicy="no-referrer"
                                className="h-full w-full object-cover brightness-[0.92]"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/70 via-transparent to-transparent" />
                            </div>
                            <div className="flex flex-1 flex-col gap-3 p-5">
                              <div>
                                <h3 className="font-serif text-xl text-brand-ivory">{meta.label}</h3>
                                <span className="mt-1 block text-[10px] font-mono uppercase tracking-[0.2em] text-brand-stone">
                                  {meta.caption}
                                </span>
                              </div>
                              <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-brand-gold/85">
                                {meta.capacity}
                              </span>
                              <p className="text-xs font-light leading-relaxed text-brand-body">
                                {meta.description}
                              </p>
                              <motion.button
                                type="button"
                                onClick={() => onBookingChange({ vehicle: id })}
                                aria-pressed={isActive}
                                whileHover={isReduced ? undefined : { y: -2 }}
                                whileTap={isReduced ? undefined : { scale: 0.985 }}
                                transition={PREMIUM_SPRING}
                                className={`mt-auto cursor-pointer border py-3 text-center text-[10px] font-mono font-semibold uppercase tracking-[0.18em] focus:outline-none focus-visible:border-brand-gold ${
                                  isActive
                                    ? "border-brand-gold bg-brand-gold text-brand-black"
                                    : "border-brand-cream/25 text-brand-cream"
                                }`}
                              >
                                {isActive ? "Selected" : meta.cta}
                              </motion.button>
                            </div>
                          </article>
                        );
                      })}
                    </div>

                    <div className="mt-10 space-y-5 border-t border-brand-cream/10 pt-8">
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
                        <label htmlFor="sheet-flight" className={labelClass}>
                          Flight number (when relevant)
                        </label>
                        <input
                          id="sheet-flight"
                          type="text"
                          placeholder="e.g. LX 2806"
                          value={booking.flightNumber}
                          onChange={(event) => onBookingChange({ flightNumber: event.target.value })}
                          className={inputClass}
                        />
                      </div>

                      <div className="border-t border-brand-cream/10 pt-7">
                        <span className="mb-5 block text-[10px] font-mono uppercase tracking-[0.2em] text-brand-cream">Contact and quotation</span>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="sm:col-span-2">
                            <label htmlFor="sheet-name" className={labelClass}>Name</label>
                            <input id="sheet-name" type="text" placeholder="Full name" value={booking.name} onChange={(event) => onBookingChange({ name: event.target.value })} className={inputClass} />
                          </div>
                          <div>
                            <label htmlFor="sheet-phone" className={labelClass}>Phone or WhatsApp</label>
                            <input id="sheet-phone" type="tel" placeholder="+41…" value={booking.phone} onChange={(event) => onBookingChange({ phone: event.target.value })} className={inputClass} />
                          </div>
                          <div>
                            <label htmlFor="sheet-email" className={labelClass}>Email</label>
                            <input id="sheet-email" type="email" placeholder="name@office.com" value={booking.email} onChange={(event) => onBookingChange({ email: event.target.value })} className={inputClass} />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="sheet-notes" className={labelClass}>
                          Child seat, special instructions or planned stops
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
                    </div>
                  </div>

                  {/* Right — desktop request review + actions (sticky). */}
                  <aside className="hidden lg:block">
                    <div className="sticky top-4 border border-brand-cream/12 bg-brand-black/40 p-6">
                      <CornerMarkers />
                      <span className="mb-5 block text-[11px] font-mono uppercase tracking-[0.24em] text-brand-cream">
                        Your transfer request
                      </span>

                      <dl className="space-y-3.5 border-b border-brand-cream/10 pb-5">
                        {[
                          ["Route", routeText],
                          ...(isHourly ? [["Duration", durationLabelFor(booking.duration)]] : []),
                          ["Date", dateText],
                          ["Pickup time", timeText],
                          ...(booking.flightNumber.trim() ? [["Flight number", booking.flightNumber.trim()]] : []),
                          ["Vehicle", vehicleMeta.label],
                          ["Passengers", passengerLabel(booking.passengers)],
                          ["Luggage", luggageLabel(booking.luggage)]
                        ].map(([term, value]) => (
                          <div key={term} className="flex items-start justify-between gap-4">
                            <dt className="text-[10px] font-mono uppercase tracking-[0.18em] text-brand-stone">
                              {term}
                            </dt>
                            <dd className="max-w-[60%] text-right text-xs font-light text-brand-ivory">
                              {value}
                            </dd>
                          </div>
                        ))}
                      </dl>

                      <p className="mt-5 text-[11px] font-light leading-relaxed text-brand-stone">
                        Route received. A fixed quotation will be confirmed before the journey.
                      </p>

                      <div className="mt-6 space-y-3">
                        <motion.a
                          href={whatsappLink(booking)}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={isReduced ? undefined : { y: -1, backgroundColor: "#FAF8F5" }}
                          whileTap={isReduced ? undefined : { scale: 0.985 }}
                          transition={PREMIUM_SPRING}
                          className="block bg-brand-gold py-3.5 text-center text-xs font-mono font-semibold uppercase tracking-[0.14em] text-brand-black"
                        >
                          Request by WhatsApp
                        </motion.a>
                        <motion.a
                          href={emailLink(booking)}
                          whileHover={isReduced ? undefined : { y: -1, borderColor: "rgba(234,222,206,0.6)" }}
                          whileTap={isReduced ? undefined : { scale: 0.985 }}
                          transition={PREMIUM_SPRING}
                          className="block border border-brand-cream/30 py-3.5 text-center text-xs font-mono uppercase tracking-[0.14em] text-brand-cream"
                        >
                          Request by Email
                        </motion.a>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <motion.button
                          type="button"
                          onClick={handleCopy}
                          whileHover={isReduced ? undefined : { color: "#EADECE" }}
                          whileTap={isReduced ? undefined : { scale: 0.985 }}
                          transition={PREMIUM_SPRING}
                          className="cursor-pointer text-[10px] font-mono uppercase tracking-[0.16em] text-brand-stone focus:outline-none"
                        >
                          {isCopied ? "Request Copied" : "Copy Request"}
                        </motion.button>
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            </div>

            {/* Mobile — sticky request actions at the bottom (desktop has them in the rail). */}
            <div className="border-t border-brand-cream/10 bg-brand-deep-forest px-6 py-4 lg:hidden">
              <div className="grid grid-cols-2 gap-3">
                <motion.a
                  href={whatsappLink(booking)}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={isReduced ? undefined : { scale: 0.985 }}
                  transition={PREMIUM_SPRING}
                  className="block bg-brand-gold py-3.5 text-center text-xs font-mono font-semibold uppercase tracking-[0.14em] text-brand-black"
                >
                  Request by WhatsApp
                </motion.a>
                <motion.a
                  href={emailLink(booking)}
                  whileTap={isReduced ? undefined : { scale: 0.985 }}
                  transition={PREMIUM_SPRING}
                  className="block border border-brand-cream/30 py-3.5 text-center text-xs font-mono uppercase tracking-[0.14em] text-brand-cream"
                >
                  Request by Email
                </motion.a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
