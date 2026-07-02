import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";

interface RequestSectionProps {
  prefilledVehicle?: string;
}

export default function RequestSection({ prefilledVehicle = "" }: RequestSectionProps) {
  // Input states
  const [route, setRoute] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [luggage, setLuggage] = useState("2");
  const [vehicle, setVehicle] = useState(prefilledVehicle || "bmw-i7");
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState("");

  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Generate the formal copyable specification string
  const getSpecificationText = () => {
    return `ALAIR NOIR PRIVATE TRAVEL INQUIRY SPECIFICATION
--------------------------------------------------
Origin / Destination : ${route || "To be specified"}
Date                 : ${date || "To be specified"}
Time (CET)           : ${time || "To be specified"}
Passenger Count      : ${passengers} Executive(s)
Luggage Count        : ${luggage} Large Bag(s)
Preferred Vehicle    : ${vehicle === "bmw-i7" ? "BMW i7 2026 (Sleek Electric Sedan)" : "Mercedes V-Class 2026 (Executive VIP Cabin)"}
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  const whatsappLink = `https://wa.me/41772870956?text=${encodeURIComponent(getSpecificationText())}`;
  const mailtoLink = `mailto:booking@alairnoir.ch?subject=Private Chauffeur Request Zürich&body=${encodeURIComponent(getSpecificationText())}`;

  return (
    <section id="request-section" className="relative py-24 md:py-36 px-6 md:px-12 lg:px-24 bg-brand-black overflow-hidden luxury-noise border-b border-brand-cream/10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="max-w-3xl mb-16 md:mb-24">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-brand-gold block mb-4">
            Private Mobility Request
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-light text-brand-ivory tracking-tight mb-6">
            Begin with <span className="italic text-brand-stone font-light">the route.</span>
          </h2>
          <p className="text-sm md:text-base text-brand-stone font-light leading-relaxed">
            Send the date, time, route, passenger count, luggage requirements, preferred vehicle, and any private instructions. ALAIR NOIR confirms availability, vehicle recommendation, and rate directly before the journey.
          </p>
        </div>

        {/* Layout Grid: Left Form, Right Dynamic Real-Time Output */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">
          
          {/* Left: Input Form (7 columns) */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Route Input */}
              <div className="flex flex-col">
                <label className="text-[10px] font-mono uppercase text-brand-gold tracking-widest mb-2">
                  01 / Route Description (e.g., Zürich Airport to Davos)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter pickup address and destination stop"
                  value={route}
                  onChange={(e) => setRoute(e.target.value)}
                  className="w-full bg-brand-deep-forest/40 border border-brand-cream/10 p-4 text-sm text-brand-ivory font-light font-sans focus:outline-none focus:border-brand-cream transition-all placeholder:text-brand-stone/40"
                />
              </div>

              {/* Date & Time Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-[10px] font-mono uppercase text-brand-gold tracking-widest mb-2">
                    02 / Scheduled Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-brand-deep-forest/40 border border-brand-cream/10 p-4 text-sm text-brand-ivory font-light font-sans focus:outline-none focus:border-brand-cream transition-all"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-mono uppercase text-brand-gold tracking-widest mb-2">
                    03 / Scheduled Time (CET)
                  </label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-brand-deep-forest/40 border border-brand-cream/10 p-4 text-sm text-brand-ivory font-light font-sans focus:outline-none focus:border-brand-cream transition-all"
                  />
                </div>
              </div>

              {/* Passengers & Baggage Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-[10px] font-mono uppercase text-brand-gold tracking-widest mb-2">
                    04 / Passenger Count
                  </label>
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    className="w-full bg-brand-deep-forest/40 border border-brand-cream/10 p-4 text-sm text-brand-ivory font-light font-sans focus:outline-none focus:border-brand-cream transition-all cursor-pointer"
                  >
                    <option value="1">1 Executive</option>
                    <option value="2">2 Passengers</option>
                    <option value="3">3 Passengers</option>
                    <option value="4">4 Group Passengers</option>
                    <option value="5">5+ Delegation Group</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-mono uppercase text-brand-gold tracking-widest mb-2">
                    05 / Large Luggage Bags
                  </label>
                  <select
                    value={luggage}
                    onChange={(e) => setLuggage(e.target.value)}
                    className="w-full bg-brand-deep-forest/40 border border-brand-cream/10 p-4 text-sm text-brand-ivory font-light font-sans focus:outline-none focus:border-brand-cream transition-all cursor-pointer"
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

              {/* Preferred Cabin Type */}
              <div className="flex flex-col">
                <label className="text-[10px] font-mono uppercase text-brand-gold tracking-widest mb-2">
                  06 / Preferred Cabin Experience
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => setVehicle("bmw-i7")}
                    className={`p-4 border cursor-pointer flex flex-col justify-between transition-all duration-300 ${
                      vehicle === "bmw-i7" ? "bg-brand-gold-muted border-brand-gold" : "border-brand-cream/10 hover:border-brand-gold/40"
                    }`}
                  >
                    <span className="font-serif text-sm text-brand-ivory">BMW i7 2026</span>
                    <span className="text-[9px] font-mono text-brand-stone mt-1">Sleek Electric Sedan</span>
                  </div>
                  <div
                    onClick={() => setVehicle("v-class")}
                    className={`p-4 border cursor-pointer flex flex-col justify-between transition-all duration-300 ${
                      vehicle === "v-class" ? "bg-brand-gold-muted border-brand-gold" : "border-brand-cream/10 hover:border-brand-gold/40"
                    }`}
                  >
                    <span className="font-serif text-sm text-brand-ivory">Mercedes V-Class 2026</span>
                    <span className="text-[9px] font-mono text-brand-stone mt-1">VIP Luxury Cabin</span>
                  </div>
                </div>
              </div>

              {/* Contact Reference */}
              <div className="flex flex-col">
                <label className="text-[10px] font-mono uppercase text-brand-gold tracking-widest mb-2">
                  07 / Your Contact (Email / Phone)
                </label>
                <input
                  type="text"
                  required
                  placeholder="booking@clientoffice.com or +41..."
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full bg-brand-deep-forest/40 border border-brand-cream/10 p-4 text-sm text-brand-ivory font-light font-sans focus:outline-none focus:border-brand-cream transition-all placeholder:text-brand-stone/40"
                />
              </div>

              {/* Special Instructions */}
              <div className="flex flex-col">
                <label className="text-[10px] font-mono uppercase text-brand-gold tracking-widest mb-2">
                  08 / Private Directives / Notes
                </label>
                <textarea
                  placeholder="State any temperature, communication boundaries, flight numbers, or secure key handover instructions..."
                  value={notes}
                  rows={3}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-brand-deep-forest/40 border border-brand-cream/10 p-4 text-sm text-brand-ivory font-light font-sans focus:outline-none focus:border-brand-cream transition-all placeholder:text-brand-stone/40 resize-none"
                />
              </div>

              <div className="pt-4 flex items-center space-x-6">
                <button
                  type="submit"
                  className="px-8 py-4 bg-brand-cream text-brand-black text-xs font-mono uppercase tracking-[0.2em] font-medium hover:bg-brand-ivory transition-all duration-300 cursor-pointer"
                >
                  Generate Private Spec
                </button>
              </div>

            </form>
          </div>

          {/* Right: Dynamic Output Summary & Instant CTA Directives (5 columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full bg-brand-deep-forest/20 border border-brand-cream/10 p-8 relative">
            
            {/* Top header */}
            <div>
              <div className="flex justify-between items-center mb-6 pb-2 border-b border-brand-cream/10">
                <span className="text-[10px] font-mono text-brand-stone uppercase tracking-widest">
                  Live Dispatch Speculator
                </span>
                <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
              </div>

              <p className="text-sm font-serif italic text-brand-ivory mb-6">
                "Private mobility should not feel complicated. It should feel prepared."
              </p>

              {/* Monospace Code summary */}
              <div className="p-6 bg-brand-black/90 border border-brand-cream/5 rounded font-mono text-xs text-brand-stone leading-relaxed whitespace-pre-wrap select-all mb-8 max-h-[380px] overflow-y-auto">
                {getSpecificationText()}
              </div>
            </div>

            {/* CTA panel */}
            <div className="space-y-4">
              <button
                onClick={handleCopy}
                className="w-full py-4 border border-brand-gold/30 hover:border-brand-gold hover:bg-brand-gold-muted text-brand-gold text-xs font-mono uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer"
              >
                {isCopied ? "Spec Copied to Clipboard" : "Copy Specification Draft"}
              </button>

              <div className="grid grid-cols-2 gap-4">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-4 bg-brand-gold text-brand-black text-xs font-mono uppercase tracking-[0.15em] font-semibold transition-all duration-300 text-center block hover:bg-brand-ivory"
                >
                  WhatsApp Dispatch
                </a>
                <a
                  href={mailtoLink}
                  className="py-4 border border-brand-gold text-brand-gold text-xs font-mono uppercase tracking-[0.15em] transition-all duration-300 text-center block hover:bg-brand-gold-muted"
                >
                  Email Booking Desk
                </a>
              </div>

              {/* Status Alert */}
              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-brand-gold-muted border-l-2 border-brand-gold text-xs text-brand-gold font-mono"
                  >
                    SPECS SUBMITTED SUCCESSFULY. BOOKING DESK VERIFICATION IN PROCESS...
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
