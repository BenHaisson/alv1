import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { usePhotonGeocoder, ZURICH_CENTER, type PhotonSuggestion } from "../lib/usePhotonGeocoder";
import { EMPTY_LOCATION, isLocationValidated, locationText, type LocationValue } from "../lib/bookingRequest";
import { CornerMarkers, useReducedMotionPref } from "./MotionProvider";

interface ChooseOnMapModalProps {
  isOpen: boolean;
  title: string;
  initial: LocationValue;
  onConfirm: (location: LocationValue) => void;
  onClose: () => void;
}

type SearchStatus = "idle" | "loading" | "ok" | "empty" | "error";

const DEBOUNCE_MS = 250;

const NO_RESULT_MESSAGE = "No matching location found. Try a hotel, airport, or full address.";
const SERVICE_UNAVAILABLE_MESSAGE =
  "Location search is temporarily unavailable. You can still type the address manually.";

const coordsLabel = (lat: number, lng: number) => `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

/** A gold teardrop pin, drawn inline — no external icon assets to bundle or 404 on. */
const GOLD_PIN_ICON = L.divIcon({
  className: "alair-map-pin",
  html: `<svg width="30" height="42" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M15 0C6.716 0 0 6.716 0 15c0 10.5 15 27 15 27s15-16.5 15-27C30 6.716 23.284 0 15 0z" fill="#D4AF37"/>
    <circle cx="15" cy="15" r="6" fill="#0A0A0A"/>
  </svg>`,
  iconSize: [30, 42],
  iconAnchor: [15, 42]
});

/**
 * Same-page map picker — a bottom sheet (never a navigation) with an
 * OpenStreetMap-tiled Leaflet map, tinted for the dark brand system. Search,
 * click-to-place, and drag-to-adjust all resolve through Photon (reverse)
 * geocoding, so the confirmed pin always carries real coordinates. No Google
 * Maps, no API key.
 */
export default function ChooseOnMapModal({
  isOpen,
  title,
  initial,
  onConfirm,
  onClose
}: ChooseOnMapModalProps) {
  const { fetchSuggestions, reverseGeocode } = usePhotonGeocoder();
  const isReduced = useReducedMotionPref();

  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [selected, setSelected] = useState<LocationValue>(EMPTY_LOCATION);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<PhotonSuggestion[]>([]);
  const [searchStatus, setSearchStatus] = useState<SearchStatus>("idle");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const debounceRef = useRef<number | null>(null);
  const requestIdRef = useRef(0);

  // Seed from whatever the field already holds each time the sheet opens.
  useEffect(() => {
    if (isOpen) {
      setSelected(initial);
      setSearchText(locationText(initial));
      setSuggestions([]);
      setSearchStatus("idle");
      setIsSearchOpen(false);
    } else {
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Build the map once per open (the div is freshly mounted each time by
  // AnimatePresence, so a stale ref never lingers across opens).
  useEffect(() => {
    if (!isOpen || !mapDivRef.current || mapRef.current) return;

    const center: [number, number] =
      initial.lat != null && initial.lng != null ? [initial.lat, initial.lng] : [ZURICH_CENTER.lat, ZURICH_CENTER.lng];

    const map = L.map(mapDivRef.current, {
      center,
      zoom: initial.lat != null ? 15 : 12,
      zoomControl: true,
      attributionControl: true
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const marker = L.marker(center, { draggable: true, icon: GOLD_PIN_ICON }).addTo(map);

    const applyPoint = async (lat: number, lng: number) => {
      const result = await reverseGeocode(lat, lng);
      if (result.status === "ok") {
        setSelected({
          ...result.value,
          description: result.value.formattedAddress || result.value.description || coordsLabel(lat, lng)
        });
      } else {
        setSelected({ ...EMPTY_LOCATION, lat, lng, description: coordsLabel(lat, lng), provider: "photon" });
      }
    };

    map.on("click", (event: L.LeafletMouseEvent) => {
      marker.setLatLng(event.latlng);
      applyPoint(event.latlng.lat, event.latlng.lng);
    });

    marker.on("dragend", () => {
      const position = marker.getLatLng();
      applyPoint(position.lat, position.lng);
    });

    mapRef.current = map;
    markerRef.current = marker;

    // Guards against any first-paint sizing quirk while the sheet is still animating in.
    requestAnimationFrame(() => map.invalidateSize());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    setIsSearchOpen(true);
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
      if (requestId !== requestIdRef.current) return;
      if (result.status === "ok") {
        setSuggestions(result.value);
        setSearchStatus(result.value.length > 0 ? "ok" : "empty");
      } else {
        setSuggestions([]);
        setSearchStatus(result.status);
      }
    }, DEBOUNCE_MS);
  };

  const handleSearchSelect = (suggestion: PhotonSuggestion) => {
    setIsSearchOpen(false);
    setSuggestions([]);
    setSearchStatus("idle");
    setSearchText(suggestion.mainText);
    const { lat, lng } = suggestion.location;
    if (lat == null || lng == null) return;
    setSelected(suggestion.location);
    const target: [number, number] = [lat, lng];
    if (isReduced) mapRef.current?.setView(target, 16);
    else mapRef.current?.flyTo(target, 16, { duration: 0.9 });
    markerRef.current?.setLatLng(target);
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
                onFocus={() => (suggestions.length > 0 || searchStatus !== "idle") && setIsSearchOpen(true)}
                className="w-full bg-transparent text-sm font-light text-brand-ivory placeholder:text-brand-stone/45 focus:outline-none"
              />
              <AnimatePresence>
                {isSearchOpen && searchStatus !== "idle" && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16 }}
                    className="absolute left-0 right-0 top-full z-10 mx-6 max-h-56 w-[calc(100%-3rem)] overflow-y-auto border border-brand-cream/15 bg-brand-deep-forest/95 shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-md"
                  >
                    {searchStatus === "empty" && (
                      <p className="px-4 py-3 text-xs font-light leading-snug text-brand-stone">
                        {NO_RESULT_MESSAGE}
                      </p>
                    )}
                    {searchStatus === "error" && (
                      <p className="px-4 py-3 text-xs font-light leading-snug text-brand-gold/85">
                        {SERVICE_UNAVAILABLE_MESSAGE}
                      </p>
                    )}
                    {suggestions.length > 0 && (
                      <ul>
                        {suggestions.map((suggestion) => (
                          <li key={suggestion.key}>
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
                      </ul>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div
              ref={mapDivRef}
              className="alair-leaflet h-[42vh] min-h-[280px] w-full bg-brand-black md:h-[48vh]"
              aria-label="Interactive map — click or drag the pin to set the location"
            />

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
