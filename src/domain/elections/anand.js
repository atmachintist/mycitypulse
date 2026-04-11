import { createAwaitingWard, createGujaratElection } from "./createGujaratElection.js";

const ANAND_WARDS_2026 = [
  ...Array.from({ length: 12 }, (_, index) =>
    createAwaitingWard(
      index + 1,
      `Anand (M) - Ward No.${index + 1}`,
      "Municipal",
      "Karamsad Anand Municipal Corporation, Railway Station Road, Gamdivad, Sardar Gunj, Anand.",
    ),
  ),
  createAwaitingWard(
    13,
    "Anand (M) - Ward No.13",
    "Municipal",
    "Karamsad Anand Municipal Corporation, Railway Station Road, Gamdivad, Sardar Gunj, Anand.",
  ),
];

export const ANAND_ELECTION_2026 = createGujaratElection({
  cityName: "Anand",
  body: "Karamsad Anand Municipal Corporation (KAMC)",
  status: "ward_directory",
  wards: ANAND_WARDS_2026,
  seatsTotal: 52,
  lastUpdated: "2026-04-11T13:05:00+05:30",
  scopeNote:
    "Anand's election desk now includes the inherited municipality ward structure used as a citizen-facing starting point while the new corporation's first ward-wise candidate list is still being verified.",
  sources: [
    {
      label: "Karamsad Anand Municipal Corporation",
      note: "Official corporation site and headquarters contact",
      url: "https://www.anandmunicipal.com/",
    },
    {
      label: "Anand Municipality wards",
      note: "Ward list used as the pre-corporation baseline for Anand's city wards",
      url: "https://www.civicatlas.in/municipality-anand-251174",
    },
  ],
});
