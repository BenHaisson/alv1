import type Lenis from "lenis";

/**
 * Single shared handle on the Lenis instance mounted by <SmoothScroll>.
 * Programmatic scrolls must go through Lenis while it is active — a raw
 * window.scrollTo lands for one frame and is then overwritten by Lenis's
 * own animated scroll target.
 */
let lenisInstance: Lenis | null = null;

export function setLenisInstance(lenis: Lenis | null) {
  lenisInstance = lenis;
}

export function scrollWindowTo(top: number, { immediate = false, duration = 1.2 } = {}) {
  const run = () => {
    if (lenisInstance) {
      lenisInstance.scrollTo(top, {
        immediate,
        force: true,
        lock: !immediate,
        duration
      });
      return;
    }
    window.scrollTo({ top, behavior: immediate ? "auto" : "smooth" });
  };

  // Let Lenis finish the current native gesture before replacing its target.
  // Calling scrollTo in the same wheel/scroll dispatch can otherwise be
  // overwritten by the gesture's final native position.
  if (typeof window !== "undefined") {
    window.requestAnimationFrame(run);
  } else {
    run();
  }
}
