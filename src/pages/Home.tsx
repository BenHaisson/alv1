import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Container, Eyebrow, gutter } from "../components/site/primitives";
import RequestModule from "../components/site/RequestModule";
import { CTALink, CTAAnchor } from "../components/site/cta";
import { CONTACT } from "../lib/contact";
import { imageAssets } from "../assets";

const SERVICES = [
  {
    title: "Airport Transfers",
    body: "Flight-aware arrivals, private terminal pickups, hotel transfers, and discreet handovers across Zürich."
  },
  {
    title: "Executive Transfers",
    body: "For meetings, roadshows, board appointments, private dinners, and schedules where timing cannot drift."
  },
  {
    title: "By the Hour",
    body: "A private chauffeur available between obligations, appointments, residences, hotels, and event locations."
  },
  {
    title: "Long-Distance Switzerland",
    body: "Private journeys from Zürich to Geneva, Lucerne, St. Moritz, Basel, Davos, and beyond."
  }
];

const VALUES = [
  {
    title: "Timing",
    body: "Pickup rhythm, route planning, waiting time, and handover are considered before the journey begins."
  },
  {
    title: "Privacy",
    body: "Passenger details, routes, schedules, and instructions are handled with discretion by default."
  },
  {
    title: "Presence",
    body: "The vehicle, cabin, communication, and arrival posture are prepared to represent the client properly."
  }
];

const FLEET = [
  {
    name: "BMW i7 xDrive",
    body: "Electric silence, executive rear cabin comfort, refined presence, and a calm environment between obligations.",
    image: imageAssets.luxuryBmwI7
  },
  {
    name: "Mercedes-Benz V-Class",
    body: "Spacious private cabin, business travel flexibility, family comfort, luggage capacity, and discreet group movement.",
    image: imageAssets.vclassAlairNoirArrival
  }
];

export default function Home() {
  return (
    <>
      {/* ── SECTION 1 — Hero + request module ─────────────────────────── */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-[82px] md:pt-[88px]">
        <div className="absolute inset-0">
          <img
            src={imageAssets.bmwI7Exterior}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-deep-black via-deep-black/90 to-deep-black/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-deep-black/40" />
        </div>

        <div className="relative w-full py-16 md:py-20" style={gutter}>
          <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-[1fr_420px]">
            {/* Left: headline + text */}
            <div className="max-w-[560px]">
              <Eyebrow>Private Chauffeur Service Zürich</Eyebrow>
              <h1 className="mt-6 font-serif text-[clamp(46px,8vw,86px)] font-medium leading-[0.98] text-ivory">
                Not for everyone.
                <br />
                For you.
              </h1>
              <p className="mt-7 max-w-[520px] font-sans text-[15px] leading-relaxed text-stone-cream/85 md:text-[16px]">
                Private chauffeur service for airport arrivals, executive transfers, family
                offices, private clients, and long-distance journeys across Switzerland.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <CTALink to="/contact" variant="primary">
                  Request Chauffeur
                </CTALink>
                <CTAAnchor href={CONTACT.whatsappHref} variant="secondary">
                  WhatsApp
                </CTAAnchor>
              </div>
            </div>

            {/* Right: request module */}
            <RequestModule />
          </div>
        </div>
      </section>

      {/* ── SECTION 2 — Services preview ──────────────────────────────── */}
      <section className="border-t border-hairline bg-black py-20 md:py-28">
        <Container>
          <Eyebrow>Services</Eyebrow>
          <h2 className="mt-5 max-w-2xl font-serif text-[clamp(30px,4.5vw,48px)] font-medium leading-[1.05] text-ivory">
            Private journeys, arranged with precision.
          </h2>
          <p className="mt-5 max-w-xl font-sans text-[15px] leading-relaxed text-muted-stone">
            Choose the service type. The details are handled after your request.
          </p>

          <div className="mt-12 grid gap-px overflow-hidden border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <Link
                key={s.title}
                to="/services"
                className="group flex flex-col justify-between bg-deep-black p-7 transition-colors duration-300 hover:bg-forest"
              >
                <div>
                  <h3 className="font-serif text-[24px] font-medium text-ivory">{s.title}</h3>
                  <p className="mt-4 font-sans text-[13.5px] leading-relaxed text-muted-stone">
                    {s.body}
                  </p>
                </div>
                <span className="mt-8 inline-flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-[0.22em] text-stone-cream">
                  Learn more
                  <ArrowUpRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ── SECTION 3 — Why ALAIR NOIR ────────────────────────────────── */}
      <section className="border-t border-hairline bg-deep-black py-20 md:py-28">
        <Container>
          <Eyebrow>The Standard</Eyebrow>
          <h2 className="mt-5 max-w-2xl font-serif text-[clamp(30px,4.5vw,48px)] font-medium leading-[1.05] text-ivory">
            Quiet service. Clear execution.
          </h2>

          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-12">
            {VALUES.map((v, i) => (
              <div key={v.title} className="border-t border-forest-line pt-6">
                <span className="font-sans text-[12px] tracking-[0.22em] text-muted-stone">
                  0{i + 1}
                </span>
                <h3 className="mt-4 font-serif text-[26px] font-medium text-ivory">{v.title}</h3>
                <p className="mt-4 font-sans text-[14px] leading-relaxed text-muted-stone">
                  {v.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <CTALink to="/standards" variant="secondary">
              View the Standard
            </CTALink>
          </div>
        </Container>
      </section>

      {/* ── SECTION 4 — Fleet preview ─────────────────────────────────── */}
      <section className="border-t border-hairline bg-black py-20 md:py-28">
        <Container>
          <Eyebrow>Fleet</Eyebrow>
          <h2 className="mt-5 max-w-2xl font-serif text-[clamp(30px,4.5vw,48px)] font-medium leading-[1.05] text-ivory">
            Two vehicles. One standard.
          </h2>
          <p className="mt-5 max-w-2xl font-sans text-[15px] leading-relaxed text-muted-stone">
            A focused private fleet prepared for executive comfort, family travel, airport
            arrivals, and long-distance movement across Switzerland.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {FLEET.map((f) => (
              <div key={f.name} className="group overflow-hidden border border-hairline bg-deep-black">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={f.image}
                    alt={f.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-7">
                  <h3 className="font-serif text-[26px] font-medium text-ivory">{f.name}</h3>
                  <p className="mt-4 font-sans text-[14px] leading-relaxed text-muted-stone">
                    {f.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <CTALink to="/fleet" variant="secondary">
              View Fleet
            </CTALink>
          </div>
        </Container>
      </section>

      {/* ── SECTION 5 — Final CTA ─────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-hairline bg-forest py-24 md:py-32">
        <Container className="text-center">
          <h2 className="mx-auto max-w-3xl font-serif text-[clamp(32px,5vw,54px)] font-medium leading-[1.05] text-ivory">
            Request a private chauffeur in Zürich.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl font-sans text-[15px] leading-relaxed text-stone-cream/85 md:text-[16px]">
            Share your journey details. ALAIR NOIR will review the timing, route, vehicle
            suitability, and confirmation personally.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <CTALink to="/contact" variant="primary">
              Request Chauffeur
            </CTALink>
            <CTAAnchor href={CONTACT.whatsappHref} variant="secondary">
              WhatsApp
            </CTAAnchor>
          </div>
        </Container>
      </section>
    </>
  );
}
