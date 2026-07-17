export const BRAND_NAME = "ALAIR NOIR";
export const BRAND_SLOGAN = "Not for everyone. For you.";

type BrandLockupSize = "nav" | "compact" | "opening" | "footer" | "curtain";
type BrandLockupAlign = "left" | "center" | "right";

interface BrandLockupProps {
  size?: BrandLockupSize;
  align?: BrandLockupAlign;
  tone?: "light" | "dark";
  className?: string;
}

const sizeClasses: Record<BrandLockupSize, { name: string; slogan: string; gap: string }> = {
  nav: {
    name: "text-lg tracking-[0.18em] md:text-xl",
    slogan: "text-[8px] tracking-[0.04em] md:text-[9px]",
    gap: "gap-1"
  },
  compact: {
    name: "text-[11px] tracking-[0.24em] md:text-xs",
    slogan: "text-[8px] tracking-[0.04em] md:text-[9px]",
    gap: "gap-1"
  },
  opening: {
    name: "text-4xl tracking-[0.3em] md:text-7xl",
    slogan: "text-2xl tracking-[0.02em] md:text-4xl",
    gap: "gap-6"
  },
  footer: {
    name: "text-3xl tracking-[0.15em] md:text-4xl",
    slogan: "text-lg tracking-[0.02em]",
    gap: "gap-3"
  },
  curtain: {
    name: "text-2xl tracking-[0.35em]",
    slogan: "text-sm tracking-[0.02em]",
    gap: "gap-3"
  }
};

const alignClass: Record<BrandLockupAlign, string> = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right"
};

export default function BrandLockup({
  size = "nav",
  align = "left",
  tone = "dark",
  className = ""
}: BrandLockupProps) {
  const classes = sizeClasses[size];
  const textClass = tone === "light" ? "text-brand-black" : "text-brand-cream";

  return (
    <div className={`flex flex-col ${classes.gap} ${alignClass[align]} ${className}`}>
      <span className={`block select-none font-serif font-light uppercase leading-none ${textClass} ${classes.name}`}>
        {BRAND_NAME}
      </span>
      <span className={`block font-serif font-light italic leading-none ${textClass} ${classes.slogan}`}>
        {BRAND_SLOGAN}
      </span>
    </div>
  );
}
