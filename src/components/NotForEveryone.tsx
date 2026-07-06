import StackedClientCards from "./motion/StackedClientCards";
import { ACCESS_CLASSES } from "../data";

/**
 * Section 02 — "NOT FOR EVERYONE. FOR YOU."
 * Thin wrapper: content lives in ACCESS_CLASSES (src/data.ts), interaction in
 * the reusable StackedClientCards engine (src/components/motion/).
 */
export default function NotForEveryone() {
  return (
    <StackedClientCards
      cards={ACCESS_CLASSES}
      sectionId="selection-section"
      ariaLabel="Who ALAIR NOIR is for"
      heightPerCardVh={44}
      aside={(active, goTo) => (
        <div className="max-w-xl">
          <span className="mb-5 block font-mono text-[11px] uppercase tracking-[0.32em] text-brand-gold">
            The Selection
          </span>
          <h2 className="font-serif text-4xl font-light leading-[1.05] tracking-tight text-brand-ivory md:text-5xl lg:text-6xl">
            Not for everyone.
            <br />
            <span className="italic text-brand-stone">For you.</span>
          </h2>
          <p className="mt-6 max-w-md text-base font-light leading-relaxed text-brand-body">
            ALAIR NOIR is shaped around a small set of clients whose movement is
            measured by timing, discretion, and how the arrival feels — not by
            distance.
          </p>

          <ol className="mt-10 hidden max-w-sm flex-col gap-1 lg:flex">
            {ACCESS_CLASSES.map((card, index) => {
              const isActive = index === active;
              return (
                <li key={card.id}>
                  <button
                    type="button"
                    onClick={() => goTo(index)}
                    className="group flex w-full items-center gap-4 py-2 text-left focus:outline-none"
                    aria-current={isActive ? "true" : undefined}
                  >
                    <span
                      className={`font-mono text-[10px] tracking-[0.25em] transition-colors duration-300 ${
                        isActive ? "text-brand-gold" : "text-brand-muted-stone"
                      }`}
                    >
                      {card.number}
                    </span>
                    <span
                      className={`h-px transition-all duration-500 ${
                        isActive
                          ? "w-10 bg-brand-gold"
                          : "w-5 bg-brand-cream/20 group-hover:w-8 group-hover:bg-brand-gold/50"
                      }`}
                    />
                    <span
                      className={`font-serif text-lg font-light transition-colors duration-300 ${
                        isActive
                          ? "text-brand-ivory"
                          : "text-brand-stone group-hover:text-brand-cream"
                      }`}
                    >
                      {card.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    />
  );
}
