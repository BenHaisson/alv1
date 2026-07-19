import { BriefcaseBusiness, MapPin, Plane, Users, type LucideIcon } from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue
} from "motion/react";
import { useRef, useState, type CSSProperties } from "react";
import { imageAssets } from "../assets";
import "../mobility-showcase.css";
import { useReducedMotionPref } from "./MotionProvider";

interface ServiceCard {
  title: string;
  description: string;
  image: string;
  mobileImage?: string;
  desktopPosition: string;
  mobilePosition: string;
  icon: LucideIcon;
}

const SERVICE_CARDS: ServiceCard[] = [
  {
    title: "Private Arrival",
    description: "Airport transfers with discreet personal service.",
    image: imageAssets.privateArrivalsDesktop,
    mobileImage: imageAssets.privateArrivalsMobile,
    desktopPosition: "58% 42%",
    mobilePosition: "68% 50%",
    icon: Plane
  },
  {
    title: "Executive Day",
    description: "By the hour. Focus on what matters most.",
    image: imageAssets.executiveSchedulesDesktop,
    mobileImage: imageAssets.executiveSchedulesMobile,
    desktopPosition: "center 42%",
    mobilePosition: "58% 50%",
    icon: BriefcaseBusiness
  },
  {
    title: "Private Routes",
    description: "Switzerland and beyond. Always direct.",
    image: imageAssets.longDistanceRoutesDesktop,
    mobileImage: imageAssets.longDistanceRoutesMobile,
    desktopPosition: "center 58%",
    mobilePosition: "center 48%",
    icon: MapPin
  },
  {
    title: "Group & Family",
    description: "Spacious. Comfortable. Travel together.",
    image: imageAssets.airportTransfersDesktop,
    mobileImage: imageAssets.airportTransfersMobile,
    desktopPosition: "center 58%",
    mobilePosition: "center 45%",
    icon: Users
  }
];

interface ServiceCardContentProps {
  card: ServiceCard;
}

function ServiceCardContent({ card }: ServiceCardContentProps) {
  const isReduced = useReducedMotionPref();

  return (
    <>
      <picture className="mobility-card__media absolute inset-0 block">
        {card.mobileImage && <source media="(max-width: 767px)" srcSet={card.mobileImage} />}
        <motion.img
          src={card.image}
          alt=""
          loading="eager"
          decoding="async"
          referrerPolicy="no-referrer"
          initial={isReduced ? false : { clipPath: "inset(0 0 100% 0)" }}
          animate={isReduced ? undefined : { clipPath: "inset(0 0 0% 0)" }}
          whileHover={isReduced ? undefined : { scale: 1.025, filter: "brightness(0.9) contrast(1.06)" }}
          transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
          className="mobility-card__image h-full w-full object-cover brightness-[0.82] contrast-[1.06]"
        />
      </picture>

      <motion.div className="mobility-card__content">
        <h3 className="mobility-card__title font-editorial font-normal text-brand-ivory">
          {card.title}
        </h3>
        <span className="mobility-card__divider block h-px bg-brand-gold" aria-hidden="true" />
        <p className="mobility-card__description font-light text-brand-cream/72">
          {card.description}
        </p>
      </motion.div>
    </>
  );
}

interface ServiceLayerProps {
  card: ServiceCard;
  index: number;
  progress: MotionValue<number>;
}

function serviceFrames(index: number) {
  if (index === 0) {
    return {
      points: [0, 0.2, 0.25],
      opacity: [1, 1, 0],
      y: [0, 0, -10],
      scale: [1, 1, 1.004]
    };
  }

  if (index === SERVICE_CARDS.length - 1) {
    return {
      points: [0.7, 0.75, 1],
      opacity: [0, 1, 1],
      y: [10, 0, 0],
      scale: [1.02, 1, 1]
    };
  }

  const enter = index * 0.25;
  const exit = (index + 1) * 0.25;
  return {
    points: [enter - 0.05, enter, exit - 0.05, exit],
    opacity: [0, 1, 1, 0],
    y: [10, 0, 0, -10],
    scale: [1.02, 1, 1, 1.004]
  };
}

