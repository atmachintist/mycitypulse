import { createAwaitingWard, createGujaratElection } from "./createGujaratElection.js";

const PORBANDAR_WARDS_2026 = Array.from({ length: 11 }, (_, index) =>
  createAwaitingWard(
    index + 1,
    `Porbandar (M) - Ward No.${index + 1}`,
    "Municipal",
    "Porbandar-Chhaya Municipal Corporation headquarters, Railway Colony, Bhatia Bazar Old, Porbandar, Gujarat 360575.",
  ),
);

export const PORBANDAR_ELECTION_2026 = createGujaratElection({
  cityName: "Porbandar",
  body: "Porbandar-Chhaya Municipal Corporation (PCMC)",
  status: "ward_directory",
  wards: PORBANDAR_WARDS_2026,
  seatsTotal: 44,
  lastUpdated: "2026-04-11T13:05:00+05:30",
  scopeNote:
    "Porbandar's election desk now includes the inherited Porbandar-Chhaya municipality ward structure used as a citizen-facing starting point. Ward-wise 2026 candidate names are still awaiting verification before MyCityPulse publishes them.",
  sources: [
    {
      label: "Porbandar municipality district page",
      note: "District administration page for Porbandar municipality",
      url: "https://porbandar.nic.in/public-utility/porbandar-municipality/",
    },
    {
      label: "Porbandar-Chhaya municipality wards",
      note: "Ward list used as the pre-corporation baseline for Porbandar-Chhaya",
      url: "https://civicatlas.in/municipality-porbandar-chhaya-251138",
    },
  ],
});
