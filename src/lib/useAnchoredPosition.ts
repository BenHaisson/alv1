import { useLayoutEffect, useState, type RefObject } from "react";

export interface AnchoredRect {
  top: number;
  left: number;
  width: number;
}

/**
 * Tracks a trigger element's viewport-relative box so a document.body-portaled
 * panel can be positioned with `position: fixed` (fixed coordinates match
 * getBoundingClientRect directly — no scroll-offset math). Recomputed on
 * scroll (capture: true, so scroll on any ancestor is caught) and resize
 * while `active`.
 */
export function useAnchoredPosition(triggerRef: RefObject<HTMLElement | null>, active: boolean): AnchoredRect | null {
  const [rect, setRect] = useState<AnchoredRect | null>(null);

  useLayoutEffect(() => {
    if (!active) {
      setRect(null);
      return;
    }

    const update = () => {
      const node = triggerRef.current;
      if (!node) return;
      const box = node.getBoundingClientRect();
      setRect({ top: box.bottom, left: box.left, width: box.width });
    };

    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [active, triggerRef]);

  return rect;
}
