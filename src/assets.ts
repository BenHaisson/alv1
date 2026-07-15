import alairNoirHero from "./assets/images/alair_noir_hero.png";
import airportTransfersDesktop from "./assets/images/airport_transfers_desktop.jpg";
import airportTransfersMobile from "./assets/images/airport_transfers_mobile.jpg";
import bookingHeroAlairNoir from "./assets/images/booking_hero_alair_noir.png";
import bookingHeroMobileAlairNoir from "./assets/images/booking_hero_mobile_alair_noir.png";
import bookingHeroZurichGold from "./assets/images/booking_hero_zurich_gold.png";
import bmwI7AlpineCruise from "./assets/images/bmw_i7_alpine_cruise_1782861758267.jpg";
import bmwI7CockpitDay from "./assets/images/bmw_i7_cockpit_day.jpg";
import bmwI7CockpitNight from "./assets/images/bmw_i7_cockpit_night_1782861804665.jpg";
import bmwI7Departure from "./assets/images/bmw_i7_departure_1782861743795.jpg";
import bmwI7DoorAmbience from "./assets/images/bmw_i7_door_ambience.jpg";
import bmwI7DoorsOpenNight from "./assets/images/bmw_i7_doors_open_night.jpg";
import bmwI7NightPlate from "./assets/images/bmw_i7_night_plate.jpg";
import bmwI7RearCabin from "./assets/images/bmw_i7_rear_cabin.jpg";
import bmwI7RearConsole from "./assets/images/bmw_i7_rear_console.jpg";
import bmwI7TheatreNight from "./assets/images/bmw_i7_theatre_night.jpg";
import bmwI7TheatreScreen from "./assets/images/bmw_i7_theatre_screen.jpg";
import bmwI7Exterior from "./assets/images/bmw_i7_exterior_1782843633996.jpg";
import bmwI7RearWorkspace from "./assets/images/bmw_i7_rear_workspace_1782861794303.jpg";
import bmwI7RunwaySunset from "./assets/images/bmw_i7_runway_sunset.jpg";
import bmwI7StMoritzDusk from "./assets/images/bmw_i7_st_moritz_dusk_1782861783352.jpg";
import bmwI7TarmacMeet from "./assets/images/bmw_i7_tarmac_meet_1782861771287.jpg";
import chauffeurDoorHotelNight from "./assets/images/chauffeur_door_hotel_night.webp";
import executiveSchedulesDesktop from "./assets/images/executive_schedules_desktop.jpg";
import executiveSchedulesMobile from "./assets/images/executive_schedules_mobile.jpg";
import luxuryAirportWelcome from "./assets/images/luxury_airport_welcome_1782845067151.jpg";
import luxuryBmwI7 from "./assets/images/luxury_bmw_i7_1782845017654.jpg";
import luxuryVClass from "./assets/images/luxury_v_class_1782845034354.jpg";
import luxuryVipCabin from "./assets/images/luxury_vip_cabin_1782845049105.jpg";
// The supplied long-distance frames arrived with their filenames reversed:
// the landscape frame is the desktop crop and the portrait frame is mobile.
import longDistanceRoutesDesktop from "./assets/images/long_distance_routes_mobile.jpg";
import longDistanceRoutesMobile from "./assets/images/long_distance_routes_desktop.jpg";
import privateArrivalsDesktop from "./assets/images/private_arrivals_desktop.jpg";
import privateArrivalsMobile from "./assets/images/private_arrivals_mobile.jpg";
import sectionNotForEveryoneZurich from "./assets/images/section_02_not_for_everyone_zurich.png";
import vclassAlairNoirArrival from "./assets/images/vclass_alair_noir_arrival.png";
import vclassInterior from "./assets/images/vclass_interior_1782843650116.jpg";
import vclassRearCabinNight from "./assets/images/vclass_rear_cabin_night.png";
import zurichAirportArrival from "./assets/images/zurich_airport_arrival_1782843665364.jpg";
import zurichLuxuryArrival from "./assets/images/zurich_luxury_arrival_1782843679390.jpg";

// ── Section 02 · "NOT FOR EVERYONE. FOR YOU." — identity frames ──────────────
// Bespoke OpenArt (GPT Image 2) frames were generated for these five client
// classes as part of the Claude → OpenArt pipeline. See the prompts, historyIds
// and CDN URLs in docs/alair-noir-visual-journey.md and the drop-in guide in
// src/assets/images/identity/README.md.
//
// The organization egress policy blocks cdn.openart.ai, so the generated binaries
// could not be committed automatically from this environment. Until they are
// dropped in, these keys map to existing on-brand assets so the section ships and
// looks premium. To activate the bespoke frames: download the five files into
// ./assets/images/identity/, import them here, and repoint the five keys below.
const identityCeoFounders = bmwI7Departure;
const identityFamilyOffices = luxuryVClass;
const identityDiplomaticGuests = bmwI7TarmacMeet;
// Chauffeur holding the i7 door at a lantern-lit hotel entrance — the
// "beyond the lobby doors" promise in one frame (client upload, Jul 2026).
const identityPremiumHospitality = chauffeurDoorHotelNight;
// luxuryVipCabin shows a cream interior — fleet interiors are black, so the
// dark private-terminal exterior serves this card instead.
const identityPrivateClients = bmwI7Exterior;

export const imageAssets = {
  alairNoirHero,
  airportTransfersDesktop,
  airportTransfersMobile,
  bookingHeroAlairNoir,
  bookingHeroMobileAlairNoir,
  bookingHeroZurichGold,
  bmwI7AlpineCruise,
  chauffeurDoorHotelNight,
  bmwI7CockpitDay,
  bmwI7CockpitNight,
  bmwI7Departure,
  bmwI7DoorAmbience,
  bmwI7DoorsOpenNight,
  bmwI7Exterior,
  bmwI7NightPlate,
  bmwI7RearCabin,
  bmwI7RearConsole,
  bmwI7RearWorkspace,
  bmwI7RunwaySunset,
  bmwI7TheatreNight,
  bmwI7TheatreScreen,
  bmwI7StMoritzDusk,
  bmwI7TarmacMeet,
  executiveSchedulesDesktop,
  executiveSchedulesMobile,
  luxuryAirportWelcome,
  luxuryBmwI7,
  luxuryVClass,
  luxuryVipCabin,
  longDistanceRoutesDesktop,
  longDistanceRoutesMobile,
  privateArrivalsDesktop,
  privateArrivalsMobile,
  sectionNotForEveryoneZurich,
  vclassAlairNoirArrival,
  vclassInterior,
  vclassRearCabinNight,
  zurichAirportArrival,
  zurichLuxuryArrival,
  identityCeoFounders,
  identityFamilyOffices,
  identityDiplomaticGuests,
  identityPremiumHospitality,
  identityPrivateClients,
};
