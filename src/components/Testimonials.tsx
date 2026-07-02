import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TESTIMONIALS } from "../data";

export default function Testimonials() {
  const [activeIdx, setActiveIdx] = useState(0);

  const nextQuote = () => {
    setActiveIdx((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevQuote = () => {
    setActiveIdx((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section className="relative py-24 md:py-36 px-6 md:px-12 lg:px-24 bg-brand-deep-forest overflow-hidden luxury-noise border-b border-brand-cream/10">
      <div className="max-w-4xl mx-auto flex flex-col justify-between min-h-[350px]">
        
        {/* Editorial Subtitle */}
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-brand-cream block">
            Client Perspectives
          </span>
        </div>

        {/* Carousel Window */}
        <div className="relative flex-1 flex flex-col justify-center items-center text-center px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="max-w-3xl"
            >
              {/* Massive Quotation marks */}
              <span className="text-6xl md:text-8xl font-serif text-brand-cream/10 select-none block h-8 leading-none">
                “
              </span>

              <blockquote className="text-xl md:text-3xl font-serif text-brand-ivory italic leading-relaxed font-light mb-8">
                {TESTIMONIALS[activeIdx].quote}
              </blockquote>

              <cite className="not-italic text-xs font-mono tracking-[0.25em] text-brand-cream uppercase block">
                {TESTIMONIALS[activeIdx].author}
              </cite>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Controls */}
        <div className="mt-12 flex items-center justify-between border-t border-brand-cream/10 pt-6">
          <span className="text-[10px] font-mono tracking-widest text-brand-stone/50 uppercase">
            [ SECURE TRUST PROTOCOL ACTIVE ]
          </span>

          {/* Indicator Dot Progression */}
          <div className="flex space-x-2">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeIdx === idx ? "bg-brand-cream w-4" : "bg-brand-cream/20"
                }`}
              />
            ))}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={prevQuote}
              className="text-xs font-mono tracking-wider text-brand-stone hover:text-brand-cream transition-colors duration-300 uppercase cursor-pointer"
            >
              Prev
            </button>
            <span className="text-brand-cream/20 font-mono text-xs">|</span>
            <button
              onClick={nextQuote}
              className="text-xs font-mono tracking-wider text-brand-stone hover:text-brand-cream transition-colors duration-300 uppercase cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
