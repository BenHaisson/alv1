import { useState } from "react";
import { CONTACT } from "../../lib/contact";

const JOURNEY_TYPES = [
  "Airport transfer",
  "Point-to-point",
  "By the hour",
  "Long-distance"
] as const;

const fieldClass =
  "w-full border border-hairline bg-black/40 px-4 py-3 font-sans text-[13px] text-ivory placeholder:text-muted-stone/70 focus:border-stone-cream/50 focus:outline-none transition-colors";

const labelClass =
  "mb-2 block font-sans text-[10px] uppercase tracking-[0.22em] text-muted-stone";

/**
 * Compact private-request module. There is no price calculator: submitting
 * composes the journey detail into a personal WhatsApp request so the flow
 * stays reviewed-before-confirmation rather than instant booking.
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
      className={`border border-hairline bg-forest/70 p-6 backdrop-blur-md sm:p-7 ${className}`}
    >
      <h2 className="font-serif text-[24px] font-medium text-ivory">Plan your journey</h2>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="journeyType" className={labelClass}>
            Journey type
          </label>
          <select
            id="journeyType"
            value={journeyType}
            onChange={(e) => setJourneyType(e.target.value)}
            className={`${fieldClass} appearance-none`}
          >
            {JOURNEY_TYPES.map((t) => (
              <option key={t} value={t} className="bg-black text-ivory">
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="pickup" className={labelClass}>
            Pickup location
          </label>
          <input
            id="pickup"
            type="text"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder="Zürich Airport, hotel, residence"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="destination" className={labelClass}>
            Destination
          </label>
          <input
            id="destination"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Where to"
            className={fieldClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className={labelClass}>
              Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`${fieldClass} [color-scheme:dark]`}
            />
          </div>
          <div>
            <label htmlFor="time" className={labelClass}>
              Time
            </label>
            <input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={`${fieldClass} [color-scheme:dark]`}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-ivory px-7 py-[15px] font-sans text-[12px] uppercase tracking-[0.22em] font-medium text-deep-black transition-colors hover:bg-stone-cream"
        >
          Request Options
        </button>
      </form>

      <p className="mt-4 font-sans text-[11px] leading-relaxed text-muted-stone">
        Your request is reviewed personally before confirmation.
      </p>
    </div>
  );
}
