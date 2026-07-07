/**
 * Idempotent loader for the Google Maps JavaScript API (places + geocoding).
 * Powers PlaceAutocompleteField / ChooseOnMapModal — every call to
 * loadGoogleMaps() returns the same in-flight/resolved promise, so the script
 * tag is only ever injected once no matter how many fields mount.
 *
 * VITE_GOOGLE_MAPS_API_KEY must be set (see .env.example). Without it the
 * booking fields still work as plain text input — they just can't offer
 * Places suggestions, the map picker, or reverse geocoding.
 */

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

const SCRIPT_ID = "alair-noir-google-maps-script";

let loadPromise: Promise<void> | null = null;

export function hasGoogleMapsApiKey(): boolean {
  return Boolean(GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY.trim());
}

export function loadGoogleMaps(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only load in the browser"));
  }
  if (window.google?.maps?.places) {
    return Promise.resolve();
  }
  if (!hasGoogleMapsApiKey()) {
    return Promise.reject(new Error("Missing VITE_GOOGLE_MAPS_API_KEY"));
  }
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Google Maps")));
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });

  return loadPromise;
}
