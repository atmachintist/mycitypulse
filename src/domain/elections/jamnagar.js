import { createGujaratElection, createNumberedWards } from "./createGujaratElection.js";

const JAMNAGAR_WARDS_2026 = createNumberedWards({
  cityName: "Jamnagar",
  totalWards: 16,
  zone: "Municipal",
  officeAddress:
    "Jamnagar Municipal Corporation, Jubilee Garden, Jamnagar. Ward-level civic confirmation can also be checked against the JMC corporator pages.",
});

export const JAMNAGAR_ELECTION_2026 = createGujaratElection({
  cityName: "Jamnagar",
  body: "Jamnagar Municipal Corporation (JMC)",
  status: "ward_directory",
  wards: JAMNAGAR_WARDS_2026,
  seatsTotal: 64,
  lastUpdated: "2026-04-13T18:45:00+05:30",
  scopeNote:
    "Jamnagar's election desk now reflects the post-nomination phase as of April 13, 2026. Candidate announcements and filed nominations are in motion, but ward-wise candidate names are still being verified before MyCityPulse attaches names to specific wards.",
  sources: [
    {
      label: "Jamnagar Municipal Corporation member pages",
      note: "Official JMC corporator pages confirming ward-number structure",
      url: "https://www.mcjamnagar.com/Corporation/Memberd.aspx?MyId=64&SID=CORP&TBL=edXa1jhKhyh785HG",
    },
    {
      label: "Jamnagar Municipal Corporation",
      note: "Official JMC site and contact details",
      url: "https://www.mcjamnagar.com/",
    },
  ],
});
