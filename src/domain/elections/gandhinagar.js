import { createAwaitingWard, createGujaratElection } from "./createGujaratElection.js";

const GANDHINAGAR_WARDS_2026 = [
  createAwaitingWard(1, "Sector-25, 26 and Randheja", "Zone 2 / North", "Gandhinagar Municipal Corporation, Ward 1 civic desk via Sector 17 headquarters."),
  createAwaitingWard(2, "Pethapur, GEB Colony, Adivada, Charedi", "Zone 2 / North", "Gandhinagar Municipal Corporation, Ward 2 civic desk via Sector 17 headquarters."),
  createAwaitingWard(3, "Sector-24, 27, 28 and GIDC", "Zone 2 / North", "Gandhinagar Municipal Corporation, Ward 3 civic desk via Sector 17 headquarters."),
  createAwaitingWard(4, "Palaj, Dholakuva, Basan, Indroda, Borij", "Zone 2 / North", "Gandhinagar Municipal Corporation, Ward 4 civic desk via Sector 17 headquarters."),
  createAwaitingWard(5, "Sector-9, 10, 18, 19, 20, 21, 22, 23, 29, 30", "Zone 2 / Central", "Gandhinagar Municipal Corporation, Ward 5 civic desk via Sector 17 headquarters."),
  createAwaitingWard(6, "Sector-11 to 17, Fatepura, Gokulpura, Vavol fringe", "Zone 2 / Central", "Gandhinagar Municipal Corporation, Ward 6 civic desk via Sector 17 headquarters."),
  createAwaitingWard(7, "Vavol and Kolvada", "Zone 1 / West", "Gandhinagar Municipal Corporation, Ward 7 civic desk via Sector 17 headquarters."),
  createAwaitingWard(8, "Sector-4, 5, Vasana, Hadmatiya, Sargasan, Por, Ambapur", "Zone 1 / West", "Gandhinagar Municipal Corporation, Ward 8 civic desk via Sector 17 headquarters."),
  createAwaitingWard(9, "Sector-2, 3, Infocity, Kudasan", "Zone 1 / West", "Gandhinagar Municipal Corporation, Ward 9 civic desk via Sector 17 headquarters."),
  createAwaitingWard(10, "Sector-1, 6, 7, 8, Raysan, Randesan, Koba", "Zone 1 / East", "Gandhinagar Municipal Corporation, Ward 10 civic desk via Sector 17 headquarters."),
  createAwaitingWard(11, "Bhat, Koteshwar, Zundal, Khoraj, Nabhoi, Amiyapur, Sughad", "Zone 1 / East", "Gandhinagar Municipal Corporation, Ward 11 civic desk via Sector 17 headquarters."),
];

export const GANDHINAGAR_ELECTION_2026 = createGujaratElection({
  cityName: "Gandhinagar",
  body: "Gandhinagar Municipal Corporation (GMC)",
  status: "ward_directory",
  wards: GANDHINAGAR_WARDS_2026,
  seatsTotal: 44,
  lastUpdated: "2026-04-12T16:20:00+05:30",
  scopeNote:
    "Gandhinagar's election desk now reflects the closed nomination phase as of April 11, 2026. The official ward structure is in place, while ward-wise candidate names still await verification before publication.",
  sources: [
    {
      label: "GMC councillors list",
      note: "Official ward numbers and area labels from the current councillors list",
      url: "https://gandhinagarmunicipal.com/councillors-contact-list/",
    },
    {
      label: "GMC zone / ward contact list",
      note: "Official sanitation and ward-area mapping by zone",
      url: "https://gandhinagarmunicipal.com/zone-ward-wise-contact-list/",
    },
    {
      label: "GMC official website",
      note: "Official corporation site and headquarters contact",
      url: "https://gandhinagarmunicipal.com/",
    },
  ],
});
