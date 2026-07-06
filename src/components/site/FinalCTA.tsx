import { Container } from "./primitives";
import { CTALink, CTAAnchor } from "./cta";
import { CONTACT } from "../../lib/contact";

export default function FinalCTA({
  title = "Request a private chauffeur in Zürich.",
  body = "Share your journey details. ALAIR NOIR will review the timing, route, vehicle suitability, and confirmation personally."
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="border-t border-hairline bg-forest py-24 md:py-28">
      <Container className="text-center">
        <h2 className="mx-auto max-w-3xl font-serif text-[clamp(30px,4.5vw,50px)] font-medium leading-[1.05] text-ivory">
          {title}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl font-sans text-[15px] leading-relaxed text-stone-cream/85">
          {body}
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
  );
}
