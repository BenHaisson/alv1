import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { EASE } from "./motion";

/**
 * Route-change curtain. On navigation an opaque forest panel rises from below,
 * covers the viewport while the new page swaps in, then continues up and off
 * the top — the "from below to the top" transition from the main site, rebuilt
 * for client-side routing. Skipped for reduced-motion visitors.
 */
export default function PageTransition() {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  const [sweeping, setSweeping] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduce) return;
    setSweeping(true);
  }, [pathname, reduce]);

  if (!sweeping) return null;

  return (
    <motion.div
      key={pathname}
      className="pointer-events-none fixed inset-0 z-[150] flex items-center justify-center bg-forest"
      initial={{ y: "100%" }}
      animate={{ y: ["100%", "0%", "0%", "-100%"] }}
      transition={{ duration: 0.95, ease: EASE, times: [0, 0.42, 0.56, 1] }}
      onAnimationComplete={() => setSweeping(false)}
    >
      <motion.span
        className="font-serif uppercase text-ivory"
        style={{ letterSpacing: "0.22em", fontWeight: 500, fontSize: "clamp(20px, 3vw, 30px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 0.95, ease: "easeInOut", times: [0, 0.42, 0.56, 1] }}
      >
        ALAIR NOIR
      </motion.span>
    </motion.div>
  );
}
