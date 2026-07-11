import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
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
  /** Above-the-fold slot: poster loads eagerly and the video mounts
   *  immediately. Below-the-fold slots (default) lazy-load the poster and
   *  only mount the video once the section approaches the viewport. */
  priority?: boolean;
}

/**
 * Full-bleed cinematic video background with a poster-first strategy:
 * the poster renders immediately (and permanently on mobile, on
 * prefers-reduced-motion, or when the mp4 is missing/unplayable); the video
 * cross-fades in over it only once it can actually play. On load the media
 * settles from scale 1.06 to 1.0 — slow, no flashing.
 *
 * Non-priority slots are lazy: the mp4 element mounts only when the section
 * comes within a viewport of the fold, and playback pauses whenever the
 * section scrolls away, so below-the-fold videos never decode ahead of need.
 *
 * Video files live in public/videos/ (see README there). Components using
 * this never break when an mp4 slot is not filled yet.
 */
export default function CinematicVideoBackground({
  slot,
  mediaClassName = "",
  overlay = true,
  minVideoWidth = 768,
  priority = false
}: CinematicVideoBackgroundProps) {
  const isReduced = useReducedMotionPref();
  const isWide = useMediaQuery(`(min-width: ${slot.minVideoWidth ?? minVideoWidth}px)`);
  const usesMobilePoster = useMediaQuery("(max-width: 767px)");
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [hasApproached, setHasApproached] = useState(priority);
  const poster = usesMobilePoster && slot.mobilePoster ? slot.mobilePoster : slot.poster;
  const alt = usesMobilePoster && slot.mobilePoster ? slot.mobileAlt ?? slot.alt : slot.alt;

  // "Near" spans one extra viewport in each direction so the video is decoding
  // by the time the section scrolls in, but not on initial page load.
  const isNearView = useInView(containerRef, { margin: "100% 0px 100% 0px" });

  useEffect(() => {
    if (isNearView) setHasApproached(true);
  }, [isNearView]);

  const wantsVideo = !!slot.src && !isReduced && isWide && !videoFailed && hasApproached;

  // Pause playback whenever the section is far off-screen; resume on return.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isNearView) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isNearView, wantsVideo]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute inset-0"
        initial={isReduced ? false : { scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: EASE }}
      >
        <img
          src={poster}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover ${mediaClassName}`}
        />

        {wantsVideo && (
          <motion.video
            ref={videoRef}
            className={`absolute inset-0 h-full w-full object-cover ${mediaClassName}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: videoReady ? 1 : 0 }}
            transition={{ duration: 1.2, ease: EASE }}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={poster}
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
