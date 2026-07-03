import { useState } from "react";
import { motion } from "motion/react";
import type { VideoSlot } from "../../data/visualJourney";
import { useMediaQuery, useReducedMotionPref } from "../MotionProvider";

const EASE = [0.16, 1, 0.3, 1] as const;

interface CinematicVideoBackgroundProps {
  slot: VideoSlot;
  /** Extra classes for the poster/video element (filters, object-position…). */
  mediaClassName?: string;
  /** Dark gradient overlay to keep foreground text readable. Default true. */
  overlay?: boolean;
  /** Serve the poster instead of video below this width. Default 768. */
  minVideoWidth?: number;
}

/**
 * Full-bleed cinematic video background with a poster-first strategy:
 * the poster renders immediately (and permanently on mobile, on
 * prefers-reduced-motion, or when the mp4 is missing/unplayable); the video
 * cross-fades in over it only once it can actually play. On load the media
 * settles from scale 1.06 to 1.0 — slow, no flashing.
 *
 * Video files live in public/videos/ (see README there). Components using
 * this never break when an mp4 slot is not filled yet.
 */
export default function CinematicVideoBackground({
  slot,
  mediaClassName = "",
  overlay = true,
  minVideoWidth = 768
}: CinematicVideoBackgroundProps) {
  const isReduced = useReducedMotionPref();
  const isWide = useMediaQuery(`(min-width: ${minVideoWidth}px)`);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  const wantsVideo = !isReduced && isWide && !videoFailed;

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute inset-0"
        initial={isReduced ? false : { scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: EASE }}
      >
        <img
          src={slot.poster}
          alt={slot.alt}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover ${mediaClassName}`}
        />

        {wantsVideo && (
          <motion.video
            className={`absolute inset-0 h-full w-full object-cover ${mediaClassName}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: videoReady ? 1 : 0 }}
            transition={{ duration: 1.2, ease: EASE }}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={slot.poster}
            onCanPlay={() => setVideoReady(true)}
            onError={() => setVideoFailed(true)}
          >
            <source src={slot.src} type="video/mp4" onError={() => setVideoFailed(true)} />
          </motion.video>
        )}
      </motion.div>

      {overlay && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-black/82 via-brand-black/34 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black/88 via-transparent to-brand-black/46" />
        </>
      )}
    </div>
  );
}
