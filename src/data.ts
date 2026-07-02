import {
  Vehicle,
  Pillar,
  AudienceCard,
  RouteItem,
  OccasionItem,
  ProofItem,
  Testimonial,
  FAQItem,
  AccessClass,
  ServiceMatrixItem,
  JourneyStep,
  IntelRoute,
  ProtocolItem
} from "./types";
import { imageAssets } from "./assets";

export const IMAGES = {
  bmw_i7_exterior: imageAssets.luxuryBmwI7,
  vclass_interior: imageAssets.luxuryVClass,
  zurich_airport_arrival: imageAssets.luxuryAirportWelcome,
  zurich_luxury_arrival: imageAssets.luxuryVipCabin,
  // Standard premium placeholders or dark vignettes for minor slides
  cabin_1: imageAssets.luxuryVipCabin, // Sleek leather
  cabin_2: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200", // Night drive
  cabin_3: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=1200", // Clean console
};

export const ALAIR_STANDARDS: Pillar[] = [
  {
    number: "01",
    title: "Timing",
    description: "Pickup, waiting time, route planning, airport rhythm, and arrival timing are prepared before the journey begins. You should not need to wonder if the vehicle is ready. It should already be there."
  },
  {
    number: "02",
    title: "Privacy",
    description: "Passenger details, routes, schedules, conversations, phone calls, documents, and private addresses are handled with discretion. Privacy is not an extra request. It is the default."
  },
  {
    number: "03",
    title: "Presence",
    description: "The vehicle, chauffeur, cabin, and arrival posture must represent the client properly. Clean. Composed. Professional. Quiet."
  },
  {
    number: "04",
    title: "Composure",
    description: "The cabin is your private interval between obligations. Work. Call. Think. Read. Rest. Or remain in silence."
  },
  {
    number: "05",
    title: "Precision",
    description: "Every detail is confirmed clearly and executed quietly — pickup point, destination, vehicle, passengers, luggage, flight details, special instructions. Premium clients notice what ordinary services ignore."
  }
];

export const AUDIENCE_CARDS: AudienceCard[] = [
  {
    number: "01",
    title: "CEOs & Founders",
    description: "For meetings, investors, airports, hotels, private obligations, and days that cannot feel improvised. A calm cabin between decisions."
  },
  {
    number: "02",
    title: "Executives",
    description: "For board meetings, corporate visits, roadshows, conferences, dinners, and airport arrivals where timing and presentation matter. No confusion. No casual service. No repeated instructions."
  },
  {
    number: "03",
    title: "Family Offices",
    description: "For principal movement, guest coordination, private residences, multi-stop schedules, and confidential itineraries. Reliable movement without unnecessary exposure."
  },
  {
    number: "04",
    title: "Government & Diplomatic Guests",
    description: "For official guests, delegations, protocol-sensitive travel, and private schedules requiring discretion and professional conduct. Composed service. Respectful communication. Controlled arrival."
  },
  {
    number: "05",
    title: "Private Clients",
    description: "For residence transfers, hotels, airport journeys, private dinners, shopping appointments, family travel, medical appointments, and weekend escapes. Personal without being intrusive."
  },
  {
    number: "06",
    title: "Hotels & Concierge",
    description: "For premium hospitality partners who require a chauffeur service that reflects their own standard. The guest is received properly before reaching the destination."
  }
];

