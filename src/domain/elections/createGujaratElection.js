const COMMON_TIMELINE = [
  { date: "2026-04-06", label: "Nomination opens", icon: "\uD83D\uDCDD" },
  { date: "2026-04-11", label: "Nomination closes", icon: "\uD83D\uDD12", urgent: true },
  { date: "2026-04-13", label: "Scrutiny", icon: "\u2713" },
  { date: "2026-04-15", label: "Withdrawal deadline", icon: "\uD83D\uDCCB" },
  { date: "2026-04-26", label: "Election day", icon: "\uD83D\uDDF3\uFE0F" },
  { date: "2026-04-28", label: "Counting and results", icon: "\uD83D\uDCCA" },
];

export function createAwaitingWard(number, name, zone, officeAddress) {
  return {
    number,
    name,
    zone,
    officeAddress,
    candidateStatus: "awaiting_verification",
    candidateSummary: "No candidate names have been verified for this ward yet in MyCityPulse.",
    candidates: [],
  };
}

export function createNumberedWards({
  cityName,
  totalWards,
  zone = "Municipal",
  officeAddress,
  wardNamePrefix = "Ward",
}) {
  return Array.from({ length: totalWards }, (_, index) =>
    createAwaitingWard(
      index + 1,
      `${wardNamePrefix} ${index + 1}`,
      zone,
      officeAddress ||
        `${cityName} municipal election ward. Use the city corporation helpline or headquarters listed in Sources to confirm the latest ward office details.`,
    ),
  );
}

export function createGujaratElection({
  cityName,
  body,
  lastUpdated,
  scopeNote,
  locationNote,
  status = "candidate_updates",
  wards = [],
  seatsTotal = 0,
  sources = [],
}) {
  return {
    year: 2026,
    status,
    lastUpdated,
    election_date: "2026-04-26",
    result_date: "2026-04-28",
    nomination_open: "2026-04-06",
    nomination_close: "2026-04-11",
    scrutiny_date: "2026-04-13",
    withdrawal_date: "2026-04-15",
    wards_total: wards.length,
    wards_populated: wards.length,
    seats_total: seatsTotal,
    polling_hours: "7:00 AM to 6:00 PM",
    candidateTracker: {
      lastReviewed: lastUpdated.slice(0, 10),
      officialFinalWards: 0,
      partyAnnouncedWards: 0,
      namedEntries: 0,
      statusNote:
        `Party candidates are already being announced and nomination papers have been filed for ${cityName}, but MyCityPulse is still verifying the ward-to-candidate mapping before publishing names here.`,
      legend: [
        { key: "official_final", label: "Official final list", tone: "verified" },
        { key: "party_announced", label: "Party-announced", tone: "partial" },
        { key: "awaiting_verification", label: "Awaiting verification", tone: "pending" },
      ],
    },
    timeline: COMMON_TIMELINE,
    wards,
    scopeNote,
    locationNote:
      locationNote ||
      `DIGIPIN helps anchor your exact location, but MyCityPulse does not yet auto-map DIGIPIN to ${cityName} ward boundaries. Save your DIGIPIN, then confirm your ${cityName} ward yourself once the official ward directory is published here.`,
    sources: [
      {
        label: "Gujarat local body poll schedule",
        note: "State Election Commission announcement reported by Indian Express",
        url: "https://indianexpress.com/article/cities/ahmedabad/local-body-polls-on-april-26-results-on-april-28-gujarat-state-election-commission-10614279/",
      },
      {
        label: "Gujarat civic poll nominations filed",
        note: "TOI report after nominations closed on April 12, 2026",
        url: "https://timesofindia.indiatimes.com/city/ahmedabad/gujarat-local-body-elections-32748-nominations-filed-for-9992-seats/articleshow/130198393.cms",
      },
      {
        label: "DIGIPIN technical document",
        note: "India Post digital address infrastructure",
        url: "https://www.indiapost.gov.in/Navigation_Documents/Static_Navigation/DIGIPIN%20Technical%20Document%20Final%20English.pdf",
      },
      ...sources,
    ],
    body,
  };
}
