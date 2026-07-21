import { motion, useSpring, type MotionValue } from "motion/react";
import StackedClientCards from "./StackedClientCards";
import { DESTINATIONS } from "../../data/visualJourney";
import {
  HEADING_REVEAL_VARIANTS,
  MOTION_EASE,
  PREMIUM_SPRING,
  REVEAL_VARIANTS,
  STAGGER_GROUP_VARIANTS
} from "../../lib/motion";
import { useReducedMotionPref } from "../MotionProvider";

interface DestinationStackMotionProps {
  /** Scrolls to the request section, wired to the Arrange Route CTA. */
  onArrange?: () => void;
}

/** The booking route list, reduced to plain destinations for the client. */
const ROUTE_LIST = [
  "Zürich Airport",
  "Zürich City",
  "Davos",
  "St. Moritz",
  "Lucerne",
  "Basel",
  "Geneva",
  "Milan",
  "Munich"
];

/**
 * Section 04, "Where we drive." The schematic SVG route line and destination
 * card stack remain, but the copy reveals in a short scanning rhythm.
 */
export default function DestinationStackMotion({ onArrange }: DestinationStackMotionProps) {
  const isReduced = useReducedMotionPref();

  return (
    <StackedClientCards
      cards={DESTINATIONS}
      sectionId="destination-section"
      ariaLabel="Destinations served from Zürich"
      sectionClassName="bg-brand-black"
      heightPerCardVh={44}
      aside={() => (
        <motion.div
          className="max-w-xl"
          initial={isReduced ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          variants={STAGGER_GROUP_VARIANTS}
        >
          <motion.h2
            variants={HEADING_REVEAL_VARIANTS}
            className="section-heading"
          >
            Where we drive
          </motion.h2>

          <motion.ul
            className="mt-8 flex max-w-md flex-wrap gap-x-3 gap-y-3"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
            }}
          >
            {ROUTE_LIST.map((route) => (
              <motion.li
                key={route}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.68, ease: MOTION_EASE } }
                }}
                className="border border-brand-cream/15 bg-brand-black/40 px-3.5 py-2 text-[11px] font-mono uppercase tracking-[0.14em] text-brand-ivory/85"
              >
                {route}
              </motion.li>
            ))}
          </motion.ul>

          <motion.p
            variants={REVEAL_VARIANTS}
            className="mt-8 max-w-md text-sm font-light leading-relaxed text-brand-body"
          >
            Request your route. We confirm availability and rate directly.
          </motion.p>

          <motion.button
            type="button"
            onClick={onArrange}
            variants={REVEAL_VARIANTS}
            initial="rest"
            animate="rest"
            whileHover={isReduced ? undefined : "hover"}
            transition={PREMIUM_SPRING}
            className="group mt-8 flex w-fit cursor-pointer items-center gap-4 border border-brand-cream/25 px-7 py-3.5 text-[10px] font-mono uppercase tracking-[0.22em] text-brand-cream focus:outline-none focus-visible:border-brand-gold"
          >
            <span>Arrange Route</span>
            <motion.span
              aria-hidden="true"
              variants={{
                rest: { x: 0 },
                hover: { x: 4 }
              }}
              transition={PREMIUM_SPRING}
            >
              &rarr;
            </motion.span>
          </motion.button>
        </motion.div>
      )}
      background={(progress) => <RouteLine progress={progress} />}
    />
  );
}

/** Schematic route line drawn by scroll progress, with per-destination stops. */
function RouteLine({ progress }: { progress: MotionValue<number> }) {
  const drawn = useSpring(progress, { stiffness: 60, damping: 22, restDelta: 0.001 });

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full opacity-45">
      <path
        d={ROUTE_PATH}
        fill="none"
        stroke="rgba(214, 199, 176, 0.10)"
        strokeWidth="0.18"
        vectorEffect="non-scaling-stroke"
        strokeDasharray="0.9 1.3"
      />
      <motion.path
        d={ROUTE_PATH}
        fill="none"
        stroke="rgba(212, 175, 55, 0.55)"
        strokeWidth="0.3"
        vectorEffect="non-scaling-stroke"
        style={{ pathLength: drawn }}
      />
      {DESTINATIONS.map((destination) => {
        const point = routePoint(destination.routeStop / 100);
        return (
          <circle
            key={destination.id}
            cx={point.x}
            cy={point.y}
            r="0.55"
            fill="rgba(212, 175, 55, 0.5)"
          />
        );
      })}
    </svg>
  );
}

const ROUTE_PATH = buildRoutePath();

function routePoint(t: number) {
  const x = 4 + t * 92;
  const y = 78 - t * 52 + Math.sin(t * Math.PI) * -12;
  return { x, y };
}

function buildRoutePath() {
  const steps = 48;
  const points: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const { x, y } = routePoint(i / steps);
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return points.join(" ");
}
