const ward = (number, name, zone, officeAddress) => ({
  number,
  name,
  zone,
  officeAddress,
});

const officeLookup = (zoneLabel) =>
  `Surat Municipal Corporation election ward. Public local-office lookup: use the SMC ${zoneLabel} ward-office directory linked in Sources for the nearest ward office contact.`;

const baseWards = [
  ward(1, "Jahagirpura-Variyav-Chhaprabhatha-Kosad", "West / North", officeLookup("West Zone")),
  ward(2, "Amroli-Mota Varachha-Kathor", "North", officeLookup("North Zone")),
  ward(3, "Varachha-Sarthana-Simada-Laskana", "North / East A", officeLookup("North Zone")),
  ward(4, "Kapodra", "East A", officeLookup("East Zone A")),
  ward(5, "Fulpada-Aswanikumar", "East A", officeLookup("East Zone A")),
  ward(6, "Katargam", "East B", officeLookup("East Zone B")),
  ward(7, "Katargam-Ved", "East B", officeLookup("East Zone B")),
  ward(8, "Dabholi-Siganpor", "East B", officeLookup("East Zone B")),
  ward(9, "Rander-Jahagirabad-Palanpur", "West", officeLookup("West Zone")),
  ward(10, "Adajan-Pal-Ichhapor", "West", officeLookup("West Zone")),
  ward(11, "Adajan-Gorat", "West", officeLookup("West Zone")),
  ward(12, "Nanavat-Saiyadpura-KuberNagar-Mahidharpura", "Central", officeLookup("Central Zone")),
  ward(13, "Wadifaliya-Navapura-Begampura-Salabatpura", "Central", officeLookup("Central Zone")),
  ward(14, "Umarwada-Matawadi", "East A / South East", officeLookup("East Zone A")),
  ward(15, "Karanj-Magob", "East A / South East", officeLookup("East Zone A")),
  ward(16, "Puna (West)", "East A", officeLookup("East Zone A")),
  ward(17, "Puna (East)", "East A", officeLookup("East Zone A")),
  ward(18, "Limbayat-Parvat-Kumbhariya", "South East", officeLookup("South East Zone")),
  ward(19, "Anjana-Dumbhal", "South East", officeLookup("South East Zone")),
  ward(20, "Khatodara-Majura-Sagrampura", "South West / Central", officeLookup("South West Zone")),
  ward(21, "Sonifaliya-Nanpura-Athwa-Piplod", "Central / South West", officeLookup("Central Zone")),
  ward(22, "Bhatar-Vesu-Dumas", "South West", officeLookup("South West Zone")),
  ward(23, "Bamroli-Udhana (North)", "South A", officeLookup("South Zone A")),
  ward(24, "Udhana (South)", "South A", officeLookup("South Zone A")),
  ward(25, "Limbayat-Udhana Yard", "South East / South A", officeLookup("South East Zone")),
  ward(26, "Godadra-Dindoli (North)", "South B", officeLookup("South Zone B")),
  ward(27, "Dindoli (South)", "South B", officeLookup("South Zone B")),
  ward(28, "Pandesara-Bhestan", "South B", officeLookup("South Zone B")),
  ward(29, "Althan-Bamroli-Vadod", "South West / South A", officeLookup("South West Zone")),
  ward(30, "Kansad-Sachin-Unn-Abhava", "South B", officeLookup("South Zone B")),
];

export const SURAT_WARDS_2026 = baseWards.map((entry) => ({
  ...entry,
  candidateStatus: "awaiting_verification",
  candidateSummary: "No candidate names have been verified for this ward yet in MyCityPulse.",
  candidates: [],
}));

export const SURAT_ELECTION_2026 = {
  year: 2026,
  status: "ward_directory",
  lastUpdated: "2026-04-10T18:20:00+05:30",
  election_date: "2026-04-26",
  result_date: "2026-04-28",
  nomination_open: "2026-04-06",
  nomination_close: "2026-04-11",
  scrutiny_date: "2026-04-13",
  withdrawal_date: "2026-04-15",
  wards_total: SURAT_WARDS_2026.length,
  wards_populated: SURAT_WARDS_2026.length,
  seats_total: 120,
  polling_hours: "7:00 AM to 6:00 PM",
  candidateTracker: {
    lastReviewed: "2026-04-10",
    officialFinalWards: 0,
    partyAnnouncedWards: 0,
    namedEntries: 0,
    statusNote:
      "MyCityPulse currently shows the full Surat election-ward directory, but ward-wise final candidate names are still awaiting verification here.",
    legend: [
      { key: "official_final", label: "Official final list", tone: "verified" },
      { key: "party_announced", label: "Party-announced", tone: "partial" },
      { key: "awaiting_verification", label: "Awaiting verification", tone: "pending" },
    ],
  },
  timeline: [
    { date: "2026-04-06", label: "Nomination opens", icon: "\uD83D\uDCDD" },
    { date: "2026-04-11", label: "Nomination closes", icon: "\uD83D\uDD12", urgent: true },
    { date: "2026-04-13", label: "Scrutiny", icon: "\u2713" },
    { date: "2026-04-15", label: "Withdrawal deadline", icon: "\uD83D\uDCCB" },
    { date: "2026-04-26", label: "Election day", icon: "\uD83D\uDDF3\uFE0F" },
    { date: "2026-04-28", label: "Counting and results", icon: "\uD83D\uDCCA" },
  ],
  wards: SURAT_WARDS_2026,
  scopeNote:
    "Ward names and seat count come from SMC's official election-ward allotment page. SMC's public ward-office directory is published separately by zone, so the office line here is a transparent lookup route rather than a claimed one-to-one election-ward office map.",
  locationNote:
    "DIGIPIN helps anchor your exact location, but MyCityPulse does not yet auto-map DIGIPIN to Surat election-ward boundaries. Save your DIGIPIN, then confirm your Surat ward yourself.",
  sources: [
    {
      label: "SMC wardwise allotment of seats",
      note: "Official Surat election ward names, ward count, seat count, and reservation matrix",
      url: "https://www.suratmunicipal.gov.in/Departments/ElectionCensus/ElectionCensusWardwiseAllotmentSeats",
    },
    {
      label: "SMC wards directory",
      note: "Official public ward-office directory published zone by zone",
      url: "https://www.suratmunicipal.gov.in/Zones/Wards?ZoneId=NifrTxTpQi0Mc8IGmRI02w%3D%3D",
    },
    {
      label: "SMC election home",
      note: "Official summary confirming 30 wards and 120 councillors",
      url: "https://www.suratmunicipal.gov.in/Departments/ElectionCensus/ElectionCensusHome",
    },
    {
      label: "DIGIPIN technical document",
      note: "India Post digital address infrastructure",
      url: "https://www.indiapost.gov.in/Navigation_Documents/Static_Navigation/DIGIPIN%20Technical%20Document%20Final%20English.pdf",
    },
    {
      label: "Gujarat local body poll schedule",
      note: "Indian Express report after the Gujarat SEC announcement",
      url: "https://indianexpress.com/article/cities/ahmedabad/local-body-polls-on-april-26-results-on-april-28-gujarat-state-election-commission-10614279/",
    },
  ],
};
