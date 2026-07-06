import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EASE } from "./motion";

export interface Frame {
  image: string;
  title: string;
  caption: string;
}

/**
 * Quiet cabin/vehicle gallery: one large crossfading frame with a caption and
 * a thumbnail strip. Keyboard and arrow navigable. Used on the Fleet page.
 */
export default function Gallery({ frames }: { frames: Frame[] }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const go = (n: number) => setI((prev) => (prev + n + frames.length) % frames.length);
  const active = frames[i];

  return (
    <div>
      <div className="relative aspect-[16/9] overflow-hidden border border-hairline bg-black">
        <AnimatePresence mode="wait">
          <motion.img
            key={i}
            src={active.image}
            alt={active.title}
            initial={reduce ? false : { opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep-black/70 via-transparent to-transparent" />

        {/* Controls */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            type="button"
            aria-label="Previous frame"
            onClick={() => go(-1)}
            className="flex h-9 w-9 items-center justify-center border border-hairline bg-deep-black/70 text-ivory backdrop-blur transition-colors hover:border-stone-cream/60"
          >
            <ChevronLeft size={16} strokeWidth={1.6} />
          </button>
          <button
            type="button"
            aria-label="Next frame"
            onClick={() => go(1)}
            className="flex h-9 w-9 items-center justify-center border border-hairline bg-deep-black/70 text-ivory backdrop-blur transition-colors hover:border-stone-cream/60"
          >
            <ChevronRight size={16} strokeWidth={1.6} />
          </button>
        </div>

        <div className="absolute bottom-4 left-4 max-w-[70%]">
          <p className="font-serif text-[18px] font-medium text-ivory">{active.title}</p>
          <p className="mt-1 font-sans text-[12px] leading-snug text-stone-cream/80">{active.caption}</p>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
        {frames.map((f, idx) => (
          <button
            key={f.image}
            type="button"
            aria-label={f.title}
            onClick={() => setI(idx)}
            className={`aspect-[4/3] overflow-hidden border transition-colors ${
              idx === i ? "border-stone-cream" : "border-hairline opacity-60 hover:opacity-100"
            }`}
          >
            <img src={f.image} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
