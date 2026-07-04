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

export function scrollWindowTo(top: number, { immediate = false } = {}) {
  if (lenisInstance) {
    lenisInstance.scrollTo(top, { immediate, force: true });
    return;
  }
  window.scrollTo({ top, behavior: immediate ? "auto" : "smooth" });
}
