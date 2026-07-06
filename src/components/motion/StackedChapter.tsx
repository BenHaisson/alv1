import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotionPref } from "../MotionProvider";

interface StackedChapterProps {
  children: ReactNode;
  /** Paint order — must ascend down the page so later sheets cover pinned ones. */
  zIndex: number;
  /** Optional nav anchor, rendered as a zero-height flow sentinel (a pinned
   *  element reports rect.top ≈ 0 and would corrupt scrollToSection math). */
  id?: string;
  /** Rollback lever: render in plain flow without pinning. */
  stacked?: boolean;
}

/**
 * Skiper16-style stacked page transition: the chapter pins (CSS sticky) and
 * scales down / dims while the next section slides over it like a sheet of
 * card stock. Adapted for variable-height chapters — content taller than the
 * viewport pins bottom-aligned after being fully read, so nothing is hidden.
 *
 * Must be a direct child of the page flow container (renders a fragment) so
 * sticky has the full page height to pin within. Cover progress is measured
 * on a zero-height sentinel placed after the sticky block: the sticky element
 * keeps its flow space, so the sentinel's top equals the incoming content's
 * top — no cross-chapter ref wiring, and no useScroll on sticky elements
 * (their measured offsets are unreliable while pinned).
 */
export default function StackedChapter({
  children,
  zIndex,
  id,
  stacked = true
}: StackedChapterProps) {
  const isReduced = useReducedMotionPref();
  const stickyRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const [stickyTop, setStickyTop] = useState(0);

  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;

    const measure = () =>
      setStickyTop(Math.min(0, window.innerHeight - el.offsetHeight));

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [stacked, isReduced]);

  const { scrollYProgress: cover } = useScroll({
    target: coverRef,
    offset: ["start end", "start start"]
  });
  const scale = useTransform(cover, [0, 1], [1, 0.955]);
  const dim = useTransform(cover, [0, 1], [0, 0.42]);
  // Once fully covered, drop paint + hit-testing + tab focus for the chapter.
  const visibility = useTransform(cover, (v) =>
    v >= 0.999 ? ("hidden" as const) : ("visible" as const)
  );

  if (!stacked || isReduced) {
    return (
      <>
        {id && <div id={id} className="h-0 scroll-mt-20" aria-hidden="true" />}
        <div className="relative" style={{ zIndex }}>
          {children}
        </div>
      </>
    );
  }

  return (
    <>
      {id && <div id={id} className="h-0 scroll-mt-20" aria-hidden="true" />}
      <motion.div
        ref={stickyRef}
        className="sticky"
        style={{
          top: stickyTop,
          zIndex,
          scale,
          visibility,
          // Keeps the visible window's top edge stationary while scaling
          // (equals origin-top for chapters shorter than the viewport).
          transformOrigin: `50% ${-stickyTop}px`
          // No persistent will-change: promoting every chapter's sticky sheet
          // to its own layer for the whole page multiplied compositor memory
          // and was a prime suspect for the scroll stutter. Motion still hints
          // the layer for the duration of the transform, which is enough.
        }}
      >
        {children}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-brand-black"
          style={{ opacity: dim }}
        />
      </motion.div>
      <div ref={coverRef} aria-hidden="true" className="relative h-0 w-full" />
    </>
  );
}
