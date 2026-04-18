import { createAwaitingWard, createGujaratElection } from "./createGujaratElection.js";

const NADIAD_WARDS_2026 = [
  ...Array.from({ length: 12 }, (_, index) =>
    createAwaitingWard(
      index + 1,
      `Nadiad (M) - Ward No.${index + 1}`,
      "Municipal",
      "Nadiad Municipal Corporation headquarters. Confirm the latest ward-office details locally until the new corporation publishes a dedicated ward directory.",
    ),
  ),
  createAwaitingWard(
    13,
    "Kamla (OG) (Part) - Ward No.13",
    "Municipal",
    "Nadiad Municipal Corporation headquarters. Confirm the latest ward-office details locally until the new corporation publishes a dedicated ward directory.",
  ),
];

export const NADIAD_ELECTION_2026 = createGujaratElection({
  cityName: "Nadiad",
  body: "Nadiad Municipal Corporation (NMC)",
  status: "ward_directory",
  wards: NADIAD_WARDS_2026,
  seatsTotal: 52,
  lastUpdated: "2026-04-12T16:20:00+05:30",
  scopeNote:
    "Nadiad's election desk now reflects the closed nomination phase as of April 11, 2026. The inherited municipality ward structure remains the starting point while the new corporation's first ward-wise candidate list is still being verified.",
  sources: [
    {
      label: "Nadiad Municipality wards",
      note: "Ward list used as the pre-corporation baseline for Nadiad's city wards",
      url: "https://www.civicatlas.in/municipality-nadiad-251187",
    },
    {
      label: "Nadiad municipal corporation announcement",
      note: "State government's corporation conversion announcement",
      url: "https://english.gujaratsamachar.com/news/gujarat/nadiad-and-porbandar-chhaya-declared-municipal-corporations-by-gujarat-govt",
    },
  ],
});
