import { motion } from "motion/react";
import { VALUE_CARDS } from "../data";
import { CornerMarkers, useReducedMotionPref } from "./MotionProvider";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function WhatWeAre() {
  const isReduced = useReducedMotionPref();

  return (
    <section className="relative overflow-hidden border-b border-brand-cream/10 bg-brand-black px-6 py-24 md:px-12 md:py-36 lg:px-24 luxury-noise">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left: statement */}
          <div className="lg:col-span-6">
            <span className="mb-4 block text-xs font-mono uppercase tracking-[0.3em] text-brand-gold">
              Private Mobility. Precisely Delivered.
            </span>
            <h2 className="mb-8 font-serif text-3xl font-light leading-[1.1] tracking-tight text-brand-ivory md:text-4xl lg:text-5xl">
              A private chauffeur service for Zürich, Switzerland,{" "}
              <span className="font-light italic text-brand-stone">and selected cross-border journeys.</span>
            </h2>
            <div className="space-y-5 text-base font-light leading-relaxed text-brand-body">
              <p>
                ALAIR NOIR GmbH offers premium chauffeur service for clients who require more than
                transportation. The route, timing, pickup posture, cabin condition, communication,
                luggage handling, and arrival sequence are considered before the journey begins.
              </p>
              <p>
                Whether the movement is from Zürich Airport to a hotel, from a residence to a
                private appointment, from Zürich to Davos, or between meetings across Switzerland,
                the service is arranged around discretion, reliability, and personal attention.
              </p>
            </div>
          </div>

          {/* Right: three value cards */}
          <div className="flex flex-col gap-4 lg:col-span-6">
            {VALUE_CARDS.map((card, index) => (
              <motion.div
                key={card.number}
                initial={isReduced ? false : { opacity: 0, x: 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, delay: isReduced ? 0 : index * 0.1, ease: EASE_OUT }}
                className="group relative flex items-start gap-5 border border-brand-cream/10 bg-brand-deep-forest/25 p-6 transition-colors duration-200 ease-out hover:border-brand-gold hover:bg-brand-forest-lift/40"
              >
                <CornerMarkers />
                <span className="font-serif text-2xl font-light text-brand-gold/80">
                  {card.number}
                </span>
                <div>
                  <h3 className="mb-2 font-serif text-lg font-light tracking-wide text-brand-ivory">
                    {card.title}
                  </h3>
                  <p className="text-sm font-light leading-relaxed text-brand-stone">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
