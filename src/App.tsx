import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import BrandOpening from "./components/BrandOpening";
import LuxuryHeader from "./components/LuxuryHeader";
import HeroArrival from "./components/HeroArrival";
import NotForEveryoneScene from "./components/NotForEveryoneScene";
import EditorialGallery from "./components/EditorialGallery";
import VehicleCollection from "./components/VehicleCollection";
import RouteMap from "./components/RouteMap";
import ProofSection from "./components/ProofSection";
import Testimonials from "./components/Testimonials";
import BeforeRequestFAQ from "./components/BeforeRequestFAQ";
import RequestSection from "./components/RequestSection";
import LuxuryFooter from "./components/LuxuryFooter";

const SECTIONS = [
  { key: "hero", id: "hero-section", label: "01 // THE ARRIVAL", navLabel: "Arrival" },
  { key: "standard", id: "standard-section", label: "02 // THE STANDARD", navLabel: "Standard" },
  { key: "journey", id: "journey-section", label: "03 // THE JOURNEY", navLabel: "Journey" },
  { key: "fleet", id: "fleet-section", label: "04 // THE FLEET", navLabel: "Fleet" },
  { key: "routes", id: "routes-section", label: "05 // THE ROUTES", navLabel: "Routes" },
  { key: "faq", id: "before-request-section", label: "06 // BEFORE REQUEST", navLabel: "FAQ" },
  { key: "request", id: "request-section", label: "07 // THE REQUEST", navLabel: "Request" }
];

function ChapterReveal({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0.82, y: 34, scale: 0.992 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ amount: 0.18, once: false }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}

function SectionBridge() {
  return (
    <div className="relative h-16 overflow-hidden bg-brand-black md:h-24" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-black via-brand-deep-forest/45 to-brand-black" />
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        whileInView={{ scaleY: 1, opacity: 1 }}
        viewport={{ amount: 0.7, once: false }}
        transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-3 left-1/2 top-3 w-px origin-top bg-brand-gold/25"
      />
    </div>
  );
}

function JourneyRail({
  activeKey,
  onSelect
}: {
  activeKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <nav
      aria-label="Alair Noir journey chapters"
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
                  : "w-4 bg-brand-cream/18 group-hover:w-6 group-hover:bg-brand-gold/60"
              }`}
            />
            <span
              className={`overflow-hidden whitespace-nowrap text-[9px] font-mono uppercase tracking-[0.22em] transition-all duration-300 ${
                isActive
                  ? "w-24 text-brand-cream opacity-100"
                  : "w-0 text-brand-stone/55 opacity-0 group-hover:w-24 group-hover:text-brand-stone group-hover:opacity-100"
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
  const [activeLabel, setActiveLabel] = useState("01 // THE ARRIVAL");
  const [activeKey, setActiveKey] = useState("hero");

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

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
          setActiveLabel(SECTIONS[i].label);
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
        window.scrollTo({ top, behavior: "auto" });
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
    <div className="relative min-h-screen bg-brand-black text-brand-ivory font-sans selection:bg-brand-cream/35 selection:text-brand-black">
      {isIntroComplete && (
        <motion.div
          className="fixed left-0 right-0 top-0 z-[100] h-[2px] origin-left bg-brand-gold"
          style={{ scaleX }}
        />
      )}

      {isIntroComplete && <JourneyRail activeKey={activeKey} onSelect={scrollToSection} />}

      <AnimatePresence>
        {isIntroComplete && showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 z-40 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-brand-gold/30 bg-brand-black/90 text-brand-gold shadow-xl transition-all duration-300 hover:border-brand-gold hover:bg-brand-gold-muted hover:shadow-[0_0_15px_rgba(205,162,80,0.2)] focus:outline-none"
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
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center border-r border-brand-gold bg-brand-deep-forest shadow-[15px_0_40px_rgba(205,162,80,0.18)] luxury-noise"
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
                NEXT CHAPTER
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
        <BrandOpening onComplete={setIsIntroComplete} />

        {isIntroComplete && <LuxuryHeader onNavClick={scrollToSection} activeSection={activeKey} />}

        <div id="hero-section">
          <HeroArrival onRequestScroll={() => scrollToSection("request")} />
        </div>

        <SectionBridge />

        <ChapterReveal>
          <NotForEveryoneScene />
        </ChapterReveal>

        <SectionBridge />

        <div id="journey-section" className="relative scroll-mt-20">
          <EditorialGallery />
        </div>

        <SectionBridge />

        <ChapterReveal>
          <VehicleCollection onRequestScroll={handleFleetRequest} />
        </ChapterReveal>

        <SectionBridge />

        <div id="routes-section" className="scroll-mt-20">
          <ChapterReveal>
            <RouteMap onRequestScroll={() => scrollToSection("request")} />
          </ChapterReveal>
        </div>

        <SectionBridge />

        <div id="before-request-section" className="scroll-mt-20">
          <ChapterReveal>
            <ProofSection />
            <Testimonials />
            <BeforeRequestFAQ />
          </ChapterReveal>
        </div>

        <SectionBridge />

        <ChapterReveal>
          <RequestSection prefilledVehicle={selectedVehicle} />
        </ChapterReveal>

        <LuxuryFooter onNavClick={scrollToSection} />
      </motion.div>

      <div className="fixed inset-0 z-30 pointer-events-none luxury-noise opacity-30" />
    </div>
  );
}
