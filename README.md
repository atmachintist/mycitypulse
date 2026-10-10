# MyCityPulse

**A citizen-first guide to everyday urban public services in India.**

MyCityPulse helps a resident describe a local problem, prepare a clear grievance draft, find a verified official channel where available, and understand how city governance works.

## What the current release actually does

- **Homepage** at `/`: problem-first journeys and clearly stated service limitations.
- **Get civic help** at `/help`: six basic categories, free-text description, city, neighbourhood, optional landmark and DIGIPIN, editable complaint draft and copy-to-clipboard.
- **Verified handoff for Ahmedabad**: direct links to the official AMC CCRS portal, including public tracking link. We cannot verify responsibility for every ward, asset, service or private site, so citizens must check jurisdiction.
- **How it works** at `/how-it-works`: explains prepared vs officially filed vs resolved complaints and answers privacy questions.
- **Know your city** at `/know-your-city`: an introductory guide to mayors, commissioners, wards, other authorities, and the 74th Amendment; links to primary sources and Nāgrika's Governance Series.
- **Saved notes** at `/saved`: entirely optional browser-local records, including a user-entered official acknowledgment and filing date.
- English default; Gujarati and Marathi interface options. Other languages can be requested by email.

**Not implemented:** Filing directly with any public authority, verified automatic jurisdiction matching, municipal back-office integration, official complaint-status sync, SLA guarantees, user accounts, location geocoding, or backend uploads. Do not claim these features exist.

## Developer setup

```sh
npm install
npm run dev
npm run build
```

The app is React 19 + Vite. The *only active frontend entrypoint* is `src/main.jsx`, which imports `src/v1/App.jsx`. Its locale and source data live in `src/v1/content.js`, and styles in `src/v1/styles.css`.

Legacy code and previously explored concepts remain in repository history and inactive directories solely for recovery. They do not render or bundle in V1.

## Deployment and domain

Vercel project `mycitypulse` (team `atmachintists-projects`) deploys the `dist` directory. The public domain `mycitypulse.in` may **not** resolve to this Vercel project while the external DNS at the registrar still points to the older ChatGPT Sites host.

Before cutover, check **Vercel → Project → Settings → Domains** for the exact recommended values. Only adjust website A/CNAME records at the registrar. Never remove or modify email MX/TXT/SPF/DKIM records to perform a website migration. Domain routing changes require separate real-world verification.

## Responsible product boundaries

- Independent from government; identify official portals as external services.
- No private data is sent to MyCityPulse servers by the complaint draft flow.
- A locally saved record is not an official government acknowledgement.
- A reference and filing date are self-recorded, not verified.
- A follow-up estimate based on weekdays is a personal reminder only.
- Never claim that a suggested service area proves asset ownership or official jurisdiction.
- Use public primary sources and clearly attribute Nāgrika's independent research.
