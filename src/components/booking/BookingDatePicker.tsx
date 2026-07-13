import { CalendarDays } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useReducedMotionPref } from "../MotionProvider";

interface BookingDatePickerProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  labelledBy: string;
  placeholder: string;
  invalid?: boolean;
}

export function BookingDatePicker({
  id,
  value,
  onChange,
  labelledBy,
  placeholder,
  invalid = false
}: BookingDatePickerProps) {
  const isReduced = useReducedMotionPref();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={wrapperRef} className="relative flex w-full items-center gap-2">
      <input
        ref={inputRef}
        id={id}
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        value={value}
        aria-labelledby={labelledBy}
        aria-controls={`${id}-panel`}
        aria-expanded={isOpen}
        aria-invalid={invalid}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setIsOpen(false);
        }}
        className="min-w-0 flex-1 bg-transparent text-[15px] font-light text-brand-cream placeholder:text-brand-cream/50 focus:outline-none"
      />
      <button
        type="button"
        aria-label="Open date picker"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={`${id}-panel`}
        onClick={() => setIsOpen((open) => !open)}
        className="shrink-0 text-brand-cream focus:outline-none"
      >
        <CalendarDays className="h-4 w-4" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`${id}-panel`}
            role="dialog"
            aria-label="Choose a booking date"
            initial={isReduced ? false : { opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={isReduced ? undefined : { opacity: 0, y: -5 }}
            transition={isReduced ? { duration: 0 } : { duration: 0.14, ease: "easeInOut" }}
            className="absolute left-0 top-full z-[70] mt-2 w-64 rounded-md border border-brand-cream/18 bg-brand-deep-forest/98 p-4 text-left shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-md"
          >
            <label htmlFor={`${id}-native`} className="block text-[10px] font-medium uppercase tracking-[0.14em] text-brand-stone">
              Select date
            </label>
            <input
              id={`${id}-native`}
              type="date"
              onChange={(event) => {
                if (!event.target.value) return;
                const [year, month, day] = event.target.value.split("-");
                onChange(`${day}/${month}/${year.slice(-2)}`);
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className="mt-3 w-full rounded-sm border border-brand-cream/18 bg-brand-black/48 px-3 py-2.5 text-sm text-brand-ivory focus:outline-none"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
