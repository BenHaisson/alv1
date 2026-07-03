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
  ValueCard
} from "./types";
import { imageAssets } from "./assets";

export const IMAGES = {
  bmw_i7_exterior: imageAssets.luxuryBmwI7,
  vclass_interior: imageAssets.luxuryVClass,
  zurich_airport_arrival: imageAssets.luxuryAirportWelcome,
  zurich_luxury_arrival: imageAssets.luxuryVipCabin,
  // Approved local assets only — no external/stock URLs (see SKILL.md asset rules)
  cabin_1: imageAssets.luxuryVipCabin, // Sleek leather
  cabin_2: imageAssets.bmwI7CockpitNight, // Night drive
  cabin_3: imageAssets.bmwI7RearWorkspace, // Clean console
};

export const ALAIR_STANDARDS: Pillar[] = [
  {
    number: "01",
    title: "Timing",
    description: "Pickup rhythm, route planning, waiting time, and handover are considered before the journey begins. The schedule is treated as something to protect, not simply follow."
  },
  {
    number: "02",
    title: "Privacy",
    description: "Passenger details, routes, schedules, and instructions are handled with discretion by default. Privacy is not an upgrade. It is the operating standard."
  },
  {
    number: "03",
    title: "Presence",
    description: "The vehicle, cabin, communication, and arrival posture are prepared to represent the client properly. The service should feel composed before the door opens."
  },
  {
    number: "04",
    title: "Composure",
    description: "The cabin becomes a private interval between obligations — quiet enough to think, call, read, rest, or reset."
  },
  {
    number: "05",
    title: "Precision",
    description: "Details are confirmed clearly, executed quietly, and adjusted when the schedule changes. Precision is visible in what the client does not need to manage."
  }
];

