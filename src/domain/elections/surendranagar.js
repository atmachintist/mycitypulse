import { createGujaratElection, createNumberedWards } from "./createGujaratElection.js";

const SURENDRANAGAR_WARDS_2026 = createNumberedWards({
  cityName: "Surendranagar",
  totalWards: 13,
  zone: "North / South Zone",
  officeAddress:
    "Surendranagar Municipal Corporation, Near Collector Office, Tower Road, Surendranagar, Gujarat 363040.",
});

export const SURENDRANAGAR_ELECTION_2026 = createGujaratElection({
  cityName: "Surendranagar",
  body: "Surendranagar Municipal Corporation (SNMC)",
  status: "ward_directory",
  wards: SURENDRANAGAR_WARDS_2026,
  seatsTotal: 52,
  lastUpdated: "2026-04-13T18:45:00+05:30",
  scopeNote:
    "Surendranagar's election desk now reflects the post-nomination phase as of April 13, 2026. Candidate announcements and filed nominations are in motion, while ward-wise candidate names still await verification before publication.",
  sources: [
    {
      label: "Surendranagar Municipal Corporation",
      note: "Official corporation site",
      url: "https://snmcgujarat.com/",
    },
    {
      label: "SNMC demographic profile",
      note: "Official profile confirming 13 administrative wards",
      url: "https://snmcgujarat.com/DemoGraphic_Profile",
    },
    {
      label: "SNMC zones / wards",
      note: "Official north and south zone structure",
      url: "https://snmcgujarat.com/Zones_wards",
    },
  ],
});
