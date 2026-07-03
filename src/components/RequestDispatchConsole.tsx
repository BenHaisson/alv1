import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { imageAssets } from "../assets";
import { CornerMarkers, useReducedMotionPref } from "./MotionProvider";

interface RequestDispatchConsoleProps {
  prefilledVehicle?: string;
}

type StepId = "guest" | "route" | "timing" | "vehicle" | "instructions" | "dispatch";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const VEHICLE_META: Record<string, { label: string; caption: string; image: string }> = {
  "bmw-i7": {
    label: "BMW i7 xDrive60",
    caption: "Silent Executive Sedan",
    image: imageAssets.luxuryBmwI7
  },
  "v-class": {
    label: "Mercedes-Benz V-Class",
    caption: "Premium Private Capacity",
    image: imageAssets.luxuryVClass
  }
};

export default function RequestDispatchConsole({ prefilledVehicle = "" }: RequestDispatchConsoleProps) {
  const [route, setRoute] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [luggage, setLuggage] = useState("2");
  const [vehicle, setVehicle] = useState(prefilledVehicle || "bmw-i7");
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [activeStep, setActiveStep] = useState<StepId>("guest");
  const isReduced = useReducedMotionPref();

  useEffect(() => {
    if (prefilledVehicle) setVehicle(prefilledVehicle);
  }, [prefilledVehicle]);

  const vehicleMeta = VEHICLE_META[vehicle] ?? VEHICLE_META["bmw-i7"];
  const recommendVClass = Number.parseInt(passengers, 10) >= 4 || luggage === "4" || luggage === "5+";

  const steps = useMemo(() => {
    const guestComplete = contact.trim() !== "";
    const routeComplete = route.trim() !== "";
    const timingComplete = date !== "" && time !== "";
    const ready = guestComplete && routeComplete && timingComplete;

    return [
      { id: "guest" as StepId, number: "01", label: "Guest", complete: guestComplete },
      { id: "route" as StepId, number: "02", label: "Route", complete: routeComplete },
      { id: "timing" as StepId, number: "03", label: "Timing", complete: timingComplete },
      { id: "vehicle" as StepId, number: "04", label: "Vehicle", complete: true },
      { id: "instructions" as StepId, number: "05", label: "Instructions", complete: notes.trim() !== "" },
      { id: "dispatch" as StepId, number: "06", label: "Dispatch", complete: ready }
    ];
  }, [contact, route, date, time, notes]);

  const readyToDispatch = steps[5].complete;
  const requiredComplete = [steps[0], steps[1], steps[2]].filter((step) => step.complete).length;

  const getSpecificationText = () => {
    return `ALAIR NOIR PRIVATE TRANSFER CONSOLE
--------------------------------------------------
Origin / Destination : ${route || "To be specified"}
Date                 : ${date || "To be specified"}
Time (CET)           : ${time || "To be specified"}
Passenger Count      : ${passengers} Executive(s)
Luggage Count        : ${luggage} Large Bag(s)
Preferred Vehicle    : ${vehicleMeta.label} (${vehicleMeta.caption})
Contact Reference    : ${contact || "To be specified"}
Special Directives   : ${notes || "None"}
--------------------------------------------------
Prepared for ALAIR NOIR GmbH, Zürich, Switzerland.`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getSpecificationText());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const whatsappLink = `https://wa.me/41772870956?text=${encodeURIComponent(getSpecificationText())}`;
  const mailtoLink = `mailto:booking@alairnoir.ch?subject=Private Chauffeur Request Zürich&body=${encodeURIComponent(getSpecificationText())}`;

  const groupClass = (step: StepId) =>
    `flex flex-col border p-5 transition-all duration-500 ${
      activeStep === step
        ? "border-brand-gold/50 bg-brand-deep-forest/40 shadow-[0_0_34px_rgba(205,162,80,0.07)]"
        : "border-brand-cream/10 bg-brand-deep-forest/20"
    }`;

  const labelClass = "mb-2 text-[10px] font-mono uppercase tracking-widest text-brand-gold";
  const inputClass =
    "w-full border border-brand-cream/10 bg-brand-black/60 p-4 text-sm font-light font-sans text-brand-ivory transition-all placeholder:text-brand-stone/40 focus:border-brand-gold/60 focus:outline-none";

  return (
    <section
      id="request-section"
      className="relative overflow-hidden border-b border-brand-cream/10 bg-brand-black px-6 py-24 md:px-12 md:py-36 lg:px-24 luxury-noise"
    >
      <div className="mx-auto max-w-7xl">
        {/* Console header */}
        <div className="mb-12 max-w-3xl md:mb-16">
          <span className="mb-4 block text-xs font-mono uppercase tracking-[0.3em] text-brand-gold">
            Booking
          </span>
          <h2 className="mb-6 font-serif text-3xl font-light tracking-tight text-brand-ivory md:text-5xl lg:text-6xl">
            Begin with the route. <span className="font-light italic text-brand-stone">We will prepare the rest.</span>
          </h2>
          <p className="text-sm font-light leading-relaxed text-brand-stone md:text-base">
            Send your pickup point, destination, date, time, passenger count, luggage details, and
            preferred vehicle. ALAIR NOIR will confirm availability, route suitability, and the
            chauffeur arrangement directly.
          </p>
        </div>

        {/* Step progress rail */}
        <div className="mb-12 grid grid-cols-3 gap-2 md:grid-cols-6 md:gap-3">
          {steps.map((step) => {
            const isActive = activeStep === step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  setActiveStep(step.id);
                  document
                    .getElementById(`console-${step.id}`)
                    ?.scrollIntoView({ behavior: isReduced ? "auto" : "smooth", block: "center" });
                }}
                className={`cursor-pointer border px-3 py-3 text-left transition-all duration-300 focus:outline-none focus-visible:border-brand-gold ${
                  isActive
                    ? "border-brand-gold/60 bg-brand-gold-muted"
                    : "border-brand-cream/10 bg-brand-deep-forest/20 hover:border-brand-cream/25"
                }`}
              >
                <span className="flex items-center justify-between">
                  <span
                    className={`text-[9px] font-mono tracking-[0.2em] ${
                      isActive ? "text-brand-gold" : "text-brand-stone/70"
                    }`}
                  >
                    {step.number}
                  </span>
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
                      step.complete ? "bg-brand-gold" : "border border-brand-stone/50"
                    }`}
                  />
                </span>
                <span
                  className={`mt-1.5 block text-[10px] font-mono uppercase tracking-[0.16em] ${
                    isActive ? "text-brand-cream" : "text-brand-stone"
                  }`}
                >
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left: dispatch form */}
          <div className="lg:col-span-7">
            <form onSubmit={(event) => event.preventDefault()} className="space-y-5">
              {/* 01 Guest */}
              <fieldset
                id="console-guest"
                onFocus={() => setActiveStep("guest")}
                className={groupClass("guest")}
              >
                <legend className="sr-only">Guest details</legend>
                <span className="mb-4 text-[9px] font-mono uppercase tracking-[0.26em] text-brand-stone">
                  01 / Guest
                </span>
                <div className="space-y-5">
                  <div className="flex flex-col">
                    <label htmlFor="console-contact" className={labelClass}>
                      Contact (Email / Phone)
                    </label>
                    <input
                      id="console-contact"
                      type="text"
                      required
                      placeholder="booking@clientoffice.com or +41..."
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="flex flex-col">
                      <label htmlFor="console-passengers" className={labelClass}>
                        Passenger Count
                      </label>
                      <select
                        id="console-passengers"
                        value={passengers}
                        onChange={(e) => setPassengers(e.target.value)}
                        className={`${inputClass} cursor-pointer`}
                      >
                        <option value="1">1 Executive</option>
                        <option value="2">2 Passengers</option>
                        <option value="3">3 Passengers</option>
                        <option value="4">4 Group Passengers</option>
                        <option value="5">5+ Delegation Group</option>
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="console-luggage" className={labelClass}>
                        Large Luggage Bags
                      </label>
                      <select
                        id="console-luggage"
                        value={luggage}
                        onChange={(e) => setLuggage(e.target.value)}
                        className={`${inputClass} cursor-pointer`}
                      >
                        <option value="0">No luggage</option>
                        <option value="1">1 Large Bag</option>
                        <option value="2">2 Standard Bags</option>
                        <option value="3">3 Medium Bags</option>
                        <option value="4">4 Large Cabin Cases</option>
                        <option value="5+">5+ Large Cases</option>
                      </select>
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* 02 Route */}
              <fieldset
                id="console-route"
                onFocus={() => setActiveStep("route")}
                className={groupClass("route")}
              >
                <legend className="sr-only">Route details</legend>
                <span className="mb-4 text-[9px] font-mono uppercase tracking-[0.26em] text-brand-stone">
                  02 / Route
                </span>
                <div className="flex flex-col">
                  <label htmlFor="console-route-input" className={labelClass}>
                    Route Description (e.g., Zürich Airport to Davos)
                  </label>
                  <input
                    id="console-route-input"
                    type="text"
                    required
                    placeholder="Enter pickup address and destination stop"
                    value={route}
                    onChange={(e) => setRoute(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </fieldset>

              {/* 03 Timing */}
              <fieldset
                id="console-timing"
                onFocus={() => setActiveStep("timing")}
                className={groupClass("timing")}
              >
                <legend className="sr-only">Timing details</legend>
                <span className="mb-4 text-[9px] font-mono uppercase tracking-[0.26em] text-brand-stone">
                  03 / Timing
                </span>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="flex flex-col">
                    <label htmlFor="console-date" className={labelClass}>
                      Scheduled Date
                    </label>
                    <input
                      id="console-date"
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="console-time" className={labelClass}>
                      Scheduled Time (CET)
                    </label>
                    <input
                      id="console-time"
                      type="time"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              </fieldset>

              {/* 04 Vehicle */}
              <fieldset
                id="console-vehicle"
                onFocus={() => setActiveStep("vehicle")}
                className={groupClass("vehicle")}
              >
                <legend className="sr-only">Preferred vehicle</legend>
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[9px] font-mono uppercase tracking-[0.26em] text-brand-stone">
                    04 / Vehicle
                  </span>
                  {recommendVClass && (
                    <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-brand-gold/80">
                      V-Class suggested for this group
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {Object.entries(VEHICLE_META).map(([id, meta]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setVehicle(id)}
                      aria-pressed={vehicle === id}
                      className={`flex cursor-pointer flex-col justify-between border p-4 text-left transition-all duration-300 focus:outline-none focus-visible:border-brand-gold ${
                        vehicle === id
                          ? "border-brand-gold bg-brand-gold-muted"
                          : "border-brand-cream/10 hover:border-brand-gold/40"
                      }`}
                    >
                      <span className="font-serif text-sm text-brand-ivory">{meta.label}</span>
                      <span className="mt-1 text-[9px] font-mono text-brand-stone">{meta.caption}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* 05 Instructions */}
              <fieldset
                id="console-instructions"
                onFocus={() => setActiveStep("instructions")}
                className={groupClass("instructions")}
              >
                <legend className="sr-only">Private instructions</legend>
                <span className="mb-4 text-[9px] font-mono uppercase tracking-[0.26em] text-brand-stone">
                  05 / Instructions — optional
                </span>
                <div className="flex flex-col">
                  <label htmlFor="console-notes" className={labelClass}>
                    Private Directives / Notes
                  </label>
                  <textarea
                    id="console-notes"
                    placeholder="Flight numbers, temperature, communication boundaries, or handover instructions..."
                    value={notes}
                    rows={3}
                    onChange={(e) => setNotes(e.target.value)}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </fieldset>
            </form>
          </div>

          {/* Right: live dispatch summary */}
          <div
            id="console-dispatch"
            className="relative flex h-full flex-col justify-between border border-brand-cream/10 bg-brand-deep-forest/20 p-7 lg:col-span-5"
            onMouseEnter={() => setActiveStep("dispatch")}
          >
            <CornerMarkers />

            <div>
              <div className="mb-6 flex items-center justify-between border-b border-brand-cream/10 pb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-brand-stone">
                  Live Request Summary
                </span>
                <span className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      readyToDispatch ? "bg-brand-gold" : "bg-brand-stone/40"
                    } ${isReduced ? "" : "animate-pulse"}`}
                  />
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-brand-gold/80">
                    {readyToDispatch ? "READY" : "STANDBY"}
                  </span>
                </span>
              </div>

              {/* Selected vehicle preview */}
              <div className="relative mb-6 h-32 overflow-hidden border border-brand-cream/10">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={vehicle}
                    src={vehicleMeta.image}
                    alt={vehicleMeta.label}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    initial={isReduced ? false : { opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={isReduced ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.6, ease: EASE_OUT }}
                    className="h-full w-full object-cover brightness-[0.85]"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/85 to-transparent" />
                <div className="absolute bottom-2 left-3">
                  <span className="block font-serif text-sm text-brand-ivory">{vehicleMeta.label}</span>
                  <span className="block text-[8px] font-mono uppercase tracking-[0.2em] text-brand-gold">
                    {vehicleMeta.caption}
                  </span>
                </div>
              </div>

              {/* Required-field progress */}
              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.2em] text-brand-stone">
                  <span>Dispatch sequence</span>
                  <span>{requiredComplete} / 3 required</span>
                </div>
                <div className="h-[2px] w-full bg-brand-cream/10">
                  <motion.div
                    animate={{ scaleX: requiredComplete / 3 }}
                    transition={{ duration: isReduced ? 0 : 0.6, ease: EASE_OUT }}
                    className="h-full origin-left bg-brand-gold"
                  />
                </div>
              </div>

              <div className="mb-8 max-h-[300px] overflow-y-auto whitespace-pre-wrap rounded border border-brand-cream/5 bg-brand-black/90 p-5 font-mono text-xs leading-relaxed text-brand-stone select-all">
                {getSpecificationText()}
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                onClick={handleCopy}
                className="w-full cursor-pointer border border-brand-gold/30 py-4 text-xs font-mono uppercase tracking-[0.2em] text-brand-gold transition-all duration-300 hover:border-brand-gold hover:bg-brand-gold-muted focus:outline-none focus-visible:border-brand-gold"
              >
                {isCopied ? "Request Copied to Clipboard" : "Copy Request Draft"}
              </button>

              <AnimatePresence mode="wait" initial={false}>
                {readyToDispatch ? (
                  <motion.div
                    key="dispatch-actions"
                    initial={isReduced ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={isReduced ? undefined : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.5, ease: EASE_OUT }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-brand-gold py-4 text-center text-xs font-mono font-semibold uppercase tracking-[0.15em] text-brand-black transition-all duration-300 hover:bg-brand-ivory"
                    >
                      WhatsApp Dispatch
                    </a>
                    <a
                      href={mailtoLink}
                      className="block border border-brand-gold py-4 text-center text-xs font-mono uppercase tracking-[0.15em] text-brand-gold transition-all duration-300 hover:bg-brand-gold-muted"
                    >
                      Email Booking Desk
                    </a>
                  </motion.div>
                ) : (
                  <motion.p
                    key="dispatch-hint"
                    initial={isReduced ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={isReduced ? undefined : { opacity: 0 }}
                    className="border border-brand-cream/10 bg-brand-black/40 px-4 py-3.5 text-center text-[9px] font-mono uppercase tracking-[0.2em] text-brand-stone"
                  >
                    Complete guest / route / timing to unlock dispatch
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
