import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MotionProvider, useReducedMotionPref } from "./components/MotionProvider";
import LuxuryHeader from "./components/LuxuryHeader";
import EditorialHero from "./components/EditorialHero";
import HeroCommandDeck from "./components/HeroCommandDeck";
import ServiceSelection from "./components/ServiceSelection";
import OperatingStandard from "./components/OperatingStandard";
import ProductFleet from "./components/ProductFleet";
import RouteNetwork from "./components/RouteNetwork";
import PrivateOffice from "./components/PrivateOffice";
import FinalRouteRequest from "./components/FinalRouteRequest";
import LuxuryFooter from "./components/LuxuryFooter";
import { EMPTY_BOOKING, vehicleIdFromName, type BookingState } from "./lib/bookingRequest";

const SECTION_IDS = ["hero", "booking", "services", "fleet", "routes", "office"] as const;

function Homepage() {
  const isReduced = useReducedMotionPref();
  const [booking, setBooking] = useState<BookingState>(EMPTY_BOOKING);
  const [activeSection, setActiveSection] = useState("hero");
  const [showMobileBooking, setShowMobileBooking] = useState(false);

  const updateBooking = (patch: Partial<BookingState>) => {
    setBooking((current) => ({ ...current, ...patch }));
  };

  const scrollToSection = (section: string) => {
    const target = document.getElementById(`${section}-section`);
    target?.scrollIntoView({ behavior: isReduced ? "auto" : "smooth", block: "start" });
  };

  useEffect(() => {
    const onScroll = () => {
      setShowMobileBooking(window.scrollY > window.innerHeight * 0.82);
      const marker = window.scrollY + window.innerHeight * 0.32;
      let next = "hero";
      for (const section of SECTION_IDS) {
        const element = document.getElementById(`${section}-section`);
        if (element && element.offsetTop <= marker) next = section;
      }
      setActiveSection(next);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const selectVehicle = (vehicleName: string) => {
    updateBooking({ vehicle: vehicleIdFromName(vehicleName) });
    scrollToSection("booking");
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-brand-black text-brand-ivory selection:bg-brand-gold selection:text-brand-black">
      <a
        href="#booking-section"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:block focus:bg-brand-ivory focus:px-4 focus:py-3 focus:text-brand-black"
      >
        Skip to booking
      </a>

      <LuxuryHeader onNavClick={scrollToSection} activeSection={activeSection} />

      <main>
        <EditorialHero onRequest={() => scrollToSection("booking")} />
        <HeroCommandDeck booking={booking} onBookingChange={updateBooking} />
        <ServiceSelection onSelect={() => scrollToSection("booking")} />
        <OperatingStandard />
        <ProductFleet onSelect={selectVehicle} />
        <RouteNetwork onRequest={() => scrollToSection("booking")} />
        <PrivateOffice onRequestScroll={() => scrollToSection("booking")} />
        <FinalRouteRequest onRequest={() => scrollToSection("booking")} />
      </main>

      <LuxuryFooter onNavClick={scrollToSection} />

      <AnimatePresence>
        {showMobileBooking && (
          <motion.div
            className="fixed inset-x-4 bottom-[max(16px,env(safe-area-inset-bottom))] z-40 lg:hidden"
            initial={isReduced ? { opacity: 0 } : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={isReduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: isReduced ? 0 : 0.36, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.button
              type="button"
              onClick={() => scrollToSection("booking")}
              whileTap={isReduced ? undefined : { scale: 0.985 }}
              transition={{ type: "spring", stiffness: 420, damping: 38 }}
              className="h-13 w-full border border-brand-gold/60 bg-brand-gold px-6 text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-brand-black shadow-[0_18px_50px_rgba(0,0,0,0.55)]"
            >
              Book a chauffeur
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <MotionProvider>
      <Homepage />
    </MotionProvider>
  );
}
