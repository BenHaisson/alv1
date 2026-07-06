import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import { MotionProvider, useMediaQuery } from "./components/MotionProvider";
import SmoothScroll from "./components/SmoothScroll";
import { scrollWindowTo } from "./lib/smoothScroll";
import CinematicOpeningPortal from "./components/CinematicOpeningPortal";
import LuxuryHeader from "./components/LuxuryHeader";
import HeroCommandDeck from "./components/HeroCommandDeck";
import WhatWeAre from "./components/WhatWeAre";
import NotForEveryone from "./components/NotForEveryone";
import ServiceMatrix from "./components/ServiceMatrix";
import FleetControlSlider from "./components/FleetControlSlider";
import FleetRevealMotion from "./components/motion/FleetRevealMotion";
import DestinationStackMotion from "./components/motion/DestinationStackMotion";
import PrivateIntervalMotion from "./components/motion/PrivateIntervalMotion";
import SectionTransition from "./components/motion/SectionTransition";
import StackedChapter from "./components/motion/StackedChapter";
import StandardsSection from "./components/StandardsSection";
import BeforeRequestFAQ from "./components/BeforeRequestFAQ";
import RequestDispatchConsole from "./components/RequestDispatchConsole";
import LuxuryFooter from "./components/LuxuryFooter";
import FloatingWhatsApp from "./components/FloatingWhatsApp";

const SECTIONS = [
  { key: "hero", id: "hero-section", label: "01 // PRIVATE CHAUFFEUR", navLabel: "Chauffeur" },
  { key: "services", id: "services-section", label: "02 // SERVICES", navLabel: "Services" },
  { key: "fleet", id: "fleet-section", label: "03 // THE FLEET", navLabel: "Fleet" },
  { key: "standards", id: "standards-section", label: "04 // THE STANDARD", navLabel: "Standard" },
  { key: "routes", id: "routes-section", label: "05 // THE ROUTES", navLabel: "Routes" },
  { key: "request", id: "request-section", label: "06 // BOOKING", navLabel: "Booking" }
];