export const VEHICLES: Vehicle[] = [
  {
    id: "bmw-i7",
    name: "BMW i7 xDrive60",
    subTitle: "Silent executive mobility.",
    description: "The BMW i7 xDrive60 is the executive choice for clients who value silence, comfort, and modern luxury. Ideal for airport transfers, business meetings, hotel arrivals, private appointments, and long-distance journeys across Switzerland.",
    highlights: [
      "Fully electric luxury sedan",
      "Silent cabin atmosphere",
      "Premium rear-seat comfort",
      "Executive presence on arrival",
      "Ideal for calls, work, rest, or privacy"
    ],
    bestFor: [
      "Executives & founders",
      "Private clients",
      "Airport arrivals",
      "Business meetings",
      "Hotel transfers",
      "One to three passengers"
    ],
    specs: [
      { label: "Power", value: "Electric 544 hp" },
      { label: "Range", value: "Up to 625 km (WLTP)" },
      { label: "Upholstery", value: "Merino Luxury Leather" },
      { label: "Roof Style", value: "Sky Lounge Panoramic" }
    ],
    image: imageAssets.luxuryBmwI7,
    interiorImage: imageAssets.bmwI7RearWorkspace,
    numericalSpecs: [
      { label: "Power output", value: 544, suffix: " hp" },
      { label: "Electric range", value: 625, suffix: " km" },
      { label: "Max Speed", value: 240, suffix: " km/h" }
    ]
  },
  {
    id: "v-class",
    name: "Mercedes-Benz V-Class",
    subTitle: "Premium space for private groups.",
    description: "The Mercedes-Benz V-Class is designed for families, delegations, executives, guests, and airport arrivals requiring more space. Ideal when the journey includes luggage, assistants, family members, hotel guests, event schedules, or long-distance private travel.",
    highlights: [
      "Spacious premium cabin",
      "Comfortable group seating",
      "Strong luggage capacity",
      "Private, discreet presentation",
      "Ideal for family offices, hospitality, and guest movement"
    ],
    bestFor: [
      "Families",
      "Executive groups",
      "Delegations",
      "Airport luggage",
      "Hotel arrivals & event transfers",
      "Long-distance routes"
    ],
    specs: [
      { label: "Wheelbase", value: "4.9m Long Wheelbase" },
      { label: "Styling", value: "AMG Line Package" },
      { label: "Infotainment", value: "Dynamic MBUX" },
      { label: "Seating", value: "8-Seat Luxury Configuration" }
    ],
    image: imageAssets.luxuryVClass,
    interiorImage: imageAssets.vclassInterior,
    numericalSpecs: [
      { label: "Wheelbase length", value: 4.9, suffix: " m" },
      { label: "Max seating capacity", value: 8, suffix: " seats" },
      { label: "Luggage volume", value: 1030, suffix: " L" }
    ]
  }
];

export const ROUTES: RouteItem[] = [
  {
    name: "Zürich Airport",
    description: "Flight-aware arrivals and departures, guest pickup, luggage consideration, and onward transfers to hotels and residences.",
    coordinates: { x: 52, y: 43 }
  },
  {
    name: "Zürich City",
    description: "Hotel transfers, private appointments, corporate movement, and city schedules.",
    coordinates: { x: 50, y: 50 }
  },
  {
    name: "Zug",
    description: "Executive travel, private offices, residences, and corporate transfers.",
    coordinates: { x: 52, y: 58 }
  },
  {
    name: "Lucerne",
    description: "Hotel arrivals, private stays, leisure routes, and guest reception.",
    coordinates: { x: 44, y: 62 }
  },
  {
    name: "Basel",
    description: "Business travel, events, airport connections, and cross-city movement.",
    coordinates: { x: 28, y: 38 }
  },
  {
    name: "Bern",
    description: "Government appointments, diplomatic schedules, corporate visits, and capital city movement.",
    coordinates: { x: 30, y: 60 }
  },
  {
    name: "Geneva",
    description: "Long-distance executive routes, private travel, diplomatic schedules, and hotel arrivals.",
    coordinates: { x: 8, y: 88 }
  },
  {
    name: "Lausanne",
    description: "Business schedules, lakeside hotels, private clients, and long-distance movement.",
    coordinates: { x: 16, y: 78 }
  },
  {
    name: "Davos",
    description: "Event-week mobility, WEF schedules, private guests, and mountain transfers.",
    coordinates: { x: 78, y: 60 }
  },
  {
    name: "St. Moritz",
    description: "Private long-distance travel, winter stays, hotel arrivals, and luggage-heavy journeys.",
    coordinates: { x: 80, y: 74 }
  },
  {
    name: "Gstaad",
    description: "Private alpine routes, residences, hotels, and seasonal movement.",
    coordinates: { x: 28, y: 76 }
  },
  {
    name: "Interlaken",
    description: "Leisure journeys, five-star hotel arrivals, family travel, and mountain excursions.",
    coordinates: { x: 38, y: 70 }
  }
];

