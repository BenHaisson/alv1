import { Fragment, lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  CalendarCheck,
  CalendarDays,
  Car,
  Clock,
  Clock3,
  MapPin,
  ShieldCheck,
  Timer,
  type LucideIcon
} from "lucide-react";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "motion/react";
import { useMediaQuery, useReducedMotionPref } from "./MotionProvider";
import CinematicVideoBackground from "./motion/CinematicVideoBackground";
import PlaceAutocompleteField from "./PlaceAutocompleteField";
import BookingOptionsSheet from "./BookingOptionsSheet";
import { BookingCard } from "./booking/BookingCard";
import { BookingDatePicker } from "./booking/BookingDatePicker";
import { BookingDropdown } from "./booking/BookingDropdown";
import { BookingField } from "./booking/BookingField";
import { SegmentedControl, type BookingType } from "./booking/SegmentedControl";
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
  isIntroComplete: boolean;
}

type MapTarget = "pickup" | "destination" | null;
type ActiveBookingField = "pickup" | "destination" | "duration" | "date" | "time";

const ChooseOnMapModal = lazy(() => import("./ChooseOnMapModal"));

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const TRUST_LINE: { icon: LucideIcon; label: string }[] = [
  { icon: Clock, label: "On time" },
  { icon: ShieldCheck, label: "Discreet" },
  { icon: Car, label: "Executive fleet" },
  { icon: CalendarCheck, label: "Pre-arranged" }
];

