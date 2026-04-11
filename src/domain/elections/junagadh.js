import { createGujaratElection, createNumberedWards } from "./createGujaratElection.js";

const JUNAGADH_WARDS_2026 = createNumberedWards({
  cityName: "Junagadh",
  totalWards: 20,
  zone: "Municipal",
  officeAddress:
    "Junagadh Municipal Corporation headquarters. Confirm current ward-office details through the JMC official site before visiting.",
});

export const JUNAGADH_ELECTION_2026 = createGujaratElection({
  cityName: "Junagadh",
  body: "Junagadh Municipal Corporation (JMC)",
  status: "ward_directory",
  wards: JUNAGADH_WARDS_2026,
  seatsTotal: 60,
  lastUpdated: "2026-04-11T13:05:00+05:30",
  scopeNote:
    "Junagadh's election desk now carries the official ward count and election timeline. Ward-wise 2026 candidate names are still awaiting verification before MyCityPulse publishes them.",
  sources: [
    {
      label: "Junagadh Municipal Corporation introduction",
      note: "Official JMC overview confirming 20 wards and 60 councillors",
      url: "https://junagadhmunicipal.org/introduction/",
    },
    {
      label: "Junagadh Municipal Corporation",
      note: "Official JMC home page",
      url: "https://junagadhmunicipal.org/",
    },
  ],
});
