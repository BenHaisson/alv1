import { Link } from "react-router-dom";
import type { ReactNode } from "react";

// Shared button styling. Primary = ivory fill on dark; Secondary = hairline
// outline. Buttons are quiet, wide-tracked Inter labels — no gold, no shine.
const base =
  "inline-flex items-center justify-center gap-2 font-sans text-[12px] uppercase tracking-[0.22em] font-medium transition-colors duration-300 px-7 py-[15px] whitespace-nowrap";

const variants = {
  primary: "bg-ivory text-deep-black hover:bg-stone-cream",
  secondary:
    "border border-hairline text-ivory hover:border-stone-cream/60 hover:text-stone-cream",
  ghost:
    "text-stone-cream hover:text-ivory px-0 py-0 tracking-[0.22em]"
} as const;

type Variant = keyof typeof variants;

interface Common {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

export function CTALink({
  to,
  variant = "primary",
  className = "",
  children
}: Common & { to: string }) {
  return (
    <Link to={to} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export function CTAAnchor({
  href,
  variant = "primary",
  className = "",
  children,
  ...rest
}: Common & { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className={`${base} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </a>
  );
}

export function CTAButton({
  variant = "primary",
  className = "",
  children,
  ...rest
}: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
