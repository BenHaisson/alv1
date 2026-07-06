import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EASE } from "./motion";

/**
 * Full-bleed poster-first video background. The poster paints immediately (and
 * stays permanently on mobile, reduced-motion, or when the mp4 can't play); the
 * muted looping video cross-fades in once it can actually play. Adapted from the
 * main-branch CinematicVideoBackground, self-contained for the new site.
 */
export default function VideoBackground({
  video,
  poster,
  alt = "",
  className = "",
  minVideoWidth = 768
}: {
  video: string;
  poster: string;
  alt?: string;
  className?: string;
  minVideoWidth?: number;
}) {
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const isWide = typeof window !== "undefined" && window.innerWidth >= minVideoWidth;
  const wantsVideo = !reduce && isWide && !failed;

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute inset-0"
        initial={reduce ? false : { scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: EASE }}
      >
        <img
          src={poster}
          alt={alt}
          loading="eager"
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover ${className}`}
        />
        {wantsVideo && (
          <motion.video
            className={`absolute inset-0 h-full w-full object-cover ${className}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ duration: 1.2, ease: EASE }}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={poster}
            onCanPlay={() => setReady(true)}
            onError={() => setFailed(true)}
          >
            <source src={video} type="video/mp4" />
          </motion.video>
        )}
      </motion.div>
    </div>
  );
}
