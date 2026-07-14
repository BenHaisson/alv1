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
      className="relative mx-auto mb-2 flex h-11 w-full rounded-full border border-brand-cream/30 bg-brand-black/72 p-1 shadow-[0_14px_38px_rgba(0,0,0,0.34)] backdrop-blur-md md:mb-5 md:h-14 md:w-auto"
    >
      <legend className="sr-only">Journey type</legend>
      {BOOKING_TYPES.map((option) => {
        const isSelected = value === option.value;

        return (
          <label
            key={option.value}
            className="relative flex min-w-0 flex-1 cursor-pointer items-center justify-center rounded-full px-3 text-[13px] font-semibold focus-within:outline focus-within:outline-1 focus-within:outline-offset-2 focus-within:outline-brand-gold md:min-w-28 md:flex-none md:px-6 md:text-sm"
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
                transition={
                  isReduced
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 420, damping: 38, mass: 0.75 }
                }
              />
            )}
            <motion.span
              className="relative z-10"
              animate={{ color: isSelected ? "#0A0A0A" : "#EADECE" }}
              transition={isReduced ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {option.label}
            </motion.span>
          </label>
        );
      })}
    </fieldset>
  );
}
