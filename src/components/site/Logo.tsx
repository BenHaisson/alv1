import { Link } from "react-router-dom";

/**
 * Two-line brand lockup. Line 1 is Cormorant Garamond (the only serif use
 * besides headlines); line 2 is an Inter subline. Sizes shift subtly between
 * mobile and desktop per the brand spec.
 */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label="ALAIR NOIR — home"
      className={`group inline-flex flex-col leading-none ${className}`}
    >
      <span
        className="font-serif uppercase text-ivory"
        style={{ letterSpacing: "0.18em", fontWeight: 500, fontSize: "clamp(17px, 2vw, 21px)" }}
      >
        ALAIR NOIR
      </span>
      <span
        className="mt-[6px] font-sans uppercase text-[10px] md:text-[11px]"
        style={{ letterSpacing: "0.28em", color: "rgba(246, 242, 233, 0.68)" }}
      >
        Zürich · Switzerland
      </span>
    </Link>
  );
}
