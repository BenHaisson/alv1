import { lazy, Suspense, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CornerMarkers, useReducedMotionPref } from "./MotionProvider";
import PlaceAutocompleteField from "./PlaceAutocompleteField";
import {
  VEHICLE_META,
  DATE_INPUT_PLACEHOLDER,
  DURATION_OPTIONS,
  buildRequestText,
  formatBookingDateInput,
  whatsappLink,
  emailLink,
  vehicleMetaFor,
  type BookingState,
  type TripType
} from "../lib/bookingRequest";

const TRIP_TABS: { id: TripType; label: string }[] = [
  { id: "one-way", label: "One way" },
  { id: "hourly", label: "By the hour" }
];

type MapTarget = "pickup" | "destination" | null;

// Leaflet (+ OSM tiles) only downloads once someone actually opens the map
// picker — a rare interaction — instead of bundling it into the initial load.
const ChooseOnMapModal = lazy(() => import("./ChooseOnMapModal"));

interface RequestDispatchConsoleProps {
  booking: BookingState;
  onBookingChange: (patch: Partial<BookingState>) => void;
}

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * The final booking section — "Request Your Chauffeur". A single calm form
 * (Route, Date, Time, Passengers, Luggage, Vehicle, Contact, Notes) beside a
 * live Trip Summary that updates as fields are filled. Shares App-level booking
 * state, so anything entered in the hero panel arrives already prefilled here.
 */
