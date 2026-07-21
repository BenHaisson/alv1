import { motion } from "motion/react";
import type { ReactNode } from "react";
import { MOTION_EASE } from "../../lib/motion";

interface BookingCardProps {
  children: ReactNode;
  expanded: boolean;
}

export function BookingCard({ children, expanded }: BookingCardProps) {
  return (
    <motion.div
      layout
      layoutDependency={expanded}
      className={`hero-booking-grid ${expanded ? "hero-booking-grid--expanded" : ""}`}
      transition={{ layout: { duration: 0.42, ease: MOTION_EASE } }}
    >
      {children}
    </motion.div>
  );
}
