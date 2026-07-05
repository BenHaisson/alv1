import alairNoirHero from "./assets/images/alair_noir_hero.png";
import bmwI7AlpineCruise from "./assets/images/bmw_i7_alpine_cruise_1782861758267.jpg";
import bmwI7CockpitDay from "./assets/images/bmw_i7_cockpit_day.jpg";
import bmwI7CockpitNight from "./assets/images/bmw_i7_cockpit_night_1782861804665.jpg";
import bmwI7Departure from "./assets/images/bmw_i7_departure_1782861743795.jpg";
import bmwI7DoorAmbience from "./assets/images/bmw_i7_door_ambience.jpg";
import bmwI7RearCabin from "./assets/images/bmw_i7_rear_cabin.jpg";
import bmwI7RearConsole from "./assets/images/bmw_i7_rear_console.jpg";
import bmwI7TheatreScreen from "./assets/images/bmw_i7_theatre_screen.jpg";
import bmwI7Exterior from "./assets/images/bmw_i7_exterior_1782843633996.jpg";
import bmwI7RearWorkspace from "./assets/images/bmw_i7_rear_workspace_1782861794303.jpg";
import bmwI7RunwaySunset from "./assets/images/bmw_i7_runway_sunset.jpg";
import bmwI7StMoritzDusk from "./assets/images/bmw_i7_st_moritz_dusk_1782861783352.jpg";
import bmwI7TarmacMeet from "./assets/images/bmw_i7_tarmac_meet_1782861771287.jpg";
import chauffeurDoorHotelNight from "./assets/images/chauffeur_door_hotel_night.webp";
import luxuryAirportWelcome from "./assets/images/luxury_airport_welcome_1782845067151.jpg";
import luxuryBmwI7 from "./assets/images/luxury_bmw_i7_1782845017654.jpg";
import luxuryVClass from "./assets/images/luxury_v_class_1782845034354.jpg";
import luxuryVipCabin from "./assets/images/luxury_vip_cabin_1782845049105.jpg";
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
  bmwI7AlpineCruise,
  chauffeurDoorHotelNight,
  bmwI7CockpitDay,
  bmwI7CockpitNight,
  bmwI7Departure,
  bmwI7DoorAmbience,
  bmwI7Exterior,
  bmwI7RearCabin,
  bmwI7RearConsole,
  bmwI7RearWorkspace,
  bmwI7RunwaySunset,
  bmwI7TheatreScreen,
  bmwI7StMoritzDusk,
  bmwI7TarmacMeet,
  luxuryAirportWelcome,
  luxuryBmwI7,
  luxuryVClass,
  luxuryVipCabin,
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
