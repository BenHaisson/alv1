# ALAIR NOIR video slots

The motion layer expects up to three approved video moments here. Files in
`public/` are served at the site root, so `public/videos/bmw-i7-hero.mp4` is
loaded as `/videos/bmw-i7-hero.mp4` (paths configured in
`src/data/visualJourney.ts`).

| File | Used by | Scene |
|---|---|---|
| `bmw-i7-hero.mp4` | Hero background (`HeroCommandDeck` via `CinematicVideoBackground`) | BMW i7 arriving through Zürich at night, 6–8s loop, slow tracking |
| `mercedes-vclass-arrival.mp4` | Fleet / arrival moment (slot ready, not yet wired) | V-Class arriving at a five-star hotel entrance, 7s |
| `bmw-i7-cabin.mp4` | Private interval (slot ready, not yet wired) | Rear cabin, silhouette, tablet glow, subtle movement |

**Nothing breaks while these are missing** — every slot falls back to its
poster image automatically (missing mp4 → poster; mobile → poster;
prefers-reduced-motion → poster).

Production rules (see `.claude/skills/alair-noir-visual-journey/SKILL.md`):
videos are made with OpenArt **image-to-video from an approved still frame
of the real vehicle** — never text-only generation. Still first → approval →
video. Encode as H.264 mp4, ~8s, 1920×1080 or wider, no audio needed
(playback is muted).
