import { motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { useReducedMotionPref } from "../MotionProvider";

const SHORT_EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

interface BookingFieldProps {
  id: string;
  label: string;
  children: ReactNode;
  onActivate?: () => void;
  className?: string;
  lineClassName?: string;
  validationMessage?: string;
  replacement?: boolean;
}

export function BookingField({
  id,
  label,
  children,
  onActivate,
  className = "",
  lineClassName = "",
  validationMessage,
  replacement = false
}: BookingFieldProps) {
  const isReduced = useReducedMotionPref();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className={`hero-booking-field group ${className}`}
      initial={replacement && !isReduced ? { opacity: 0.76 } : false}
      animate={{ opacity: 1 }}
      exit={replacement && !isReduced ? { opacity: 0.76 } : undefined}
      transition={isReduced ? { duration: 0 } : { duration: 0.14, ease: "easeInOut" }}
      onPointerDownCapture={onActivate}
      onFocusCapture={() => {
        setIsFocused(true);
        onActivate?.();
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsFocused(false);
      }}
    >
      <label id={`${id}-label`} htmlFor={id} className="text-xs font-sans font-semibold text-brand-ivory/95">
        {label}
      </label>
      <div className={`hero-booking-line relative ${lineClassName}`}>
        {children}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left bg-brand-gold"
          initial={false}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          transition={isReduced ? { duration: 0 } : { duration: 0.18, ease: SHORT_EASE }}
        />
      </div>
      {validationMessage && (
        <p className="mt-1.5 w-full text-left text-[10px] leading-snug text-red-300/90" role="alert">
          {validationMessage}
        </p>
      )}
    </motion.div>
  );
}
