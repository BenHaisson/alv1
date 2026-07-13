import { motion } from "motion/react";
import type { ReactNode } from "react";

const SHORT_EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

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
      transition={{ layout: { duration: 0.34, ease: SHORT_EASE } }}
    >
      {children}
    </motion.div>
  );
}
