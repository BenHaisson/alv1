import { useEffect, useRef, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

// Signature ALAIR NOIR easing carried over from the main-branch motion system.
export const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Arms once when the element first intersects the viewport. IntersectionObserver
 * does the efficient waiting, but a passive scroll/resize rect check backs it
 * up — some environments deliver only the initial IO observation and never the
 * scroll-driven updates, which silently defeats motion's own whileInView. Ported
 * from the main-branch motion system so reveals never get stuck hidden.
 */
function useRevealArm<T extends HTMLElement>(amount = 0.18) {
  const ref = useRef<T>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || armed) return;

    const isInView = () => {
      const rect = el.getBoundingClientRect();
      if (rect.height === 0) return false;
      const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      return visible / rect.height >= amount || rect.top < window.innerHeight;
    };

    if (isInView()) {
      setArmed(true);
      return;
    }

    const arm = () => setArmed(true);
    const onScroll = () => {
      if (isInView()) arm();
    };

    let observer: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) arm();
        },
        { threshold: 0, rootMargin: "0px 0px -10% 0px" }
      );
      observer.observe(el);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [armed, amount]);

  return { ref, armed };
}

/**
 * Quiet fade-up reveal as an element scrolls into view. Reused across the
 * compact homepage and menu pages in place of the old cinematic scroll rig.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className = ""
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const { ref, armed } = useRevealArm<HTMLDivElement>();
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={armed ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Subtle magnetic pull on hover — max 10px — for primary CTAs. Wraps any
 * child (link, anchor, button) rather than forcing a <button>.
 */
export function Magnetic({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const reduce = useReducedMotion();

  const onMove = (e: MouseEvent) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const max = 10;
    setPos({
      x: ((e.clientX - (left + width / 2)) / (width / 2)) * max,
      y: ((e.clientY - (top + height / 2)) / (height / 2)) * max
    });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 150, damping: 18, mass: 0.1 }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
