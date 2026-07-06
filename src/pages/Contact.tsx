import { PageIntro, Container, Eyebrow } from "../components/site/primitives";
import RequestModule from "../components/site/RequestModule";
import { CONTACT } from "../lib/contact";

const CHANNELS = [
  { label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { label: "Phone", value: CONTACT.phoneDisplay, href: CONTACT.phoneHref },
  { label: "WhatsApp", value: CONTACT.whatsappNumber, href: CONTACT.whatsappHref, external: true },
  { label: "Instagram", value: CONTACT.instagramHandle, href: CONTACT.instagramHref, external: true }
];

export default function Contact() {
  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title="Request a private chauffeur."
        body="Share your journey details below, or reach us directly. Every request is reviewed personally before confirmation."
      />

      <section className="bg-black py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_420px] lg:items-start">
            {/* Direct channels + response expectation */}
            <div>
              <Eyebrow>Direct</Eyebrow>
              <h2 className="mt-4 font-serif text-[clamp(26px,3.5vw,38px)] font-medium text-ivory">
                Reach ALAIR NOIR
              </h2>

              <dl className="mt-8 divide-y divide-forest-line border-t border-forest-line">
                {CHANNELS.map((c) => (
                  <div key={c.label} className="grid grid-cols-[120px_1fr] items-baseline gap-4 py-5">
                    <dt className="font-sans text-[11px] uppercase tracking-[0.22em] text-muted-stone">
                      {c.label}
                    </dt>
                    <dd>
                      <a
                        href={c.href}
                        target={c.external ? "_blank" : undefined}
                        rel={c.external ? "noopener noreferrer" : undefined}
                        className="font-sans text-[15px] text-ivory transition-colors hover:text-stone-cream"
                      >
                        {c.value}
                      </a>
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-10 border border-hairline bg-deep-black p-7">
                <Eyebrow>Response</Eyebrow>
                <p className="mt-4 font-sans text-[14.5px] leading-relaxed text-muted-stone">
                  Requests are reviewed personally. You will receive a reply confirming
                  availability, the recommended vehicle, and the timing for your journey —
                  typically within a few hours. For time-sensitive arrangements, WhatsApp is the
                  fastest way to reach us.
                </p>
              </div>
            </div>

            {/* Request module */}
            <RequestModule />
          </div>
        </Container>
      </section>
    </>
  );
}
