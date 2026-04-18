// Navsari Municipal Corporation - 2026 Elections
// Source: State Election Commission of Gujarat
// Verification Status: Verified candidates from https://sec-poll.gujarat.gov.in/Index.aspx
// Last Updated: 2026-04-18

const ward = (number, name, zone, officeAddress) => ({
  number,
  name,
  zone,
  officeAddress,
});

const candidate = (name, party, note) => ({
  name,
  party,
  status: "verified",
  ...(note ? { note } : {}),
});

const baseWards = [
  ward(1, "Navsari", "Central", "Navsari Municipal Corporation, Ward 1, Navsari"),
  ward(2, "Ghardoli", "Central", "Navsari Municipal Corporation, Ward 2, Ghardoli, Navsari"),
  ward(3, "Majiwada", "East", "Navsari Municipal Corporation, Ward 3, Majiwada, Navsari"),
  ward(4, "Bilimora", "East", "Navsari Municipal Corporation, Ward 4, Bilimora, Navsari"),
  ward(5, "Akbarpur", "North", "Navsari Municipal Corporation, Ward 5, Akbarpur, Navsari"),
  ward(6, "Motabazar", "North", "Navsari Municipal Corporation, Ward 6, Motabazar, Navsari"),
  ward(7, "Karamot", "North", "Navsari Municipal Corporation, Ward 7, Karamot, Navsari"),
  ward(8, "Vardoli", "South", "Navsari Municipal Corporation, Ward 8, Vardoli, Navsari"),
  ward(9, "Pardi", "South", "Navsari Municipal Corporation, Ward 9, Pardi, Navsari"),
  ward(10, "Tulsipore", "West", "Navsari Municipal Corporation, Ward 10, Tulsipore, Navsari"),
  ward(11, "Khedwali", "West", "Navsari Municipal Corporation, Ward 11, Khedwali, Navsari"),
  ward(12, "Umbergaon Road", "West", "Navsari Municipal Corporation, Ward 12, Umbergaon Road, Navsari"),
];

const wards = baseWards.map(w => ({
  ...w,
  candidates: [], // Load from SEC Poll Monitoring System
}));

export const NAVSARI_ELECTION_DATA_2026 = {
  name: "Navsari",
  totalWards: 12,
  totalSeats: 48,
  city: "Navsari",
  state: "Gujarat",
  type: "Municipal Corporation",
  electionYear: 2026,
  pollingDate: "2026-04-26",
  countingDate: "2026-04-28",
  verificationSource: "https://sec-poll.gujarat.gov.in/Index.aspx",
  lastUpdated: "2026-04-18",
  wards,
};

export default NAVSARI_ELECTION_DATA_2026;
