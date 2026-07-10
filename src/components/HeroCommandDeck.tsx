import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronDown, Clock3, MapPin, Timer, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotionPref } from "./MotionProvider";
import CinematicVideoBackground from "./motion/CinematicVideoBackground";
import PlaceAutocompleteField from "./PlaceAutocompleteField";
import BookingOptionsSheet from "./BookingOptionsSheet";
import { HERO_VIDEO } from "../data/visualJourney";
import {
  DATE_INPUT_PLACEHOLDER,
  DURATION_OPTIONS,
  formatBookingDateInput,
  type BookingState,
  type TripType
} from "../lib/bookingRequest";

interface HeroCommandDeckProps {
  booking: BookingState;
  onBookingChange: (patch: Partial<BookingState>) => void;
}

type MapTarget = "pickup" | "destination" | null;
type ActiveBookingField = "pickup" | "destination" | "duration" | "date" | "time";

const ChooseOnMapModal = lazy(() => import("./ChooseOnMapModal"));

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

const FIELD_CUES: Record<ActiveBookingField, { icon: LucideIcon; title: string; body: string }> = {
  pickup: {
    icon: MapPin,
    title: "Choose your pickup.",
    body: "Start with an exact address, airport terminal, hotel, or private entrance."
  },
  destination: {
    icon: MapPin,
    title: "Choose your drop-off.",
    body: "Arrive calm and assured, with the route prepared before dispatch."
  },
  duration: {
    icon: Timer,
    title: "Set your reserved time.",
    body: "Keep the chauffeur with you for meetings, dinners, and city movements."
  },
  date: {
    icon: CalendarDays,
    title: "Select your date.",
    body: "We prepare the journey around your arrival day and private schedule."
  },
  time: {
    icon: Clock3,
    title: "Select your pickup time.",
    body: "Timing stays precise, discreet, and paced around the client."
  }
};

