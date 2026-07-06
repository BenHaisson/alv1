import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { CTALink } from "./cta";
import { CONTACT, NAV_LINKS } from "../../lib/contact";

/**
 * Compact site header. Deep-black with a subtle blur, 88px desktop / 82px
 * mobile. Logo left, centred/right navigation on desktop, request CTA right.
 * A full-screen sheet menu replaces the nav on mobile.
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile sheet whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll while the sheet is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || menuOpen
          ? "bg-deep-black/85 backdrop-blur-md"
          : "bg-transparent"
      }`}
      style={{ borderBottom: "1px solid rgba(246, 242, 233, 0.08)" }}
    >
      <div
        className="mx-auto flex h-[82px] max-w-[1400px] items-center justify-between md:h-[88px]"
        style={{ paddingLeft: "clamp(24px, 4vw, 56px)", paddingRight: "clamp(24px, 4vw, 56px)" }}
      >
        <Logo />

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-sans text-[13px] tracking-[0.02em] transition-colors duration-200 ${
                location.pathname === link.to
                  ? "text-ivory"
                  : "text-ivory/70 hover:text-ivory"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <CTALink to="/contact" variant="secondary">
            Request Chauffeur
          </CTALink>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="text-ivory lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={24} strokeWidth={1.4} /> : <Menu size={24} strokeWidth={1.4} />}
        </button>
      </div>

      {/* Mobile sheet */}
      {menuOpen && (
        <div className="lg:hidden">
          <nav
            className="flex flex-col gap-1 bg-deep-black/95 px-6 pb-10 pt-4 backdrop-blur-md"
            style={{ minHeight: "calc(100vh - 82px)" }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="border-b border-hairline py-4 font-sans text-[15px] tracking-[0.02em] text-ivory/85"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center justify-center bg-ivory px-7 py-4 font-sans text-[12px] uppercase tracking-[0.22em] font-medium text-deep-black"
            >
              Request Chauffeur
            </Link>
            <a
              href={CONTACT.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center justify-center border border-hairline px-7 py-4 font-sans text-[12px] uppercase tracking-[0.22em] font-medium text-ivory"
            >
              WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
