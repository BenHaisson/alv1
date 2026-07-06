import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { Container, Eyebrow, gutter } from "../components/site/primitives";
import RequestModule from "../components/site/RequestModule";
import { CTALink, CTAAnchor } from "../components/site/cta";
import { Reveal, Magnetic, EASE } from "../components/site/motion";
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

// Staggered hero entrance — quiet fade-up on mount, above the fold.
const heroItem = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } }
};

export default function Home() {
  return (
    <>
      {/* ── SECTION 1 — Hero + request module ─────────────────────────── */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-[82px] md:pt-[88px]">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: EASE }}
        >
          <img
            src={imageAssets.bmwI7Exterior}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-deep-black via-deep-black/90 to-deep-black/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-deep-black/40" />
        </motion.div>

        <div className="relative w-full py-16 md:py-20" style={gutter}>
          <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-[1fr_380px]">
            {/* Left: headline + text */}
            <motion.div
              className="max-w-[540px]"
              initial="hidden"
              animate="show"
              transition={{ staggerChildren: 0.12, delayChildren: 0.15 }}
            >
              <motion.div variants={heroItem}>
                <Eyebrow>Private Chauffeur Service Zürich</Eyebrow>
              </motion.div>
              <motion.h1
                variants={heroItem}
                className="mt-6 font-serif text-[clamp(44px,7.5vw,80px)] font-medium leading-[0.98] text-ivory"
              >
                Not for everyone.
                <br />
                For you.
              </motion.h1>
              <motion.p
                variants={heroItem}
                className="mt-6 max-w-[500px] font-sans text-[15px] leading-relaxed text-stone-cream/85 md:text-[16px]"
              >
                Private chauffeur service for airport arrivals, executive transfers, family
                offices, private clients, and long-distance journeys across Switzerland.
              </motion.p>
              <motion.div variants={heroItem} className="mt-8 flex flex-wrap items-center gap-4">
                <Magnetic>
                  <CTALink to="/contact" variant="primary">
                    Request Chauffeur
                  </CTALink>
                </Magnetic>
                <CTAAnchor href={CONTACT.whatsappHref} variant="secondary">
                  WhatsApp
                </CTAAnchor>
              </motion.div>
            </motion.div>

            {/* Right: request module */}
            <motion.div
              className="justify-self-start lg:justify-self-end"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}
            >
              <RequestModule />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2 — Services preview ──────────────────────────────── */}
      <section className="border-t border-hairline bg-black py-20 md:py-28">
        <Container>
          <Reveal>
            <Eyebrow>Services</Eyebrow>
            <h2 className="mt-5 max-w-2xl font-serif text-[clamp(30px,4.5vw,48px)] font-medium leading-[1.05] text-ivory">
              Private journeys, arranged with precision.
            </h2>
            <p className="mt-5 max-w-xl font-sans text-[15px] leading-relaxed text-muted-stone">
              Choose the service type. The details are handled after your request.
            </p>
          </Reveal>

          <Reveal className="mt-12 grid gap-px overflow-hidden border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
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
          </Reveal>
        </Container>
      </section>

      {/* ── SECTION 3 — Why ALAIR NOIR ────────────────────────────────── */}
      <section className="border-t border-hairline bg-deep-black py-20 md:py-28">
        <Container>
          <Reveal>
            <Eyebrow>The Standard</Eyebrow>
            <h2 className="mt-5 max-w-2xl font-serif text-[clamp(30px,4.5vw,48px)] font-medium leading-[1.05] text-ivory">
              Quiet service. Clear execution.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-12">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.1}>
                <div className="border-t border-forest-line pt-6">
                  <span className="font-sans text-[12px] tracking-[0.22em] text-muted-stone">
                    0{i + 1}
                  </span>
                  <h3 className="mt-4 font-serif text-[26px] font-medium text-ivory">{v.title}</h3>
                  <p className="mt-4 font-sans text-[14px] leading-relaxed text-muted-stone">
                    {v.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12">
            <CTALink to="/standards" variant="secondary">
              View the Standard
            </CTALink>
          </Reveal>
        </Container>
      </section>

      {/* ── SECTION 4 — Fleet preview ─────────────────────────────────── */}
      <section className="border-t border-hairline bg-black py-20 md:py-28">
        <Container>
          <Reveal>
            <Eyebrow>Fleet</Eyebrow>
            <h2 className="mt-5 max-w-2xl font-serif text-[clamp(30px,4.5vw,48px)] font-medium leading-[1.05] text-ivory">
              Two vehicles. One standard.
            </h2>
            <p className="mt-5 max-w-2xl font-sans text-[15px] leading-relaxed text-muted-stone">
              A focused private fleet prepared for executive comfort, family travel, airport
              arrivals, and long-distance movement across Switzerland.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {FLEET.map((f, i) => (
              <Reveal key={f.name} delay={i * 0.1}>
                <div className="group overflow-hidden border border-hairline bg-deep-black">
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
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12">
            <CTALink to="/fleet" variant="secondary">
              View Fleet
            </CTALink>
          </Reveal>
        </Container>
      </section>

      {/* ── SECTION 5 — Final CTA ─────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-hairline bg-forest py-24 md:py-32">
        <Container className="text-center">
          <Reveal>
            <h2 className="mx-auto max-w-3xl font-serif text-[clamp(32px,5vw,54px)] font-medium leading-[1.05] text-ivory">
              Request a private chauffeur in Zürich.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl font-sans text-[15px] leading-relaxed text-stone-cream/85 md:text-[16px]">
              Share your journey details. ALAIR NOIR will review the timing, route, vehicle
              suitability, and confirmation personally.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Magnetic>
                <CTALink to="/contact" variant="primary">
                  Request Chauffeur
                </CTALink>
              </Magnetic>
              <CTAAnchor href={CONTACT.whatsappHref} variant="secondary">
                WhatsApp
              </CTAAnchor>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
