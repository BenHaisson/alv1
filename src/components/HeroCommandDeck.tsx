import { lazy, Suspense, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { imageAssets } from "../assets";
import {
  DATE_INPUT_PLACEHOLDER,
  DURATION_OPTIONS,
  formatBookingDateInput,
  type BookingState,
  type TripType
} from "../lib/bookingRequest";
import { useReducedMotionPref } from "./MotionProvider";
import PlaceAutocompleteField from "./PlaceAutocompleteField";
import BookingOptionsSheet from "./BookingOptionsSheet";
import { BookingCard } from "./booking/BookingCard";
import { BookingDatePicker } from "./booking/BookingDatePicker";
import { BookingDropdown } from "./booking/BookingDropdown";
import { BookingField } from "./booking/BookingField";
import { SegmentedControl, type BookingType } from "./booking/SegmentedControl";

interface HeroCommandDeckProps {
  booking: BookingState;
  onBookingChange: (patch: Partial<BookingState>) => void;
}

type MapTarget = "pickup" | "destination" | null;

const ChooseOnMapModal = lazy(() => import("./ChooseOnMapModal"));

const TIME_OPTIONS = Array.from({ length: 48 }, (_, index) => {
  const hours = Math.floor(index / 2);
  const minutes = index % 2 === 0 ? "00" : "30";
  const value = `${String(hours).padStart(2, "0")}:${minutes}`;
  return { value, label: value };
});

const TRUST = [
  "Flight-aware pickups",
  "Fixed quotation",
  "BMW i7 or Mercedes V-Class",
  "Switzerland and Europe"
];

const EASE = [0.16, 1, 0.3, 1] as const;

export default function HeroCommandDeck({ booking, onBookingChange }: HeroCommandDeckProps) {
  const isReduced = useReducedMotionPref();
  const [mapTarget, setMapTarget] = useState<MapTarget>(null);
  const [hasOpenedMap, setHasOpenedMap] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const bookingType: BookingType = booking.tripType === "hourly" ? "hourly" : "oneWay";

  const openMap = (target: Exclude<MapTarget, null>) => {
    setHasOpenedMap(true);
    setMapTarget(target);
  };

  const changeTripType = (type: BookingType) => {
    setShowValidation(false);
    onBookingChange({ tripType: (type === "hourly" ? "hourly" : "one-way") as TripType });
  };

  const pickupMissing = !booking.pickup.description.trim();
  const secondFieldMissing = bookingType === "hourly"
    ? !booking.duration
    : !booking.destination.description.trim();
  const dateMissing = !booking.date.trim();
  const timeMissing = !booking.time.trim();
  const isValid = !pickupMissing && !secondFieldMissing && !dateMissing && !timeMissing;
  const fieldInputClass = "w-full bg-transparent text-[14px] font-light text-brand-cream placeholder:text-brand-cream/45 focus:outline-none md:text-[15px]";

  const openOptions = () => {
    setShowValidation(true);
    if (isValid) setIsOptionsOpen(true);
  };

  return (
    <section
      id="booking-section"
      className="relative overflow-hidden border-y border-brand-cream/10 bg-brand-black px-4 py-20 text-brand-ivory md:px-8 md:py-28 lg:px-12"
    >
      <motion.picture
        aria-hidden="true"
        className="absolute inset-0"
        initial={isReduced ? false : { opacity: 0, clipPath: "inset(100% 0 0 0)" }}
        whileInView={{ opacity: 0.34, clipPath: "inset(0 0 0 0)" }}
        viewport={{ once: true, amount: 0.28 }}
        transition={{ duration: isReduced ? 0 : 0.92, ease: EASE }}
      >
        <img
          src={imageAssets.bookingHeroZurichGold}
          alt=""
          decoding="async"
          className="h-full w-full object-cover object-[center_58%] brightness-[0.62] saturate-[0.86]"
        />
      </motion.picture>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(205,162,80,0.14),rgba(10,10,10,0)_42%),linear-gradient(180deg,#0a0a0a_0%,rgba(8,19,13,0.92)_42%,#0a0a0a_100%)]" />

      <div className="relative z-10 mx-auto grid w-full max-w-[1220px] gap-10 md:gap-12">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={isReduced ? false : { opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.42 }}
          transition={{ duration: isReduced ? 0 : 0.64, ease: EASE }}
        >
          <p className="mb-4 text-[10px] font-mono uppercase tracking-[0.24em] text-brand-gold md:text-[11px]">
            Private request
          </p>
          <motion.h2
            layoutId="booking-section-title"
            className="font-editorial text-[clamp(3.3rem,9vw,7.25rem)] font-normal leading-[0.82] text-brand-ivory"
            transition={{ layout: { type: "spring", stiffness: 82, damping: 24, mass: 1.05 } }}
          >
            Your chauffeur is ready.
          </motion.h2>
          <p className="mx-auto mt-5 max-w-[54ch] text-[14px] font-light leading-6 text-brand-body md:text-[16px] md:leading-7">
            Share the first details. We prepare the right vehicle, confirm timing, and return a fixed private quote with discretion.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto flex w-full max-w-[1180px] flex-col items-center"
          initial={isReduced ? false : { opacity: 0, y: 72 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.24 }}
          transition={{ duration: isReduced ? 0 : 0.78, delay: isReduced ? 0 : 0.08, ease: EASE }}
          aria-label="Journey booking"
        >
          <SegmentedControl value={bookingType} onChange={changeTripType} />

          <BookingCard expanded={false}>
            <BookingField
              id="hero-pickup"
              label="Pickup"
              validationMessage={showValidation && pickupMissing ? "Enter a pickup location." : undefined}
            >
              <PlaceAutocompleteField
                id="hero-pickup"
                placeholder="Airport, hotel or address"
                value={booking.pickup}
                onChange={(pickup) => onBookingChange({ pickup })}
                onOpenMap={() => openMap("pickup")}
                showCurrentLocation
                inputClassName={fieldInputClass}
              />
            </BookingField>

            <div className="grid min-h-[48px] border-b border-brand-cream/20 md:min-h-[90px] md:border-b-0 md:border-r md:border-brand-cream/48">
              <AnimatePresence initial={false} mode="sync">
                {bookingType === "hourly" ? (
                  <BookingField
                    key="duration"
                    id="hero-duration"
                    label="Duration"
                    replacement
                    className="col-start-1 row-start-1 border-b-0"
                    validationMessage={showValidation && secondFieldMissing ? "Select a duration." : undefined}
                  >
                    <BookingDropdown
                      id="hero-duration"
                      value={booking.duration}
                      options={DURATION_OPTIONS}
                      onChange={(duration) => onBookingChange({ duration })}
                      labelledBy="hero-duration-label"
                    />
                  </BookingField>
                ) : (
                  <BookingField
                    key="destination"
                    id="hero-destination"
                    label="Destination"
                    replacement
                    className="col-start-1 row-start-1 border-b-0"
                    validationMessage={showValidation && secondFieldMissing ? "Enter a destination." : undefined}
                  >
                    <PlaceAutocompleteField
                      id="hero-destination"
                      placeholder="Airport, hotel or address"
                      value={booking.destination}
                      onChange={(destination) => onBookingChange({ destination })}
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
              label="Time"
              className="md:border-r md:border-brand-cream/48"
              validationMessage={showValidation && timeMissing ? "Select a time." : undefined}
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

            <div className="hero-booking-cta flex items-center md:p-5">
              <motion.button
                type="button"
                onClick={openOptions}
                whileHover={isReduced ? undefined : { y: -1, backgroundColor: "#FAF8F5" }}
                whileTap={isReduced ? undefined : { scale: 0.985 }}
                transition={{ type: "spring", stiffness: 420, damping: 38 }}
                className="flex h-12 w-full items-center justify-center whitespace-nowrap bg-brand-gold px-7 text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-brand-black md:w-auto"
              >
                View options
              </motion.button>
            </div>
          </BookingCard>

          <motion.ul
            className="mt-5 grid w-full grid-cols-2 gap-x-4 gap-y-3 md:flex md:items-center md:justify-center md:gap-8"
            initial={isReduced ? false : "hidden"}
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: isReduced ? 0 : 0.07, delayChildren: isReduced ? 0 : 0.74 } } }}
          >
            {TRUST.map((item) => (
              <motion.li
                key={item}
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: isReduced ? 0 : 0.34, ease: EASE }}
                className="flex items-center gap-2 text-[9px] font-mono uppercase leading-tight tracking-[0.1em] text-brand-cream/62 md:text-[10px]"
              >
                <Check className="h-3 w-3 shrink-0 text-brand-gold" strokeWidth={1.6} aria-hidden="true" />
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>

      {hasOpenedMap && (
        <Suspense fallback={null}>
          <ChooseOnMapModal
            isOpen={mapTarget !== null}
            title={mapTarget === "destination" ? "Choose destination" : "Choose pickup"}
            initial={mapTarget === "destination" ? booking.destination : booking.pickup}
            onConfirm={(location) => onBookingChange(mapTarget === "destination" ? { destination: location } : { pickup: location })}
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
