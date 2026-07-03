---
name: alair-noir-visual-journey
description: Use this skill to create cinematic website journeys, AI image prompts, sliders, cards, scroll animations, transitions, and premium visual systems for ALAIR NOIR GmbH.
---

# ALAIR NOIR Visual Journey Skill

You are designing a premium website experience for ALAIR NOIR GmbH, a private chauffeur service in Zürich.

The website must feel like:
- Swiss private mobility
- High-end watchmaking
- Private aviation
- Quiet luxury
- Editorial design
- Apple product reveal
- Rolls-Royce configurator
- Awwwards-level motion

It must not feel like:
- Uber
- Blacklane
- Limousine rental
- Taxi company
- Generic SaaS website
- Template landing page
- Crypto or gaming UI

## Brand Direction

Brand name:
ALAIR NOIR GmbH

Core slogan:
NOT FOR EVERYONE.
FOR YOU.

Primary service:
Private Chauffeur Service Zürich.

Audience:
- CEOs
- Founders
- Executives
- VIP clients
- Family offices
- Private travelers
- Government-level guests
- Premium hotel guests
- Event clients

Fleet:
- Black BMW i7 2026
- Black Mercedes-Benz V-Class

Colors:
- Black: #0A0A0A
- Forest: #0E1F16
- Moss: #2F4A33
- Stone: #A89E8B
- Cream: #D6C7B0
- Ivory: #F6F2E9
- Gold: #D4AF37 as tiny accent only

Visual style:
- Dark forest
- Black
- Ivory typography
- Stone text
- Thin borders
- Editorial spacing
- No neon
- No blue
- No red
- No heavy gold
- No cheap glow
- No colorful gradients

## Vehicle Asset Rules (MANDATORY)

Never generate BMW i7 or Mercedes V-Class visuals from text-only prompts.
AI will distort grilles, headlights, proportions, doors, wheels, and logos.

For cars, always use this order:
1. Real reference image (uploaded/approved).
2. Image-to-image refinement only if needed.
3. Image-to-video from an approved still frame.
4. Website motion using CSS / the motion library — not more generation.

Always preserve the exact vehicle body, grille, headlights, proportions,
wheels, and paint from the reference. If a generated image changes the car
model, stop immediately and report failure.

## Credit-Safe Rules (MANDATORY)

- Never generate more than 2 variations of an asset before asking for approval.
- Never generate a video until its still frame is approved.
- Never use text-to-image for the BMW i7 or Mercedes V-Class.
- Prefer code animation (motion/react, CSS, SVG) over generated assets.
- The website uses only 3 real video moments; everything else is code motion:
  1. Hero background (BMW i7 arriving in Zürich, 6–8s loop, slow tracking).
  2. Fleet reveal (BMW i7 + V-Class product motion).
  3. Private cabin (rear cabin, silhouette, tablet glow, subtle movement).

## Image Generation Rules

When generating images with OpenArt AI MCP:
- Always specify website use case.
- Always specify camera angle.
- Always specify empty copy space.
- Always specify lighting.
- Always specify no visible random text.
- Always specify no distorted cars.
- Always specify no fake logos.
- Always specify stable headlights.
- Always specify premium Swiss atmosphere.
- Always specify cinematic but realistic.

Use images as:
- Hero background
- Card image
- Fleet reveal
- Interior privacy section
- Destination card
- Transition scene

## Motion Rules

All animation must feel:
- Slow
- Controlled
- Cinematic
- Smooth
- Expensive
- Precise

Use:
- Framer Motion for cards and sliders
- GSAP ScrollTrigger for pinned scroll sections
- CSS 3D transforms for stacked cards
- Lenis only if smooth scrolling already fits the project

Avoid:
- Bouncy effects
- Fast swipe effects
- Flashing lights
- Heavy zoom
- Parallax overload
- Too many animations at the same time

## Core Website Models

Create these reusable models:

1. Hero Arrival Scene
- Full screen.
- Cinematic car image or video-like image sequence.
- Text on left or top-left.
- BMW i7 visible on right.
- Dark Zürich environment.
- CTA minimal.

2. Stacked Identity Cards
- For “Not for everyone. For you.”
- Cards represent client types.
- Cards move one by one on scroll.
- Active card expands.
- Previous cards move aside.

3. Standards Slider
- Five cards:
  Timing, Privacy, Presence, Composure, Precision.
- Scroll or drag interaction.
- Cards must be short and readable.

4. Fleet Reveal
- Two premium product cards:
  BMW i7 and Mercedes-Benz V-Class.
- Cards expand on hover or scroll.
- Use accurate vehicle images.

5. Destination Stack
- Zürich Airport
- Private residence
- Five-star hotel
- Swiss Alps
- Geneva
- Basel
- St. Moritz
- Cards stacked in 3D.
- Scroll changes active destination.

6. Interior Privacy Scene
- Rear cabin image.
- Executive client silhouette.
- Tablet or market dashboard.
- No visible identity.
- Quiet luxury.

7. Final Booking Section
- Minimal.
- No pressure.
- Direct contact.
- Request availability.

## Output Requirements

When asked to build:
1. First create the storyboard.
2. Then create exact OpenArt prompts.
3. Then create component architecture.
4. Then create animation specification.
5. Then implement the code.
6. Do not overwrite unrelated files.
7. Do not add random content.
8. Keep all content premium and short.
9. Make everything responsive.
10. Respect reduced-motion accessibility.

## Quality Standard

Every section must answer:
- What is the visitor feeling?
- What does the visitor understand?
- Why does this feel premium?
- What action should happen next?
