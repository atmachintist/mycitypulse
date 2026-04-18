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
  lastUpdated: "2026-04-13T18:45:00+05:30",
  scopeNote:
    "Junagadh's election desk now reflects the post-nomination phase as of April 13, 2026. Candidate announcements and filed nominations are in motion, while ward-wise candidate names still await verification before publication.",
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
