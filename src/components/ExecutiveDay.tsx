import { useState } from "react";
import { motion } from "motion/react";

interface ExecutiveDayProps {
  onRequestScroll: () => void;
}

export default function ExecutiveDay({ onRequestScroll }: ExecutiveDayProps) {
  const steps = [
    { time: "08:30", label: "Hotel Pickup", detail: "Dolder Grand Zürich departure in immaculate silence." },
    { time: "09:00", label: "Board Meeting", detail: "Prepared arrival at Bahnhofstrasse executive office." },
    { time: "12:15", label: "Private Lunch", detail: "Discreet transfer to fine dining venue across the Limmat." },
    { time: "14:30", label: "Second Meeting", detail: "Zug residence/office crossing, schedule adjusted in real-time." },
    { time: "19:00", label: "Dinner Reservation", detail: "Host reception & secure parking waiting mode." },
    { time: "22:30", label: "Airport Return", detail: "Quiet transit back to private terminal, flight departure ready." }
  ];

  const useCases = [
    { title: "Board Meetings", description: "Prepared arrival for executives, leadership teams, and private guests." },
    { title: "Roadshows", description: "Multi-stop movement across Zürich, Switzerland, and European routes." },
    { title: "Client Dinners", description: "Discreet evening transport for hosts, guests, principals, and corporate visitors." },
    { title: "Private Appointments", description: "Controlled movement between residence, hotel, clinic, or restaurant." },
    { title: "Event Entrances", description: "Calm arrival and departure timing for high-demand dates." }
  ];

  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="relative py-24 md:py-36 px-6 md:px-12 lg:px-24 bg-brand-deep-forest overflow-hidden luxury-noise border-b border-brand-cream/10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="max-w-4xl mb-16 md:mb-24">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-brand-cream block mb-4">
            Sequenced Schedules
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-light text-brand-ivory tracking-tight mb-6">
            Some days are not transfers. <br />
            <span className="italic text-brand-stone font-light">They are sequences.</span>
          </h2>
          <p className="text-base md:text-lg text-brand-stone font-light leading-relaxed max-w-3xl">
            ALAIR NOIR is arranged around the rhythm of the full day, not only the distance between two points. For multi-stop schedules, the service can be retained around the passenger's timing, waiting periods, privacy requirements, and route changes.
          </p>
        </div>

        {/* Timeline Sequence & Case Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Sequence Itinerary (5 Columns) */}
          <div className="lg:col-span-5 p-8 bg-brand-black/50 border border-brand-cream/10 relative">
            <div className="absolute top-4 right-4 text-[10px] font-mono text-brand-cream/40">
              SIMULATION / 24H
            </div>
            
            <h3 className="text-xs font-mono tracking-widest text-brand-cream uppercase mb-8">
              A Typical Retained Day
            </h3>

            {/* Vertical Line with Active Pointer */}
            <div className="relative pl-6 space-y-6 border-l border-brand-cream/10">
              {steps.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <div
                    key={step.time}
                    onMouseEnter={() => setActiveStep(idx)}
                    className="relative cursor-pointer group"
                  >
                    {/* Floating circle on the line */}
                    <div
                      className={`absolute -left-[30px] top-1.5 w-3 h-3 rounded-full border border-brand-cream transition-all duration-300 ${
                        isActive ? "bg-brand-cream scale-125" : "bg-brand-black group-hover:bg-brand-cream/40"
                      }`}
                    />

                    <div>
                      <span className="font-mono text-xs text-brand-stone font-medium block">
                        {step.time}
                      </span>
                      <h4 className={`text-base font-serif font-light transition-colors duration-300 ${
                        isActive ? "text-brand-cream" : "text-brand-ivory group-hover:text-brand-cream"
                      }`}>
                        {step.label}
                      </h4>
                      {isActive && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.3 }}
                          className="text-xs text-brand-stone mt-1 leading-relaxed font-light"
                        >
                          {step.detail}
                        </motion.p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Case cards (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-brand-stone block mb-6">
                Retained Service Scenarios
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                {useCases.map((uc) => (
                  <div
                    key={uc.title}
                    className="p-6 border border-brand-cream/5 bg-brand-black/20 hover:border-brand-cream/15 transition-all duration-300"
                  >
                    <h4 className="text-lg font-serif text-brand-cream font-light mb-2">
                      {uc.title}
                    </h4>
                    <p className="text-xs text-brand-stone leading-relaxed font-light">
                      {uc.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-6 border-t border-brand-cream/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <p className="text-xs font-mono text-brand-stone uppercase tracking-wider max-w-sm">
                [ SERVICE MODIFICATIONS ARE PROCESSED INSTANTLY DURING JOURNEY ]
              </p>
              <button
                onClick={onRequestScroll}
                className="px-8 py-4 bg-brand-cream text-brand-black text-xs font-mono uppercase tracking-[0.2em] hover:bg-brand-ivory hover:text-brand-deep-forest transition-all duration-300 text-center"
              >
                Arrange an Executive Schedule
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
