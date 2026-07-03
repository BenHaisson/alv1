# Section 02 identity frames — drop-in guide

Five bespoke frames were generated for the **"NOT FOR EVERYONE. FOR YOU."**
identity cards (`src/components/NotForEveryone.tsx`) via the OpenART AI MCP
pipeline (model **GPT Image 2**, `text2image`, `4:5`, `2k`, `high`).

They live in the OpenART account (visible as result cards). They are **not** in
the repo because this environment's egress policy blocks `cdn.openart.ai`
(HTTP 403 at the proxy), so the files couldn't be fetched from here. Until you
drop them in, the five cards map to existing on-brand assets in `src/assets.ts`.

## Activate the bespoke frames (~2 min)

1. Download each URL below (or open the result card in OpenART and use its
   Download button) and save it into **this folder** with the target filename.
2. In `src/assets.ts`, add imports and repoint the five `identity*` constants:

   ```ts
   import identityCeoFounders from "./assets/images/identity/identity_ceo_founders.png";
   import identityFamilyOffices from "./assets/images/identity/identity_family_offices.png";
   import identityDiplomaticGuests from "./assets/images/identity/identity_diplomatic_guests.png";
   import identityPremiumHospitality from "./assets/images/identity/identity_premium_hospitality.png";
   import identityPrivateClients from "./assets/images/identity/identity_private_clients.png";
   ```

   …and delete the temporary `const identity* = <existing asset>` fallbacks.
3. `npm run build` — done. (Consider converting to `.webp` first to cut weight.)

## The five frames

| Target filename | Class | historyId | URL |
|---|---|---|---|
| `identity_ceo_founders.png` | CEO & Founders | `14902JtNxPVvPZYjaVPI` | https://cdn.openart.ai/openart-ai/production/2026-07/create-image/DArNQmCWZXRzlj9M7cpo/gpt-image-2-1_1783070571537_07b7b367.png |
| `identity_family_offices.png` | Family Offices | `3pn9kpl8Q9uwxMdH7iR4` | https://cdn.openart.ai/openart-ai/production/2026-07/create-image/DArNQmCWZXRzlj9M7cpo/gpt-image-2-1_1783070554252_31467e70.png |
| `identity_diplomatic_guests.png` | Diplomatic Guests | `kX1TvpCcGLyvzqpcU0bG` | https://cdn.openart.ai/openart-ai/production/2026-07/create-image/DArNQmCWZXRzlj9M7cpo/gpt-image-2-1_1783070575433_f5eb6de1.png |
| `identity_premium_hospitality.png` | Premium Hospitality | `sXJUcYNz9lUH4hWQFOZp` | https://cdn.openart.ai/openart-ai/production/2026-07/create-image/DArNQmCWZXRzlj9M7cpo/gpt-image-2-1_1783070568191_60e3c54b.png |
| `identity_private_clients.png` | Private Clients | `9kFbUsmpZrLUYI557M6A` | https://cdn.openart.ai/openart-ai/production/2026-07/create-image/DArNQmCWZXRzlj9M7cpo/gpt-image-2-1_1783070825105_1ce866c1.png |

## Prompts used (for regeneration or variations)

Common negative constraints folded into every prompt: *no visible faces, no
logos, no readable text, no license plate, no neon, no blue or red lighting, no
heavy gold, no crowd.* Common style: cinematic editorial, deep forest-green and
black palette, stone/cream highlights, stable warm-white headlights, vertical
portrait with empty dark copy space at the top.

- **CEO & Founders** — A composed executive in a dark tailored suit stepping into
  the rear of a black BMW i7 outside a modern glass Zürich headquarters at night,
  seen from behind, chauffeur holding the rear door; wet dark stone pavement.
- **Family Offices** — A discreet family-office arrival: a black Mercedes-Benz
  V-Class at the private gate of a Zürichberg residence at dusk, chauffeur closing
  the rear door; calm empty driveway, mature trees.
- **Diplomatic Guests** — A black luxury sedan under the stone portico of a formal
  Swiss institutional building at night, a single composed chauffeur silhouette
  beside it; restrained institutional lighting, no flags.
- **Premium Hospitality** — A black BMW i7 at the entrance of a refined Zürich
  luxury hotel at night, soft warm portico light, chauffeur by the rear door; wet
  stone forecourt reflections.
- **Private Clients** — A black luxury sedan on a quiet residential Zürich street
  at night, rear door open with warm cabin light on wet pavement, chauffeur
  waiting; intimate, discreet, soft bokeh streetlights.
