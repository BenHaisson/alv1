import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { EASE } from "./motion";

const SEEN_KEY = "an-intro-seen";

/**
 * Opening scene: the A│N monogram, the ALAIR NOIR wordmark, and the house
 * slogan, on deep black. Plays once per browser session (sessionStorage),
 * auto-dismisses after a short beat, and is skippable by any input. Recreated
 * from the main-branch opening portal in the new quiet brand language — no
 * gold, no monospace.
 */
export default function IntroPortal({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = typeof sessionStorage !== "undefined" && sessionStorage.getItem(SEEN_KEY);
    if (seen || reduce) {
      onDone();
      return;
    }
    setShow(true);

    const dismiss = () => {
      sessionStorage.setItem(SEEN_KEY, "1");
      setShow(false);
    };
    const timer = window.setTimeout(dismiss, 2800);
    const onInput = () => dismiss();
    window.addEventListener("wheel", onInput, { passive: true });
    window.addEventListener("touchstart", onInput, { passive: true });
    window.addEventListener("keydown", onInput);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("wheel", onInput);
      window.removeEventListener("touchstart", onInput);
      window.removeEventListener("keydown", onInput);
    };
  }, [reduce, onDone]);

  const item = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } }
  };

  return (
    <AnimatePresence onExitComplete={onDone}>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-deep-black px-8 text-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: EASE } }}
        >
          <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.18 }}>
            {/* A│N monogram — the icon */}
            <motion.div
              variants={item}
              className="mb-8 flex items-center justify-center gap-5 text-ivory"
              aria-label="ALAIR NOIR monogram"
            >
              <span className="font-serif text-5xl font-medium md:text-6xl" style={{ letterSpacing: "0.06em" }}>
                A
              </span>
              <motion.span
                initial={reduce ? false : { scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 1, delay: 0.2, ease: EASE }}
                className="h-14 w-px origin-top bg-stone-cream/70 md:h-16"
              />
              <span className="font-serif text-5xl font-medium md:text-6xl" style={{ letterSpacing: "0.06em" }}>
                N
              </span>
            </motion.div>

            <motion.h1
              variants={item}
              className="font-serif text-3xl font-medium uppercase text-ivory md:text-5xl"
              style={{ letterSpacing: "0.18em" }}
            >
              ALAIR NOIR
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-4 font-sans text-[10px] uppercase text-stone-cream md:text-[11px]"
              style={{ letterSpacing: "0.28em" }}
            >
              Zürich · Switzerland
            </motion.p>

            <motion.div
              variants={item}
              className="mx-auto my-7 h-px w-16 bg-stone-cream/40"
            />

            <motion.p
              variants={item}
              className="font-serif text-lg text-stone-cream/90 md:text-2xl"
            >
              Not for everyone. For you.
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