export default function HeroCommandDeck({
  booking,
  onBookingChange
}: HeroCommandDeckProps) {
  const isReduced = useReducedMotionPref();
  const bookingShellRef = useRef<HTMLDivElement>(null);
  const [mapTarget, setMapTarget] = useState<MapTarget>(null);
  const [hasOpenedMap, setHasOpenedMap] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isBookingExpanded, setIsBookingExpanded] = useState(false);
  const [activeField, setActiveField] = useState<ActiveBookingField>("pickup");

  useEffect(() => {
    if (!isBookingExpanded) return;

    const previousBookingExpanded = document.body.getAttribute("data-booking-expanded");
    const previousOverflow = document.body.style.overflow;
    document.body.setAttribute("data-booking-expanded", "true");
    document.body.style.overflow = "hidden";

    const handlePointerDown = (event: PointerEvent) => {
      if (bookingShellRef.current?.contains(event.target as Node)) return;
      setIsBookingExpanded(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsBookingExpanded(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      if (previousBookingExpanded === null) {
        document.body.removeAttribute("data-booking-expanded");
      } else {
        document.body.setAttribute("data-booking-expanded", previousBookingExpanded);
      }
      document.body.style.overflow = previousOverflow;
    };
  }, [isBookingExpanded]);

  const openMap = (target: Exclude<MapTarget, null>) => {
    setIsBookingExpanded(false);
    setHasOpenedMap(true);
    setMapTarget(target);
  };

  const activateBookingField = (field: ActiveBookingField) => {
    setActiveField(field);
    setIsBookingExpanded(true);
  };

  const handleTripTypeChange = (tripType: TripType) => {
    onBookingChange({ tripType });
    setActiveField((field) => {
      if (tripType === "hourly" && field === "destination") return "duration";
      if (tripType === "one-way" && field === "duration") return "destination";
      return field;
    });
  };

  const reveal = (delay: number) =>
    isReduced
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: EASE }
        };

  const fieldLabelClass =
    "text-xs font-sans font-semibold text-brand-ivory/95 transition-colors duration-200 group-focus-within:text-brand-gold";
  const fieldInputClass =
    "w-full bg-transparent text-[15px] font-light text-brand-cream placeholder:text-brand-cream/50 focus:outline-none";
  const activeCue = FIELD_CUES[activeField];
  const ActiveCueIcon = activeCue.icon;

  return (
    <section className="relative min-h-[100svh] overflow-hidden border-b border-brand-cream/10 bg-brand-black luxury-noise">
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

        <AnimatePresence>
          {isBookingExpanded && (
            <motion.div
              aria-hidden="true"
              className="fixed inset-0 z-30 bg-brand-black/94 luxury-noise"
              initial={isReduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={isReduced ? undefined : { opacity: 0 }}
              transition={{ duration: 0.36, ease: EASE }}
            />
          )}
        </AnimatePresence>

        <motion.div
          ref={bookingShellRef}
          layout
          {...reveal(0.42)}
          transition={{ layout: { duration: 0.72, ease: EASE } }}
          className={
            isBookingExpanded
              ? "fixed inset-x-4 top-[clamp(6.5rem,16vh,9rem)] z-50 mx-auto flex w-[calc(100vw-2rem)] max-w-[1180px] flex-col items-center text-left md:inset-x-8 md:top-[clamp(7rem,18vh,10rem)]"
              : "relative mt-10 flex w-full max-w-[1180px] flex-col items-center text-left md:mt-[clamp(7rem,23vh,14rem)]"
          }
          aria-label="Booking request"
          aria-expanded={isBookingExpanded}
        >
          <div className="relative mb-5 inline-flex rounded-full border border-brand-cream/45 bg-brand-black/45 p-1 shadow-[0_16px_44px_rgba(0,0,0,0.36)] backdrop-blur-sm">
            {TRIP_TABS.map((tab) => {
              const isActive = booking.tripType === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTripTypeChange(tab.id)}
                  aria-pressed={isActive}
                  whileTap={isReduced ? undefined : { scale: 0.975 }}
                  className={`relative min-w-28 cursor-pointer rounded-full px-6 py-2.5 text-sm font-semibold transition-colors duration-200 focus:outline-none ${
                    isActive ? "text-brand-black" : "text-brand-cream hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="hero-trip-tab"
                      className="absolute inset-0 rounded-full bg-brand-gold"
                      transition={{ type: "spring", stiffness: 420, damping: 38, mass: 0.75 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </motion.button>
              );
            })}
          </div>

          <motion.div
            layout
            className={`hero-booking-grid ${isBookingExpanded ? "hero-booking-grid--expanded" : ""}`}
            transition={{ layout: { duration: 0.72, ease: EASE } }}
          >
            <motion.div
              whileTap={isReduced ? undefined : { scale: 0.995 }}
              className="group py-3 md:px-6 md:py-5"
              onPointerDownCapture={() => activateBookingField("pickup")}
              onFocusCapture={() => activateBookingField("pickup")}
            >
              <label htmlFor="hero-pickup" className={fieldLabelClass}>
                Pickup location
              </label>
              <div className="mt-1.5 border-b border-brand-cream/58 pb-2">
                <PlaceAutocompleteField
                  id="hero-pickup"
                  placeholder="Address, airport, hotel, ..."
                  value={booking.pickup}
                  onChange={(location) => onBookingChange({ pickup: location })}
                  onOpenMap={() => openMap("pickup")}
                  showCurrentLocation
                  inputClassName={fieldInputClass}
                />
              </div>
            </motion.div>

            {booking.tripType === "hourly" ? (
              <motion.div
                whileTap={isReduced ? undefined : { scale: 0.995 }}
                className="group py-3 md:border-r md:border-brand-cream/48 md:px-6 md:py-5"
                onPointerDownCapture={() => activateBookingField("duration")}
                onFocusCapture={() => activateBookingField("duration")}
              >
                <label htmlFor="hero-duration" className={fieldLabelClass}>
                  Duration
                </label>
                <div className="mt-1.5 flex items-center border-b border-brand-cream/58 pb-2">
                  <select
                    id="hero-duration"
                    value={booking.duration}
                    onChange={(e) => onBookingChange({ duration: e.target.value })}
                    className={`${fieldInputClass} cursor-pointer appearance-none`}
                  >
                    {DURATION_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value} className="bg-brand-deep-forest text-brand-ivory">
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="h-4 w-4 shrink-0 text-brand-cream" aria-hidden="true" />
                </div>
              </motion.div>
            ) : (
              <motion.div
                whileTap={isReduced ? undefined : { scale: 0.995 }}
                className="group py-3 md:border-r md:border-brand-cream/48 md:px-6 md:py-5"
                onPointerDownCapture={() => activateBookingField("destination")}
                onFocusCapture={() => activateBookingField("destination")}
              >
                <label htmlFor="hero-destination" className={fieldLabelClass}>
                  Drop-off location
                </label>
                <div className="mt-1.5 border-b border-brand-cream/58 pb-2">
                  <PlaceAutocompleteField
                    id="hero-destination"
                    placeholder="Address, airport, hotel, ..."
                    value={booking.destination}
                    onChange={(location) => onBookingChange({ destination: location })}
                    onOpenMap={() => openMap("destination")}
                    inputClassName={fieldInputClass}
                  />
                </div>
              </motion.div>
            )}

            <motion.div
              whileTap={isReduced ? undefined : { scale: 0.995 }}
              className="group py-3 md:px-6 md:py-5"
              onPointerDownCapture={() => activateBookingField("date")}
              onFocusCapture={() => activateBookingField("date")}
            >
              <label htmlFor="hero-date" className={fieldLabelClass}>
                Date
              </label>
              <div className="mt-1.5 flex items-center border-b border-brand-cream/58 pb-2">
                <input
                  id="hero-date"
                  type="text"
                  inputMode="numeric"
                  placeholder={DATE_INPUT_PLACEHOLDER}
                  value={booking.date}
                  onChange={(e) => onBookingChange({ date: formatBookingDateInput(e.target.value) })}
                  className={`${fieldInputClass} min-w-0`}
                />
                <ChevronDown className="h-4 w-4 shrink-0 text-brand-cream" aria-hidden="true" />
              </div>
            </motion.div>

            <motion.div
              whileTap={isReduced ? undefined : { scale: 0.995 }}
              className="group py-3 md:border-r md:border-brand-cream/48 md:px-6 md:py-5"
              onPointerDownCapture={() => activateBookingField("time")}
              onFocusCapture={() => activateBookingField("time")}
            >
              <label htmlFor="hero-time" className={fieldLabelClass}>
                Pickup time
              </label>
              <div className="mt-1.5 flex items-center border-b border-brand-cream/58 pb-2">
                <input
                  id="hero-time"
                  type="time"
                  value={booking.time}
                  onChange={(e) => onBookingChange({ time: e.target.value })}
                  className={`${fieldInputClass} min-w-0`}
                />
                <ChevronDown className="h-4 w-4 shrink-0 text-brand-cream" aria-hidden="true" />
              </div>
            </motion.div>

            <div className="flex items-center pt-4 md:p-5">
              <motion.button
                type="button"
                onClick={() => {
                  setIsBookingExpanded(false);
                  setIsOptionsOpen(true);
                }}
                whileHover={isReduced ? undefined : { y: -1, backgroundColor: "#FAF8F5" }}
                whileTap={isReduced ? undefined : { scale: 0.975 }}
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                className="flex w-full items-center justify-center whitespace-nowrap rounded-full bg-brand-gold px-6 py-3.5 text-center text-sm font-semibold text-brand-black md:w-auto"
              >
                View options
              </motion.button>
            </div>

            <AnimatePresence mode="wait">
              {isBookingExpanded && (
                <motion.div
                  key={activeField}
                  className="col-span-full flex min-h-[clamp(14rem,34vh,23rem)] flex-col items-center justify-center border-t border-brand-cream/12 px-6 py-12 text-center md:px-10"
                  initial={isReduced ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={isReduced ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.48, ease: EASE }}
                >
                  <motion.div
                    layout
                    className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-brand-gold/35 bg-brand-gold-muted text-brand-gold"
                  >
                    <ActiveCueIcon className="h-6 w-6" aria-hidden="true" />
                  </motion.div>
                  <p className="font-serif text-[clamp(2rem,4vw,3rem)] font-light leading-tight text-brand-ivory">
                    {activeCue.title}
                  </p>
                  <p className="mt-3 max-w-xl text-sm font-light leading-relaxed text-brand-body md:text-base">
                    {activeCue.body}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
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

      <BookingOptionsSheet
        isOpen={isOptionsOpen}
        onClose={() => setIsOptionsOpen(false)}
        booking={booking}
        onBookingChange={onBookingChange}
      />
    </section>
  );
}
