import { Vehicle, Pillar, AudienceCard, RouteItem, OccasionItem, ProofItem, Testimonial, FAQItem } from "./types";
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
    description: "Pickup rhythm, route planning, waiting time, and handover are considered before the journey begins."
  },
  {
    number: "02",
    title: "Privacy",
    description: "Passenger details, routes, schedules, and instructions are handled with discretion by default."
  },
  {
    number: "03",
    title: "Presence",
    description: "The vehicle, cabin, communication, and arrival posture are prepared to represent the client properly."
  },
  {
    number: "04",
    title: "Composure",
    description: "The cabin becomes a private interval between obligations — quiet enough to think, call, read, rest, or reset."
  },
  {
    number: "05",
    title: "Precision",
    description: "Details are confirmed clearly, executed quietly, and adjusted when the schedule changes."
  }
];

export const AUDIENCE_CARDS: AudienceCard[] = [
  {
    number: "01",
    title: "CEOs & Founders",
    description: "For those moving between decisions, meetings, investors, hotels, airports, and private obligations where the day cannot feel improvised."
  },
  {
    number: "02",
    title: "Executives",
    description: "For board meetings, client visits, roadshows, airport arrivals, corporate dinners, and schedules where timing matters."
  },
  {
    number: "03",
    title: "Private Clients",
    description: "For residence transfers, hotels, restaurants, appointments, shopping, private events, and long-distance travel handled without unnecessary exposure."
  },
  {
    number: "04",
    title: "Family Offices",
    description: "For principals, relatives, guests, luggage-heavy airport arrivals, recurring schedules, and cross-border journeys."
  },
  {
    number: "05",
    title: "Executive Assistants",
    description: "For clear confirmations, reliable communication, vehicle recommendation, route details, and professional handling on behalf of someone else."
  },
  {
    number: "06",
    title: "Corporate Guests",
    description: "For visiting clients, senior leadership, investors, delegations, and event guests who should be received with control."
  }
];

export const VEHICLES: Vehicle[] = [
  {
    id: "bmw-i7",
    name: "BMW i7 2026",
    subTitle: "Silent, fully electric performance.",
    description: "The BMW i7 2026 sets the standard for emission-free premium travel. Equipped with a whisper-silent electric powertrain, exquisite Merino leather seating, and the breathtaking Sky Lounge panoramic glass roof, it is the ultimate quiet mobile sanctuary.",
    highlights: [
      "Electric drivetrain with 610 hp",
      "Executive Lounge rear passenger seats",
      "Sky Lounge panoramic glass roof with LED threads",
      "Double-glazed acoustic insulation with active noise cancellation"
    ],
    bestFor: [
      "CEOs & Founders",
      "Private clients & Executives",
      "ZRH Airport arrivals & Hotel transfers",
      "Quiet Alpine transitions & long-distance routes"
    ],
    specs: [
      { label: "Power", value: "Electric 610 hp" },
      { label: "Range", value: "Up to 625 km (WLTP)" },
      { label: "Upholstery", value: "Merino Luxury Leather" },
      { label: "Roof Style", value: "Sky Lounge Panoramic" }
    ],
    image: imageAssets.luxuryBmwI7,
    interiorImage: imageAssets.bmwI7RearWorkspace,
    numericalSpecs: [
      { label: "Power output", value: 610, suffix: " hp" },
      { label: "Electric range", value: 625, suffix: " km" },
      { label: "Max Speed", value: 250, suffix: " km/h" }
    ]
  },
  {
    id: "v-class",
    name: "Mercedes V-Class 2026",
    subTitle: "Spacious luxury for groups and delegations.",
    description: "The Mercedes V-Class 2026 is configured with a 4.9m wheelbase, luxurious AMG Line styling, and the latest intelligent MBUX infotainment. Complete with VIP captain seats and an optional 8-seat configuration, it transforms group transit into a premium lounge.",
    highlights: [
      "4.9m long-wheelbase executive chassis",
      "AMG Line premium aesthetics",
      "MBUX dynamic dual-screen assistant",
      "Individual reclining captain seats in 8-seat configuration"
    ],
    bestFor: [
      "Families & Private Offices",
      "Corporate delegations & board teams",
      "Assistants & VIP Event transfers",
      "Luggage-heavy airport arrivals"
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
    name: "Zürich",
    description: "Airport arrivals, hotel transfers, private appointments, corporate movement, and city schedules.",
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
    coordinates: { x: 45, y: 64 }
  },
  {
    name: "Basel",
    description: "Business travel, events, airport connections, and cross-city movement.",
    coordinates: { x: 30, y: 40 }
  },
  {
    name: "Geneva",
    description: "Long-distance executive routes, private travel, diplomatic schedules, and hotel arrivals.",
    coordinates: { x: 10, y: 88 }
  },
  {
    name: "Davos",
    description: "Event-week mobility, WEF schedules, private guests, and mountain transfers.",
    coordinates: { x: 75, y: 65 }
  },
  {
    name: "St. Moritz",
    description: "Private long-distance travel, winter stays, hotel arrivals, and luggage-heavy journeys.",
    coordinates: { x: 78, y: 76 }
  },
  {
    name: "Gstaad",
    description: "Private alpine routes, residences, hotels, and seasonal movement.",
    coordinates: { x: 32, y: 74 }
  },
  {
    name: "Milan",
    description: "Cross-border private travel, business trips, fashion, events, and onward European journeys.",
    coordinates: { x: 62, y: 98 }
  },
  {
    name: "Munich",
    description: "Executive routes, airport connections, events, and selected cross-border schedules.",
    coordinates: { x: 88, y: 15 }
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
    title: "Swiss Company Identity",
    value: "Registered Presence",
    description: "Registered Swiss business presence and professional accountability."
  },
  {
    title: "Zürich Operating Base",
    value: "Switzerland-Ready",
    description: "Prepared for Zürich city, Zürich Airport, corporate schedules, hotel arrivals, and onward Swiss routes."
  },
  {
    title: "UID Registered",
    value: "CHE-411.952.415",
    description: "Official enterprise identification number registered in Switzerland."
  },
  {
    title: "Limousine Permit",
    value: "Kanton Zürich",
    description: "Duly licensed under cantonal regulations for professional private passenger transport."
  },
  {
    title: "Certified Tachograph",
    value: "Compliant & Verified",
    description: "Prepared for legal, professional chauffeur operations and driver safety logs."
  },
  {
    title: "Direct Communication",
    value: "24/7 Priority",
    description: "Requests are handled directly through email, dedicated phone, and WhatsApp."
  },
  {
    title: "Clear Rate Confirmation",
    value: "Fixed & Disclosed",
    description: "Rates are confirmed according to route, waiting time, vehicle, luggage, and event demand."
  },
  {
    title: "Privacy-First Handling",
    value: "Absolute Discretion",
    description: "Passenger names, routes, pickup timing, and instructions are treated with strict confidentiality."
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
