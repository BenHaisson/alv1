import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "motion/react";
import { imageAssets } from "../assets";

const CARDS = [
  { id: 1, title: "BMW i7 2026", subtitle: "Sleek Electric Sedan", image: imageAssets.luxuryBmwI7, text: "Silent, fully electric performance with Merino leather and Sky Lounge panoramic roof." },
  { id: 2, title: "Mercedes V-Class 2026", subtitle: "VIP Luxury Cabin", image: imageAssets.luxuryVClass, text: "Premium 4.9m wheelbase van with MBUX, AMG Line, and individual luxury seats." },
  { id: 3, title: "Zurich Airport Arrival", subtitle: "Tarmac to Destination", image: imageAssets.luxuryAirportWelcome, text: "Seamless transition from private aviation to the road with utmost discretion." },
  { id: 4, title: "Executive Schedule", subtitle: "As Directed", image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1200", text: "A dedicated mobile office for high-stakes days. We wait while you work." },
  { id: 5, title: "Private Client Movement", subtitle: "Discreet Transit", image: imageAssets.luxuryVipCabin, text: "Absolute privacy for high-net-worth individuals and their families." },
  { id: 6, title: "Long-Distance Route", subtitle: "Inter-City Excellence", image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200", text: "First-class travel between European hubs. St. Moritz, Geneva, Milan, Munich." },
  { id: 7, title: "Event Week Mobility", subtitle: "WEF & Summits", image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=1200", text: "Coordinated logistics for global events. Flawless execution under pressure." },
  { id: 8, title: "Booking Request", subtitle: "Secure Your Journey", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200", text: "Reserve your vehicle with our private office. Experience Alair Noir." },
];

function CarouselCard({
  card,
  index,
  activeIndexSmooth,
  isMobile,
  isReduced,
}: {
  card: typeof CARDS[0];
  index: number;
  activeIndexSmooth: MotionValue<number>;
  isMobile: boolean;
  isReduced: boolean;
  key?: React.Key;
}) {
  const distance = useTransform(activeIndexSmooth, (val) => val - index);

  // Desktop transforms
  const xDesktop = useTransform(distance, [-2, -1, 0, 1, 2], ["90%", "45%", "0%", "-45%", "-90%"]);
  const rotateYDesktop = useTransform(distance, [-2, -1, 0, 1, 2], [-44, -22, 0, 22, 44]);
  const zDesktop = useTransform(distance, [-2, -1, 0, 1, 2], [-200, -120, 80, -120, -200]);
  const scaleDesktop = useTransform(distance, [-2, -1, 0, 1, 2], [0.7, 0.85, 1, 0.85, 0.7]);
  
  // Mobile transforms (stacked cards with slight vertical offset, swipeable feel driven by scroll)
  const yMobile = useTransform(distance, [-2, -1, 0, 1, 2], ["-30%", "-15%", "0%", "15%", "30%"]);
  const rotateXMobile = useTransform(distance, [-2, -1, 0, 1, 2], [-10, -5, 0, 5, 10]);
  const scaleMobile = useTransform(distance, [-2, -1, 0, 1, 2], [0.8, 0.9, 1, 0.9, 0.8]);
  const zMobile = useTransform(distance, [-2, -1, 0, 1, 2], [-100, -50, 40, -50, -100]);

  // Shared attributes
  const opacity = useTransform(distance, [-2, -1, -0.5, 0, 0.5, 1, 2], [0, 0.55, 0.8, 1, 0.8, 0.55, 0]);
  const blurAmount = useTransform(distance, [-2, -1, 0, 1, 2], [3, 1.5, 0, 1.5, 3]);
  const filter = useTransform(blurAmount, (val) => (isReduced ? "blur(0px)" : `blur(${val}px)`));
  const zIndex = useTransform(distance, (val) => 10 - Math.round(Math.abs(val) * 10));

  // Determine final transforms based on media query and reduced motion
  const x = isMobile ? "0%" : xDesktop;
  const y = isMobile ? yMobile : "0%";
  const rotateY = isMobile || isReduced ? 0 : rotateYDesktop;
  const rotateX = isMobile && !isReduced ? rotateXMobile : 0;
  const z = isReduced ? 0 : isMobile ? zMobile : zDesktop;
  const scale = isMobile ? scaleMobile : scaleDesktop;

  return (
    <motion.div
      style={{
        x,
        y,
        rotateY,
        rotateX,
        z,
        scale,
        opacity,
        filter,
        zIndex,
        position: "absolute",
        transformStyle: "preserve-3d",
      }}
      className="w-[85vw] md:w-[400px] lg:w-[460px] aspect-[4/5] md:aspect-[3/4] flex flex-col justify-end p-6 md:p-8 bg-brand-black border border-brand-cream/20 shadow-2xl rounded-sm overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-full object-cover grayscale brightness-75"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/60 to-transparent" />
      </div>
      
      <div className="relative z-10">
        <span className="text-[10px] font-mono tracking-[0.2em] text-brand-cream/65 uppercase block mb-3">
          0{index + 1} // {card.subtitle}
        </span>
        <h3 className="text-2xl md:text-3xl font-serif text-brand-ivory font-light mb-3 tracking-wide">
          {card.title}
        </h3>
        <p className="text-xs md:text-sm font-mono text-brand-cream/80 leading-relaxed max-w-sm">
          {card.text}
        </p>
      </div>
    </motion.div>
  );
}

export default function CinematicCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isReduced, setIsReduced] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReduced(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReduced(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => {
      window.removeEventListener("resize", handleResize);
      mediaQuery.removeEventListener("change", handler);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const activeIndexFloat = useTransform(scrollYProgress, [0, 1], [0, CARDS.length - 1]);
  // Use a very smooth spring for that cinematic, heavy, premium feel
  const activeIndexSmooth = useSpring(activeIndexFloat, {
    stiffness: 80,
    damping: 25,
    mass: 1.2,
  });

  return (
    <section ref={containerRef} className="relative bg-brand-forest border-y border-brand-cream/10" style={{ height: `${CARDS.length * 80}vh` }}>
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden luxury-noise">
        
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-brand-cream/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Section Header */}
        <div className="absolute top-24 md:top-32 left-0 w-full text-center z-50 pointer-events-none px-6">
          <span className="text-[10px] font-mono tracking-[0.3em] text-brand-cream uppercase block mb-4">
            The Alair Noir Experience
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-brand-ivory font-light tracking-widest glow-subtle">
            PRIVATE CHAUFFEUR
          </h2>
        </div>

        {/* 3D Carousel Stage */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{
            perspective: isReduced ? "none" : "1400px",
            transformStyle: isReduced ? "flat" : "preserve-3d",
          }}
        >
          {CARDS.map((card, idx) => (
            <CarouselCard
              key={card.id}
              card={card}
              index={idx}
              activeIndexSmooth={activeIndexSmooth}
              isMobile={isMobile}
              isReduced={isReduced}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 md:bottom-20 left-0 w-full flex flex-col items-center justify-center z-50 pointer-events-none">
          <span className="text-[9px] font-mono tracking-widest text-brand-cream/65 uppercase mb-3">
            Scroll to Navigate
          </span>
          <div className="w-[1px] h-12 bg-brand-cream/20 relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full h-1/3 bg-brand-cream"
              animate={{ y: ["0%", "300%"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
