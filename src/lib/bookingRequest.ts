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

export interface BookingState {
  tripType: TripType;
  /** Always used — the second slot (destination or duration) depends on tripType. */
  pickup: string;
  /** One-way only. */
  destination: string;
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
  pickup: "",
  destination: "",
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

export const WHATSAPP_NUMBER = "41772870956";
export const BOOKING_EMAIL = "booking@alairnoir.ch";

export interface VehicleMeta {
  /** Short booking label — "BMW i7", "Mercedes V-Class". */
  label: string;
  caption: string;
  image: string;
}

export const VEHICLE_META: Record<string, VehicleMeta> = {
  "bmw-i7": {
    label: "BMW i7",
    caption: "Silent electric sedan",
    image: imageAssets.luxuryBmwI7
  },
  "v-class": {
    label: "Mercedes V-Class",
    caption: "Spacious private cabin",
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
  const lines = [
    "ALAIR NOIR — PRIVATE CHAUFFEUR REQUEST",
    "",
    `Trip type   : ${isHourly ? "By the hour" : "One way"}`,
    `Pickup      : ${booking.pickup || "To be confirmed"}`
  ];

  if (isHourly) {
    lines.push(`Duration    : ${durationLabelFor(booking.duration)}`);
  } else {
    lines.push(`Destination : ${booking.destination || "To be confirmed"}`);
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