const TIME_OPTIONS = Array.from({ length: 48 }, (_, index) => {
  const hours = Math.floor(index / 2);
  const minutes = index % 2 === 0 ? "00" : "30";
  const value = `${String(hours).padStart(2, "0")}:${minutes}`;
  return { value, label: value };
});

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
  onBookingChange,
  isIntroComplete
}: HeroCommandDeckProps) {
  const isReduced = useReducedMotionPref();
  const isMobileBooking = useMediaQuery("(max-width: 767px)");
  const sectionRef = useRef<HTMLElement>(null);
  const bookingShellRef = useRef<HTMLDivElement>(null);
  const [mapTarget, setMapTarget] = useState<MapTarget>(null);
  const [hasOpenedMap, setHasOpenedMap] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isBookingExpanded, setIsBookingExpanded] = useState(false);
  const [activeField, setActiveField] = useState<ActiveBookingField>("pickup");
  const [showValidation, setShowValidation] = useState(false);
  const [bookingType, setBookingType] = useState<BookingType>(
    booking.tripType === "hourly" ? "hourly" : "oneWay"
  );

  useEffect(() => {
    setBookingType(booking.tripType === "hourly" ? "hourly" : "oneWay");
  }, [booking.tripType]);

  useEffect(() => {
    if (!isBookingExpanded || isMobileBooking) return;

    const previousBookingExpanded = document.body.getAttribute("data-booking-expanded");
    document.body.setAttribute("data-booking-expanded", "true");

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
    };
  }, [isBookingExpanded, isMobileBooking]);

  useEffect(() => {
    if (isMobileBooking && isBookingExpanded) setIsBookingExpanded(false);
  }, [isBookingExpanded, isMobileBooking]);

  const openMap = (target: Exclude<MapTarget, null>) => {
    setIsBookingExpanded(false);
    setHasOpenedMap(true);
    setMapTarget(target);
  };

  const activateBookingField = (field: ActiveBookingField) => {
    setActiveField(field);
    if (!isMobileBooking) setIsBookingExpanded(true);
  };

  const handleTripTypeChange = (tripType: TripType) => {
    onBookingChange({ tripType });
    setActiveField((field) => {
      if (tripType === "hourly" && field === "destination") return "duration";
      if (tripType === "one-way" && field === "duration") return "destination";
      return field;
    });
  };

  const handleBookingTypeChange = (nextType: BookingType) => {
    setShowValidation(false);
    setBookingType(nextType);
    handleTripTypeChange(nextType === "hourly" ? "hourly" : "one-way");
  };

  const fieldInputClass =
    "w-full bg-transparent text-[15px] font-light text-brand-cream placeholder:text-brand-cream/50 focus:outline-none";
  const activeCue = FIELD_CUES[activeField];
  const ActiveCueIcon = activeCue.icon;
  const pickupMissing = !booking.pickup.description.trim();
  const secondFieldMissing =
    bookingType === "hourly" ? !booking.duration : !booking.destination.description.trim();
  const dateMissing = !booking.date.trim();
  const timeMissing = !booking.time.trim();
  const isBookingValid = !pickupMissing && !secondFieldMissing && !dateMissing && !timeMissing;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });
  const stagedProgress = useSpring(scrollYProgress, {
    stiffness: 76,
    damping: 24,
    restDelta: 0.001
  });
  const backgroundScale = useTransform(stagedProgress, [0, 0.22, 0.62, 1], [1.01, 1.03, 1.12, 1.08]);
  const backgroundY = useTransform(stagedProgress, [0, 0.62, 1], ["2.5%", "-1.5%", "-3.5%"]);
  const heroBackdropOpacity = useTransform(stagedProgress, [0, 0.42, 0.78, 1], [1, 0.86, 0.38, 0]);
  const heroContentOpacity = useTransform(stagedProgress, [0, 0.32, 0.68, 0.92], [1, 0.9, 0.36, 0]);
  const gradientOpacity = useTransform(stagedProgress, [0, 0.42, 1], [0.28, 0.86, 1]);
  const mobileBackgroundY = useTransform(
    stagedProgress,
    [0, 0.34, 0.62, 1],
    ["1%", "-2%", "-10%", "-12%"]
  );
  const bookingScrollY = useTransform(stagedProgress, [0, 0.42, 0.78, 1], [0, -24, -104, -148]);
  const bookingScrollOpacity = useTransform(stagedProgress, [0, 0.36, 0.72, 0.9], [1, 1, 0.48, 0]);
  const reveal = (delay: number, y: number) => ({
    initial: isReduced ? false : { opacity: 0, y, filter: "blur(8px)" },
    animate:
      isReduced || isIntroComplete
        ? { opacity: 1, y: 0, filter: "blur(0px)" }
        : { opacity: 0, y, filter: "blur(8px)" },
    transition: isReduced ? undefined : { duration: 1.08, delay, ease: EASE }
  });
  const carReveal = {
    initial: isReduced ? false : { opacity: 0, filter: "blur(6px)" },
    animate:
      isReduced || isIntroComplete
        ? { opacity: 1, filter: "blur(0px)" }
        : { opacity: 0, filter: "blur(6px)" },
    transition: isReduced ? undefined : { duration: 1.2, delay: 0, ease: EASE }
  };

  return (
    <section
      ref={sectionRef}
      className={`relative border-b border-brand-cream/10 bg-brand-black luxury-noise ${
        isReduced ? "min-h-[100svh]" : "h-[160svh] md:min-h-[180svh]"
      }`}
    >
      <div
        className={
          isReduced
            ? "relative min-h-[100svh] overflow-hidden"
            : "sticky top-[76px] h-[calc(100svh-76px)] overflow-hidden md:top-0 md:h-[100svh]"
        }
      >
        <motion.div
          className="absolute inset-0 z-0"
          style={
            isReduced
              ? undefined
              : isMobileBooking
                ? { scale: backgroundScale, y: mobileBackgroundY, opacity: heroBackdropOpacity }
                : { scale: backgroundScale, y: backgroundY, opacity: heroBackdropOpacity }
          }
        >
          <motion.div {...carReveal} className="absolute inset-0">
            <CinematicVideoBackground
              slot={HERO_VIDEO}
              overlay={false}
              priority
              mediaClassName="scale-[1.14] object-[50%_58%] grayscale-[0.12] brightness-[0.88] contrast-[1.06] md:scale-[1.12] md:object-[50%_54%] md:brightness-[0.82]"
            />
          </motion.div>
        </motion.div>

      <motion.div
        aria-hidden="true"
        className="hero-image-overlay absolute inset-0 z-10"
        style={isReduced ? undefined : { opacity: gradientOpacity }}
      />

      <motion.div
        className="relative z-20 h-full px-4 pb-[max(14px,env(safe-area-inset-bottom))] text-center md:px-12"
        style={isReduced ? undefined : { opacity: heroContentOpacity }}
      >
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
          layoutDependency={isBookingExpanded}
          style={
            isReduced || isBookingExpanded
              ? undefined
              : { y: bookingScrollY, opacity: bookingScrollOpacity }
          }
          transition={{
            layout: { duration: 0.34, ease: EASE }
          }}
          className={
            isBookingExpanded
              ? "fixed inset-x-4 top-[clamp(6.5rem,16vh,9rem)] z-50 mx-auto flex w-[calc(100vw-2rem)] max-w-[1180px] flex-col items-center text-left md:inset-x-8 md:top-[clamp(7rem,18vh,10rem)]"
              : "hero-booking-shell absolute inset-x-0 bottom-[clamp(7rem,18svh,10rem)] mx-auto flex w-[min(390px,calc(100vw-32px))] max-w-[1120px] flex-col items-center text-center md:bottom-[clamp(2.2rem,5.4vh,4rem)] md:left-0 md:right-0 md:w-[min(1120px,calc(100%-6rem))] md:text-left"
          }
          aria-label="Booking request"
          aria-expanded={isBookingExpanded}
        >
          <motion.div
            {...reveal(0.24, isMobileBooking ? 64 : 86)}
            className="flex w-full flex-col items-center"
          >
          <div className="mb-4 w-full text-center md:mb-5">
            <motion.p
              {...reveal(0.08, isMobileBooking ? 24 : 30)}
              className="mb-2 font-mono text-[11px] font-normal uppercase leading-none tracking-[0.24em] text-brand-cream/75"
            >
              Private chauffeur service in Zürich
            </motion.p>
            <motion.h1
              {...reveal(0.24, isMobileBooking ? 30 : 36)}
              className="mx-auto max-w-full whitespace-nowrap font-serif text-[clamp(1.85rem,8vw,3.55rem)] font-light leading-[0.98] tracking-[-0.025em] text-brand-ivory md:text-[clamp(3rem,4vw,3.5625rem)]"
            >
              Your chauffeur <span className="italic text-brand-stone/90">is ready.</span>
            </motion.h1>
          </div>

          <SegmentedControl value={bookingType} onChange={handleBookingTypeChange} />

          <BookingCard expanded={isBookingExpanded}>
            <BookingField
              id="hero-pickup"
              label="Pickup location"
              className="md:px-5 md:py-3"
              onActivate={() => activateBookingField("pickup")}
              validationMessage={showValidation && pickupMissing ? "Enter a pickup location." : undefined}
            >
              <PlaceAutocompleteField
                id="hero-pickup"
                placeholder="Address, airport, hotel, ..."
                value={booking.pickup}
                onChange={(location) => onBookingChange({ pickup: location })}
                onOpenMap={() => openMap("pickup")}
                showCurrentLocation
                inputClassName={fieldInputClass}
              />
            </BookingField>

            <div className="grid min-h-[34px] border-b border-brand-cream/20 md:min-h-[53px] md:border-b-0 md:border-r md:border-brand-cream/48">
              <AnimatePresence initial={false} mode="sync">
                {bookingType === "hourly" ? (
                  <BookingField
                    key="duration"
                    id="hero-duration"
                    label="Duration"
                    replacement
                    className="col-start-1 row-start-1 border-b-0 md:px-5 md:py-3"
                    onActivate={() => activateBookingField("duration")}
                    validationMessage={showValidation && secondFieldMissing ? "Select a duration." : undefined}
                  >
                    <BookingDropdown
                      id="hero-duration"
                      value={booking.duration}
                      options={DURATION_OPTIONS}
                      onChange={(duration) => onBookingChange({ duration })}
                      labelledBy="hero-duration-label"
                      invalid={showValidation && secondFieldMissing}
                    />
                  </BookingField>
                ) : (
                  <BookingField
                    key="destination"
                    id="hero-destination"
                    label="Drop-off location"
                    replacement
                    className="col-start-1 row-start-1 border-b-0 md:px-5 md:py-3"
                    onActivate={() => activateBookingField("destination")}
                    validationMessage={showValidation && secondFieldMissing ? "Enter a drop-off location." : undefined}
                  >
                    <PlaceAutocompleteField
                      id="hero-destination"
                      placeholder="Address, airport, hotel, ..."
                      value={booking.destination}
                      onChange={(location) => onBookingChange({ destination: location })}
                      onOpenMap={() => openMap("destination")}
                      inputClassName={fieldInputClass}
                    />
                  </BookingField>
                )}
              </AnimatePresence>
            </div>

            <BookingField
              id="hero-date"
              label="Date"
              className="md:px-5 md:py-3"
              onActivate={() => activateBookingField("date")}
              validationMessage={showValidation && dateMissing ? "Select a date." : undefined}
            >
              <BookingDatePicker
                id="hero-date"
                value={booking.date}
                placeholder={DATE_INPUT_PLACEHOLDER}
                labelledBy="hero-date-label"
                onChange={(date) => onBookingChange({ date: formatBookingDateInput(date) })}
                invalid={showValidation && dateMissing}
              />
            </BookingField>

            <BookingField
              id="hero-time"
              label="Pickup time"
              className="md:border-r md:border-brand-cream/48 md:px-5 md:py-3"
              onActivate={() => activateBookingField("time")}
              validationMessage={showValidation && timeMissing ? "Select a pickup time." : undefined}
            >
              <BookingDropdown
                id="hero-time"
                value={booking.time}
                options={TIME_OPTIONS}
                onChange={(time) => onBookingChange({ time })}
                labelledBy="hero-time-label"
                placeholder="Select time"
                invalid={showValidation && timeMissing}
              />
            </BookingField>

            <div className="hero-booking-cta flex items-center md:p-3">
              <motion.button
                type="button"
                onClick={() => {
                  setShowValidation(true);
                  if (!isBookingValid) return;
                  setIsBookingExpanded(false);
                  setIsOptionsOpen(true);
                }}
                whileHover={isReduced ? undefined : { backgroundColor: "#FAF8F5" }}
                whileTap={isReduced ? undefined : { opacity: 0.88 }}
                transition={isReduced ? { duration: 0 } : { duration: 0.15, ease: "easeInOut" }}
                className="flex h-8 w-full items-center justify-center whitespace-nowrap rounded-full bg-brand-gold px-6 text-center text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-brand-black md:h-auto md:w-auto md:py-2"
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
          </BookingCard>

          {!isBookingExpanded && (
            <motion.div
              {...reveal(0.82, 18)}
              className="mt-5 grid w-full max-w-[960px] grid-cols-2 items-center justify-items-center gap-x-3 gap-y-4 text-center md:flex md:justify-center md:gap-x-0 md:gap-y-3 md:pb-0"
            >
              {TRUST_LINE.map((item, index) => {
                const TrustIcon = item.icon;

                return (
                  <Fragment key={item.label}>
                    {index > 0 && (
                      <span
                        className="hidden h-4 w-px bg-[rgba(246,242,233,0.12)] md:mx-8 md:block lg:mx-10"
                        aria-hidden="true"
                      />
                    )}
                    <span className="inline-flex items-center justify-center gap-2 text-[10px] font-sans font-medium uppercase leading-none tracking-[0.12em] text-[rgba(246,242,233,0.62)] md:text-[11px] lg:text-xs">
                      <TrustIcon
                        className="h-4 w-4 shrink-0 text-[rgba(214,199,176,0.78)] md:h-[18px] md:w-[18px]"
                        strokeWidth={1.65}
                        aria-hidden="true"
                      />
                      <span>{item.label}</span>
                    </span>
                  </Fragment>
                );
              })}
            </motion.div>
          )}
          </motion.div>
        </motion.div>
      </motion.div>

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
      </div>
    </section>
  );
}
