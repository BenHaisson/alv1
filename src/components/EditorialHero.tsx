import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { imageAssets } from "../assets";
import { INERTIA_SPRING, MOTION_EASE } from "../lib/motion";
import { useReducedMotionPref } from "./MotionProvider";

interface EditorialHeroProps {
  onRequest: () => void;
}

const copyVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

export default function EditorialHero({ onRequest }: EditorialHeroProps) {
  const isReduced = useReducedMotionPref();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 76,
    damping: 26,
    mass: 1.12,
    restDelta: 0.001
  });
  const imageY = useTransform(smoothProgress, [0, 1], ["0%", "8%"]);
  const copyY = useTransform(smoothProgress, [0, 1], ["0%", "-16%"]);
  const colorWashOpacity = useTransform(smoothProgress, [0, 0.72, 1], [0, 0.26, 0.84]);

  return (
    <section
      ref={sectionRef}
      id="hero-section"
      className="relative min-h-[100svh] overflow-hidden bg-[#efe4d8] pt-[72px] text-brand-black"
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 z-10 bg-[linear-gradient(to_bottom,rgba(239,228,216,0)_0%,rgba(10,10,10,0.18)_72%,#0a0a0a_100%)]"
        style={{ opacity: colorWashOpacity }}
      />

      <motion.picture
        className="absolute inset-x-0 bottom-0 h-[58svh] overflow-hidden md:inset-0 md:h-full"
        initial={isReduced ? false : { clipPath: "inset(0 0 100% 0)", opacity: 0 }}
        animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
        transition={{ duration: isReduced ? 0 : 1.08, ease: MOTION_EASE }}
      >
        <source media="(max-width: 767px)" srcSet={imageAssets.alairNoirCoastalHeroDesktop} />
        <motion.img
          src={imageAssets.alairNoirCoastalHeroDesktop}
          alt="Black Alair Noir chauffeur car waiting beside a quiet coastal terrace"
          fetchPriority="high"
          decoding="async"
          style={isReduced ? undefined : { y: imageY }}
          className="h-full w-full object-cover object-[30%_100%] brightness-[0.98] contrast-[1.03] md:object-[center_bottom]"
        />
      </motion.picture>

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(239,228,216,0.82)_0%,rgba(239,228,216,0.54)_28%,rgba(239,228,216,0.1)_58%,rgba(239,228,216,0)_100%)] md:bg-[radial-gradient(circle_at_50%_32%,rgba(239,228,216,0.72),rgba(239,228,216,0.26)_42%,rgba(239,228,216,0)_72%)]" />

      <motion.div
        className="relative z-20 mx-auto flex min-h-[calc(100svh-72px)] max-w-[1440px] flex-col items-center px-5 pb-[34svh] pt-[13svh] text-center md:justify-center md:px-8 md:pb-[20svh] md:pt-0 lg:px-12"
        style={isReduced ? undefined : { y: copyY }}
        initial={isReduced ? false : "hidden"}
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.34
            }
          }
        }}
      >
        <motion.p
          variants={copyVariants}
          transition={{ duration: isReduced ? 0 : 0.62, ease: MOTION_EASE }}
          className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-brand-black/54 md:text-[11px]"
        >
          Private mobility, perfectly delivered
        </motion.p>

        <motion.h1
          layoutId="alair-primary-headline"
          variants={copyVariants}
          transition={{ duration: isReduced ? 0 : 0.72, ease: MOTION_EASE, layout: INERTIA_SPRING }}
          className="max-w-[11ch] font-editorial text-[clamp(4.25rem,16vw,10rem)] font-normal leading-[0.78] text-brand-black md:max-w-[12ch]"
        >
          Not for everyone.
          <span className="block">For you.</span>
        </motion.h1>

        <motion.p
          variants={copyVariants}
          transition={{ duration: isReduced ? 0 : 0.62, ease: MOTION_EASE }}
          className="mt-7 max-w-[46ch] text-[14px] font-light leading-6 text-brand-black/66 md:text-[16px] md:leading-7"
        >
          Chauffeur service for clients who value discretion, timing, and a journey that begins before the door opens.
        </motion.p>

        <motion.button
          type="button"
          onClick={onRequest}
          variants={copyVariants}
          whileHover={isReduced ? undefined : { y: -2, backgroundColor: "#0E1F16", color: "#FAF8F5" }}
          whileTap={isReduced ? undefined : { scale: 0.985 }}
          transition={INERTIA_SPRING}
          className="mt-8 h-12 border border-brand-black/18 bg-brand-black px-7 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-ivory shadow-[0_18px_48px_rgba(10,10,10,0.16)] md:hidden"
        >
          Book now
        </motion.button>
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-20 h-32 bg-[linear-gradient(to_bottom,rgba(10,10,10,0),#0a0a0a)] md:h-40"
        initial={isReduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: isReduced ? 0 : 1.2, delay: isReduced ? 0 : 0.55, ease: MOTION_EASE }}
      />
    </section>
  );
}