export const OCCASIONS: OccasionItem[] = [
  {
    number: "01",
    title: "Zürich Airport Arrival",
    description: "For landings, departures, guest pickup, luggage consideration, and hotel or residence transfers."
  },
  {
    number: "02",
    title: "CEO & Executive Schedule",
    description: "For meetings, board appointments, investor days, client dinners, roadshows, and confidential business movement."
  },
  {
    number: "03",
    title: "Private Client Movement",
    description: "For residences, hotels, dinners, appointments, shopping, private events, and quiet city travel."
  },
  {
    number: "04",
    title: "Event Week Mobility",
    description: "For WEF Davos, Art Basel, Zürich Film Festival, private events, brand activations, and high-demand dates."
  },
  {
    number: "05",
    title: "Long-Distance Route",
    description: "For Davos, St. Moritz, Geneva, Basel, Lucerne, Milan, Munich, and selected European journeys."
  },
  {
    number: "06",
    title: "Guest & Delegation Reception",
    description: "For principals, families, corporate guests, private offices, assistants, and group movement requiring space and discretion."
  }
];

export const PROOF_ITEMS: ProofItem[] = [
  {
    title: "Direct Booking Communication",
    value: "Person to Person",
    description: "Requests are answered directly by ALAIR NOIR through email, dedicated phone, and WhatsApp — never an anonymous platform."
  },
  {
    title: "Clear Journey Confirmation",
    value: "Confirmed Before Departure",
    description: "Pickup point, timing, vehicle, and special instructions are confirmed clearly before every journey."
  },
  {
    title: "Discreet Handling",
    value: "Privacy by Default",
    description: "Personal details, routes, schedules, and private addresses are handled with strict discretion."
  },
  {
    title: "Professional Chauffeur Service",
    value: "Composed & Prepared",
    description: "Clean presentation, respectful communication, and professional conduct on every journey."
  },
  {
    title: "Prepared Vehicle Presentation",
    value: "Ready on Arrival",
    description: "The vehicle is prepared, positioned, and presented properly before you reach it."
  },
  {
    title: "Airport & Schedule Awareness",
    value: "Flight-Aware Timing",
    description: "Flights, waiting time, and schedule changes are tracked and absorbed quietly."
  },
  {
    title: "Private Cabin Environment",
    value: "Your Interval",
    description: "Work, call, think, read, rest — or remain in silence. The cabin stays private."
  },
  {
    title: "Switzerland-Wide Capability",
    value: "Zürich & Beyond",
    description: "Airport transfers, city schedules, and long-distance journeys across Switzerland."
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Punctual, immaculate, and discreet. The kind of service I want when I land in Zürich and need the rest of the day to work.",
    author: "Private Client, Zürich / London"
  },
  {
    quote: "The value is not only the vehicle. It is the calm communication, the confirmed details, and the feeling that the movement is already handled.",
    author: "Executive Assistant, Private Office"
  },
  {
    quote: "During event weeks, timing and discretion matter more than anything. ALAIR NOIR understands the pressure around guest movement.",
    author: "Corporate Guest Coordinator, Event Week"
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "Do you offer Zürich Airport transfers?",
    answer: "Yes. ALAIR NOIR arranges private transfers to and from Zürich Airport with flight-aware timing, direct communication, luggage consideration, and onward movement to hotels, residences, offices, events, or long-distance destinations."
  },
  {
    question: "Can I book for a CEO, principal, executive, guest, or client?",
    answer: "Yes. Many requests are made by executive assistants, family offices, corporate bookers, concierge teams, and private offices arranging travel on behalf of someone else."
  },
  {
    question: "Which vehicles are available?",
    answer: "ALAIR NOIR offers the BMW i7 2026 and Mercedes V-Class 2026. Vehicle recommendation depends on passenger count, luggage, journey type, and preferred cabin experience."
  },
  {
    question: "Can I request a specific vehicle?",
    answer: "Yes. A preferred vehicle can be requested when booking. Availability is confirmed directly."
  },
  {
    question: "Do you operate outside Zürich?",
    answer: "Yes. ALAIR NOIR arranges journeys across Switzerland and selected European routes by request, including Davos, St. Moritz, Basel, Geneva, Lucerne, Gstaad, Milan, and Munich."
  },
  {
    question: "Can I book long-distance travel?",
    answer: "Yes. Long-distance private chauffeur journeys are available across Switzerland and selected cross-border routes."
  },
  {
    question: "Can I reserve by the hour?",
    answer: "Yes. Hourly arrangements are available for multi-stop executive schedules, business days, events, private appointments, shopping, dinners, and flexible city movement."
  },
  {
    question: "Do you support event weeks?",
    answer: "Yes. ALAIR NOIR can arrange private mobility for high-demand periods such as WEF Davos, Art Basel, Zürich Film Festival, corporate events, private dinners, and guest schedules."
  },
  {
    question: "Are rates fixed?",
    answer: "Rates are provided on request according to route, waiting time, vehicle, passenger count, luggage, schedule requirements, and event demand."
  },
  {
    question: "How do I book?",
    answer: "Send the date, time, route, passenger count, luggage requirements, preferred vehicle, and any private instructions by email or WhatsApp. Availability and rate are confirmed directly."
  }
];

