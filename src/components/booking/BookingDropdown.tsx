import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotionPref } from "../MotionProvider";

export interface BookingDropdownOption {
  value: string;
  label: string;
  /** Optional compact label for the closed trigger; falls back to `label`. */
  triggerLabel?: string;
}

interface BookingDropdownProps {
  id: string;
  value: string;
  options: BookingDropdownOption[];
  onChange: (value: string) => void;
  labelledBy: string;
  placeholder?: string;
  invalid?: boolean;
}

export function BookingDropdown({
  id,
  value,
  options,
  onChange,
  labelledBy,
  placeholder = "Select",
  invalid = false
}: BookingDropdownProps) {
  const isReduced = useReducedMotionPref();
  const [isOpen, setIsOpen] = useState(false);
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const selectOption = (index: number) => {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    setActiveIndex(index);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((index) => Math.min(options.length - 1, Math.max(0, index + direction)));
      setIsOpen(true);
    } else if (event.key === "Enter" && isOpen) {
      event.preventDefault();
      selectOption(activeIndex);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  const selectedOption = options.find((option) => option.value === value);
  const selectedLabel = selectedOption?.triggerLabel ?? selectedOption?.label;

  return (
    <div ref={wrapperRef} className="relative w-full">
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={`${id}-listbox`}
        aria-haspopup="listbox"
        aria-labelledby={`${labelledBy} ${id}`}
        aria-activedescendant={isOpen ? `${id}-option-${activeIndex}` : undefined}
        aria-invalid={invalid}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={handleKeyDown}
        className="flex w-full min-w-0 items-center justify-between gap-3 overflow-hidden bg-transparent text-left font-sans text-[15px] font-light text-brand-cream focus:outline-none"
      >
        <span className={`min-w-0 flex-1 overflow-hidden whitespace-nowrap [mask-image:linear-gradient(to_right,#000_calc(100%-18px),transparent)] ${selectedLabel ? "text-brand-cream" : "text-brand-cream/50"}`}>
          {selectedLabel || placeholder}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-brand-cream" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`${id}-listbox`}
            role="listbox"
            aria-labelledby={labelledBy}
            initial={isReduced ? false : { opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={isReduced ? undefined : { opacity: 0, y: -5 }}
            transition={isReduced ? { duration: 0 } : { duration: 0.14, ease: "easeInOut" }}
            className="absolute left-0 top-full z-[70] mt-2 max-h-64 w-full min-w-56 overflow-y-auto rounded-md border border-brand-cream/18 bg-brand-deep-forest/98 p-1.5 text-left shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-md"
          >
            {options.map((option, index) => (
              <button
                key={option.value}
                id={`${id}-option-${index}`}
                type="button"
                role="option"
                aria-selected={option.value === value}
                onPointerMove={() => setActiveIndex(index)}
                onClick={() => selectOption(index)}
                className={`block w-full rounded-sm px-3 py-2.5 text-left text-sm font-light focus:outline-none ${
                  index === activeIndex ? "bg-brand-cream/8 text-brand-ivory" : "text-brand-cream/72"
                }`}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
