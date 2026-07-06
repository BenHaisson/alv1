import { PageIntro, Container, Eyebrow } from "../components/site/primitives";
import { Reveal } from "../components/site/motion";
import FinalCTA from "../components/site/FinalCTA";

const AUDIENCES = [
  {
    title: "CEOs & Executives",
    body: "A reliable chauffeur for senior leaders whose time is the scarcest resource in the room. Meetings, airports, roadshows, and dinners are held together on one calm timeline, so attention stays on the work, not the logistics."
  },
  {
    title: "Founders",
    body: "For founders moving between investors, partners, and appointments across the city and the country. A consistent driver who understands the pace of a founder's day and adjusts without being asked."
  },
  {
    title: "Family Offices",
    body: "Discreet, continuous coordination for principals and their households. Residence pickups, airport arrivals, guest transfers, and schedule-sensitive movement handled with the confidentiality a family office expects."
  },
  {
    title: "Assistants & EAs",
    body: "A single, dependable point of contact for the people who arrange everything. Clear communication, confirmed details, and a chauffeur who makes the assistant look precise — because the arrangement always holds."
  },
  {
    title: "Corporate Travel Planners",
    body: "For teams booking on behalf of executives and visiting guests. Consistent standards across every transfer, predictable coordination, and a partner who understands that the booking reflects on the company."
  },
  {
    title: "Guests & Delegations",
    body: "Visiting partners, board members, and VIP guests received with the arrival experience that represents the host well. Coordinated pickups, meet-and-greet, and a composed transfer from the first moment."
  }
];

export default function Corporate() {
  return (
    <>
      <PageIntro
        eyebrow="Corporate"
        title="Movement for people whose schedules cannot drift."
        body="ALAIR NOIR works with executives, founders, family offices, assistants, and corporate travel planners who need a chauffeur partner that is consistent, discreet, and dependable."
      />

      <section className="bg-black py-16 md:py-24">
        <Container>
          <Reveal className="grid gap-px overflow-hidden border border-hairline bg-hairline md:grid-cols-2 lg:grid-cols-3">
            {AUDIENCES.map((a) => (
              <div key={a.title} className="bg-deep-black p-8">
                <h2 className="font-serif text-[24px] font-medium text-ivory">{a.title}</h2>
                <p className="mt-4 font-sans text-[13.5px] leading-relaxed text-muted-stone">
                  {a.body}
                </p>
              </div>
            ))}
          </Reveal>

          <Reveal className="mt-14 border border-hairline bg-forest p-8 md:p-12">
            <Eyebrow>Account arrangements</Eyebrow>
            <p className="mt-5 max-w-3xl font-sans text-[15px] leading-relaxed text-stone-cream/85">
              For companies and family offices with recurring requirements, ALAIR NOIR can
              arrange a consistent point of contact, preferred vehicles, and standing
              instructions so every transfer is handled the same way. Reach out to discuss an
              ongoing arrangement.
            </p>
          </Reveal>
        </Container>
      </section>

      <FinalCTA
        title="Arrange corporate chauffeur service in Zürich."
        body="Tell us how your team travels. ALAIR NOIR will propose an arrangement that fits your schedule, standards, and discretion requirements."
      />
    </>
  );
}
