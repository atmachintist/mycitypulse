import { createGujaratElection, createNumberedWards } from "./createGujaratElection.js";

const MEHSANA_WARDS_2026 = createNumberedWards({
  cityName: "Mehsana",
  totalWards: 11,
  zone: "Municipal",
  officeAddress:
    "Mahesana Municipal Corporation headquarters. Confirm the latest ward-office details through the official MMC help desk before visiting.",
});

export const MEHSANA_ELECTION_2026 = createGujaratElection({
  cityName: "Mehsana",
  body: "Mahesana Municipal Corporation (MMC)",
  status: "ward_directory",
  wards: MEHSANA_WARDS_2026,
  seatsTotal: 44,
  lastUpdated: "2026-04-11T13:05:00+05:30",
  scopeNote:
    "Mehsana's election desk now includes the corporation-wide ward count and election timeline. Ward-wise 2026 candidate names are still awaiting verification before MyCityPulse publishes them.",
  sources: [
    {
      label: "Mahesana Municipal Corporation",
      note: "Official corporation site confirming 11 wards",
      url: "https://mahesanacity.in/",
    },
  ],
});
