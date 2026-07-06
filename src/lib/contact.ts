// Single source of truth for ALAIR NOIR contact points, reused across the
// header, footer, request module, and contact page.
export const CONTACT = {
  email: "booking@alairnoir.ch",
  phoneDisplay: "+41 77 287 09 56",
  phoneHref: "tel:+41772870956",
  whatsappNumber: "+41 77 287 09 56",
  whatsappHref: "https://wa.me/41772870956",
  instagramHandle: "@alairnoir",
  instagramHref: "https://instagram.com/alairnoir",
  location: "Zürich · Switzerland"
} as const;

export const NAV_LINKS = [
  { label: "Services", to: "/services" },
  { label: "Fleet", to: "/fleet" },
  { label: "Standards", to: "/standards" },
  { label: "Corporate", to: "/corporate" },
  { label: "Contact", to: "/contact" }
] as const;
