import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FAQS } from "../data";
import { MOTION_EASE } from "../lib/motion";
import { useReducedMotionPref } from "./MotionProvider";

export default function BeforeRequestFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const isReduced = useReducedMotionPref();

  const toggleIdx = (idx: number) => {
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="relative overflow-hidden border-b border-brand-cream/10 bg-brand-black px-6 py-24 md:px-12 md:py-36 lg:px-24 luxury-noise">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-16 max-w-2xl"
          initial={isReduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={isReduced ? { duration: 0 } : { duration: 0.8, ease: MOTION_EASE }}
        >
          <h2 className="section-heading mb-6">
            Private chauffeur service, <span className="section-heading-muted">clearly arranged.</span>
          </h2>
          <p className="section-subtitle max-w-xl">
            For anything not covered here, ask directly.
          </p>
        </motion.div>

        <div className="grid gap-x-10 gap-y-2 lg:grid-cols-2">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <motion.div
                key={faq.question}
                initial={isReduced ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={isReduced ? { duration: 0 } : { duration: 0.56, delay: idx * 0.04, ease: MOTION_EASE }}
                className="border-b border-brand-cream/10 pb-4"
              >
                <button
                  onClick={() => toggleIdx(idx)}
                  className="group flex w-full items-center justify-between py-4 text-left focus:outline-none"
                >
                  <motion.span
                    animate={{ color: isOpen ? "#F6F2E9" : "#FAF8F5" }}
                    transition={isReduced ? { duration: 0 } : { duration: 0.25, ease: MOTION_EASE }}
                    className="text-base font-serif font-light md:text-lg"
                  >
                    {faq.question}
                  </motion.span>

                  <span className="ml-4 flex-shrink-0 whitespace-nowrap text-xs font-mono text-brand-stone">
                    {isOpen ? "[ CLOSE ]" : "[ OPEN ]"}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={isReduced ? { duration: 0 } : { duration: 0.28, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pb-4 pr-12">
                        <p className="max-w-3xl font-sans text-xs font-light leading-relaxed text-brand-stone md:text-sm">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer
              }
            }))
          })}
        </script>
      </div>
    </section>
  );
}
