import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { INTEL_ROUTES } from "../data";
import { CornerMarkers, useReducedMotionPref } from "./MotionProvider";

interface SwissRouteIntelligenceProps {
  onRequestScroll: () => void;
}

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const HUB_ID = "zurich-city";

export default function SwissRouteIntelligence({ onRequestScroll }: SwissRouteIntelligenceProps) {
  const [selectedId, setSelectedId] = useState("zurich-airport");
  const isReduced = useReducedMotionPref();

  const hub = INTEL_ROUTES.find((route) => route.id === HUB_ID) ?? INTEL_ROUTES[0];
  const selected = INTEL_ROUTES.find((route) => route.id === selectedId) ?? INTEL_ROUTES[0];
  const isHubSelected = selected.id === HUB_ID;

  return (
    <section className="relative overflow-hidden border-b border-brand-cream/10 bg-brand-black px-6 py-24 md:px-12 md:py-36 lg:px-24 luxury-noise">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-14 max-w-3xl md:mb-20">
          <span className="mb-4 block text-xs font-mono uppercase tracking-[0.3em] text-brand-gold">
            Routes
          </span>
          <h2 className="mb-6 font-serif text-3xl font-light tracking-tight text-brand-ivory md:text-5xl lg:text-6xl">
            From Zürich to wherever <br />
            <span className="font-light italic text-brand-stone">the day requires.</span>
          </h2>
          <p className="text-base font-light leading-relaxed text-brand-stone">
            ALAIR NOIR provides private chauffeur journeys from Zürich across Switzerland and
            selected European routes. Every route is arranged with timing, passenger comfort,
            luggage, privacy, and arrival expectations in mind. Select a destination to inspect
            the route.
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left: destination select */}
          <div className="order-2 lg:order-1 lg:col-span-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-brand-stone">
                Destinations
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-brand-gold/70">
                {selected.sector}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
              {INTEL_ROUTES.map((route) => {
                const isActive = route.id === selectedId;
                return (
                  <button
                    key={route.id}
                    type="button"
                    onClick={() => setSelectedId(route.id)}
                    onMouseEnter={() => setSelectedId(route.id)}
                    aria-pressed={isActive}
                    className={`group relative cursor-pointer border p-4 text-left transition-all duration-300 focus:outline-none focus-visible:border-brand-gold ${
                      isActive
                        ? "border-brand-gold/60 bg-brand-deep-forest/50 shadow-[0_0_24px_rgba(205,162,80,0.07)]"
                        : "border-brand-cream/10 bg-brand-black hover:border-brand-cream/30"
                    }`}
                  >
                    {isActive && <CornerMarkers />}
                    <span
                      className={`block text-[9px] font-mono tracking-[0.2em] ${
                        isActive ? "text-brand-gold" : "text-brand-stone/70"
                      }`}
                    >
                      {route.sector}
                    </span>
                    <span className="mt-2 block font-serif text-base font-light text-brand-cream">
                      {route.name}
                    </span>
                    <span className="mt-1 block text-[9px] font-mono uppercase tracking-[0.14em] text-brand-stone/80">
                      {route.eta}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: aviation-console route map */}
          <div className="order-1 lg:order-2 lg:col-span-7">
            <div className="relative flex h-full min-h-[380px] items-center justify-center border border-brand-cream/10 bg-brand-deep-forest/20 p-6">
              <CornerMarkers tone="cream" />
              <div className="absolute left-4 top-4 text-[9px] font-mono uppercase tracking-[0.2em] text-brand-stone/40">
                Route Intelligence v2.1
              </div>
              <div className="absolute right-4 top-4 flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.2em] text-brand-stone/40">
                <span className={`h-1 w-1 rounded-full bg-brand-gold ${isReduced ? "" : "animate-pulse"}`} />
                ZRH HUB / LIVE
              </div>
              <div className="absolute bottom-4 right-4 text-[9px] font-mono uppercase tracking-[0.2em] text-brand-stone/40">
                CH SECTOR GRID
              </div>

              <svg
                viewBox="0 0 100 100"
                className="relative z-10 aspect-square w-full max-w-[420px] overflow-visible"
                role="img"
                aria-label={`Route map from Zürich to ${selected.name}`}
              >
                {/* Abstract Swiss border */}
                <polygon
                  points="33,10 55,8 66,14 74,12 82,22 90,34 96,50 88,58 92,70 80,74 70,86 62,94 52,84 44,88 34,80 20,88 8,84 4,76 12,66 18,58 12,50 20,40 26,28"
                  fill="none"
                  stroke="rgba(214, 199, 176, 0.07)"
                  strokeWidth="0.8"
                />

                {/* Console grid */}
                <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(214,199,176,0.04)" strokeWidth="0.5" strokeDasharray="2" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(214,199,176,0.04)" strokeWidth="0.5" strokeDasharray="2" />
                <circle cx={hub.coordinates.x} cy={hub.coordinates.y} r="16" fill="none" stroke="rgba(205,162,80,0.08)" strokeWidth="0.5" strokeDasharray="1.5" />
                <circle cx={hub.coordinates.x} cy={hub.coordinates.y} r="28" fill="none" stroke="rgba(205,162,80,0.05)" strokeWidth="0.5" strokeDasharray="1.5" />

                {/* Faint standing connections */}
                {INTEL_ROUTES.filter((route) => route.id !== HUB_ID).map((route) => (
                  <line
                    key={`base-${route.id}`}
                    x1={hub.coordinates.x}
                    y1={hub.coordinates.y}
                    x2={route.coordinates.x}
                    y2={route.coordinates.y}
                    stroke="rgba(214, 199, 176, 0.1)"
                    strokeWidth="0.5"
                  />
                ))}

                {/* Active route draw */}
                {!isHubSelected && (
                  <motion.line
                    key={`active-${selected.id}`}
                    x1={hub.coordinates.x}
                    y1={hub.coordinates.y}
                    x2={selected.coordinates.x}
                    y2={selected.coordinates.y}
                    stroke="var(--color-brand-gold)"
                    strokeWidth="1"
                    initial={isReduced ? false : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.1, ease: EASE_OUT }}
                  />
                )}

                {/* Travel pulse along the active route */}
                {!isHubSelected && !isReduced && (
                  <motion.circle
                    key={`pulse-${selected.id}`}
                    r="1.1"
                    fill="var(--color-brand-gold)"
                    initial={{ cx: hub.coordinates.x, cy: hub.coordinates.y, opacity: 0 }}
                    animate={{
                      cx: selected.coordinates.x,
                      cy: selected.coordinates.y,
                      opacity: [0, 1, 1, 0]
                    }}
                    transition={{ duration: 1.4, delay: 0.2, ease: "easeInOut" }}
                  />
                )}

                {/* Hub pulse */}
                {!isReduced && (
                  <circle
                    cx={hub.coordinates.x}
                    cy={hub.coordinates.y}
                    r="4"
                    fill="none"
                    stroke="var(--color-brand-gold)"
                    strokeWidth="0.6"
                    className="animate-ping"
                    style={{
                      transformOrigin: `${hub.coordinates.x}px ${hub.coordinates.y}px`,
                      animationDuration: "2.6s"
                    }}
                  />
                )}

                {/* Destination markers */}
                {INTEL_ROUTES.map((route) => {
                  const isActive = route.id === selectedId;
                  const isHub = route.id === HUB_ID;
                  return (
                    <g key={route.id}>
                      <circle
                        cx={route.coordinates.x}
                        cy={route.coordinates.y}
                        r={isHub ? 2.4 : isActive ? 2 : 1.4}
                        fill={
                          isActive || isHub
                            ? "var(--color-brand-gold)"
                            : "var(--color-brand-stone)"
                        }
                        onClick={() => setSelectedId(route.id)}
                        className="cursor-pointer"
                      />
                      <text
                        x={route.coordinates.x + 3}
                        y={route.coordinates.y - 2.5}
                        fill={isActive ? "var(--color-brand-ivory)" : "rgba(246, 242, 233, 0.42)"}
                        fontSize="3"
                        fontWeight={isActive ? "bold" : "normal"}
                        fontFamily="var(--font-mono)"
                        className="pointer-events-none select-none"
                      >
                        {route.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom: selected route detail */}
        <div className="mt-10 border border-brand-cream/10 bg-brand-deep-forest/15">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={isReduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={isReduced ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
              className="flex flex-col gap-6 p-6 md:p-8 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="max-w-2xl">
                <div className="mb-2 flex items-center gap-3">
                  <span className="text-[10px] font-mono tracking-[0.24em] text-brand-gold">
                    {selected.sector}
                  </span>
                  <span className="h-px w-8 bg-brand-gold/30" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-brand-stone">
                    {isHubSelected ? "Operations base" : `Zürich → ${selected.name}`}
                  </span>
                </div>
                <p className="font-serif text-lg font-light italic text-brand-ivory md:text-xl">
                  “{selected.description}”
                </p>
              </div>

              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center lg:flex-col lg:items-end xl:flex-row xl:items-center">
                <div className="text-left lg:text-right xl:text-left">
                  <span className="block text-[9px] font-mono uppercase tracking-[0.24em] text-brand-stone">
                    Est. transfer
                  </span>
                  <span className="mt-1 block font-serif text-lg font-light text-brand-gold">
                    {selected.eta}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onRequestScroll}
                  className="cursor-pointer whitespace-nowrap bg-brand-cream px-8 py-4 text-xs font-mono font-medium uppercase tracking-[0.2em] text-brand-black transition-all duration-300 hover:bg-brand-ivory hover:text-brand-deep-forest focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                >
                  Arrange this route
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
