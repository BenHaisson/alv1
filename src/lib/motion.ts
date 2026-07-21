import type { Transition, Variants, ViewportOptions } from "motion/react";

export const MOTION_EASE = [0.22, 1, 0.36, 1] as const;
export const CURTAIN_EASE = [0.76, 0, 0.24, 1] as const;

export const MOTION_DURATION = {
  fast: 0.28,
  base: 0.55,
  reveal: 0.95,
  cinematic: 1.2,
  settle: 1.55
} as const;

export const MOTION_VIEWPORT: ViewportOptions = {
  once: true,
  amount: 0.35
};

export const PREMIUM_SPRING: Transition = {
  type: "spring",
  stiffness: 155,
  damping: 34,
  mass: 0.9
};

export const INERTIA_SPRING: Transition = {
  type: "spring",
  stiffness: 70,
  damping: 26,
  mass: 1.2
};

export const REVEAL_TRANSITION: Transition = {
  duration: MOTION_DURATION.reveal,
  ease: MOTION_EASE
};

export const CINEMATIC_TRANSITION: Transition = {
  duration: MOTION_DURATION.cinematic,
  ease: MOTION_EASE
};

export const REVEAL_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 48, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: REVEAL_TRANSITION
  }
};

/* Large serif headlines: a slower settle with a soft focus pull, so display
   type arrives like a title card rather than a list item. */
export const HEADING_REVEAL_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.985, filter: "blur(14px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: CINEMATIC_TRANSITION
  }
};

export const STAGGER_GROUP_VARIANTS: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.1
    }
  }
};
