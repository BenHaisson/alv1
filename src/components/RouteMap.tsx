import { useState } from "react";
import { motion } from "motion/react";
import { ROUTES } from "../data";

interface RouteMapProps {
  onRequestScroll: () => void;
}

export default function RouteMap({ onRequestScroll }: RouteMapProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const activeRoute = hoveredIdx !== null ? ROUTES[hoveredIdx] : ROUTES[0]; // Default to Zurich details

  return (
    <section className="relative py-24 md:py-36 px-6 md:px-12 lg:px-24 bg-brand-black overflow-hidden luxury-noise border-b border-brand-cream/10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Title */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-brand-cream block mb-4">
            06 / Routes
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-light text-brand-ivory tracking-tight mb-6">
            Zürich-based. <br />
            <span className="italic text-brand-stone font-light">Switzerland-ready.</span>
          </h2>
          <p className="text-base text-brand-stone font-light leading-relaxed">
            ALAIR NOIR provides private chauffeur service from Zürich to key Swiss business,
            hospitality, airport, and mountain destinations. From airport arrivals to private
            residences, from financial centers to five-star hotels, every journey is planned
            around timing, comfort, and discretion.
          </p>
        </div>

        {/* Map and Details layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">
          
          {/* Left Side: Destination Select Grid (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {ROUTES.map((route, idx) => {
                const isActive = hoveredIdx === idx;
                return (
                  <div
                    key={route.name}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onClick={() => setHoveredIdx(idx)}
                    className={`p-5 border cursor-pointer transition-all duration-300 flex flex-col justify-between min-h-[110px] ${
                      isActive
                        ? "bg-brand-deep-forest/40 border-brand-cream"
                        : "bg-brand-black border-brand-cream/10 hover:border-brand-cream/30"
                    }`}
                  >
                    <span className="font-mono text-[10px] text-brand-stone tracking-wider">
                      ROUTE 0{idx + 1}
                    </span>
                    <h3 className="text-lg font-serif text-brand-cream font-light mt-2">
                      {route.name}
                    </h3>
                    <span className="text-[10px] font-mono text-brand-stone block mt-1">
                      {route.name === "Zürich City" ? "Operations Base" : "Swiss Destination"}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Dynamic details card showing details of the hovered city */}
            <div className="p-6 border border-brand-cream/10 bg-brand-deep-forest/10 mb-8 min-h-[140px] flex flex-col justify-center">
              <span className="text-[10px] font-mono tracking-widest text-brand-cream uppercase mb-2">
                Active Operational Blueprint // {activeRoute.name}
              </span>
              <p className="text-lg font-serif italic text-brand-ivory font-light">
                "{activeRoute.description}"
              </p>
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <button
                onClick={onRequestScroll}
                className="px-8 py-4 bg-brand-cream text-brand-black text-xs font-mono uppercase tracking-[0.2em] font-medium hover:bg-brand-ivory hover:text-brand-deep-forest transition-all duration-300 cursor-pointer"
              >
                Request Route Availability
              </button>
              <span className="text-sm font-serif italic text-brand-ivory/70">
                The destination can change. The standard does not.
              </span>
            </div>
          </div>

          {/* Right Side: High End SVG Abstract Map (5 cols) */}
          <div className="lg:col-span-5 flex items-center justify-center relative min-h-[350px] bg-brand-deep-forest/20 border border-brand-cream/10 p-6">
            
            {/* Background elements & lines */}
            <div className="absolute top-4 left-4 text-[9px] font-mono text-brand-stone/40">
              ALAIR RADAR SYSTEM v1.2
            </div>
            <div className="absolute bottom-4 right-4 text-[9px] font-mono text-brand-stone/40">
              ZÜRICH TRANSIT HUB
            </div>

            {/* Interactive Map Visual */}
            <svg viewBox="0 0 100 100" className="w-full max-w-[340px] aspect-square relative z-10 overflow-visible">
              
              {/* Draw abstract Swiss country coordinate shape lines in very subtle cream */}
              <polygon
                points="20,40 40,25 70,20 85,35 90,60 70,85 45,90 15,75 10,55"
                fill="none"
                stroke="rgba(214, 199, 176, 0.05)"
                strokeWidth="1"
              />

              {/* Grid Reference lines */}
              <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(214, 199, 176, 0.03)" strokeWidth="0.5" strokeDasharray="2" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(214, 199, 176, 0.03)" strokeWidth="0.5" strokeDasharray="2" />

              {/* Draw connections from Zürich (x=50, y=50) to other cities */}
              {ROUTES.map((route, idx) => {
                const isSelected = activeRoute.name === route.name;
                const targetX = route.coordinates.x;
                const targetY = route.coordinates.y;
                return (
                  <g key={route.name}>
                    {/* Connection line */}
                    {route.name !== "Zürich City" && (
                      <motion.line
                        x1="50"
                        y1="50"
                        x2={targetX}
                        y2={targetY}
                        stroke={isSelected ? "var(--color-brand-cream)" : "rgba(214, 199, 176, 0.15)"}
                        strokeWidth={isSelected ? "1.5" : "0.75"}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    )}

                    {/* Glowing highlight pulse under active city dot */}
                    {isSelected && (
                      <circle
                        cx={targetX}
                        cy={targetY}
                        r="4"
                        fill="none"
                        stroke="var(--color-brand-cream)"
                        strokeWidth="1"
                        className="animate-ping"
                        style={{ transformOrigin: `${targetX}px ${targetY}px` }}
                      />
                    )}

                    {/* Point Marker */}
                    <circle
                      cx={targetX}
                      cy={targetY}
                      r={route.name === "Zürich City" ? "3" : "2"}
                      fill={isSelected ? "var(--color-brand-ivory)" : route.name === "Zürich City" ? "var(--color-brand-cream)" : "var(--color-brand-stone)"}
                      onMouseEnter={() => setHoveredIdx(idx)}
                      className="cursor-pointer"
                    />

                    {/* Text Label */}
                    <text
                      x={targetX + 3}
                      y={targetY - 3}
                      fill={isSelected ? "var(--color-brand-ivory)" : "rgba(246, 242, 233, 0.45)"}
                      fontSize="3"
                      fontWeight={isSelected ? "bold" : "normal"}
                      fontFamily="var(--font-mono)"
                      className="select-none pointer-events-none"
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
    </section>
  );
}
