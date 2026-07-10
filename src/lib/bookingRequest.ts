import { imageAssets } from "../assets";

/**
 * Shared booking state + request-text builder.
 *
 * The Booking Hero panel and the final "Request Your Chauffeur" form both read
 * and write the same BookingState (lifted into App), so whatever a client types
 * up top is already prefilled in the final form — the order is never lost as the
 * page scrolls. Both surfaces build their WhatsApp / email message from the same
 * helpers here, so the request always reads identically.
 */

export type TripType = "one-way" | "hourly";

/**
 * A location field's full value — free-typed text until a Photon suggestion
 * (or a map pin / current-location fix) is resolved, at which point
 * coordinates are attached. The booking system always prefers this validated
 * form over plain text.
 */
export interface LocationValue {
  /** What's shown in the input. */
  description: string;
  /** Provider-specific identifier (e.g. "osm:N:123456") — informational only. */
  placeId: string | null;
  formattedAddress: string | null;
  lat: number | null;
  lng: number | null;
  city: string | null;
  country: string | null;
  /** Which geocoder resolved this location, e.g. "photon". */
  provider: string | null;
}

export const EMPTY_LOCATION: LocationValue = {
  description: "",
  placeId: null,
  formattedAddress: null,
  lat: null,
  lng: null,
  city: null,
  country: null,
  provider: null
};

/** Coordinates are the real signal of a resolved place — free text alone isn't. */
export function isLocationValidated(location: LocationValue): boolean {
  return location.lat != null && location.lng != null;
}

export function locationText(location: LocationValue): string {
  return location.formattedAddress || location.description || "";
}

/** An OpenStreetMap deep link — no API key, no Google dependency. */
export function locationMapsLink(location: LocationValue): string | null {
  if (location.lat == null || location.lng == null) return null;
  const { lat, lng } = location;
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`;
}

export interface BookingState {
  tripType: TripType;
  /** Always used — the second slot (destination or duration) depends on tripType. */
  pickup: LocationValue;
  /** One-way only. */
  destination: LocationValue;
  /** Hourly only — an hours value from DURATION_OPTIONS, e.g. "3". */
  duration: string;
  date: string;
  time: string;
  flightNumber: string;
  passengers: string;
  luggage: string;
  vehicle: string;
  contact: string;
  notes: string;
}

export const EMPTY_BOOKING: BookingState = {
  tripType: "one-way",
  pickup: EMPTY_LOCATION,
  destination: EMPTY_LOCATION,
  duration: "2",
  date: "",
  time: "",
  flightNumber: "",
  passengers: "1",
  luggage: "2",
  vehicle: "bmw-i7",
  contact: "",
  notes: ""
};

export interface DurationOption {
  /** Hours, as a string, e.g. "2". */
  value: string;
  label: string;
}

/** By-the-hour packages — 40 km included per hour. */
export const DURATION_OPTIONS: DurationOption[] = [2, 3, 4, 5, 6, 7].map((hours) => ({
  value: String(hours),
  label: `${hours} hours (${hours * 40} km included)`
}));

export function durationLabelFor(value: string): string {
  return DURATION_OPTIONS.find((option) => option.value === value)?.label ?? "To be confirmed";
}

export const DATE_INPUT_PLACEHOLDER = "dd/mm/yy";

export function formatBookingDateInput(value: string): string {
  const isoDate = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoDate) return `${isoDate[3]}/${isoDate[2]}/${isoDate[1].slice(-2)}`;

  const digits = value.replace(/\D/g, "");
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;

  if (digits.length >= 8 && Number(digits.slice(0, 4)) >= 1900) {
    return `${digits.slice(6, 8)}/${digits.slice(4, 6)}/${digits.slice(2, 4)}`;
  }

  const dateDigits = digits.length >= 8 ? `${digits.slice(0, 4)}${digits.slice(-2)}` : digits.slice(0, 6);
  return `${dateDigits.slice(0, 2)}/${dateDigits.slice(2, 4)}/${dateDigits.slice(4, 6)}`;
}

export const WHATSAPP_NUMBER = "41772870956";
export const BOOKING_EMAIL = "booking@alairnoir.ch";

export interface VehicleMeta {
  /** Full booking label — "BMW i7", "Mercedes-Benz V-Class". */
  label: string;
  caption: string;
  capacity: string;
  description: string;
  cta: string;
  image: string;
}

export const VEHICLE_META: Record<string, VehicleMeta> = {
  "bmw-i7": {
    label: "BMW i7",
    caption: "Silent electric sedan",
    capacity: "1–3 passengers · 2 bags",
    description: "Best for airport arrivals, executive meetings, hotels, and private city transfers.",
    cta: "Select BMW i7",
    image: imageAssets.luxuryBmwI7
  },
  "v-class": {
    label: "Mercedes-Benz V-Class",
    caption: "Spacious private cabin",
    capacity: "1–6 passengers · 5 bags",
    description: "Best for families, delegations, luggage-heavy transfers, events, and long-distance routes.",
    cta: "Select V-Class",
    image: imageAssets.luxuryVClass
  }
};

export function vehicleMetaFor(id: string): VehicleMeta {
  return VEHICLE_META[id] ?? VEHICLE_META["bmw-i7"];
}

/** Normalise a free-text vehicle name to a known vehicle id. */
export function vehicleIdFromName(name?: string): string {
  if (!name) return "bmw-i7";
  const value = name.toLowerCase();
  return value.includes("v-class") || value.includes("mercedes") ? "v-class" : "bmw-i7";
}

/** The client-facing request message shared by both booking surfaces. */
export function buildRequestText(booking: BookingState): string {
  const vehicle = vehicleMetaFor(booking.vehicle);
  const isHourly = booking.tripType === "hourly";
  const pickupText = locationText(booking.pickup);
  const pickupMapsLink = locationMapsLink(booking.pickup);
  const lines = [
    "ALAIR NOIR — PRIVATE CHAUFFEUR REQUEST",
    "",
    `Trip type   : ${isHourly ? "By the hour" : "One way"}`,
    `Pickup      : ${pickupText || "To be confirmed"}`
  ];
  if (pickupMapsLink) lines.push(`Pickup Maps : ${pickupMapsLink}`);

  if (isHourly) {
    lines.push(`Duration    : ${durationLabelFor(booking.duration)}`);
  } else {
    const destinationText = locationText(booking.destination);
    const destinationMapsLink = locationMapsLink(booking.destination);
    lines.push(`Destination : ${destinationText || "To be confirmed"}`);
    if (destinationMapsLink) lines.push(`Dest. Maps  : ${destinationMapsLink}`);
  }

  lines.push(
    `Date        : ${booking.date || "To be confirmed"}`,
    `Time        : ${booking.time ? `${booking.time} (Zürich local)` : "To be confirmed"}`
  );

  if (booking.flightNumber.trim()) lines.push(`Flight      : ${booking.flightNumber.trim()}`);

  lines.push(
    `Passengers  : ${booking.passengers}`,
    `Luggage     : ${booking.luggage}`,
    `Vehicle     : ${vehicle.label}`
  );

  if (booking.contact.trim()) lines.push(`Contact     : ${booking.contact.trim()}`);
  if (booking.notes.trim()) lines.push(`Notes       : ${booking.notes.trim()}`);

  return lines.join("\n");
}

export function whatsappLink(booking: BookingState): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildRequestText(booking))}`;
}

export function emailLink(booking: BookingState): string {
  const subject = "Private Chauffeur Request — Zürich";
  return `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    buildRequestText(booking)
  )}`;
}