export default function RequestDispatchConsole({
  booking,
  onBookingChange
}: RequestDispatchConsoleProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [mapTarget, setMapTarget] = useState<MapTarget>(null);
  const [hasOpenedMap, setHasOpenedMap] = useState(false);
  const isReduced = useReducedMotionPref();

  const openMap = (target: Exclude<MapTarget, null>) => {
    setHasOpenedMap(true);
    setMapTarget(target);
  };

  const vehicleMeta = vehicleMetaFor(booking.vehicle);
  const requestText = buildRequestText(booking);
  const ready = booking.pickup.description.trim() !== "" && booking.contact.trim() !== "";

  const handleCopy = () => {
    navigator.clipboard.writeText(requestText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const labelClass = "mb-2 block text-[10px] font-mono uppercase tracking-widest text-brand-stone";
  const inputClass =
    "w-full border border-brand-cream/12 bg-brand-black/60 p-4 text-sm font-light text-brand-ivory transition-colors placeholder:text-brand-stone/55 focus:border-brand-gold/60 focus:outline-none";

  // The request-section nav anchor lives on StackedChapter's flow sentinel in
  // App.tsx — a pinned section would mis-report its own position.
  return (
    <section className="relative overflow-hidden border-b border-brand-cream/10 bg-brand-black px-6 py-24 md:px-12 md:py-32 lg:px-24 luxury-noise">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-12 max-w-3xl md:mb-16">
          <span className="mb-4 block text-xs font-mono uppercase tracking-[0.3em] text-brand-gold">
            Contact
          </span>
          <h2 className="mb-6 font-serif text-3xl font-light tracking-tight text-brand-ivory md:text-5xl lg:text-6xl">
            Request Your Chauffeur
          </h2>
          <p className="text-base font-light leading-relaxed text-brand-body">
            Send your pickup, time, flight number, passengers, luggage, and preferred vehicle. We
            confirm availability and rate directly.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left — the request form */}
          <div className="lg:col-span-7">
            <form onSubmit={(event) => event.preventDefault()} className="space-y-5">
              <div>
                <span className={labelClass}>Trip type</span>
                <div className="flex gap-2">
                  {TRIP_TABS.map((tab) => {
                    const isActive = booking.tripType === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => onBookingChange({ tripType: tab.id })}
                        aria-pressed={isActive}
                        className={`cursor-pointer border px-4 py-2 text-[10px] font-mono uppercase tracking-[0.18em] transition-colors duration-200 focus:outline-none focus-visible:border-brand-gold ${
                          isActive
                            ? "border-brand-gold bg-brand-gold-muted text-brand-cream"
                            : "border-brand-cream/12 text-brand-stone hover:border-brand-cream/30"
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="req-pickup" className={labelClass}>
                    Pickup location
                  </label>
                  <PlaceAutocompleteField
                    id="req-pickup"
                    placeholder="Zürich Airport (ZRH)"
                    value={booking.pickup}
                    onChange={(location) => onBookingChange({ pickup: location })}
                    onOpenMap={() => openMap("pickup")}
                    showCurrentLocation
                    warningInFlow
                    inputClassName={inputClass}
                  />
                </div>
                {booking.tripType === "hourly" ? (
                  <div>
                    <label htmlFor="req-duration" className={labelClass}>
                      Duration
                    </label>
                    <select
                      id="req-duration"
                      value={booking.duration}
                      onChange={(e) => onBookingChange({ duration: e.target.value })}
                      className={`${inputClass} cursor-pointer`}
                    >
                      {DURATION_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="req-destination" className={labelClass}>
                      Destination
                    </label>
                    <PlaceAutocompleteField
                      id="req-destination"
                      placeholder="Hotel, address, or landmark"
                      value={booking.destination}
                      onChange={(location) => onBookingChange({ destination: location })}
                      onOpenMap={() => openMap("destination")}
                      warningInFlow
                      inputClassName={inputClass}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="req-date" className={labelClass}>
                    Date
                  </label>
                  <input
                    id="req-date"
                    type="text"
                    inputMode="numeric"
                    placeholder={DATE_INPUT_PLACEHOLDER}
                    value={booking.date}
                    onChange={(e) => onBookingChange({ date: formatBookingDateInput(e.target.value) })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="req-time" className={labelClass}>
                    Time (Zürich local)
                  </label>
                  <input
                    id="req-time"
                    type="time"
                    value={booking.time}
                    onChange={(e) => onBookingChange({ time: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="req-flight" className={labelClass}>
                  Flight number
                </label>
                <input
                  id="req-flight"
                  type="text"
                  placeholder="e.g. LX 225"
                  value={booking.flightNumber}
                  onChange={(e) => onBookingChange({ flightNumber: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="req-passengers" className={labelClass}>
                    Passengers
                  </label>
                  <select
                    id="req-passengers"
                    value={booking.passengers}
                    onChange={(e) => onBookingChange({ passengers: e.target.value })}
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
                  <label htmlFor="req-luggage" className={labelClass}>
                    Luggage
                  </label>
                  <select
                    id="req-luggage"
                    value={booking.luggage}
                    onChange={(e) => onBookingChange({ luggage: e.target.value })}
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

              {/* Vehicle — a visual choice, two cards. */}
              <div>
                <span className={labelClass}>Vehicle</span>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {Object.entries(VEHICLE_META).map(([id, meta]) => {
                    const isActive = booking.vehicle === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => onBookingChange({ vehicle: id })}
                        aria-pressed={isActive}
                        className={`relative flex cursor-pointer flex-col justify-between overflow-hidden border p-4 text-left transition-all duration-300 focus:outline-none focus-visible:border-brand-gold ${
                          isActive
                            ? "border-brand-gold bg-brand-gold-muted"
                            : "border-brand-cream/12 hover:border-brand-cream/30"
                        }`}
                      >
                        <span className="font-serif text-base text-brand-ivory">{meta.label}</span>
                        <span className="mt-1 text-[9px] font-mono uppercase tracking-[0.18em] text-brand-stone">
                          {meta.caption}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="req-contact" className={labelClass}>
                  Contact (Email / Phone)
                </label>
                <input
                  id="req-contact"
                  type="text"
                  placeholder="name@office.com or +41…"
                  value={booking.contact}
                  onChange={(e) => onBookingChange({ contact: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="req-notes" className={labelClass}>
                  Notes
                </label>
                <textarea
                  id="req-notes"
                  rows={3}
                  placeholder="Flight number, waiting time, or handover instructions…"
                  value={booking.notes}
                  onChange={(e) => onBookingChange({ notes: e.target.value })}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </form>
          </div>

          {/* Right — live Trip Summary */}
          <div
            className="relative flex flex-col border border-brand-cream/12 bg-brand-deep-forest/25 p-7 lg:sticky lg:top-28 lg:col-span-5"
          >
            <CornerMarkers />

            <div className="mb-5 flex items-center justify-between border-b border-brand-cream/10 pb-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-brand-stone">
                Prepare Request
              </span>
              <span className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${ready ? "bg-brand-gold" : "bg-brand-stone/40"} ${
                    isReduced ? "" : "animate-pulse"
                  }`}
                />
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-brand-gold/80">
                  {ready ? "Ready to send" : "Draft"}
                </span>
              </span>
            </div>

            {/* Selected vehicle preview */}
            <div className="relative mb-6 h-32 overflow-hidden border border-brand-cream/10">
              <AnimatePresence mode="wait">
                <motion.img
                  key={booking.vehicle}
                  src={vehicleMeta.image}
                  alt={vehicleMeta.label}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  initial={isReduced ? false : { opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={isReduced ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE_OUT }}
                  className="h-full w-full object-cover brightness-[0.85]"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/85 to-transparent" />
              <div className="absolute bottom-2 left-3">
                <span className="block font-serif text-sm text-brand-ivory">{vehicleMeta.label}</span>
                <span className="block text-[8px] font-mono uppercase tracking-[0.2em] text-brand-stone">
                  {vehicleMeta.caption}
                </span>
              </div>
            </div>

            <span className="mb-3 block text-[10px] font-mono uppercase tracking-[0.24em] text-brand-cream">
              Trip Summary
            </span>
            <div className="mb-6 max-h-[280px] overflow-y-auto whitespace-pre-wrap rounded border border-brand-cream/5 bg-brand-black/90 p-5 font-mono text-xs leading-relaxed text-brand-stone select-all">
              {requestText}
            </div>

            <div className="mt-auto space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={whatsappLink(booking)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-brand-gold py-4 text-center text-xs font-mono font-semibold uppercase tracking-[0.14em] text-brand-black transition-colors duration-200 hover:bg-brand-ivory"
                >
                  Send by WhatsApp
                </a>
                <a
                  href={emailLink(booking)}
                  className="block border border-brand-cream/30 py-4 text-center text-xs font-mono uppercase tracking-[0.14em] text-brand-cream transition-colors duration-200 hover:border-brand-cream/60 hover:bg-brand-cream/5"
                >
                  Send by Email
                </a>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="w-full cursor-pointer border border-brand-cream/20 py-3.5 text-xs font-mono uppercase tracking-[0.2em] text-brand-cream transition-colors duration-200 hover:border-brand-cream/50 hover:bg-brand-cream/5 focus:outline-none focus-visible:border-brand-gold"
              >
                {isCopied ? "Request Copied" : "Copy Request"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {hasOpenedMap && (
        <Suspense fallback={null}>
          <ChooseOnMapModal
            isOpen={mapTarget !== null}
            title={mapTarget === "destination" ? "Choose Destination" : "Choose Pickup Location"}
            initial={mapTarget === "destination" ? booking.destination : booking.pickup}
            onConfirm={(location) =>
              onBookingChange(mapTarget === "destination" ? { destination: location } : { pickup: location })
            }
            onClose={() => setMapTarget(null)}
          />
        </Suspense>
      )}
    </section>
  );
}
