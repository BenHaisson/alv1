import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useReducedMotionPref } from "../MotionProvider";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Arms once when the element first intersects the viewport. IntersectionObserver
 * does the efficient waiting, but a passive scroll/resize rect check backs it
 * up — some environments deliver only the initial IO observation and never the
 * scroll-driven updates, which also silently defeats motion's whileInView.
 */
function useRevealArm<T extends HTMLElement>(amount = 0.25) {
  const ref = useRef<T>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || armed) return;

    const isInView = () => {
      const rect = el.getBoundingClientRect();
      if (rect.height === 0) return false;
      const visible =
        Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      return visible / rect.height >= amount;
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
        { threshold: amount }
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

interface MotionImageProps {
  src: string;
  alt: string;
  /** Mask reveal direction. */
  reveal?: "up" | "left";
  /** Slow settle from this scale to 1 while revealing. */
  fromScale?: number;
  duration?: number;
  delay?: number;
  className?: string;
  imgClassName?: string;
  loading?: "eager" | "lazy";
}

/**
 * Editorial image reveal: a clip-path mask opens while the image settles from
 * a slight over-scale to 1. Animates transform/clip-path only (no width or
 * height), once per viewport entry. Reduced motion renders the image plainly.
 */
export default function MotionImage({
  src,
  alt,
  reveal = "up",
  fromScale = 1.08,
  duration = 1.4,
  delay = 0,
  className = "",
  imgClassName = "",
  loading = "lazy"
}: MotionImageProps) {
  const isReduced = useReducedMotionPref();
  const { ref, armed } = useRevealArm<HTMLDivElement>();

  if (isReduced) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <img src={src} alt={alt} loading={loading} className={`h-full w-full object-cover ${imgClassName}`} />
      </div>
    );
  }

  const hiddenClip =
    reveal === "up" ? "inset(100% 0% 0% 0%)" : "inset(0% 100% 0% 0%)";

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={{ clipPath: armed ? "inset(0% 0% 0% 0%)" : hiddenClip }}
      transition={{ duration, delay, ease: EASE }}
      className={`overflow-hidden ${className}`}
    >
      <motion.img
        src={src}
        alt={alt}
        loading={loading}
        initial={false}
        animate={{ scale: armed ? 1 : fromScale }}
        transition={{ duration: duration + 0.4, delay, ease: EASE }}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </motion.div>
  );
}
