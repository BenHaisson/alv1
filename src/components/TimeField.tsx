import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useMediaQuery, useReducedMotionPref } from "./MotionProvider";
import { useAnchoredPosition } from "../lib/useAnchoredPosition";
import { useDismissable } from "../lib/useDismissable";
import { TIME_OPTIONS, formatTimeDisplay } from "../lib/dateTime";

interface TimeFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  placeholder: string;
  buttonClassName: string;
}

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const PANEL_WIDTH = 320;

/**
 * A dark-glass, 15-minute-interval time list replacing the native
 * `<input type="time">`. Desktop: portal-rendered, anchored under the
 * trigger. Mobile (<768px): a bottom sheet with a sticky title.
 */
export default function TimeField({ id, value, onChange, isOpen, onOpenChange, placeholder, buttonClassName }: TimeFieldProps) {
  const isReduced = useReducedMotionPref();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const anchor = useAnchoredPosition(triggerRef, isOpen && isDesktop);
  const selectedIndex = TIME_OPTIONS.indexOf(value);
  const [activeIndex, setActiveIndex] = useState(selectedIndex >= 0 ? selectedIndex : 0);

  useDismissable([triggerRef, panelRef], isOpen, () => onOpenChange(false));

  useEffect(() => {
    if (!isOpen) return;
    const initialIndex = selectedIndex >= 0 ? selectedIndex : 0;
    setActiveIndex(initialIndex);
    requestAnimationFrame(() => {
      itemRefs.current[initialIndex]?.scrollIntoView({ block: "center" });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    itemRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const displayText = formatTimeDisplay(value);

  const handleSelect = (time: string) => {
    onChange(time);
    onOpenChange(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, TIME_OPTIONS.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      handleSelect(TIME_OPTIONS[activeIndex]);
    }
  };

  const renderList = (heightClassName: string) => (
    <div
      ref={listRef}
      role="listbox"
      aria-label="Choose pickup time"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{ overscrollBehavior: "contain" }}
      className={`overflow-y-auto py-1.5 focus:outline-none ${heightClassName}`}
    >
      {TIME_OPTIONS.map((time, index) => {
        const isSelected = time === value;
        const isActive = index === activeIndex;
        return (
          <button
            key={time}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            type="button"
            role="option"
            aria-selected={isSelected}
            onMouseEnter={() => setActiveIndex(index)}
            onClick={() => handleSelect(time)}
            className={`flex w-full items-center px-5 py-2.5 text-left text-sm font-light transition-colors duration-100 focus:outline-none ${
              isSelected
                ? "bg-brand-gold text-brand-black"
                : isActive
                  ? "bg-brand-cream/10 text-brand-gold"
                  : "text-brand-ivory hover:bg-brand-cream/5"
            }`}
          >
            {formatTimeDisplay(time)}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        id={id}
        type="button"
        onClick={() => onOpenChange(!isOpen)}
        aria-haspopup="listbox"
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
                {renderList("max-h-[360px]")}
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
                  initial={isReduced ? { opacity: 0 } : { y: "100%" }}
                  animate={isReduced ? { opacity: 1 } : { y: 0 }}
                  exit={isReduced ? { opacity: 0 } : { y: "100%" }}
                  transition={{ duration: 0.4, ease: EASE_OUT }}
                  className="fixed inset-x-0 bottom-0 z-[9999] flex max-h-[75vh] flex-col rounded-t-xl border-t border-brand-cream/15 bg-brand-deep-forest pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_-20px_60px_rgba(0,0,0,0.55)]"
                >
                  <div className="flex justify-center pt-2.5" aria-hidden="true">
                    <span className="h-1 w-10 rounded-full bg-brand-cream/25" />
                  </div>
                  <div className="sticky top-0 border-b border-brand-cream/10 bg-brand-deep-forest px-5 pb-3 pt-1">
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-brand-cream">
                      Select pickup time
                    </span>
                  </div>
                  {renderList("flex-1")}
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