export const VALUE_CARDS: ValueCard[] = [
  {
    number: "01",
    title: "Private by Default",
    description: "Passenger details, schedules, routes, waiting time, and special instructions are handled with discretion from the first message."
  },
  {
    number: "02",
    title: "Prepared Before Arrival",
    description: "Pickup timing, route rhythm, luggage requirements, vehicle choice, and client preferences are reviewed before the chauffeur reaches the pickup point."
  },
  {
    number: "03",
    title: "Calm in Motion",
    description: "The cabin is prepared as a private interval between obligations — quiet enough to think, call, read, rest, or reset."
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
    subTitle: "Silent executive mobility for private and business movement.",
    description: "The BMW i7 xDrive60 is fully electric, quiet, and suited for clients who need a composed cabin between meetings, airport arrivals, hotels, residences, and private appointments. It is designed for calm executive travel where silence, comfort, and presence matter.",
    highlights: [
      "Fully electric ride",
      "Quiet executive cabin",
      "Premium rear-seat comfort",
      "Discreet arrival presence",
      "Ideal for Zürich city and business routes"
    ],
    bestFor: [
      "Executives",
      "Founders",
      "Private clients",
      "Airport arrivals",
      "Hotel transfers",
      "Single-principal movement"
    ],
    specs: [
      { label: "Power", value: "Electric 544 hp" },
      { label: "Range", value: "Up to 625 km (WLTP)" },
      { label: "Upholstery", value: "Merino Luxury Leather" },
      { label: "Roof Style", value: "Sky Lounge Panoramic" }
    ],
    image: imageAssets.luxuryBmwI7,
    // Fleet interiors are black — the rear-workspace shot shows a cream cabin,
    // so the black i7 cockpit serves until the corrected black rear-cabin
    // still (OpenArt i2i) is approved and dropped in.
    interiorImage: imageAssets.bmwI7CockpitNight,
    numericalSpecs: [
      { label: "Power output", value: 544, suffix: " hp" },
      { label: "Electric range", value: 625, suffix: " km" },
      { label: "Max Speed", value: 240, suffix: " km/h" }
    ]
  },
  {
    id: "v-class",
    name: "Mercedes-Benz V-Class",
    subTitle: "Premium space for families, guests, luggage, and group movement.",
    description: "The Mercedes-Benz V-Class offers refined space for passengers who require comfort, luggage capacity, and flexibility without losing the private chauffeur standard. It is suited for families, hotel guests, delegations, airport transfers, and longer journeys across Switzerland.",
    highlights: [
      "Spacious premium cabin",
      "Comfortable group travel",
      "Strong luggage capacity",
      "Ideal for airport and hotel movement",
      "Suitable for Switzerland-wide journeys"
    ],
    bestFor: [
      "Families",
      "VIP guests",
      "Hotel transfers",
      "Delegations",
      "Airport luggage",
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
    question: "Do you provide private chauffeur service in Zürich?",
    answer: "Yes. ALAIR NOIR GmbH provides private chauffeur service in Zürich for executives, private clients, hotels, family offices, diplomatic guests, airport transfers, and long-distance journeys across Switzerland."
  },
  {
    question: "Do you offer Zürich Airport transfers?",
    answer: "Yes. Zürich Airport transfers can be arranged for arrivals, departures, hotel transfers, residence transfers, private clients, executives, families, and VIP guests."
  },
  {
    question: "Can I book a chauffeur for several hours?",
    answer: "Yes. Hourly chauffeur service can be arranged for meetings, events, private appointments, city movement, shopping, dining, or multi-stop schedules."
  },
  {
    question: "Which vehicles are available?",
    answer: "ALAIR NOIR offers a BMW i7 xDrive60 for silent executive mobility and a Mercedes-Benz V-Class for premium group travel, families, luggage, and long-distance comfort."
  },
  {
    question: "Do you serve destinations outside Zürich?",
    answer: "Yes. Chauffeur journeys can be arranged across Switzerland, including Zug, Lucerne, Basel, Bern, Geneva, Davos, St. Moritz, Gstaad, Interlaken, Lugano, and other destinations by request."
  },
  {
    question: "Can hotels or concierge teams book for guests?",
    answer: "Yes. Hotels, concierge desks, guest relations teams, private hosts, and assistants can arrange chauffeur service for guests, principals, families, and VIP arrivals."
  },
  {
    question: "Is the service suitable for family offices and private principals?",
    answer: "Yes. ALAIR NOIR is suitable for family office coordination, principal movement, guest transfers, private residence pickups, airport arrivals, and discreet schedule-sensitive journeys."
  },
  {
    question: "Can I choose between the BMW i7 and Mercedes-Benz V-Class?",
    answer: "Yes. Vehicle selection depends on passenger count, luggage, route, and client preference. The BMW i7 is ideal for quiet executive travel. The Mercedes-Benz V-Class is ideal for groups, families, luggage, and longer routes."
  },
  {
    question: "How do I request a price?",
    answer: "Send the pickup point, destination, date, time, passenger count, luggage details, and preferred vehicle. Availability and rate will be confirmed directly."
  },
  {
    question: "Can I book by WhatsApp?",
    answer: "Yes. Booking can be started by WhatsApp for fast, direct coordination."
  }
];

export const ACCESS_CLASSES: AccessClass[] = [
  {
    id: "ceo-founders",
    number: "01",
    title: "CEO & Founders",
    tagline: "A calm cabin between decisions",
    description:
      "Moving between decisions, boardrooms, investors, and airports — days that cannot feel improvised.",
    image: imageAssets.identityCeoFounders
  },
  {
    id: "family-offices",
    number: "02",
    title: "Family Offices",
    tagline: "Movement without exposure",
    description:
      "Principals, relatives, guests, recurring schedules, and luggage-heavy arrivals handled quietly.",
    image: imageAssets.identityFamilyOffices
  },
  {
    id: "diplomatic-guests",
    number: "03",
    title: "Diplomatic Guests",
    tagline: "Protocol-grade discretion",
    description:
      "Protocol-sensitive movement, delegation logistics, and discreet professional conduct throughout.",
    image: imageAssets.identityDiplomaticGuests
  },
  {
    id: "premium-hospitality",
    number: "04",
    title: "Premium Hospitality",
    tagline: "Five-star, beyond the lobby",
    description:
      "Hotel and concierge partners extending a five-star standard beyond the lobby doors.",
    image: imageAssets.identityPremiumHospitality
  },
  {
    id: "private-clients",
    number: "05",
    title: "Private Clients",
    tagline: "Personal, never intrusive",
    description:
      "Residences, hotels, appointments, private dinners, and weekend escapes without exposure.",
    image: imageAssets.identityPrivateClients
  }
];

export const SERVICE_MATRIX: ServiceMatrixItem[] = [
  {
    id: "airport-transfer",
    number: "01",
    title: "Zürich Airport Transfers",
    tagline: "Flight-aware arrival control",
    description:
      "Private airport transfers to and from Zürich Airport with flight-aware timing, meet-and-greet coordination, luggage handling, and direct transfer to hotels, residences, offices, private terminals, or onward destinations.",
    details: [
      "International arrivals",
      "VIP guests",
      "Executives",
      "Family office clients",
      "Hotel guests",
      "Diplomatic visitors"
    ]
  },
  {
    id: "executive-transfer",
    number: "02",
    title: "Executive Chauffeur Zürich",
    tagline: "Composed between decisions",
    description:
      "Discreet chauffeur service for CEOs, founders, board members, investors, and senior executives moving between meetings, hotels, restaurants, airports, private appointments, and events.",
    details: [
      "Board meetings",
      "Roadshows",
      "Client visits",
      "Investor meetings",
      "Corporate dinners",
      "Conference days"
    ]
  },
  {
    id: "private-client",
    number: "03",
    title: "Private Client Chauffeur",
    tagline: "Shaped around your rhythm",
    description:
      "Personal chauffeur service for private clients who value privacy, comfort, and continuity. Suitable for residence transfers, shopping appointments, medical visits, private dinners, family movements, and special occasions.",
    details: [
      "Private clients",
      "Couples",
      "Families",
      "Principals",
      "Personal assistants",
      "Lifestyle managers"
    ]
  },
  {
    id: "family-office",
    number: "04",
    title: "Family Office & Principal Movement",
    tagline: "Schedule-sensitive execution",
    description:
      "Chauffeur coordination for principals, family offices, assistants, advisors, and guests requiring discretion, consistency, and schedule-sensitive execution.",
    details: [
      "Family office schedules",
      "Private banking appointments",
      "Residence transfers",
      "Guest arrivals",
      "Multi-stop itineraries"
    ]
  },
  {
    id: "hotel-concierge",
    number: "05",
    title: "Hotel, Concierge & Hospitality",
    tagline: "A refined arrival experience",
    description:
      "Premium transfer service for luxury hotels, concierge desks, guest relations teams, and hospitality partners requiring a refined arrival and departure experience.",
    details: [
      "Hotel arrivals",
      "VIP guests",
      "Private dining",
      "Airport pickup",
      "Event transfers",
      "Luggage-heavy movement"
    ]
  },
  {
    id: "long-distance",
    number: "06",
    title: "Long-Distance Chauffeur Switzerland",
    tagline: "Zürich to wherever the day requires",
    description:
      "Private chauffeur journeys from Zürich to destinations across Switzerland and selected European routes, prepared with route planning, comfort, timing, and privacy.",
    details: [
      "Davos, St. Moritz, Gstaad",
      "Geneva, Basel, Bern",
      "Lucerne, Interlaken, Lugano",
      "Milan & selected cross-border"
    ]
  }
];

export const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: "request",
    number: "01",
    title: "Send the Request",
    status: "INQUIRY RECEIVED",
    instruction: "Share the pickup point, destination, date, time, passenger count, luggage details, and preferred vehicle.",
    tag: "DIRECT LINE",
    description:
      "Booking begins with a direct message — no portals, no call centers, no exposure.",
    image: imageAssets.bmwI7CockpitNight
  },
  {
    id: "confirm",
    number: "02",
    title: "Confirm the Details",
    status: "AVAILABILITY LOCKED",
    instruction: "Availability, route, vehicle suitability, timing, and price are confirmed directly.",
    tag: "WRITTEN CONFIRMATION",
    description:
      "Every detail is fixed clearly and quietly — nothing left to interpretation.",
    image: imageAssets.bmwI7Departure
  },
  {
    id: "prepare",
    number: "03",
    title: "Prepare the Journey",
    status: "CABIN CALIBRATED",
    instruction: "Flight details, waiting time, route rhythm, private instructions, and passenger preferences are reviewed before pickup.",
    tag: "PRE-DEPARTURE",
    description:
      "The cabin is prepared to represent the client before the door ever opens.",
    image: imageAssets.bmwI7CockpitNight
  },
  {
    id: "meet",
    number: "04",
    title: "Meet the Chauffeur",
    status: "ON POSITION",
    instruction: "The vehicle arrives prepared, the cabin is ready, and the journey begins without unnecessary friction.",
    tag: "PREPARED ARRIVAL",
    description:
      "Arrival choreography stays precise: the vehicle is already waiting, never searched for.",
    image: imageAssets.bmwI7TarmacMeet
  },
  {
    id: "adapt",
    number: "05",
    title: "Adapt When Needed",
    status: "SCHEDULE SYNC",
    instruction: "If the schedule changes, the service adapts quietly and communicates clearly.",
    tag: "LIVE ADJUSTMENT",
    description:
      "When the day moves, the journey moves with it — recalculated, not renegotiated.",
    image: imageAssets.bmwI7StMoritzDusk
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
  },
  {
    id: "lugano",
    name: "Lugano",
    sector: "TI-11",
    eta: "≈ 2 H 40",
    description: "Ticino lakeside travel, private residences, cross-border Milan connections, and southern-Switzerland journeys.",
    coordinates: { x: 64, y: 86 }
  }
];

