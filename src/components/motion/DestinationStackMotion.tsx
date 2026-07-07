import { motion, useSpring, type MotionValue } from "motion/react";
import StackedClientCards from "./StackedClientCards";
import { DESTINATIONS } from "../../data/visualJourney";

interface DestinationStackMotionProps {
  /** Scrolls to the request section — wired to the "Arrange Route" CTA. */
  onArrange?: () => void;
}

/** The booking route list — reduced to plain destinations for the client. */
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
 * Section 04 — "Where we drive." The schematic SVG route line and 3D
 * destination card stack (StackedClientCards engine) are kept as the visual
 * map, but the copy is reduced to a simple route list and a single CTA so the
 * section stays booking-focused. Content lives in DESTINATIONS
 * (src/data/visualJourney.ts).
 */
export default function DestinationStackMotion({ onArrange }: DestinationStackMotionProps) {
  return (
    <StackedClientCards
      cards={DESTINATIONS}
      sectionId="destination-section"
      ariaLabel="Destinations served from Zürich"
      sectionClassName="bg-brand-black"
      heightPerCardVh={44}
      aside={() => (
        <div className="max-w-xl">
          <span className="mb-5 block font-mono text-[11px] uppercase tracking-[0.32em] text-brand-gold">
            The Routes
          </span>
          <h2 className="font-serif text-4xl font-light leading-[1.05] tracking-tight text-brand-ivory md:text-5xl lg:text-6xl">
            Where we drive
          </h2>

          <ul className="mt-8 flex max-w-md flex-wrap gap-x-3 gap-y-3">
            {ROUTE_LIST.map((route) => (
              <li
                key={route}
                className="border border-brand-cream/15 bg-brand-black/40 px-3.5 py-2 text-[11px] font-mono uppercase tracking-[0.14em] text-brand-ivory/85"
              >
                {route}
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-md text-sm font-light leading-relaxed text-brand-body">
            Request your route. We confirm availability and rate directly.
          </p>

          <button
            type="button"
            onClick={onArrange}
            className="group mt-8 flex w-fit cursor-pointer items-center gap-4 border border-brand-cream/25 px-7 py-3.5 text-[10px] font-mono uppercase tracking-[0.22em] text-brand-cream transition-colors duration-300 hover:border-brand-cream/60 hover:text-brand-ivory focus:outline-none focus-visible:border-brand-gold"
          >
            <span>Arrange Route</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
        </div>
      )}
      background={(progress) => <RouteLine progress={progress} />}
    />
  );
}

/** Schematic route line drawn by scroll progress, with per-destination stops. */
function RouteLine({ progress }: { progress: MotionValue<number> }) {
  const drawn = useSpring(progress, { stiffness: 60, damping: 22, restDelta: 0.001 });

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="h-full w-full opacity-45"
    >
      {/* Faint full route as reference. */}
      <path
        d={ROUTE_PATH}
        fill="none"
        stroke="rgba(234, 222, 206, 0.10)"
        strokeWidth="0.18"
        vectorEffect="non-scaling-stroke"
        strokeDasharray="0.9 1.3"
      />
      {/* The travelled portion draws with scroll. */}
      <motion.path
        d={ROUTE_PATH}
        fill="none"
        stroke="rgba(205, 162, 80, 0.55)"
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
            fill="rgba(205, 162, 80, 0.5)"
          />
        );
      })}
    </svg>
  );
}

/**
 * A gentle west-to-east arc across the stage. routePoint() mirrors the same
 * curve analytically so destination stops sit exactly on the drawn path.
 */
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
