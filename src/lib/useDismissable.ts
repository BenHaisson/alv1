import { useEffect, type RefObject } from "react";

/**
 * Click-outside + Escape dismissal for a trigger/panel pair that may live in
 * different parts of the DOM (the panel is document.body-portaled, so a
 * single wrapping ref can't be used the way PlaceAutocompleteField does).
 */
export function useDismissable(
  refs: RefObject<HTMLElement | null>[],
  active: boolean,
  onDismiss: () => void
) {
  useEffect(() => {
    if (!active) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInside = refs.some((ref) => ref.current && ref.current.contains(target));
      if (!isInside) onDismiss();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismiss();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}
