import { motion, useSpring, type MotionValue } from "motion/react";
import StackedClientCards from "./StackedClientCards";
import { DESTINATIONS } from "../../data/visualJourney";

/**
 * Section 05 — "Zürich to wherever." 3D destination card stack (reuses the
 * StackedClientCards engine) over a schematic SVG route line that draws with
 * scroll. Pure code motion — no generated video. Content lives in
 * DESTINATIONS (src/data/visualJourney.ts).
 */
export default function DestinationStackMotion() {
  return (
    <StackedClientCards
      cards={DESTINATIONS}
      sectionId="destination-section"
      ariaLabel="Destinations served from Zürich"
      sectionClassName="bg-brand-black"
      aside={(active, goTo) => (
        <div className="max-w-xl">
          <span className="mb-5 block font-mono text-[11px] uppercase tracking-[0.32em] text-brand-gold">
            The Routes
          </span>
          <h2 className="font-serif text-4xl font-light leading-[1.05] tracking-tight text-brand-ivory md:text-5xl lg:text-6xl">
            Zürich
            <br />
            <span className="italic text-brand-stone">to wherever.</span>
          </h2>
          <p className="mt-6 max-w-md text-base font-light leading-relaxed text-brand-stone">
            The base is Zürich. The range is the day&apos;s requirement — airport,
            city, alps, or the other end of the country.
          </p>
          <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-brand-ivory/75">
            Private chauffeur journeys from Zürich to Davos, St. Moritz, Gstaad,
            Geneva, Lucerne, and Lugano — with flight-aware airport transfers,
            hourly bookings, and selected cross-border routes to Milan and Munich
            on request. Send the route; availability and rate are confirmed
            directly.
          </p>

          <ol className="mt-10 hidden max-w-sm flex-col gap-1 lg:flex">
            {DESTINATIONS.map((card, index) => {
              const isActive = index === active;
              return (
                <li key={card.id}>
                  <button
                    type="button"
                    onClick={() => goTo(index)}
                    className="group flex w-full items-center gap-4 py-1.5 text-left focus:outline-none"
                    aria-current={isActive ? "true" : undefined}
                  >
                    <span
                      className={`font-mono text-[10px] tracking-[0.25em] transition-colors duration-300 ${
                        isActive ? "text-brand-gold" : "text-brand-muted-stone"
                      }`}
                    >
                      {card.number}
                    </span>
                    <span
                      className={`h-px transition-all duration-500 ${
                        isActive
                          ? "w-10 bg-brand-gold"
                          : "w-5 bg-brand-cream/20 group-hover:w-8 group-hover:bg-brand-gold/50"
                      }`}
                    />
                    <span
                      className={`font-serif text-lg font-light transition-colors duration-300 ${
                        isActive
                          ? "text-brand-ivory"
                          : "text-brand-stone/60 group-hover:text-brand-stone"
                      }`}
                    >
                      {card.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
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