function JourneyRail({
  activeKey,
  onSelect
}: {
  activeKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <nav
      aria-label="Alair Noir interface chapters"
      className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 xl:flex"
    >
      {SECTIONS.map((section, index) => {
        const isActive = activeKey === section.key;

        return (
          <button
            key={section.key}
            type="button"
            onClick={() => onSelect(section.key)}
            className="group flex items-center gap-3 text-left focus:outline-none"
            aria-current={isActive ? "step" : undefined}
          >
            <span
              className={`h-px transition-all duration-300 ${
                isActive
                  ? "w-8 bg-brand-gold"
                  : "w-4 bg-brand-cream/25 group-hover:w-6 group-hover:bg-brand-cream/55"
              }`}
            />
            {/* Label reveals on hover/focus only. Kept collapsed at rest so the
                persistent active label never overlaps section body text as the
                page scrolls under this fixed rail. Active state stays legible
                through the wider gold tick above. */}
            <span
              className={`overflow-hidden whitespace-nowrap text-[9px] font-mono uppercase tracking-[0.22em] opacity-0 transition-all duration-300 w-0 group-hover:w-24 group-hover:opacity-100 group-focus-visible:w-24 group-focus-visible:opacity-100 ${
                isActive ? "text-brand-cream" : "text-brand-stone"
              }`}
            >
              {String(index + 1).padStart(2, "0")} {section.navLabel}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export default function App() {
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("bmw-i7");
  const [isCurtainActive, setIsCurtainActive] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeKey, setActiveKey] = useState("hero");
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  // Auto-advance the opening intro: after a short beat the portal eases itself
  // into the hero so no action is required to enter. Any wheel / touch / key
  // input before then cancels it — the visitor always keeps control, and it
  // stays skippable by simply scrolling. Reduced-motion visitors are exempt.
  useEffect(() => {
    if (prefersReducedMotion) return;
    if (window.scrollY > 8) return;

    let done = false;
    const opts: AddEventListenerOptions = { passive: true };

    const finish = (autoAdvance: boolean) => {
      if (done) return;
      done = true;
      window.clearTimeout(timer);
      window.removeEventListener("wheel", onUser, opts);
      window.removeEventListener("touchstart", onUser, opts);
      window.removeEventListener("keydown", onUser);
      if (!autoAdvance) return;

      const hero = document.getElementById("hero-section");
      if (!hero) return;
      const heroTop = hero.getBoundingClientRect().top + window.scrollY;
      const heroScroll = Math.max(0, hero.offsetHeight - window.innerHeight);
      // Land partway into the hero pin, where the headline is fully revealed.
      scrollWindowTo(heroTop + heroScroll * 0.55);
    };

    const onUser = () => finish(false);
    const timer = window.setTimeout(() => finish(true), 2800);

    window.addEventListener("wheel", onUser, opts);
    window.addEventListener("touchstart", onUser, opts);
    window.addEventListener("keydown", onUser);

    return () => finish(false);
  }, [prefersReducedMotion]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;

      setShowBackToTop(window.scrollY > 500);

      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        const top = el ? el.getBoundingClientRect().top + window.scrollY : Number.POSITIVE_INFINITY;

        if (top <= scrollPos) {
          setActiveKey(SECTIONS[i].key);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (keyOrId: string) => {
    const section = SECTIONS.find((item) => item.key === keyOrId || item.id === keyOrId);
    const targetId = section?.id ?? keyOrId;

    setIsCurtainActive(true);

    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        const top = element.getBoundingClientRect().top + window.scrollY - 76;
        scrollWindowTo(top, { immediate: true });
      }
    }, 360);

    setTimeout(() => {
      setIsCurtainActive(false);
    }, 840);
  };

  const handleFleetRequest = (vehicleName?: string) => {
    if (vehicleName?.toLowerCase().includes("v-class") || vehicleName?.toLowerCase().includes("mercedes")) {
      setSelectedVehicle("v-class");
    } else {
      setSelectedVehicle("bmw-i7");
    }
    scrollToSection("request");
  };

  return (
    <MotionProvider>
      <SmoothScroll>
      <div className="relative min-h-screen bg-brand-black text-brand-ivory font-sans selection:bg-brand-cream/35 selection:text-brand-black">
        <a
          href="#hero-section"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[10000] focus:border focus:border-brand-gold focus:bg-brand-black focus:px-4 focus:py-2 focus:text-xs focus:font-mono focus:uppercase focus:tracking-widest focus:text-brand-cream"
        >
          Skip to content
        </a>
        {isIntroComplete && (
          <motion.div
            className="fixed left-0 right-0 top-0 z-[100] h-[2px] origin-left bg-brand-gold"
            style={{ scaleX }}
          />
        )}

        {isIntroComplete && <JourneyRail activeKey={activeKey} onSelect={scrollToSection} />}

        {isIntroComplete && <FloatingWhatsApp collapsed={activeKey !== "hero"} />}

        <AnimatePresence>
          {isIntroComplete && showBackToTop && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={() => scrollWindowTo(0)}
              className="fixed bottom-8 right-8 z-40 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-brand-cream/25 bg-brand-black/90 text-brand-cream shadow-xl transition-all duration-300 hover:border-brand-cream/60 hover:bg-brand-cream/10 focus:outline-none"
              aria-label="Back to Top"
            >
              <span className="text-[10px] font-mono font-medium tracking-widest">UP</span>
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isCurtainActive && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.72, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-0 z-[9999] flex flex-col items-center justify-center border-r border-brand-gold/50 bg-brand-deep-forest shadow-[15px_0_40px_rgba(0,0,0,0.55)] luxury-noise"
            >
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                exit={{ scaleX: 0, opacity: 0 }}
                transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-0 right-0 top-1/2 h-px origin-left bg-brand-gold/30"
              />
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ delay: 0.16, duration: 0.36 }}
                className="text-center"
              >
                <h2 className="text-2xl font-serif font-light uppercase tracking-[0.35em] text-brand-cream">
                  ALAIR NOIR
                </h2>
                <span className="mt-3 block text-[9px] font-mono tracking-[0.25em] text-brand-stone">
                  ARRIVING
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10"
        >
          <CinematicOpeningPortal onComplete={setIsIntroComplete} />

          {isIntroComplete && <LuxuryHeader onNavClick={scrollToSection} activeSection={activeKey} />}

          {/* 02 — Hero: slides over the pinned opening portal (stage z-0),
              first sheet of the stack. Self-pinning, so plain flow + z wrapper. */}
          <div id="hero-section" className="relative z-[1]">
            <HeroCommandDeck onRequestScroll={() => scrollToSection("request")} />
            <SectionTransition />
          </div>

          {/* From here down each chapter is a sheet in the card stack: it pins
              and scales down/dims as the next chapter slides over it
              (StackedChapter). Self-pinning sections (NotForEveryone,
              DestinationStackMotion) stay in plain flow — an ancestor transform
              would break their internal sticky pins — inside relative z-index
              wrappers so they cover previously pinned sheets. z ascends down
              the page. */}

          {/* 03 — What ALAIR NOIR is: company clarity directly after the hero. */}
          <StackedChapter zIndex={2}>
            <WhatWeAre />
          </StackedChapter>

          {/* 04 — "NOT FOR EVERYONE. FOR YOU." — the single manifesto section. */}
          <div className="relative z-[3]">
            <NotForEveryone />
            <SectionTransition />
          </div>

          <StackedChapter zIndex={4} id="services-section">
            <ServiceMatrix />
          </StackedChapter>

          {/* 06 — Fleet: one chapter, two beats. Cinematic reveal first, compact
              selector below it. FleetRevealMotion drives its own scroll progress
              but has no internal sticky, so it survives the stacked wrapper. */}
          <StackedChapter zIndex={5} id="fleet-section">
            <FleetRevealMotion onRequestScroll={handleFleetRequest} />
            <FleetControlSlider onRequestScroll={handleFleetRequest} />
          </StackedChapter>

          {/* 07 — The ALAIR Standard, with the trust strip merged in below. */}
          <StackedChapter zIndex={6} id="standards-section">
            <StandardsSection />
          </StackedChapter>

          {/* Private Interval: the approved cabin video moment — the Composure
              standard made visible. */}
          <StackedChapter zIndex={7}>
            <PrivateIntervalMotion />
          </StackedChapter>

          {/* 08 — Routes: the cinematic "Zürich to wherever" destination stack
              (sticky pin — stays in plain flow). */}
          <div id="routes-section" className="relative z-[8] scroll-mt-20">
            <DestinationStackMotion />
            <SectionTransition />
          </div>

          {/* 09 — How booking works + request, one conversion section. */}
          <StackedChapter zIndex={9} id="request-section">
            <RequestDispatchConsole prefilledVehicle={selectedVehicle} />
          </StackedChapter>

          {/* Final covering sheet — not stacked: the footer is shorter than a
              viewport, so a pinned FAQ would rest half-scaled at max scroll. */}
          <div className="relative z-[10]">
            <BeforeRequestFAQ />
            <LuxuryFooter onNavClick={scrollToSection} />
          </div>
        </motion.div>

        <div className="fixed inset-0 z-30 pointer-events-none luxury-noise opacity-30" />
      </div>
      </SmoothScroll>
    </MotionProvider>
  );
}
