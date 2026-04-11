import { createAwaitingWard, createGujaratElection } from "./createGujaratElection.js";

const MORBI_WARDS_2026 = Array.from({ length: 13 }, (_, index) =>
  createAwaitingWard(
    index + 1,
    `Morvi (M) - Ward No.${index + 1}`,
    "Municipal",
    "Morbi Municipal Corporation, 15 Vasant Plot Main Road, Sardar Nagar, Morbi-363641.",
  ),
);

export const MORBI_ELECTION_2026 = createGujaratElection({
  cityName: "Morbi",
  body: "Morbi Municipal Corporation (MMC)",
  status: "ward_directory",
  wards: MORBI_WARDS_2026,
  seatsTotal: 52,
  lastUpdated: "2026-04-11T13:05:00+05:30",
  scopeNote:
    "Morbi's election desk now includes the official 13-ward corporation structure and election timeline. Ward-wise 2026 candidate names are still awaiting verification before MyCityPulse publishes them.",
  sources: [
    {
      label: "Morbi Municipal Corporation",
      note: "Official MMC site confirming 13 wards and headquarters contact",
      url: "https://mmcgujarat.in/",
    },
    {
      label: "Morbi Municipality wards",
      note: "Ward names used as the pre-corporation baseline for Morbi",
      url: "https://www.civicatlas.in/municipality-morbi-251118",
    },
  ],
});
