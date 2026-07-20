import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useMediaQuery, useReducedMotionPref } from "./MotionProvider";
import { useAnchoredPosition } from "../lib/useAnchoredPosition";
import { useDismissable } from "../lib/useDismissable";
import {
  WEEKDAY_LABELS,
  formatDateDisplay,
  formatMonthLabel,
  getCalendarCells,
  isSameDay,
  parseISODate,
  startOfDay,
  toISODate
} from "../lib/dateTime";

interface DateFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  placeholder: string;
  buttonClassName: string;
}

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const PANEL_WIDTH = 380;

/**
 * A dark-glass calendar dropdown replacing the native `<input type="date">`.
 * Desktop: portal-rendered, anchored under the trigger via getBoundingClientRect.
 * Mobile (<768px): a bottom sheet, matching BookingOptionsSheet's pattern.
 */
export default function DateField({ id, value, onChange, isOpen, onOpenChange, placeholder, buttonClassName }: DateFieldProps) {
  const isReduced = useReducedMotionPref();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const anchor = useAnchoredPosition(triggerRef, isOpen && isDesktop);
  const selectedDate = parseISODate(value);
  const [monthCursor, setMonthCursor] = useState(() => selectedDate ?? startOfDay(new Date()));

  useEffect(() => {
    if (isOpen) setMonthCursor(selectedDate ?? startOfDay(new Date()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useDismissable([triggerRef, panelRef], isOpen, () => onOpenChange(false));

  const cells = getCalendarCells(monthCursor);
  const displayText = formatDateDisplay(value);

  const handleSelect = (date: Date) => {
    onChange(toISODate(date));
    onOpenChange(false);
  };

  const calendarBody = (
    <>
      <div className="flex items-center justify-between px-5 pt-5">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => setMonthCursor((cursor) => new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
          className="flex h-8 w-8 cursor-pointer items-center justify-center text-brand-stone transition-colors duration-150 hover:text-brand-gold focus:outline-none"
        >
          ‹
        </button>
        <span className="text-xs font-mono uppercase tracking-[0.18em] text-brand-ivory">
          {formatMonthLabel(monthCursor)}
        </span>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setMonthCursor((cursor) => new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
          className="flex h-8 w-8 cursor-pointer items-center justify-center text-brand-stone transition-colors duration-150 hover:text-brand-gold focus:outline-none"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-1 px-4 pb-4 pt-4">
        {WEEKDAY_LABELS.map((label) => (
          <span
            key={label}
            className="flex h-8 items-center justify-center text-[10px] font-mono uppercase tracking-[0.1em] text-brand-stone/70"
          >
            {label}
          </span>
        ))}

        {cells.map((cell) => {
          const isSelected = selectedDate != null && isSameDay(cell.date, selectedDate);
          return (
            <button
              key={cell.date.toISOString()}
              type="button"
              disabled={cell.isPast}
              onClick={() => handleSelect(cell.date)}
              className={`m-0.5 flex h-9 items-center justify-center text-xs font-light transition-colors duration-150 focus:outline-none ${
                !cell.isCurrentMonth ? "text-brand-stone/25" : cell.isPast ? "text-brand-stone/25" : "text-brand-ivory"
              } ${cell.isPast ? "cursor-not-allowed" : "cursor-pointer"} ${
                isSelected
                  ? "bg-brand-gold text-brand-black"
                  : cell.isPast
                    ? ""
                    : "hover:bg-brand-cream/10 hover:text-brand-gold"
              } ${cell.isToday && !isSelected ? "ring-1 ring-inset ring-brand-gold/50" : ""}`}
            >
              {cell.date.getDate()}
            </button>
          );
        })}
      </div>
    </>
  );

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        id={id}
        type="button"
        onClick={() => onOpenChange(!isOpen)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`${buttonClassName} cursor-pointer text-left ${isOpen ? "text-brand-gold" : ""}`}
      >
        {displayText || <span className="text-brand-stone/45">{placeholder}</span>}
      </button>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && isDesktop && anchor && (
              <motion.div
                ref={panelRef}
                role="dialog"
                aria-label="Choose date"
                initial={isReduced ? false : { opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={isReduced ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.16 }}
                style={{
                  position: "fixed",
                  top: anchor.top + 8,
                  left: Math.min(anchor.left, window.innerWidth - PANEL_WIDTH - 16),
                  width: PANEL_WIDTH
                }}
                className="z-[9999] border border-brand-cream/15 bg-brand-deep-forest/95 text-left shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-md"
              >
                {calendarBody}
              </motion.div>
            )}

            {isOpen && !isDesktop && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => onOpenChange(false)}
                  className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm"
                  aria-hidden="true"
                />
                <motion.div
                  ref={panelRef}
                  role="dialog"
                  aria-label="Choose date"
                  initial={isReduced ? { opacity: 0 } : { y: "100%" }}
                  animate={isReduced ? { opacity: 1 } : { y: 0 }}
                  exit={isReduced ? { opacity: 0 } : { y: "100%" }}
                  transition={{ duration: 0.4, ease: EASE_OUT }}
                  className="fixed inset-x-0 bottom-0 z-[9999] rounded-t-xl border-t border-brand-cream/15 bg-brand-deep-forest pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_-20px_60px_rgba(0,0,0,0.55)]"
                >
                  <div className="flex justify-center pt-2.5" aria-hidden="true">
                    <span className="h-1 w-10 rounded-full bg-brand-cream/25" />
                  </div>
                  <div className="border-b border-brand-cream/10 px-5 pb-3 pt-1">
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-brand-cream">
                      Select date
                    </span>
                  </div>
                  {calendarBody}
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