function ServiceVisualLayer({ card, index, progress }: ServiceLayerProps) {
  const frames = serviceFrames(index);
  const opacity = useTransform(progress, frames.points, frames.opacity);
  const scale = useTransform(progress, frames.points, frames.scale);

  return (
    <motion.picture
      aria-hidden="true"
      style={{
        opacity,
        scale,
        zIndex: index + 1,
        ...({
          "--desktop-position": card.desktopPosition,
          "--mobile-position": card.mobilePosition
        } as CSSProperties)
      }}
      className="mobility-showcase__visual absolute inset-0 block will-change-transform"
    >
      {card.mobileImage && <source media="(max-width: 767px)" srcSet={card.mobileImage} />}
      <img
        src={card.image}
        alt=""
        loading="eager"
        decoding="async"
        fetchPriority={index === 0 ? "high" : "auto"}
        className="mobility-showcase__image h-full w-full object-cover"
      />
    </motion.picture>
  );
}

function ServiceCopyLayer({ card, index, progress }: ServiceLayerProps) {
  const frames = serviceFrames(index);
  const opacity = useTransform(progress, frames.points, frames.opacity);
  const titleY = useTransform(progress, frames.points, frames.y);
  const descriptionPoints = frames.points.map((point, pointIndex) => {
    if (pointIndex === 0 || pointIndex === frames.points.length - 1) return point;
    return Math.min(point + 0.012, 1);
  });
  const descriptionOpacity = useTransform(progress, descriptionPoints, frames.opacity);
  const descriptionY = useTransform(progress, frames.points, frames.y.map((value) => value * 0.8));

  return (
    <motion.div
      aria-hidden="true"
      className="mobility-showcase__copy absolute inset-0 will-change-transform"
      style={{ opacity }}
    >
      <motion.h3
        className="mobility-showcase__title font-editorial font-normal text-brand-ivory"
        style={{ y: titleY }}
      >
        {card.title}
      </motion.h3>
      <motion.p
        className="mobility-showcase__description font-sans font-light text-brand-cream/72"
        style={{ opacity: descriptionOpacity, y: descriptionY }}
      >
        {card.description}
      </motion.p>
    </motion.div>
  );
}

interface ServiceNavButtonProps extends ServiceLayerProps {
  isActive: boolean;
  onSelect: (index: number) => void;
}

function ServiceNavButton({ card, index, progress, isActive, onSelect }: ServiceNavButtonProps) {
  const Icon = card.icon;
  const focus = useTransform(progress, (value) => {
    const stagedProgress = Math.min(value, 0.75);
    const distance = Math.abs(stagedProgress - index * 0.25);
    return Math.max(0, 1 - distance / 0.08);
  });
  const opacity = useTransform(focus, [0, 1], [0.34, 1]);
  const y = useTransform(focus, [0, 1], [0, -7]);
  const scale = useTransform(focus, [0, 1], [0.9, 1.14]);
  const filter = useTransform(focus, [0, 1], ["brightness(0.72)", "brightness(1.16)"]);

  return (
    <button
      type="button"
      className="mobility-showcase__nav-item"
      aria-current={isActive ? "step" : undefined}
      aria-label={`Show ${card.title}`}
      title={card.title}
      onClick={() => onSelect(index)}
    >
      <motion.span
        className="mobility-showcase__nav-icon"
        style={{ opacity, y, scale, filter }}
      >
        <Icon aria-hidden="true" strokeWidth={1.2} />
      </motion.span>
    </button>
  );
}
function SectionHeading() {
  return (
    <div className="mobility-section__header flex min-h-[inherit] shrink-0 flex-col items-center justify-center text-center">
      <div className="mx-auto flex max-w-[92rem] flex-col items-center px-5">
        <h2 className="section-heading max-w-[min(100%,78rem)] overflow-visible pb-[0.14em] text-[clamp(3rem,6.2vw,6.8rem)] leading-[1.05]">
          Not for everyone.<span className="section-heading-muted mt-1 block pb-[0.1em]">For you.</span>
        </h2>
        <p className="section-subtitle mx-auto mt-8 max-w-3xl">
          Four ways to move with certainty, prepared around your time, privacy, and destination.
        </p>
      </div>
    </div>
  );
}

