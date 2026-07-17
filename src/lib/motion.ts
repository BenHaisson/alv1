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
  hidden: { opacity: 0, y: 56 },
  show: {
    opacity: 1,
    y: 0,
    transition: REVEAL_TRANSITION
  }
};

export const STAGGER_GROUP_VARIANTS: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08
    }
  }
};
