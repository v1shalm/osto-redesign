# osto.one hero redesign

Hero section redesign concept for [osto.one](https://www.osto.one) as part of a product design assignment.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## What's here

- `app/page.tsx` — version toggle wrapper
- `app/OstoHeroV1.tsx` — first iteration: "Your audit is in six weeks" H1, social-proof carousel, editorial stat row, customer logo strip
- `app/OstoHeroV2.tsx` — stripped iteration: "Compliance is the byproduct of security. We fix both." H1, dashboard alone (no extra proof components), left-aligned tabs
- `app/OstoDashboard.tsx` — live, interactive dashboard mock with three tab-driven views (Security posture, Compliance readiness, Pen-test findings) and live-feeling tickers
- `app/SocialProof.tsx` — auto-rotating social-proof carousel used in V1

A floating top-right pill toggles between V1 and V2. The choice persists in localStorage.

## Notes

Customer logos and the "40+ teams" claim are illustrative placeholders. For a real handoff to osto these would be replaced with their actual customer data.