export const ACCESS_CLASSES: AccessClass[] = [
  {
    id: "ceo-founders",
    number: "01",
    title: "CEO & Founders",
    description:
      "Moving between decisions, boardrooms, investors, and airports — days that cannot feel improvised."
  },
  {
    id: "family-offices",
    number: "02",
    title: "Family Offices",
    description:
      "Principals, relatives, guests, recurring schedules, and luggage-heavy arrivals handled quietly."
  },
  {
    id: "diplomatic-guests",
    number: "03",
    title: "Diplomatic Guests",
    description:
      "Protocol-sensitive movement, delegation logistics, and discreet professional conduct throughout."
  },
  {
    id: "premium-hospitality",
    number: "04",
    title: "Premium Hospitality",
    description:
      "Hotel and concierge partners extending a five-star standard beyond the lobby doors."
  },
  {
    id: "private-clients",
    number: "05",
    title: "Private Clients",
    description:
      "Residences, hotels, appointments, private dinners, and weekend escapes without exposure."
  }
];

export const SERVICE_MATRIX: ServiceMatrixItem[] = [
  {
    id: "airport-transfer",
    number: "01",
    title: "Airport Transfer",
    tagline: "Flight-aware arrival control",
    details: [
      "Flight-aware pickup",
      "Terminal coordination",
      "Luggage consideration",
      "Hotel or residence handover"
    ]
  },
  {
    id: "executive-transfer",
    number: "02",
    title: "Executive Transfer",
    tagline: "Corporate schedule precision",
    details: ["Board meetings", "Investor days", "Client dinners", "Roadshows"]
  },
  {
    id: "private-client",
    number: "03",
    title: "Private Client Movement",
    tagline: "Quiet personal mobility",
    details: [
      "Residences",
      "Hotels",
      "Appointments",
      "Private dinners",
      "Weekend escapes"
    ]
  },
  {
    id: "diplomatic",
    number: "04",
    title: "Diplomatic / Government",
    tagline: "Protocol-grade handling",
    details: [
      "Protocol-sensitive travel",
      "Delegation movement",
      "Discreet handling",
      "Professional conduct"
    ]
  },
  {
    id: "hotel-concierge",
    number: "05",
    title: "Hotel & Concierge",
    tagline: "Five-star guest reception",
    details: [
      "Guest reception",
      "Premium arrival",
      "Concierge coordination",
      "Five-star standard"
    ]
  },
  {
    id: "long-distance",
    number: "06",
    title: "Long-Distance Routes",
    tagline: "Switzerland-wide reach",
    details: [
      "Davos & St. Moritz",
      "Geneva & Basel",
      "Cross-country schedules",
      "Selected European routes"
    ]
  }
];

