import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePhotonGeocoder, type PhotonSuggestion } from "../lib/usePhotonGeocoder";
import { EMPTY_LOCATION, isLocationValidated, type LocationValue } from "../lib/bookingRequest";
import { useReducedMotionPref } from "./MotionProvider";

interface PlaceAutocompleteFieldProps {
  id: string;
  placeholder: string;
  value: LocationValue;
  onChange: (location: LocationValue) => void;
  onOpenMap: () => void;
  inputClassName: string;
  /** "Use current location" only makes sense for a pickup field. */
  showCurrentLocation?: boolean;
  /** Bar cells are a fixed-height grid row (absolute overlay); the form
   *  variant has normal vertical flow, so the warning can push layout. */
  warningInFlow?: boolean;
}

type SearchStatus = "idle" | "loading" | "ok" | "empty" | "error";

const DEBOUNCE_MS = 250;

const coordsLabel = (lat: number, lng: number) => `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

const UNVALIDATED_WARNING = "Please select a location from the suggestions or choose it on the map.";
const LOCATION_DENIED_MESSAGE =
  "Location access was not allowed. Please type your address or choose on map.";
const NO_RESULT_MESSAGE = "No matching location found. Try a hotel, airport, or full address.";
const SERVICE_UNAVAILABLE_MESSAGE =
  "Location search is temporarily unavailable. You can still type the address manually.";

/**
 * A Photon-backed (OpenStreetMap) location input: custom dark-glass
 * suggestion list (never the native browser dropdown), biased to
 * Zürich/Switzerland, plus "Choose on map" and "Use current location" actions
 * under the suggestions. Selecting a suggestion (or confirming a map pin /
 * current-location fix) stores the formatted address, coordinates, city, and
 * country on the shared LocationValue — free-typed text alone is flagged with
 * a subtle warning. No API key, no Google dependency.
 */
export default function PlaceAutocompleteField({
  id,
  placeholder,
  value,
  onChange,
  onOpenMap,
  inputClassName,
  showCurrentLocation = false,
  warningInFlow = false
}: PlaceAutocompleteFieldProps) {
  const { fetchSuggestions, reverseGeocode } = usePhotonGeocoder();
  const isReduced = useReducedMotionPref();
  const [suggestions, setSuggestions] = useState<PhotonSuggestion[]>([]);
  const [searchStatus, setSearchStatus] = useState<SearchStatus>("idle");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<number | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => () => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
  }, []);

  const handleInputChange = (text: string) => {
    onChange({ ...EMPTY_LOCATION, description: text });
    setLocationError(null);
    setActiveIndex(-1);
    setIsOpen(true);

    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (!text.trim()) {
      setSuggestions([]);
      setSearchStatus("idle");
      return;
    }

    const requestId = ++requestIdRef.current;
    setSearchStatus("loading");
    debounceRef.current = window.setTimeout(async () => {
      const result = await fetchSuggestions(text);
      if (requestId !== requestIdRef.current) return; // a newer keystroke superseded this request
      if (result.status === "ok") {
        setSuggestions(result.value);
        setSearchStatus(result.value.length > 0 ? "ok" : "empty");
      } else {
        setSuggestions([]);
        setSearchStatus(result.status);
      }
    }, DEBOUNCE_MS);
  };

  const handleSelect = (suggestion: PhotonSuggestion) => {
    setIsOpen(false);
    setSuggestions([]);
    setSearchStatus("idle");
    onChange(suggestion.location);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(LOCATION_DENIED_MESSAGE);
      return;
    }
    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const result = await reverseGeocode(latitude, longitude);
        if (result.status === "ok") {
          onChange({
            ...result.value,
            description: result.value.formattedAddress || result.value.description || coordsLabel(latitude, longitude)
          });
        } else {
          // The GPS fix itself is still a validated coordinate even when
          // reverse geocoding can't resolve a readable address for it.
          onChange({
            ...EMPTY_LOCATION,
            lat: latitude,
            lng: longitude,
            description: coordsLabel(latitude, longitude),
            provider: "photon"
          });
          if (result.status === "error") setLocationError(SERVICE_UNAVAILABLE_MESSAGE);
        }
        setIsLocating(false);
        setIsOpen(false);
      },
      () => {
        setLocationError(LOCATION_DENIED_MESSAGE);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (event.key === "Escape") setIsOpen(false);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, suggestions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  const showUnvalidatedWarning =
    !isOpen && !locationError && value.description.trim() !== "" && !isLocationValidated(value);

  const warningNode = (locationError || showUnvalidatedWarning) && (
    <p
      id={`${id}-validation`}
      className={`px-0.5 text-[10px] font-light leading-snug ${
        locationError ? "text-red-300/90" : "text-brand-gold/85"
      }`}
    >
      {locationError || UNVALIDATED_WARNING}
    </p>
  );

  return (
    <div ref={wrapperRef} className="relative">
      <input
        id={id}
        type="text"
        autoComplete="off"
        placeholder={placeholder}
        value={value.description}
        onChange={(event) => handleInputChange(event.target.value)}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        className={inputClassName}
        role="combobox"
        aria-expanded={isOpen}
        aria-autocomplete="list"
        aria-controls={`${id}-suggestions`}
        aria-invalid={Boolean(locationError || showUnvalidatedWarning)}
        aria-describedby={locationError || showUnvalidatedWarning ? `${id}-validation` : undefined}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`${id}-suggestions`}
            data-lenis-prevent
            data-lenis-prevent-wheel
            data-lenis-prevent-touch
            onWheel={(event) => event.stopPropagation()}
            onTouchMove={(event) => event.stopPropagation()}
            initial={isReduced ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={isReduced ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            style={{ width: "max(360px, 100%)", maxWidth: "calc(100vw - 2rem)" }}
            className="absolute left-0 top-full z-50 mt-2 max-h-80 overflow-y-auto border border-brand-cream/15 bg-brand-deep-forest/95 text-left shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-md"
          >
            {searchStatus === "empty" && (
              <p className="px-4 py-3 text-xs font-light leading-snug text-brand-stone">{NO_RESULT_MESSAGE}</p>
            )}
            {searchStatus === "error" && (
              <p className="px-4 py-3 text-xs font-light leading-snug text-brand-gold/85">
                {SERVICE_UNAVAILABLE_MESSAGE}
              </p>
            )}

            {suggestions.length > 0 && (
              <ul>
                {suggestions.map((suggestion, index) => (
                  <li key={suggestion.key}>
                    <button
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => handleSelect(suggestion)}
                      className={`flex w-full flex-col gap-0.5 border-b border-brand-cream/5 px-4 py-3 text-left last:border-b-0 ${
                        index === activeIndex ? "bg-brand-gold-muted" : "hover:bg-brand-cream/5"
                      }`}
                    >
                      <span className="text-sm font-light text-brand-ivory">{suggestion.mainText}</span>
                      {suggestion.secondaryText && (
                        <span className="text-[11px] font-light text-brand-stone">
                          {suggestion.secondaryText}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="border-t border-brand-cream/10 py-1.5">
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setIsOpen(false);
                  onOpenMap();
                }}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-[11px] font-mono uppercase tracking-[0.16em] text-brand-cream hover:bg-brand-cream/5"
              >
                <span aria-hidden="true" className="text-brand-gold">
                  ⌖
                </span>
                Choose on map
              </button>
              {showCurrentLocation && (
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-[11px] font-mono uppercase tracking-[0.16em] text-brand-cream hover:bg-brand-cream/5 disabled:cursor-wait disabled:opacity-60"
                >
                  <span aria-hidden="true" className="text-brand-gold">
                    ◎
                  </span>
                  {isLocating ? "Locating…" : "Use current location"}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {warningNode &&
        (warningInFlow ? (
          <div className="mt-1.5">{warningNode}</div>
        ) : (
          <div className="absolute left-0 right-0 top-full z-40 mt-1.5">{warningNode}</div>
        ))}
    </div>
  );
}
