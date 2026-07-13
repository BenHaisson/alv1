import { motion } from "motion/react";
import { useReducedMotionPref } from "../MotionProvider";

export type BookingType = "oneWay" | "hourly";

interface SegmentedControlProps {
  value: BookingType;
  onChange: (value: BookingType) => void;
}

const BOOKING_TYPES: { value: BookingType; label: string }[] = [
  { value: "oneWay", label: "One way" },
  { value: "hourly", label: "By the hour" }
];

export function SegmentedControl({ value, onChange }: SegmentedControlProps) {
  const isReduced = useReducedMotionPref();

  return (
    <fieldset
      aria-label="Journey type"
      className="relative mx-auto mb-3 mt-6 flex h-14 w-[min(330px,calc(100vw-48px))] rounded-full border border-brand-cream/35 bg-brand-black/56 p-1 shadow-[0_16px_44px_rgba(0,0,0,0.36)] backdrop-blur-md md:mb-5 md:mt-0 md:w-auto"
    >
      <legend className="sr-only">Journey type</legend>
      {BOOKING_TYPES.map((option) => {
        const isSelected = value === option.value;

        return (
          <label
            key={option.value}
            className={`relative flex min-w-0 flex-1 cursor-pointer items-center justify-center rounded-full px-4 text-sm font-semibold focus-within:outline focus-within:outline-1 focus-within:outline-offset-2 focus-within:outline-brand-gold md:min-w-28 md:flex-none md:px-6 ${
              isSelected ? "text-brand-black" : "text-brand-cream"
            }`}
          >
            <input
              className="sr-only"
              type="radio"
              name="hero-booking-type"
              value={option.value}
              checked={isSelected}
              onChange={() => onChange(option.value)}
            />
            {isSelected && (
              <motion.span
                layoutId="hero-booking-type-emphasis"
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-brand-gold"
                transition={isReduced ? { duration: 0 } : { duration: 0.15, ease: "easeInOut" }}
              />
            )}
            <span className="relative z-10">{option.label}</span>
          </label>
        );
      })}
    </fieldset>
  );
}