export const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: "request",
    number: "01",
    title: "Request",
    status: "INQUIRY RECEIVED",
    instruction: "Route, timing, passengers, and instructions arrive by WhatsApp or email.",
    tag: "DIRECT LINE",
    description:
      "The journey begins with a direct message — no portals, no call centers, no exposure.",
    image: imageAssets.bmwI7RearWorkspace
  },
  {
    id: "confirm",
    number: "02",
    title: "Confirm",
    status: "AVAILABILITY LOCKED",
    instruction: "Vehicle, rate, and pickup detail are confirmed in writing before the journey.",
    tag: "WRITTEN CONFIRMATION",
    description:
      "Every detail is fixed clearly and quietly — nothing left to interpretation.",
    image: imageAssets.bmwI7Departure
  },
  {
    id: "prepare",
    number: "03",
    title: "Prepare",
    status: "CABIN CALIBRATED",
    instruction: "Temperature, water, silence settings, and route pre-checks are completed.",
    tag: "PRE-DEPARTURE",
    description:
      "The cabin is prepared to represent the client before the door ever opens.",
    image: imageAssets.bmwI7CockpitNight
  },
  {
    id: "arrive",
    number: "04",
    title: "Arrive",
    status: "ON POSITION",
    instruction: "The chauffeur is positioned early — flight-aware and terminal-ready.",
    tag: "FLIGHT-AWARE",
    description:
      "Arrival choreography stays precise: the vehicle is already waiting, never searched for.",
    image: imageAssets.bmwI7TarmacMeet
  },
  {
    id: "drive",
    number: "05",
    title: "Drive",
    status: "EN ROUTE",
    instruction: "A silent electric cabin between obligations — calls, preparation, or rest.",
    tag: "PRIVATE CABIN",
    description:
      "The road becomes a protected interval: quiet enough to think, work, or reset.",
    image: imageAssets.bmwI7AlpineCruise
  },
  {
    id: "adapt",
    number: "06",
    title: "Adapt",
    status: "SCHEDULE SYNC",
    instruction: "Delays, added stops, or changed plans are absorbed without friction.",
    tag: "LIVE ADJUSTMENT",
    description:
      "When the day moves, the journey moves with it — recalculated, not renegotiated.",
    image: imageAssets.bmwI7StMoritzDusk
  },
  {
    id: "deliver",
    number: "07",
    title: "Deliver",
    status: "HANDOVER COMPLETE",
    instruction: "Arrival at hotel, residence, or terminal — handled to the door.",
    tag: "COMPLETION",
    description:
      "The journey closes the way it opened: prepared, discreet, and exactly on time.",
    image: imageAssets.luxuryAirportWelcome
  }
];

