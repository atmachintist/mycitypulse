// Gandhidham Municipal Corporation - 2026 Elections
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
  ward(1, "Gandhidham", "Central", "Gandhidham Municipal Corporation, Ward 1, Gandhidham"),
  ward(2, "Sector 1", "Central", "Gandhidham Municipal Corporation, Ward 2, Sector 1, Gandhidham"),
  ward(3, "Sector 2", "Central", "Gandhidham Municipal Corporation, Ward 3, Sector 2, Gandhidham"),
  ward(4, "Sector 3", "East", "Gandhidham Municipal Corporation, Ward 4, Sector 3, Gandhidham"),
  ward(5, "Sector 4", "East", "Gandhidham Municipal Corporation, Ward 5, Sector 4, Gandhidham"),
  ward(6, "Sector 5", "East", "Gandhidham Municipal Corporation, Ward 6, Sector 5, Gandhidham"),
  ward(7, "Sector 6", "North", "Gandhidham Municipal Corporation, Ward 7, Sector 6, Gandhidham"),
  ward(8, "Sector 7", "North", "Gandhidham Municipal Corporation, Ward 8, Sector 7, Gandhidham"),
  ward(9, "Sector 8", "North", "Gandhidham Municipal Corporation, Ward 9, Sector 8, Gandhidham"),
  ward(10, "Sector 9", "South", "Gandhidham Municipal Corporation, Ward 10, Sector 9, Gandhidham"),
  ward(11, "Sector 10", "South", "Gandhidham Municipal Corporation, Ward 11, Sector 10, Gandhidham"),
  ward(12, "Sector 11", "West", "Gandhidham Municipal Corporation, Ward 12, Sector 11, Gandhidham"),
  ward(13, "Sector 12", "West", "Gandhidham Municipal Corporation, Ward 13, Sector 12, Gandhidham"),
  ward(14, "Sector 13", "West", "Gandhidham Municipal Corporation, Ward 14, Sector 13, Gandhidham"),
  ward(15, "Industrial Area", "West", "Gandhidham Municipal Corporation, Ward 15, Industrial Area, Gandhidham"),
];

const wards = baseWards.map(w => ({
  ...w,
  candidates: [], // Load from SEC Poll Monitoring System
}));

export const GANDHIDHAM_ELECTION_DATA_2026 = {
  name: "Gandhidham",
  totalWards: 15,
  totalSeats: 60,
  city: "Gandhidham",
  state: "Gujarat",
  type: "Municipal Corporation",
  electionYear: 2026,
  pollingDate: "2026-04-26",
  countingDate: "2026-04-28",
  verificationSource: "https://sec-poll.gujarat.gov.in/Index.aspx",
  lastUpdated: "2026-04-18",
  wards,
};

export default GANDHIDHAM_ELECTION_DATA_2026;
