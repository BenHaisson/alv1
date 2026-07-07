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
  route: string;
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
  route: "",
  date: "",
  time: "",
  flightNumber: "",
  passengers: "1",
  luggage: "2",
  vehicle: "bmw-i7",
  contact: "",
  notes: ""
};

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
  const lines = [
    "ALAIR NOIR — PRIVATE CHAUFFEUR REQUEST",
    "",
    `Trip type  : ${booking.tripType === "hourly" ? "By the hour" : "One way"}`,
    `Route      : ${booking.route || "To be confirmed"}`,
    `Date       : ${booking.date || "To be confirmed"}`,
    `Time       : ${booking.time ? `${booking.time} (Zürich local)` : "To be confirmed"}`
  ];

  if (booking.flightNumber.trim()) lines.push(`Flight     : ${booking.flightNumber.trim()}`);

  lines.push(
    `Passengers : ${booking.passengers}`,
    `Luggage    : ${booking.luggage}`,
    `Vehicle    : ${vehicle.label}`
  );

  if (booking.contact.trim()) lines.push(`Contact    : ${booking.contact.trim()}`);
  if (booking.notes.trim()) lines.push(`Notes      : ${booking.notes.trim()}`);

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
