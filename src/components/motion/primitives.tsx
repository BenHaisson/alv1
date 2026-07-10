import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type HTMLMotionProps,
  type MotionValue,
  type Variants
} from "motion/react";
import {
  Children,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode
} from "react";
import { useReducedMotionPref } from "../MotionProvider";
import { INERTIA_SPRING, MOTION_DURATION, MOTION_EASE, PREMIUM_SPRING } from "../../lib/motion";

type DivMotionProps = HTMLMotionProps<"div">;

export function AnimatedSection({
  children,
  className = "",
  ...props
}: DivMotionProps & { children: ReactNode }) {
  const isReduced = useReducedMotionPref();

  return (
    <motion.section
      initial={isReduced ? false : { opacity: 0, y: 56 }}
      whileInView={isReduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.24 }}
      transition={{ duration: MOTION_DURATION.cinematic, ease: MOTION_EASE }}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  );
}

export function FadeIn({
  children,
  delay = 0,
  y = 28,
  className = "",
  ...props
}: DivMotionProps & { children: ReactNode; delay?: number; y?: number }) {
  const isReduced = useReducedMotionPref();

  return (
    <motion.div
      initial={isReduced ? false : { opacity: 0, y, filter: "blur(8px)" }}
      whileInView={isReduced ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: MOTION_DURATION.reveal, delay, ease: MOTION_EASE }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function RevealImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  direction = "up",
  delay = 0,
  ...props
}: DivMotionProps & {
  src: string;
  alt: string;
  imgClassName?: string;
  direction?: "up" | "left" | "right";
  delay?: number;
}) {
  const isReduced = useReducedMotionPref();
  const hiddenClip =
    direction === "up"
      ? "inset(100% 0% 0% 0%)"
      : direction === "left"
        ? "inset(0% 100% 0% 0%)"
        : "inset(0% 0% 0% 100%)";

  return (
    <motion.div
      initial={isReduced ? false : { clipPath: hiddenClip }}
      whileInView={isReduced ? undefined : { clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: MOTION_DURATION.cinematic, delay, ease: MOTION_EASE }}
      className={`overflow-hidden ${className}`}
      {...props}
    >
      <motion.img
        src={src}
        alt={alt}
        initial={isReduced ? false : { scale: 1.08 }}
        whileInView={isReduced ? undefined : { scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: MOTION_DURATION.settle, delay, ease: MOTION_EASE }}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </motion.div>
  );
}

export function ParallaxImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  offset = 72
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  offset?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotionPref();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rawY = useTransform(scrollYProgress, [0, 1], [-offset, offset]);
  const y = useSpring(rawY, INERTIA_SPRING);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        style={isReduced ? undefined : { y }}
        className={`h-[calc(100%+144px)] w-full object-cover ${imgClassName}`}
      />
    </div>
  );
}

export function PageTransition({
  children,
  layoutId = "page-transition",
  className = ""
}: {
  children: ReactNode;
  layoutId?: string;
  className?: string;
}) {
  const isReduced = useReducedMotionPref();

  return (
    <motion.main
      layout
      layoutId={layoutId}
      initial={isReduced ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={isReduced ? undefined : { opacity: 0, y: -18 }}
      transition={{ duration: 0.72, ease: MOTION_EASE }}
      className={className}
    >
      {children}
    </motion.main>
  );
}

export function HeroReveal({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  const isReduced = useReducedMotionPref();

  return (
    <motion.div
      initial={isReduced ? false : { opacity: 0, y: 72, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.35, ease: MOTION_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FleetReveal({
  children,
  className = "",
  delay = 0
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const isReduced = useReducedMotionPref();

  return (
    <motion.div
      initial={isReduced ? false : { clipPath: "inset(0% 100% 0% 0%)", x: 36 }}
      whileInView={isReduced ? undefined : { clipPath: "inset(0% 0% 0% 0%)", x: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: MOTION_DURATION.cinematic, delay, ease: MOTION_EASE }}
      className={`overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function LuxuryCard({
  children,
  className = "",
  layoutId
}: {
  children: ReactNode;
  className?: string;
  layoutId?: string;
}) {
  return (
    <motion.article
      layout
      layoutId={layoutId}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={PREMIUM_SPRING}
      className={className}
    >
      {children}
    </motion.article>
  );
}

const galleryVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.08
    }
  }
};

const galleryItemVariants: Variants = {
  hidden: { opacity: 0, y: 28, clipPath: "inset(12% 0% 0% 0%)" },
  show: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: MOTION_DURATION.reveal, ease: MOTION_EASE }
  }
};

export function AnimatedGallery({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  const isReduced = useReducedMotionPref();

  if (isReduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      variants={galleryVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
      className={className}
    >
      {Children.map(children, (child) => (
        <motion.div variants={galleryItemVariants}>{child}</motion.div>
      ))}
    </motion.div>
  );
}

export function ScrollProgress({
  className = "fixed left-0 right-0 top-0 z-[120] h-[2px] origin-left bg-brand-gold"
}: {
  className?: string;
}) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, PREMIUM_SPRING);

  return <motion.div aria-hidden="true" style={{ scaleX }} className={className} />;
}

export function MagneticButton({
  children,
  className = "",
  onClick
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 160, damping: 24, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 160, damping: 24, mass: 0.35 });

  const handleMove = (event: MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(((event.clientX - rect.left) / rect.width - 0.5) * 16);
    y.set(((event.clientY - rect.top) / rect.height - 0.5) * 16);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={onClick}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.985 }}
      transition={PREMIUM_SPRING}
      className={className}
    >
      {children}
    </motion.button>
  );
}

export function CursorFollower({
  className = "pointer-events-none fixed left-0 top-0 z-[9998] hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-gold/50 mix-blend-difference lg:block"
}: {
  className?: string;
}) {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 180, damping: 28, mass: 0.45 });
  const springY = useSpring(y, { stiffness: 180, damping: 28, mass: 0.45 });

  useEffect(() => {
    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  return <motion.div aria-hidden="true" style={{ x: springX, y: springY }} className={className} />;
}

export function ImageSlider({
  images,
  className = "",
  imageClassName = ""
}: {
  images: { src: string; alt: string; id?: string }[];
  className?: string;
  imageClassName?: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active];

  if (!current) return null;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.img
          key={current.id ?? current.src}
          src={current.src}
          alt={current.alt}
          initial={{ opacity: 0, scale: 1.04, clipPath: "inset(0% 0% 0% 12%)" }}
          animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ opacity: 0, scale: 1.02, clipPath: "inset(0% 12% 0% 0%)" }}
          transition={{ duration: MOTION_DURATION.reveal, ease: MOTION_EASE }}
          className={`h-full w-full object-cover ${imageClassName}`}
        />
      </AnimatePresence>

      <div className="absolute bottom-4 right-4 z-10 flex gap-2">
        {images.map((image, index) => (
          <motion.button
            key={image.id ?? image.src}
            type="button"
            aria-label={`Show image ${index + 1}`}
            onClick={() => setActive(index)}
            animate={{ width: active === index ? 28 : 8, opacity: active === index ? 1 : 0.45 }}
            transition={PREMIUM_SPRING}
            className="h-2 bg-brand-cream"
          />
        ))}
      </div>
    </div>
  );
}

export function useInertia(value: MotionValue<number>) {
  return useSpring(value, INERTIA_SPRING);
}
