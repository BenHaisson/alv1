import { useEffect, useRef, type ReactNode } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import "lenis/dist/lenis.css";
import { useReducedMotionPref } from "./MotionProvider";
import { setLenisInstance } from "../lib/smoothScroll";

/**
 * Site-wide Lenis smooth scrolling (Skiper16 pattern). `root` mode drives the
 * native window scroll, so every existing window-based useScroll (progress
 * bar, opening portal, card stacks) keeps working untouched. Reduced motion
 * renders children bare — native scrolling, no inertia.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const isReduced = useReducedMotionPref();
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    if (isReduced) return;
    setLenisInstance(lenisRef.current?.lenis ?? null);
    return () => setLenisInstance(null);
  }, [isReduced]);

  if (isReduced) return <>{children}</>;

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{ lerp: 0.1, wheelMultiplier: 1, touchMultiplier: 1.35, anchors: false }}
    >
      {children}
    </ReactLenis>
  );
}
