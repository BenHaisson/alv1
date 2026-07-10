import type { Transition, ViewportOptions } from "motion/react";

export const MOTION_EASE = [0.16, 1, 0.3, 1] as const;
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
  stiffness: 140,
  damping: 28,
  mass: 0.8
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
