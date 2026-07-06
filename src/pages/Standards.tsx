import { PageIntro, Container } from "../components/site/primitives";
import FinalCTA from "../components/site/FinalCTA";

const PILLARS = [
  {
    title: "Timing",
    body: "Pickup rhythm, route planning, waiting time, and handover are considered before the journey begins. Flights are monitored, traffic is anticipated, and the schedule is treated as something to protect rather than simply follow. The vehicle is in position early, and the client is never left waiting."
  },
  {
    title: "Privacy",
    body: "Passenger details, routes, schedules, and instructions are handled with discretion by default. Conversations remain in the cabin. Nothing is discussed, shared, or displayed. Discretion is not a request you have to make — it is the standard the service is built on."
  },
  {
    title: "Presence",
    body: "The vehicle, cabin, communication, and arrival posture are prepared to represent the client properly. A clean car, a composed chauffeur, and a measured arrival that reflects well on the person being carried. Presence is quiet, deliberate, and never performative."
  },
  {
    title: "Composure",
    body: "Delays, changes, and last-minute adjustments are absorbed without friction. The chauffeur stays calm, communicates clearly, and solves problems before they reach the passenger. The client experiences a steady journey regardless of what is happening around it."
  },
  {
    title: "Precision",
    body: "Every detail — the route, the timing, the vehicle choice, the handover — is deliberate. Nothing is left to chance and nothing is improvised at the client's expense. Precision is what turns a car ride into a service worth returning to."
  }
];

export default function Standards() {
  return (
    <>
      <PageIntro
        eyebrow="The Standard"
        title="Quiet service. Clear execution."
        body="The ALAIR NOIR standard is not a slogan. It is a set of principles applied to every journey, before, during, and after the drive."
      />

      <section className="bg-black py-16 md:py-24">
        <Container>
          <div className="space-y-px overflow-hidden border border-hairline bg-hairline">
            {PILLARS.map((p, i) => (
              <div key={p.title} className="grid gap-6 bg-deep-black p-8 md:grid-cols-[1fr_2fr] md:p-10">
                <div className="flex items-baseline gap-4">
                  <span className="font-sans text-[12px] tracking-[0.22em] text-muted-stone">
                    0{i + 1}
                  </span>
                  <h2 className="font-serif text-[30px] font-medium text-ivory">{p.title}</h2>
                </div>
                <p className="font-sans text-[14.5px] leading-relaxed text-muted-stone">{p.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <FinalCTA />
    </>
  );
}
