import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const ReducedMotionContext = createContext(false);

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const prefersReduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <ReducedMotionContext.Provider value={prefersReduced}>
      {children}
    </ReducedMotionContext.Provider>
  );
}

export function useReducedMotionPref() {
  return useContext(ReducedMotionContext);
}

export function CornerMarkers({ tone = "gold" }: { tone?: "gold" | "cream" }) {
  const color = tone === "gold" ? "border-brand-gold/60" : "border-brand-cream/40";

  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
      <span className={`absolute left-0 top-0 h-2.5 w-2.5 border-l border-t ${color}`} />
      <span className={`absolute right-0 top-0 h-2.5 w-2.5 border-r border-t ${color}`} />
      <span className={`absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l ${color}`} />
      <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r ${color}`} />
    </span>
  );
}
