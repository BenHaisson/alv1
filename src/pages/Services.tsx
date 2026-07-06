import { PageIntro, Container, Eyebrow } from "../components/site/primitives";
import FinalCTA from "../components/site/FinalCTA";

const SERVICES = [
  {
    title: "Airport Transfers",
    body: "Arrivals and departures at Zürich Airport handled with flight-aware timing. The chauffeur monitors the flight, adjusts for early or delayed landings, and is in position before the aircraft doors open. Private terminal pickups, meet-and-greet at the arrivals hall, luggage assistance, and a direct, unhurried transfer to the hotel, residence, or onward destination."
  },
  {
    title: "Executive Transfers",
    body: "For CEOs, founders, board members, and senior executives moving between meetings, roadshows, board appointments, investor days, and private dinners. Routes are planned around the day's schedule so timing never drifts. A quiet, prepared cabin between appointments — a place to work, take a call, or arrive composed."
  },
  {
    title: "By the Hour",
    body: "A private chauffeur retained for a defined window, available between obligations across the city and region. Appointments, residences, hotels, event locations, and multi-stop days are held together by a single driver who understands the schedule. Waiting time, parking, and repositioning are managed so the vehicle is always ready when you are."
  },
  {
    title: "Long-Distance Switzerland",
    body: "Private journeys from Zürich to Geneva, Lucerne, St. Moritz, Basel, Davos, and destinations across Switzerland and selected European routes. Alpine passes, mountain resorts, and cross-country transfers are prepared with route planning, comfort stops, and a cabin built for the distance."
  },
  {
    title: "Events & Occasions",
    body: "Chauffeur coordination for private events, galas, conferences, weddings, and hospitality programmes. Multiple pickups, coordinated arrival windows, and discreet standby throughout the evening. Guests, principals, and partners are moved on a single, calm timeline."
  },
  {
    title: "Private Clients",
    body: "Personal chauffeur service for clients who value privacy, comfort, and continuity. Residences, appointments, dinners, shopping, and family movement handled by a driver who learns the preferences and keeps the routine consistent, without friction and without noise."
  }
];

export default function Services() {
  return (
    <>
      <PageIntro
        eyebrow="Services"
        title="Private journeys, arranged with precision."
        body="Choose the service type. The details — timing, route, vehicle, and confirmation — are handled personally after your request."
      />

      <section className="bg-black py-16 md:py-24">
        <Container>
          <div className="grid gap-px overflow-hidden border border-hairline bg-hairline md:grid-cols-2">
            {SERVICES.map((s, i) => (
              <div key={s.title} className="bg-deep-black p-8 md:p-10">
                <Eyebrow>{`0${i + 1}`}</Eyebrow>
                <h2 className="mt-4 font-serif text-[28px] font-medium text-ivory">{s.title}</h2>
                <p className="mt-4 font-sans text-[14.5px] leading-relaxed text-muted-stone">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <FinalCTA />
    </>
  );
}
