import type { ReactNode } from "react";
import { Reveal } from "./motion";

// Consistent horizontal gutter used across every section and page.
export const gutter = { paddingLeft: "clamp(24px, 4vw, 56px)", paddingRight: "clamp(24px, 4vw, 56px)" };

export function Container({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-[1200px] ${className}`} style={gutter}>
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

/** Top-of-page header for the interior menu pages. */
export function PageIntro({
  eyebrow,
  title,
  body
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <section className="border-b border-hairline pb-14 pt-36 md:pb-20 md:pt-44">
      <Container>
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-5 max-w-3xl font-serif text-[clamp(38px,6vw,64px)] font-medium leading-[1.02] text-ivory">
            {title}
          </h1>
          {body && (
            <p className="mt-6 max-w-2xl font-sans text-[15px] leading-relaxed text-muted-stone md:text-[16px]">
              {body}
            </p>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
