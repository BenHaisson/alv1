import { Link } from "react-router-dom";
import { CONTACT, NAV_LINKS } from "../../lib/contact";

export default function Footer() {
  return (
    <footer className="border-t border-hairline bg-deep-black">
      <div
        className="mx-auto max-w-[1400px] px-6 py-16 md:py-20"
        style={{ paddingLeft: "clamp(24px, 4vw, 56px)", paddingRight: "clamp(24px, 4vw, 56px)" }}
      >
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <p
              className="font-serif uppercase text-ivory"
              style={{ letterSpacing: "0.18em", fontWeight: 500, fontSize: "22px" }}
            >
              ALAIR NOIR
            </p>
            <p className="mt-3 font-sans text-[13px] text-muted-stone">
              Private Chauffeur Service Zürich
            </p>
          </div>

          {/* Contact */}
          <div>
            <p className="eyebrow mb-5">Contact</p>
            <ul className="space-y-3 font-sans text-[13px] text-ivory/75">
              <li>
                <a href={`mailto:${CONTACT.email}`} className="transition-colors hover:text-ivory">
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a href={CONTACT.phoneHref} className="transition-colors hover:text-ivory">
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-ivory"
                >
                  WhatsApp: {CONTACT.whatsappNumber}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.instagramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-ivory"
                >
                  Instagram: {CONTACT.instagramHandle}
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <p className="eyebrow mb-5">Navigation</p>
            <ul className="space-y-3 font-sans text-[13px] text-ivory/75">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="transition-colors hover:text-ivory">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-muted-stone">
            Zürich · Switzerland
          </p>
          <p className="font-sans text-[11px] text-muted-stone">
            © {new Date().getFullYear()} ALAIR NOIR GmbH
          </p>
        </div>
      </div>
    </footer>
  );
}
