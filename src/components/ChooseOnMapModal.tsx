import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { usePlaceAutocomplete, ZURICH_CENTER, type PlaceSuggestion } from "../lib/usePlaceAutocomplete";
import { EMPTY_LOCATION, isLocationValidated, locationText, type LocationValue } from "../lib/bookingRequest";
import { CornerMarkers, useReducedMotionPref } from "./MotionProvider";

interface ChooseOnMapModalProps {
  isOpen: boolean;
  title: string;
  initial: LocationValue;
  onConfirm: (location: LocationValue) => void;
  onClose: () => void;
}

/** ALAIR NOIR-tinted dark map style — black base, cream labels, restrained
 *  gold on roads/POI so the map reads as part of the same dark-glass system. */
const MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#0d0d0d" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0a0a0a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#a39e96" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#3a3730" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#101210" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#14170f" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#78736b" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#0e1f16" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#242119" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#0a0a0a" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#cda250" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#332b1a" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#eadece" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#1a1a1a" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#08130d" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#4a4640" }] }
];

const coordsLabel = (lat: number, lng: number) => `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

/**
 * Same-page map picker — a bottom sheet (never a navigation) with a dark
 * ALAIR-tinted Google Map. Search, click-to-place, and drag-to-adjust all
 * resolve through the same usePlaceAutocomplete reverse-geocode path, so the
 * confirmed pin always carries validated coordinates.
 */
export default function ChooseOnMapModal({
  isOpen,
  title,
  initial,
  onConfirm,
  onClose
}: ChooseOnMapModalProps) {
  const { ready, fetchSuggestions, fetchDetails, reverseGeocode } = usePlaceAutocomplete();
  const isReduced = useReducedMotionPref();

  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  const [selected, setSelected] = useState<LocationValue>(EMPTY_LOCATION);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const debounceRef = useRef<number | null>(null);

  // Seed from whatever the field already holds each time the sheet opens.
  useEffect(() => {
    if (isOpen) {
      setSelected(initial);
      setSearchText(locationText(initial));
      setSuggestions([]);
      setIsSearchOpen(false);
    } else {
      mapRef.current = null;
      markerRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Build the map once per open (the div is freshly mounted each time by
  // AnimatePresence, so a stale ref never lingers across opens).
  useEffect(() => {
    if (!isOpen || !ready || !mapDivRef.current || mapRef.current) return;

    const center =
      initial.lat != null && initial.lng != null ? { lat: initial.lat, lng: initial.lng } : ZURICH_CENTER;

    const map = new google.maps.Map(mapDivRef.current, {
      center,
      zoom: initial.lat != null ? 15 : 12,
      disableDefaultUI: false,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      clickableIcons: false,
      styles: MAP_STYLE
    });

    const marker = new google.maps.Marker({
      map,
      position: center,
      draggable: true
    });

    const applyPoint = async (lat: number, lng: number) => {
      const resolved = await reverseGeocode(lat, lng);
      setSelected({
        ...resolved,
        description: resolved.formattedAddress || resolved.description || coordsLabel(lat, lng)
      });
    };

    map.addListener("click", (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return;
      marker.setPosition(event.latLng);
      applyPoint(event.latLng.lat(), event.latLng.lng());
    });

    marker.addListener("dragend", () => {
      const position = marker.getPosition();
      if (!position) return;
      applyPoint(position.lat(), position.lng());
    });

    mapRef.current = map;
    markerRef.current = marker;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, ready]);

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    setIsSearchOpen(true);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (!text.trim()) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = window.setTimeout(async () => {
      setSuggestions(await fetchSuggestions(text));
    }, 220);
  };

  const handleSearchSelect = async (suggestion: PlaceSuggestion) => {
    setIsSearchOpen(false);
    setSuggestions([]);
    setSearchText(suggestion.mainText);
    const details = await fetchDetails(suggestion.placeId);
    if (details.lat == null || details.lng == null) return;
    setSelected(details);
    mapRef.current?.panTo({ lat: details.lat, lng: details.lng });
    mapRef.current?.setZoom(16);
    markerRef.current?.setPosition({ lat: details.lat, lng: details.lng });
  };

  const canConfirm = isLocationValidated(selected);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[9997] bg-black/75 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={isReduced ? { opacity: 0 } : { y: "100%" }}
            animate={isReduced ? { opacity: 1 } : { y: 0 }}
            exit={isReduced ? { opacity: 0 } : { y: "100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 z-[9998] flex max-h-[88vh] flex-col border-t border-brand-cream/15 bg-brand-deep-forest shadow-[0_-20px_60px_rgba(0,0,0,0.6)] luxury-noise md:inset-x-auto md:left-1/2 md:bottom-6 md:w-[640px] md:-translate-x-1/2 md:border"
          >
            <div className="relative flex items-center justify-between border-b border-brand-cream/10 px-6 py-4">
              <CornerMarkers tone="cream" />
              <span className="text-[11px] font-mono uppercase tracking-[0.24em] text-brand-cream">
                {title}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close map"
                className="cursor-pointer text-brand-stone transition-colors duration-150 hover:text-brand-cream"
              >
                ✕
              </button>
            </div>

            <div className="relative border-b border-brand-cream/10 px-6 py-3">
              <input
                type="text"
                autoComplete="off"
                placeholder="Search an address, hotel, or landmark"
                value={searchText}
                onChange={(event) => handleSearchChange(event.target.value)}
                onFocus={() => suggestions.length > 0 && setIsSearchOpen(true)}
                className="w-full bg-transparent text-sm font-light text-brand-ivory placeholder:text-brand-stone/45 focus:outline-none"
              />
              <AnimatePresence>
                {isSearchOpen && suggestions.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16 }}
                    className="absolute left-0 right-0 top-full z-10 mx-6 max-h-56 w-[calc(100%-3rem)] overflow-y-auto border border-brand-cream/15 bg-brand-deep-forest/95 shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-md"
                  >
                    {suggestions.map((suggestion) => (
                      <li key={suggestion.placeId}>
                        <button
                          type="button"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => handleSearchSelect(suggestion)}
                          className="flex w-full flex-col gap-0.5 border-b border-brand-cream/5 px-4 py-2.5 text-left transition-colors duration-150 last:border-b-0 hover:bg-brand-cream/5"
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
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            <div
              ref={mapDivRef}
              className="h-[42vh] min-h-[280px] w-full bg-brand-black md:h-[48vh]"
              aria-label="Interactive map — click or drag the pin to set the location"
            >
              {!ready && (
                <div className="flex h-full w-full items-center justify-center px-6 text-center text-xs font-light text-brand-stone">
                  Map unavailable — search above still works once a location service is configured.
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 border-t border-brand-cream/10 px-6 py-4">
              <p className="min-h-[1.25rem] text-xs font-light text-brand-ivory/85">
                {selected.description || "Click the map or drag the pin to choose a point."}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 cursor-pointer border border-brand-cream/25 py-3.5 text-xs font-mono uppercase tracking-[0.16em] text-brand-cream transition-colors duration-200 hover:border-brand-cream/50 hover:bg-brand-cream/5"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!canConfirm}
                  onClick={() => {
                    onConfirm(selected);
                    onClose();
                  }}
                  className="flex-1 cursor-pointer bg-brand-gold py-3.5 text-xs font-mono font-semibold uppercase tracking-[0.16em] text-brand-black transition-colors duration-200 hover:bg-brand-ivory disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Confirm location
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
