# ALAIR NOIR video slots

The approved video moments are installed here. Files in `public/` are
served at the site root, so `public/videos/bmw-i7-hero.mp4` is loaded as
`/videos/bmw-i7-hero.mp4` (paths configured in `src/data/visualJourney.ts`).

| File | Used by | Scene |
|---|---|---|
| `bmw-i7-hero.mp4` | Hero background (`HeroCommandDeck` via `CinematicVideoBackground`) | BMW i7 arriving through Zürich at night, slow forward tracking |
| `bmw-i7-terminal.mp4` | Fleet reveal, BMW i7 card (`FleetRevealMotion`) | Aerial of the i7 crossing an airport taxiway at sunset — client OpenArt i2v clip (Jul 2026), slowed to 0.5× in the file for the cinematic pace, plays on mobile too (`minVideoWidth: 0`) |
| `mercedes-vclass-arrival.mp4` | Fleet reveal, V-Class card (`FleetRevealMotion`) | V-Class arriving at a hotel-style terminal entrance |
| `bmw-i7-cabin.mp4` | Private Interval section (`PrivateIntervalMotion`, section 06) | Rear cabin, city lights drifting, tablet glow, near-static |

These were produced image-to-video from approved still frames of the real
vehicles (`wan2-7`, 1080p, ~7s), per the vehicle-reference rules in
`.claude/skills/alair-noir-visual-journey/SKILL.md` — never text-only
generation for the BMW i7 or Mercedes V-Class.

**Nothing breaks if a file is ever removed** — every slot falls back to its
poster image automatically (missing mp4 → poster; mobile → poster;
prefers-reduced-motion → poster; codec/decode failure → poster).

To replace a clip: drop a new file at the same path (H.264 mp4, ~1080p,
muted-safe — audio tracks are ignored since playback is always muted) and
update the matching `poster` in `src/data/visualJourney.ts` if the new
clip's first frame differs from the current poster.
