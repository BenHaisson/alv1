import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";

interface RequestSectionProps {
  prefilledVehicle?: string;
}

const VEHICLE_OPTIONS = [
  { id: "bmw-i7", name: "BMW i7 xDrive60", tagline: "Silent executive mobility" },
  { id: "v-class", name: "Mercedes-Benz V-Class", tagline: "Premium space for private groups" },
  { id: "best", name: "Best Vehicle", tagline: "Recommended for the journey" }
];

const JOURNEY_TYPES = [
  "Airport transfer",
  "Executive transfer",
  "Hourly chauffeur service",
  "Hotel transfer",
  "Private client transfer",
  "Family travel",
  "Corporate event",
  "Government or diplomatic guest",
  "Long-distance transfer"
];

export default function RequestSection({ prefilledVehicle = "" }: RequestSectionProps) {
  // Input states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [luggage, setLuggage] = useState("2");
  const [vehicle, setVehicle] = useState(prefilledVehicle || "best");
  const [journeyType, setJourneyType] = useState(JOURNEY_TYPES[0]);
  const [notes, setNotes] = useState("");

  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Keep the fleet section's vehicle choice in sync after mount
  useEffect(() => {
    if (prefilledVehicle) {
      setVehicle(prefilledVehicle);
    }
  }, [prefilledVehicle]);

  const vehicleLabel =
    vehicle === "bmw-i7"
      ? "BMW i7 xDrive60"
      : vehicle === "v-class"
        ? "Mercedes-Benz V-Class"
        : "Best vehicle for the journey";

  // Generate the formal copyable request string
  const getSpecificationText = () => {
    return `ALAIR NOIR — PRIVATE TRANSFER REQUEST
--------------------------------------------------
Full Name            : ${fullName || "To be specified"}
Phone Number         : ${phone || "To be specified"}
Email Address        : ${email || "To be specified"}
Pickup Location      : ${pickup || "To be specified"}
Destination          : ${destination || "To be specified"}
Date                 : ${date || "To be specified"}
Pickup Time (CET)    : ${time || "To be specified"}
Passengers           : ${passengers}
Luggage              : ${luggage}
Vehicle Preference   : ${vehicleLabel}
Journey Type         : ${journeyType}
Special Instructions : ${notes || "None"}
--------------------------------------------------
ALAIR NOIR GmbH · Private Chauffeur Service Zürich`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getSpecificationText());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const whatsappLink = `https://wa.me/41772870956?text=${encodeURIComponent(getSpecificationText())}`;
  const mailtoLink = `mailto:booking@alairnoir.ch?subject=Private Transfer Request Zürich&body=${encodeURIComponent(getSpecificationText())}`;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    window.location.href = mailtoLink;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
    }, 6000);
  };

  const inputClasses =
    "w-full bg-brand-deep-forest/40 border border-brand-cream/10 p-4 text-sm text-brand-ivory font-light font-sans focus:outline-none focus:border-brand-cream transition-all placeholder:text-brand-stone/40";

  return (
    <section id="request-section" className="relative py-24 md:py-36 px-6 md:px-12 lg:px-24 bg-brand-black overflow-hidden luxury-noise border-b border-brand-cream/10">
      <div className="max-w-7xl mx-auto">

        {/* Header Block */}
        <div className="max-w-3xl mb-16 md:mb-24">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-brand-gold block mb-4">
            08 / Request Private Transfer
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-light text-brand-ivory tracking-tight mb-6">
            Request a <span className="italic text-brand-stone font-light">private transfer.</span>
          </h2>
          <p className="text-sm md:text-base text-brand-stone font-light leading-relaxed">
            Send your journey details and receive direct confirmation. ALAIR NOIR accepts
            requests for airport transfers, executive schedules, hotel arrivals, private
            clients, family office movement, event transportation, and long-distance
            journeys across Switzerland.
          </p>
        </div>

        {/* Layout Grid: Left Form, Right Dynamic Real-Time Output */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">

          {/* Left: Input Form (7 columns) */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Name & Phone Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-[10px] font-mono uppercase text-brand-gold tracking-widest mb-2">
                    01 / Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Name or guest name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-mono uppercase text-brand-gold tracking-widest mb-2">
                    02 / Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+41..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label className="text-[10px] font-mono uppercase text-brand-gold tracking-widest mb-2">
                  03 / Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="booking@clientoffice.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClasses}
                />
              </div>

              {/* Pickup & Destination Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-[10px] font-mono uppercase text-brand-gold tracking-widest mb-2">
                    04 / Pickup Location
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zürich Airport, Terminal 1"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-mono uppercase text-brand-gold tracking-widest mb-2">
                    05 / Destination
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Badrutt's Palace, St. Moritz"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* Date & Time Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-[10px] font-mono uppercase text-brand-gold tracking-widest mb-2">
                    06 / Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-mono uppercase text-brand-gold tracking-widest mb-2">
                    07 / Pickup Time (CET)
                  </label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* Passengers & Luggage Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-[10px] font-mono uppercase text-brand-gold tracking-widest mb-2">
                    08 / Passengers
                  </label>
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    className={`${inputClasses} cursor-pointer`}
                  >
                    <option value="1">1 Passenger</option>
                    <option value="2">2 Passengers</option>
                    <option value="3">3 Passengers</option>
                    <option value="4">4 Passengers</option>
                    <option value="5">5 Passengers</option>
                    <option value="6">6 Passengers</option>
                    <option value="7+">7+ Passengers / Delegation</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-mono uppercase text-brand-gold tracking-widest mb-2">
                    09 / Luggage
                  </label>
                  <select
                    value={luggage}
                    onChange={(e) => setLuggage(e.target.value)}
                    className={`${inputClasses} cursor-pointer`}
                  >
                    <option value="No luggage">No luggage</option>
                    <option value="1">1 Bag</option>
                    <option value="2">2 Bags</option>
                    <option value="3">3 Bags</option>
                    <option value="4">4 Bags</option>
                    <option value="5+">5+ Bags / Luggage-heavy</option>
                  </select>
                </div>
              </div>

              {/* Vehicle Preference */}
              <div className="flex flex-col">
                <label className="text-[10px] font-mono uppercase text-brand-gold tracking-widest mb-2">
                  10 / Vehicle Preference
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {VEHICLE_OPTIONS.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => setVehicle(option.id)}
                      className={`p-4 border cursor-pointer flex flex-col justify-between transition-all duration-300 ${
                        vehicle === option.id ? "bg-brand-gold-muted border-brand-gold" : "border-brand-cream/10 hover:border-brand-gold/40"
                      }`}
                    >
                      <span className="font-serif text-sm text-brand-ivory">{option.name}</span>
                      <span className="text-[9px] font-mono text-brand-stone mt-1">{option.tagline}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Journey Type */}
              <div className="flex flex-col">
                <label className="text-[10px] font-mono uppercase text-brand-gold tracking-widest mb-2">
                  11 / Journey Type
                </label>
                <select
                  value={journeyType}
                  onChange={(e) => setJourneyType(e.target.value)}
                  className={`${inputClasses} cursor-pointer`}
                >
                  {JOURNEY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Special Instructions */}
              <div className="flex flex-col">
                <label className="text-[10px] font-mono uppercase text-brand-gold tracking-widest mb-2">
                  12 / Special Instructions
                </label>
                <textarea
                  placeholder="Flight number, hotel entrance, private address notes, luggage details, child seat request, guest name, waiting time, confidentiality instructions, or schedule changes..."
                  value={notes}
                  rows={3}
                  onChange={(e) => setNotes(e.target.value)}
                  className={`${inputClasses} resize-none`}
                />
              </div>

              <div className="pt-4 flex items-center space-x-6">
                <button
                  type="submit"
                  className="px-8 py-4 bg-brand-cream text-brand-black text-xs font-mono uppercase tracking-[0.2em] font-medium hover:bg-brand-ivory transition-all duration-300 cursor-pointer"
                >
                  Send Private Transfer Request
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
                  Live Request Summary
                </span>
                <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
              </div>

              <p className="text-sm font-serif italic text-brand-ivory mb-6">
                "A private transfer should feel effortless because the effort has already been made."
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
                {isCopied ? "Request Copied to Clipboard" : "Copy Request Details"}
              </button>

              <div className="grid grid-cols-2 gap-4">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-4 bg-brand-gold text-brand-black text-xs font-mono uppercase tracking-[0.15em] font-semibold transition-all duration-300 text-center block hover:bg-brand-ivory"
                >
                  Send By WhatsApp
                </a>
                <a
                  href={mailtoLink}
                  className="py-4 border border-brand-gold text-brand-gold text-xs font-mono uppercase tracking-[0.15em] transition-all duration-300 text-center block hover:bg-brand-gold-muted"
                >
                  Send By Email
                </a>
              </div>

              {/* Closing Statement */}
              <p className="pt-4 text-center text-xs font-serif italic text-brand-ivory/70 leading-relaxed">
                A private transfer should not begin with uncertainty.
                <br />
                Send the details. Receive confirmation. Arrive properly.
              </p>

              {/* Status Alert */}
              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-brand-gold-muted border-l-2 border-brand-gold text-xs text-brand-gold font-mono"
                  >
                    REQUEST PREPARED. SEND THE OPENED EMAIL — OR USE WHATSAPP — TO RECEIVE DIRECT CONFIRMATION.
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
