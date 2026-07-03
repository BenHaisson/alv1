import { imageAssets } from "../assets";

/**
 * Data for the ALAIR NOIR motion layer (src/components/motion/).
 *
 * Video slots point into /videos/* (served from public/videos/). The three
 * approved video moments are produced later via the OpenArt image-to-video
 * pipeline (see .claude/skills/alair-noir-visual-journey/SKILL.md — vehicle
 * asset + credit-safe rules). Until an mp4 exists at the path, every motion
 * component falls back to its poster image, so the site ships without them.
 */

export interface VideoSlot {
  /** Public path to the mp4, e.g. "/videos/bmw-i7-hero.mp4". */
  src: string;
  /** Poster / fallback still (imported asset). Always required. */
  poster: string;
  alt: string;
}

export const HERO_VIDEO: VideoSlot = {
  src: "/videos/bmw-i7-hero.mp4",
  poster: imageAssets.alairNoirHero,
  alt: "Black BMW i7 arriving through Zürich at night for Alair Noir"
};

export const CABIN_VIDEO: VideoSlot = {
  src: "/videos/bmw-i7-cabin.mp4",
  // Fleet interiors are black — poster uses the black i7 cockpit until the
  // corrected black rear-cabin still is approved; the video will be generated
  // from that approved frame, and this poster should then match it.
  poster: imageAssets.bmwI7CockpitNight,
  alt: "Private rear cabin of the BMW i7 at night"
};

export const VCLASS_ARRIVAL_VIDEO: VideoSlot = {
  src: "/videos/mercedes-vclass-arrival.mp4",
  poster: imageAssets.luxuryVClass,
  alt: "Mercedes-Benz V-Class arriving at a Zürich hotel entrance"
};

export interface FleetRevealCard {
  id: string;
  name: string;
  role: string;
  line: string;
  image: string;
  /** Optional approved video moment for this card (falls back to `image`). */
  video?: VideoSlot;
}

export const FLEET_REVEAL: FleetRevealCard[] = [
  {
    id: "bmw-i7",
    name: "BMW i7 xDrive60",
    role: "The Executive Cabin",
    line: "Silent, electric, composed — for single-principal movement.",
    image: imageAssets.luxuryBmwI7
  },
  {
    id: "v-class",
    name: "Mercedes-Benz V-Class",
    role: "The Private Shuttle",
    line: "Space for families, guests, and luggage — without losing the standard.",
    image: imageAssets.luxuryVClass,
    video: VCLASS_ARRIVAL_VIDEO
  }
];

export interface DestinationCard {
  id: string;
  number: string;
  title: string;
  tagline?: string;
  description: string;
  image?: string;
  /** Position on the schematic route line, 0–100 (percent along the path). */
  routeStop: number;
}

export const DESTINATIONS: DestinationCard[] = [
  {
    id: "zurich-airport",
    number: "01",
    title: "Zürich Airport",
    tagline: "Flight-aware arrival",
    description:
      "Terminal coordination, luggage consideration, and onward handover — timed to the flight, not the clock.",
    image: imageAssets.zurichAirportArrival,
    routeStop: 6
  },
  {
    id: "zurich-city",
    number: "02",
    title: "Zürich City",
    tagline: "The operations base",
    description:
      "Hotel arrivals, corporate schedules, private appointments, and quiet city movement.",
    image: imageAssets.zurichLuxuryArrival,
    routeStop: 22
  },
  {
    id: "davos",
    number: "03",
    title: "Davos",
    tagline: "Event-week mobility",
    description:
      "WEF schedules, private guests, and mountain transfers handled under pressure, quietly.",
    image: imageAssets.bmwI7AlpineCruise,
    routeStop: 42
  },
  {
    id: "st-moritz",
    number: "04",
    title: "St. Moritz",
    tagline: "Winter arrival",
    description:
      "Long-distance travel, winter stays, hotel arrivals, and luggage-heavy journeys.",
    image: imageAssets.bmwI7StMoritzDusk,
    routeStop: 62
  },
  {
    id: "geneva",
    number: "05",
    title: "Geneva",
    tagline: "The long route west",
    description:
      "Executive routes, diplomatic schedules, and lakeside hotel arrivals across the country.",
    image: imageAssets.luxuryAirportWelcome,
    routeStop: 82
  },
  {
    id: "basel",
    number: "06",
    title: "Basel",
    tagline: "Cross-city movement",
    description:
      "Business travel, Art Basel weeks, airport connections, and cross-border coordination.",
    image: imageAssets.bmwI7Departure,
    routeStop: 96
  }
];
