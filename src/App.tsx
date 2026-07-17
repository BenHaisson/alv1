import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MotionProvider, useMediaQuery } from "./components/MotionProvider";
import SmoothScroll from "./components/SmoothScroll";
import { scrollWindowTo } from "./lib/smoothScroll";
import CinematicOpeningPortal from "./components/CinematicOpeningPortal";
import LuxuryHeader from "./components/LuxuryHeader";
import HeroCommandDeck from "./components/HeroCommandDeck";
import NotForEveryone from "./components/NotForEveryone";
import FleetControlSlider from "./components/FleetControlSlider";
import FleetRevealMotion from "./components/motion/FleetRevealMotion";
import DestinationStackMotion from "./components/motion/DestinationStackMotion";
import PrivateIntervalMotion from "./components/motion/PrivateIntervalMotion";
import StackedChapter from "./components/motion/StackedChapter";
import StandardsSection from "./components/StandardsSection";
import BeforeRequestFAQ from "./components/BeforeRequestFAQ";
import PreFooterRequest from "./components/PreFooterRequest";
import LuxuryFooter from "./components/LuxuryFooter";
import BrandLockup from "./components/BrandLockup";
import { EMPTY_BOOKING, vehicleIdFromName, type BookingState } from "./lib/bookingRequest";

const SECTIONS = [
  { key: "hero", id: "hero-section", label: "01 // BOOK", navLabel: "Book" },
  { key: "fleet", id: "fleet-section", label: "02 // THE FLEET", navLabel: "Fleet" },
  { key: "routes", id: "routes-section", label: "03 // THE ROUTES", navLabel: "Routes" },
  { key: "standards", id: "standards-section", label: "04 // THE STANDARD", navLabel: "Standard" }
];

export default function App() {
  const isMobileViewport = useMediaQuery("(max-width: 767px)");
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  // Booking state lifted here so the hero panel and the final request form share
  // one source of truth — whatever the client types up top is already prefilled
  // in the final form, so the order is never lost while scrolling.
  const [booking, setBooking] = useState<BookingState>(EMPTY_BOOKING);
  const updateBooking = (patch: Partial<BookingState>) =>
    setBooking((prev) => ({ ...prev, ...patch }));
  const [isCurtainActive, setIsCurtainActive] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeKey, setActiveKey] = useState("hero");

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

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
        const top = element.getBoundingClientRect().top + window.scrollY - 56;
        scrollWindowTo(top, { immediate: true });
      }
    }, 360);

    setTimeout(() => {
      setIsCurtainActive(false);
    }, 840);
  };

  const handleFleetRequest = (vehicleName?: string) => {
    updateBooking({ vehicle: vehicleIdFromName(vehicleName) });
    scrollToSection("hero");
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
        <AnimatePresence>
          {isIntroComplete && showBackToTop && (!isMobileViewport || activeKey !== "hero") && (
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
                <BrandLockup size="curtain" align="center" />
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

          {/* 01 — Booking Hero: the first screen exists only for the order. It
              slides over the pinned opening portal (stage z-0). */}
          <div id="hero-section" className="relative z-[1]">
            <HeroCommandDeck
              booking={booking}
              onBookingChange={updateBooking}
              isIntroComplete={isIntroComplete}
            />
          </div>

          {/* From here down each chapter is a sheet in the card stack: it pins
              and scales down/dims as the next chapter slides over it
              (StackedChapter). Self-pinning sections (DestinationStackMotion)
              stay in plain flow — an ancestor transform would break their
              internal sticky pins — inside relative z-index wrappers so they
              cover previously pinned sheets. z ascends down the page. */}

          {/* 02 — "NOT FOR EVERYONE. FOR YOU." — short brand identity. */}
          <div className="relative z-[2] -mt-[64svh]">
            <NotForEveryone />
          </div>

          {/* 03 — Fleet: visual choice first (reveal cards + Book CTAs), cabin
              gallery below. FleetRevealMotion drives its own scroll progress but
              has no internal sticky, so it survives the stacked wrapper. */}
          <StackedChapter zIndex={3} id="fleet-section" stacked={false}>
            <FleetRevealMotion onRequestScroll={handleFleetRequest} />
            <FleetControlSlider onRequestScroll={handleFleetRequest} />
          </StackedChapter>

          {/* Private Interval: the approved cabin video moment — cabin visuals
              preserved. */}
          <StackedChapter zIndex={4} stacked={false}>
            <PrivateIntervalMotion />
          </StackedChapter>

          {/* 04 — Routes: "Where we drive" destination stack + route line
              (sticky pin — stays in plain flow). */}
          <div id="routes-section" className="relative z-[5] scroll-mt-20">
            <DestinationStackMotion onArrange={() => scrollToSection("hero")} />
          </div>

          {/* 05 — The ALAIR Standard — premium positioning. */}
          <StackedChapter zIndex={6} id="standards-section" stacked={false}>
            <StandardsSection />
          </StackedChapter>

          <div className="relative z-[8]">
            <PreFooterRequest onRequestRoute={() => scrollToSection("hero")} />
          </div>

          {/* Final covering sheet — not stacked: the footer is shorter than a
              viewport, so a pinned FAQ would rest half-scaled at max scroll. The
              FAQ stays here, out of the main nav, as a quiet accordion. */}
          <div className="relative z-[9]">
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
