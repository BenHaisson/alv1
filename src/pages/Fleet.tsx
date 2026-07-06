import { PageIntro, Container, Eyebrow } from "../components/site/primitives";
import { Reveal } from "../components/site/motion";
import FinalCTA from "../components/site/FinalCTA";
import { imageAssets } from "../assets";

const VEHICLES = [
  {
    name: "BMW i7 xDrive",
    tagline: "Silent executive travel",
    image: imageAssets.luxuryBmwI7,
    interior: imageAssets.bmwI7RearCabin,
    intro:
      "A fully electric flagship built for quiet, composed movement. The i7 carries a refined presence without display — ideal for executive transfers, airport arrivals, and the calm interval between obligations.",
    features: [
      ["Cabin", "Silent electric drive, executive rear comfort, and a settled, low-noise environment for calls or reflection."],
      ["Comfort", "Reclining rear seats, individual climate, ambient light, and a smooth ride across city and motorway."],
      ["Luggage", "Suited to two to three passengers with carry-on and standard luggage for airport transfers."],
      ["Business use", "A prepared workspace between meetings — connectivity, privacy, and a stable surface to arrive composed."],
      ["Private travel", "Refined and understated for private appointments, dinners, and discreet city movement."]
    ]
  },
  {
    name: "Mercedes-Benz V-Class",
    tagline: "Space, flexibility, group comfort",
    image: imageAssets.vclassAlairNoirArrival,
    interior: imageAssets.vclassRearCabinNight,
    intro:
      "A spacious private cabin for families, groups, and journeys with luggage. The V-Class offers flexible seating and generous room without compromising discretion or comfort.",
    features: [
      ["Cabin", "Generous private cabin with facing or forward seating, headroom, and an open, comfortable interior."],
      ["Comfort", "Individual seats, climate control, and a smooth ride tuned for longer distances and family travel."],
      ["Luggage", "Substantial luggage capacity for airport runs, ski trips, and multi-passenger journeys."],
      ["Business use", "Room to travel as a team, hold a conversation, or move a delegation on a single timeline."],
      ["Private travel", "Family comfort and group movement handled with the same discretion as executive transfers."]
    ]
  }
];

export default function Fleet() {
  return (
    <>
      <PageIntro
        eyebrow="Fleet"
        title="Two vehicles. One standard."
        body="A focused private fleet prepared for executive comfort, family travel, airport arrivals, and long-distance movement across Switzerland."
      />

      {VEHICLES.map((v, idx) => (
        <section
          key={v.name}
          className={`border-b border-hairline py-16 md:py-24 ${idx % 2 === 0 ? "bg-black" : "bg-deep-black"}`}
        >
          <Container>
            <Reveal className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div className={idx % 2 === 1 ? "lg:order-2" : ""}>
                <div className="overflow-hidden border border-hairline">
                  <img src={v.image} alt={v.name} className="aspect-[16/11] w-full object-cover" />
                </div>
              </div>
              <div className={idx % 2 === 1 ? "lg:order-1" : ""}>
                <Eyebrow>{v.tagline}</Eyebrow>
                <h2 className="mt-4 font-serif text-[clamp(30px,4vw,44px)] font-medium text-ivory">
                  {v.name}
                </h2>
                <p className="mt-5 font-sans text-[15px] leading-relaxed text-muted-stone">
                  {v.intro}
                </p>

                <dl className="mt-8 divide-y divide-forest-line border-t border-forest-line">
                  {v.features.map(([label, text]) => (
                    <div key={label} className="grid grid-cols-[110px_1fr] gap-4 py-4">
                      <dt className="font-sans text-[11px] uppercase tracking-[0.22em] text-stone-cream">
                        {label}
                      </dt>
                      <dd className="font-sans text-[13.5px] leading-relaxed text-muted-stone">
                        {text}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </Container>
        </section>
      ))}

      <FinalCTA />
    </>
  );
}