export const INTEL_ROUTES: IntelRoute[] = [
  {
    id: "zurich-airport",
    name: "Zürich Airport",
    sector: "ZRH-A",
    eta: "≈ 15 MIN",
    description:
      "Flight-aware pickup, terminal coordination, luggage consideration, and onward handover.",
    coordinates: { x: 60, y: 22 }
  },
  {
    id: "zurich-city",
    name: "Zürich City",
    sector: "ZRH-C",
    eta: "OPERATIONS BASE",
    description:
      "Hotel arrivals, corporate schedules, private appointments, and city movement — the hub itself.",
    coordinates: { x: 57, y: 30 }
  },
  {
    id: "zug",
    name: "Zug",
    sector: "ZG-01",
    eta: "≈ 35 MIN",
    description: "Executive travel, private offices, residences, and corporate transfers.",
    coordinates: { x: 54, y: 41 }
  },
  {
    id: "lucerne",
    name: "Lucerne",
    sector: "LU-02",
    eta: "≈ 50 MIN",
    description: "Hotel arrivals, private stays, leisure routes, and guest reception.",
    coordinates: { x: 47, y: 45 }
  },
  {
    id: "basel",
    name: "Basel",
    sector: "BS-03",
    eta: "≈ 1 H 05",
    description: "Business travel, Art Basel weeks, airport connections, and cross-city movement.",
    coordinates: { x: 36, y: 15 }
  },
  {
    id: "bern",
    name: "Bern",
    sector: "BE-04",
    eta: "≈ 1 H 20",
    description: "Government schedules, diplomatic visits, and federal-city appointments.",
    coordinates: { x: 33, y: 43 }
  },
  {
    id: "geneva",
    name: "Geneva",
    sector: "GE-05",
    eta: "≈ 2 H 45",
    description:
      "Long-distance executive routes, private travel, diplomatic schedules, and hotel arrivals.",
    coordinates: { x: 8, y: 79 }
  },
  {
    id: "lausanne",
    name: "Lausanne",
    sector: "VD-06",
    eta: "≈ 2 H 30",
    description: "Lakeside residences, business appointments, and onward Léman-region movement.",
    coordinates: { x: 16, y: 67 }
  },
  {
    id: "davos",
    name: "Davos",
    sector: "GR-07",
    eta: "≈ 2 H 00",
    description: "Event-week mobility, WEF schedules, private guests, and mountain transfers.",
    coordinates: { x: 85, y: 44 }
  },
  {
    id: "st-moritz",
    name: "St. Moritz",
    sector: "GR-08",
    eta: "≈ 2 H 30",
    description:
      "Private long-distance travel, winter stays, hotel arrivals, and luggage-heavy journeys.",
    coordinates: { x: 86, y: 62 }
  },
  {
    id: "gstaad",
    name: "Gstaad",
    sector: "BE-09",
    eta: "≈ 2 H 15",
    description: "Private alpine routes, residences, hotels, and seasonal movement.",
    coordinates: { x: 27, y: 62 }
  },
  {
    id: "interlaken",
    name: "Interlaken",
    sector: "BE-10",
    eta: "≈ 1 H 50",
    description: "Alpine resort arrivals, private stays, and scenic long-distance schedules.",
    coordinates: { x: 38, y: 56 }
  }
];

export const PROTOCOLS: ProtocolItem[] = [
  {
    number: "01",
    title: "Direct Booking",
    description: "Requests are handled directly — no marketplace, no third-party dispatch."
  },
  {
    number: "02",
    title: "Clear Confirmation",
    description: "Vehicle, rate, timing, and pickup are confirmed in writing before departure."
  },
  {
    number: "03",
    title: "Privacy by Default",
    description: "Names, routes, and schedules are treated as confidential — always."
  },
  {
    number: "04",
    title: "Professional Chauffeur",
    description: "Trained, discreet, and prepared to represent the client properly."
  },
  {
    number: "05",
    title: "Prepared Vehicle",
    description: "Cabin, temperature, water, and presentation calibrated before arrival."
  },
  {
    number: "06",
    title: "Flight-Aware Timing",
    description: "Landings are tracked; pickup adjusts to the aircraft, not the estimate."
  },
  {
    number: "07",
    title: "Private Cabin",
    description: "A silent interval between obligations — no unnecessary conversation."
  },
  {
    number: "08",
    title: "Switzerland-Wide Capability",
    description: "Zürich-based and prepared for every Swiss route and selected EU journeys."
  }
];
