import { motion } from "motion/react";
import { useReducedMotionPref } from "../MotionProvider";
import { PREMIUM_SPRING } from "../../lib/motion";

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

  const moveSelection = (direction: -1 | 1) => {
    const currentIndex = BOOKING_TYPES.findIndex((option) => option.value === value);
    const nextIndex = (currentIndex + direction + BOOKING_TYPES.length) % BOOKING_TYPES.length;
    onChange(BOOKING_TYPES[nextIndex].value);
  };

  return (
    <motion.div
      aria-label="Journey type"
      className="booking-type-toggle mx-auto mb-2 md:mb-5"
      role="radiogroup"
    >
      {BOOKING_TYPES.map((option) => {
        const isSelected = value === option.value;

        return (
          <motion.button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            className={isSelected ? "active" : undefined}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                event.preventDefault();
                moveSelection(-1);
              }
              if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                event.preventDefault();
                moveSelection(1);
              }
            }}
            animate={{
              backgroundColor: isSelected ? "#D4AF37" : "rgba(0, 0, 0, 0)",
              color: isSelected ? "#0A0A0A" : "#D6C7B0"
            }}
            whileTap={isReduced ? undefined : { scale: 0.985 }}
            transition={
              isReduced
                ? { duration: 0 }
                : PREMIUM_SPRING
            }
          >
            {option.label}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
