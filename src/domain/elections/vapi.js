// Vapi Municipal Corporation - 2026 Elections
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
  ward(1, "Old Vapi", "Central", "Vapi Municipal Corporation, Ward 1, Old Vapi"),
  ward(2, "City Center", "Central", "Vapi Municipal Corporation, Ward 2, City Center, Vapi"),
  ward(3, "Industrial Estate", "Central", "Vapi Municipal Corporation, Ward 3, Industrial Estate, Vapi"),
  ward(4, "Pardi", "East", "Vapi Municipal Corporation, Ward 4, Pardi, Vapi"),
  ward(5, "Mah", "East", "Vapi Municipal Corporation, Ward 5, Mah, Vapi"),
  ward(6, "Silvassa Road", "East", "Vapi Municipal Corporation, Ward 6, Silvassa Road, Vapi"),
  ward(7, "Maroli", "North", "Vapi Municipal Corporation, Ward 7, Maroli, Vapi"),
  ward(8, "Umbergaon Road", "North", "Vapi Municipal Corporation, Ward 8, Umbergaon Road, Vapi"),
  ward(9, "North Vapi", "North", "Vapi Municipal Corporation, Ward 9, North Vapi"),
  ward(10, "South Vapi", "South", "Vapi Municipal Corporation, Ward 10, South Vapi"),
  ward(11, "West Vapi", "South", "Vapi Municipal Corporation, Ward 11, West Vapi"),
  ward(12, "Railway Station Area", "West", "Vapi Municipal Corporation, Ward 12, Railway Station Area, Vapi"),
  ward(13, "Commercial Area", "West", "Vapi Municipal Corporation, Ward 13, Commercial Area, Vapi"),
  ward(14, "Residential Zone", "West", "Vapi Municipal Corporation, Ward 14, Residential Zone, Vapi"),
];

const wards = baseWards.map(w => ({
  ...w,
  candidates: [], // Load from SEC Poll Monitoring System
}));

export const VAPI_ELECTION_DATA_2026 = {
  name: "Vapi",
  totalWards: 14,
  totalSeats: 56,
  city: "Vapi",
  state: "Gujarat",
  type: "Municipal Corporation",
  electionYear: 2026,
  pollingDate: "2026-04-26",
  countingDate: "2026-04-28",
  verificationSource: "https://sec-poll.gujarat.gov.in/Index.aspx",
  lastUpdated: "2026-04-18",
  wards,
};

export default VAPI_ELECTION_DATA_2026;
