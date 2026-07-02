import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FAQS } from "../data";

export default function BeforeRequestFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggleIdx = (idx: number) => {
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="relative py-24 md:py-36 px-6 md:px-12 lg:px-24 bg-brand-black overflow-hidden luxury-noise border-b border-brand-cream/10">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-brand-cream block mb-4">
            Pre-Journey Guidelines
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-brand-ivory tracking-tight mb-4">
            Before You Request
          </h2>
          <p className="text-sm text-brand-stone font-light">
            Answers to common booking and operational scenarios. For custom arrangements, please reach out directly.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border-b border-brand-cream/10 pb-4 transition-all duration-300"
              >
                {/* Accordion Trigger */}
                <button
                  onClick={() => toggleIdx(idx)}
                  className="w-full flex justify-between items-center py-4 text-left group focus:outline-none"
                >
                  <span className={`text-base md:text-lg font-serif font-light transition-colors duration-300 ${
                    isOpen ? "text-brand-cream" : "text-brand-ivory group-hover:text-brand-cream"
                  }`}>
                    {faq.question}
                  </span>
                  
                  {/* Subtle luxury index line toggle */}
                  <span className="text-xs font-mono text-brand-stone transition-transform duration-300">
                    {isOpen ? "[ CLOSE ]" : "[ OPEN ]"}
                  </span>
                </button>

                {/* Expanded Answer Panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pr-12 pb-4">
                        <p className="text-xs md:text-sm text-brand-stone leading-relaxed font-light font-sans max-w-3xl">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* FAQ Schema Structured JSON-LD representation */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": FAQS.map((faq) => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })}
        </script>

      </div>
    </section>
  );
}