function ReducedMotionCards() {
  return (
    <section className="mobility-section mobility-section--static relative border-b border-brand-cream/10 bg-brand-deep-forest">
      <div className="mx-auto max-w-[90rem]">
        <SectionHeading />
        <div className="mobility-card-grid mt-0 grid gap-5 md:grid-cols-2">
          {SERVICE_CARDS.map((card) => (
            <article
              key={card.title}
              className="mobility-card relative isolate overflow-hidden rounded-[26px] border border-brand-cream/16 bg-brand-deep-forest md:rounded-[28px]"
              style={{
                "--desktop-position": card.desktopPosition,
                "--mobile-position": card.mobilePosition
              } as CSSProperties}
            >
              <ServiceCardContent card={card} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function NotForEveryone() {
  const introRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [activeService, setActiveService] = useState(0);
  const isReduced = useReducedMotionPref();
  const { scrollYProgress: introProgress } = useScroll({
    target: introRef,
    offset: ["start 78%", "end 18%"]
  });
  const easedIntroProgress = useSpring(introProgress, {
    stiffness: 88,
    damping: 28,
    mass: 0.9,
    restDelta: 0.001
  });
  const introOpacity = useTransform(easedIntroProgress, [0, 0.2, 0.76, 1], [0.52, 1, 1, 0.68]);
  const introY = useTransform(easedIntroProgress, [0, 0.28, 0.76, 1], [42, 0, 0, -34]);
  const introScale = useTransform(easedIntroProgress, [0, 0.34, 0.76, 1], [0.62, 1.1, 1.1, 0.78]);
  const { scrollYProgress } = useScroll({
    target: galleryRef,
    offset: ["start start", "end end"]
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 84,
    damping: 26,
    mass: 0.82,
    restDelta: 0.001
  });
  const sectionBackground = useTransform(
    progress,
    [0, 0.2, 0.36],
    ["#08130D", "#08130D", "#0A0A0A"]
  );

  const accentScale = useTransform(
    progress,
    [0, 0.04, 0.2, 0.25, 0.45, 0.5, 0.7, 0.75, 1],
    [1, 0.72, 0.72, 1, 0.72, 1, 0.72, 1, 1]
  );

  useMotionValueEvent(progress, "change", (value) => {
    const nextService = Math.min(SERVICE_CARDS.length - 1, Math.floor(value * 4 + 0.001));
    setActiveService((current) => current === nextService ? current : nextService);
  });

  const scrollToService = (index: number) => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    const galleryTop = window.scrollY + gallery.getBoundingClientRect().top;
    const scrollDistance = Math.max(0, gallery.offsetHeight - window.innerHeight);
    window.scrollTo({
      top: galleryTop + scrollDistance * (index / SERVICE_CARDS.length),
      behavior: "smooth"
    });
  };

  if (isReduced) return <ReducedMotionCards />;

  return (
    <motion.section
      className="mobility-section relative border-b border-brand-cream/10 luxury-noise"
      style={{ backgroundColor: sectionBackground }}
    >
      <div ref={introRef} className="mobility-section__entry bg-brand-deep-forest">
        <motion.div
          className="mx-auto w-full max-w-[90rem]"
          style={{ opacity: introOpacity, y: introY, scale: introScale, transformOrigin: "center center" }}
        >
          <SectionHeading />
        </motion.div>
      </div>

      <div ref={galleryRef} className="mobility-section__gallery relative h-[500svh]">
        <div className="mobility-section__viewport mobility-section__viewport--gallery sticky top-[76px] h-[calc(100svh-76px)] overflow-hidden md:top-14 md:h-[calc(100svh-56px)]">
          <div className="mobility-showcase relative isolate mx-auto h-full max-w-[100rem] overflow-hidden">
            <div className="mobility-showcase__visuals absolute inset-0 bg-brand-deep-forest">
              {SERVICE_CARDS.map((card, index) => (
                <ServiceVisualLayer key={card.title} card={card} index={index} progress={progress} />
              ))}
            </div>

            <div className="mobility-showcase__shade absolute inset-0 z-10" aria-hidden="true" />

            <div className="mobility-showcase__content absolute z-20">
              <p className="sr-only" aria-live="polite">
                {SERVICE_CARDS[activeService].title}: {SERVICE_CARDS[activeService].description}
              </p>
              <motion.span
                className="mobility-showcase__accent block h-px bg-brand-cream/72"
                style={{ scaleX: accentScale }}
                aria-hidden="true"
              />
              <div className="mobility-showcase__copy-frame relative">
                {SERVICE_CARDS.map((card, index) => (
                  <ServiceCopyLayer key={card.title} card={card} index={index} progress={progress} />
                ))}
              </div>
            </div>

            <nav className="mobility-showcase__nav absolute z-30" aria-label="Service showcase">
              {SERVICE_CARDS.map((card, index) => (
                <ServiceNavButton
                  key={card.title}
                  card={card}
                  index={index}
                  progress={progress}
                  isActive={activeService === index}
                  onSelect={scrollToService}
                />
              ))}
            </nav>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
