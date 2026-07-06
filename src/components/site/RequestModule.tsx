import { useState } from "react";
import { MapPin, Navigation, Calendar, Clock } from "lucide-react";
import { CONTACT } from "../../lib/contact";

const JOURNEY_TYPES = [
  "Airport transfer",
  "Point-to-point",
  "By the hour",
  "Long-distance"
] as const;

const field =
  "w-full border border-hairline bg-black/40 py-2.5 pl-9 pr-3 font-sans text-[13px] text-ivory placeholder:text-muted-stone/70 focus:border-stone-cream/50 focus:outline-none transition-colors";

const iconWrap = "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-stone";

/**
 * Compact private-request module modelled on Blacklane's booking widget:
 * a segmented journey-type control over placeholder-only fields, kept tight
 * so it sits neatly in the hero rather than dominating it. Submitting composes
 * a personal WhatsApp request — no price calculator, reviewed before confirming.
 */
export default function RequestModule({ className = "" }: { className?: string }) {
  const [journeyType, setJourneyType] = useState<string>(JOURNEY_TYPES[0]);
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = [
      "ALAIR NOIR — Chauffeur request",
      `Journey type: ${journeyType}`,
      pickup && `Pickup: ${pickup}`,
      destination && `Destination: ${destination}`,
      date && `Date: ${date}`,
      time && `Time: ${time}`
    ].filter(Boolean);
    const url = `${CONTACT.whatsappHref}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className={`w-full max-w-[380px] border border-hairline bg-forest/80 p-5 backdrop-blur-md ${className}`}
    >
      <h2 className="font-serif text-[20px] font-medium leading-none text-ivory">
        Plan your journey
      </h2>

      {/* Journey type — segmented pills */}
      <div className="mt-4 grid grid-cols-2 gap-1.5" role="tablist" aria-label="Journey type">
        {JOURNEY_TYPES.map((t) => {
          const active = journeyType === t;
          return (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setJourneyType(t)}
              className={`px-2 py-2 text-[11px] tracking-[0.02em] transition-colors ${
                active
                  ? "bg-ivory font-medium text-deep-black"
                  : "border border-hairline text-ivory/70 hover:text-ivory"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="mt-3 space-y-2">
        <div className="relative">
          <MapPin size={15} className={iconWrap} strokeWidth={1.6} />
          <input
            aria-label="Pickup location"
            type="text"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder="Pickup location"
            className={field}
          />
        </div>

        <div className="relative">
          <Navigation size={15} className={iconWrap} strokeWidth={1.6} />
          <input
            aria-label="Destination"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Destination"
            className={field}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <Calendar size={15} className={iconWrap} strokeWidth={1.6} />
            <input
              aria-label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`${field} [color-scheme:dark]`}
            />
          </div>
          <div className="relative">
            <Clock size={15} className={iconWrap} strokeWidth={1.6} />
            <input
              aria-label="Time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={`${field} [color-scheme:dark]`}
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-1 w-full bg-ivory py-3 font-sans text-[12px] uppercase tracking-[0.22em] font-medium text-deep-black transition-colors hover:bg-stone-cream"
        >
          Request Options
        </button>
      </form>

      <p className="mt-3 font-sans text-[10.5px] leading-relaxed text-muted-stone">
        Your request is reviewed personally before confirmation.
      </p>
    </div>
  );
}
