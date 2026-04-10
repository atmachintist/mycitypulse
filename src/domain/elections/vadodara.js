const ward = (number, name, zone, officeAddress) => ({
  number,
  name,
  zone,
  officeAddress,
});

const baseWards = [
  ward(1, "Ward 1 (Chhani TP 13)", "North", "Vadodara Municipal Corporation, Office of Ward No.-1, Opp. Ambedkar Nagar, Near Ding Dong Chowkdi, TP 13, Chhani, Vadodara"),
  ward(2, "Ward 2 (Sama)", "North", "Vadodara Municipal Corporation, Office of Ward No.-2, Opp. Ayyappa Ground, Sama, Vadodara"),
  ward(3, "Ward 3 (Fatehgunj)", "North", "Vadodara Municipal Corporation, Office of Ward No.-3, Old Octroi Building, Fatehgunj Main Road, Vadodara"),
  ward(4, "Ward 4 (Harni-Warasiya)", "East", "Vadodara Municipal Corporation, Office of Ward No.-4, Near Sawad Community Hall, Harni-Warasia Road, Near Shweta Park Char Rasta, Vadodara"),
  ward(5, "Ward 5 (Navjivan-Ajwa Road)", "East", "Vadodara Municipal Corporation, Office of Ward No.-5, Near Post Office, Navjivan, Ajwa Road, Vadodara"),
  ward(6, "Ward 6 (Kishanwadi)", "East", "Vadodara Municipal Corporation, Office of Ward No.-6, Gadheda Market Char Rasta to Super Bakery Road, Beside Vegetable Market, Kishanwadi, Vadodara"),
  ward(7, "Ward 7 (Nagarwada)", "North", "Vadodara Municipal Corporation, Office of Ward No.-7, Near Loksatta Press, Opp. Bhathiji Mandir, Bahucharaji Road, Nagarwada Tin Rasta, Vadodara"),
  ward(8, "Ward 8 (Subhanpura)", "West", "Vadodara Municipal Corporation, Office of Ward No.-8, Beside Atithi Gruh, High Tension Line Road, Subhanpura, Vadodara"),
  ward(9, "Ward 9 (Gotri)", "West", "Vadodara Municipal Corporation, Office of Ward No. 9, Behind Gotri Urban Health Centre, Opp. Pursharth Bungalows, Beside Adarsh Duplex, Gotri, Vadodara"),
  ward(10, "Ward 10 (Gotri-Bhayli)", "West", "Vadodara Municipal Corporation, Office of Ward No.-10, Near Nilamber Circle, Opp. Linde Corporate Office, Gotri-Bhayli Road, Vadodara"),
  ward(11, "Ward 11 (Iskcon-Vasna)", "West", "Vadodara Municipal Corporation, Office of Ward No.-11, Opp. New Sindhi Market, Near Maheshwari Society, Iskcon-Vasna Road, Vadodara"),
  ward(12, "Ward 12 (Akota)", "West", "Vadodara Municipal Corporation, Office of Ward No.-12, Near Sahajanand Apartment, Off Old Padra Road, Akota, Vadodara"),
  ward(13, "Ward 13 (Navapura)", "North", "Vadodara Municipal Corporation, Office of Ward No.13, Bagi Khana-Jayratna Building Main Road, Navapura, Vadodara"),
  ward(14, "Ward 14 (Kalupura)", "East", "Vadodara Municipal Corporation, Office of Ward No.-14, Kalupura, Adaniya Bridge Road, Vadodara"),
  ward(15, "Ward 15 (Waghodia Road)", "East", "Vadodara Municipal Corporation, Office of Ward No.-15, Behind Prarambh Complex, Near Mahesh Complex, Waghodia Road, Vadodara"),
  ward(16, "Ward 16 (Gajaravadi)", "South", "Vadodara Municipal Corporation, Office of Ward No.-16, Gajaravadi Main Road, Vadodara"),
  ward(17, "Ward 17 (Pratapnagar)", "South", "Vadodara Municipal Corporation, Office of Ward No.-17, Sindhwai Mata Road, Pratapnagar, Vadodara"),
  ward(18, "Ward 18 (Makarpura GIDC)", "South", "Vadodara Municipal Corporation, Office of Ward No.-18, GIDC Industrial Estate, Makarpura, Vadodara"),
  ward(19, "Ward 19 (Makarpura Village)", "South", "Vadodara Municipal Corporation, Office of Ward No.19, Beside Makarpura Police Station, Makarpura Village, Vadodara"),
];

export const VADODARA_WARDS_2026 = baseWards.map((entry) => ({
  ...entry,
  candidateStatus: "awaiting_verification",
  candidateSummary: "No candidate names have been verified for this ward yet in MyCityPulse.",
  candidates: [],
}));

export const VADODARA_ELECTION_2026 = {
  year: 2026,
  status: "ward_directory",
  lastUpdated: "2026-04-10T18:10:00+05:30",
  election_date: "2026-04-26",
  result_date: "2026-04-28",
  nomination_open: "2026-04-06",
  nomination_close: "2026-04-11",
  scrutiny_date: "2026-04-13",
  withdrawal_date: "2026-04-15",
  wards_total: VADODARA_WARDS_2026.length,
  wards_populated: VADODARA_WARDS_2026.length,
  seats_total: 76,
  polling_hours: "7:00 AM to 6:00 PM",
  candidateTracker: {
    lastReviewed: "2026-04-10",
    officialFinalWards: 0,
    partyAnnouncedWards: 0,
    namedEntries: 0,
    statusNote:
      "MyCityPulse currently shows the full Vadodara ward directory, but ward-wise final candidate names are still awaiting verification here.",
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
  wards: VADODARA_WARDS_2026,
  scopeNote:
    "VMC officially publishes numbered wards, zones, and ward office addresses. The area labels used here are MyCityPulse shorthand based on each ward office location so citizens can identify the right ward more easily.",
  locationNote:
    "DIGIPIN helps anchor your exact location, but MyCityPulse does not yet auto-map DIGIPIN to Vadodara ward boundaries. Save your DIGIPIN, then confirm your Vadodara ward yourself.",
  sources: [
    {
      label: "VMC ward office addresses",
      note: "Official ward numbers, zones, and ward office addresses",
      url: "https://vmc.gov.in/ViewContactWardOffices.aspx",
    },
    {
      label: "VMC elected wing introduction",
      note: "Official confirmation of 19 election wards and 76 councillor seats",
      url: "https://vmc.gov.in/ElectedwingIntroduction.aspx",
    },
    {
      label: "DIGIPIN technical document",
      note: "India Post digital address infrastructure",
      url: "https://www.indiapost.gov.in/Navigation_Documents/Static_Navigation/DIGIPIN%20Technical%20Document%20Final%20English.pdf",
    },
    {
      label: "Gujarat local body poll schedule",
      note: "Schedule reported after the Gujarat SEC announcement",
      url: "https://indianexpress.com/article/cities/ahmedabad/local-body-polls-on-april-26-results-on-april-28-gujarat-state-election-commission-10614279/",
    },
  ],
};
