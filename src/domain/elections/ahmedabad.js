const ward = (number, name, zone, officeAddress) => ({
  number,
  name,
  zone,
  officeAddress,
});

const baseWards = [
  ward(1, "Shahpur", "Central", "Ahmedabad Municipal Corporation, Shahpur Ward Office, Bapu Smruti Kunj, Near Shahpur Darwaja, Ahmedabad"),
  ward(2, "Dariapur", "Central", "Ahmedabad Municipal Corporation, Dariapur Ward Office, Near Kuti Masjid, Near Rupapari Ni Pol, Dariapur Darwaja, Ahmedabad"),
  ward(3, "Jamalpur", "Central", "Ahmedabad Municipal Corporation, Jamalpur Sub Zonal Office, J.P. Store, Opp. AMTS Staff Quarters, Jamalpur, Ahmedabad"),
  ward(4, "Khadia", "Central", "Ahmedabad Municipal Corporation, Khadia Ward Office, Near Panch Kuva Darwaja, Khadia, Ahmedabad"),
  ward(5, "Asarva", "Central", "Ahmedabad Municipal Corporation, Asarva Ward Office, Haripura Municipal Dispensary Compound, Asarva, Ahmedabad"),
  ward(6, "Shahibaug", "Central", "Ahmedabad Municipal Corporation, Girdharnagar Ward Office, Behind Kirti Apartment, Near Pritampura Municipal School No. 3-4, Kanjinagar Cross Road, Shahibaug, Ahmedabad"),
  ward(7, "Gomtipur", "East", "Ahmedabad Municipal Corporation, Gomtipur Ward Office, Near Gomtipur Referral Hospital, Municipal Bal Bhavan, Opp. Gomtipur Darwaja, Ahmedabad"),
  ward(8, "Odhav", "East", "Ahmedabad Municipal Corporation, Odhav Ward Office, Near Rabari Vasahat, Beside Odhav Fire Station, Odhav, Ahmedabad"),
  ward(9, "Vastral", "East", "Ahmedabad Municipal Corporation, Vastral Ward Office, Beside Ajay Tenament Part 5 Third Gate, Old Nagarpalika Office, Near Nani Canal, Vastral Road, Mahadev Nagar, Ahmedabad 382415"),
  ward(10, "Bhaipura Hatkeshwar", "East", "Ahmedabad Municipal Corporation, Bhaipura-Hatkeshwar Ward Office, Opp. Ishwarkrupa Duplex, Near Nutan School, Haripura, Maninagar East, Ahmedabad"),
  ward(11, "Amraiwadi", "East", "Ahmedabad Municipal Corporation, Amraiwadi Sub Zonal Office, Near Mathur Master Cross Road, 132 Foot Ring Road, Amraiwadi, Ahmedabad"),
  ward(12, "Ramol Hathijan", "East", "Ahmedabad Municipal Corporation, Ramol-Hathijan Ward Office, Inside Ramol Gam, Ramol, Ahmedabad"),
  ward(13, "Nikol", "East", "Ahmedabad Municipal Corporation, Nikol Ward Office, Near Parshwanath Township Circle, Near Shivam School, Parshwanath Township Part 1, Nava Naroda, Ahmedabad"),
  ward(14, "Virat Nagar", "East", "Ahmedabad Municipal Corporation, Viratnagar Ward Office, Opp. Lilanagar Smashan Gruh, Lilanagar, Ahmedabad"),
  ward(15, "Bapu Nagar", "North", "Ahmedabad Municipal Corporation, Bapunagar Sub Zonal Office, Beside Urban Health Center, Margha Farm Road, Near Viratnagar Cross Road, Bapunagar, Ahmedabad"),
  ward(16, "India Colony", "North", "Ahmedabad Municipal Corporation, India Colony Ward Office, Opp. Chandraprasad Desai Hall, Bapunagar, Ahmedabad"),
  ward(17, "Thakkarbapa Nagar", "North", "Ahmedabad Municipal Corporation, Thakkarbapanagar Ward Office, Kevadia Ni Chali, Opp. Bajrang Ashram, National Highway No. 8, Thakkarbapanagar, Ahmedabad"),
  ward(18, "Saraspur", "North", "Ahmedabad Municipal Corporation, Saraspur Municipal Bal Bhavan, Near Maniben K. K. Eye Hospital, Saraspur, Ahmedabad 380018"),
  ward(19, "Sardar Nagar", "North", "Ahmedabad Municipal Corporation, Sardar Nagar Library Bhavan, Beside Sardar Nagar Police Station, Sardar Nagar, Ahmedabad"),
  ward(20, "Naroda", "North", "Ahmedabad Municipal Corporation, Naroda Ward Office, Old Panchayat Office, Near Fountain, Naroda, Ahmedabad"),
  ward(21, "Kuber Nagar", "North", "Ahmedabad Municipal Corporation, Kubernagar Sub Zonal Office, Near C Ward Water Tank, Opp. Sardargram Railway Station, Ahmedabad"),
  ward(22, "Saijpur Bogha", "North", "Ahmedabad Municipal Corporation, Saijpur Ward Office, Opp. Saijpur Tower, Saijpur, Ahmedabad"),
  ward(23, "Gota", "North West", "Ahmedabad Municipal Corporation, Gota Ward Office, 1st Floor, Urban Health Centre Building, Oganaj Gam, Gota, Ahmedabad"),
  ward(24, "Chandlodiya", "North West", "Ahmedabad Municipal Corporation, Near Chandlodiya Over Bridge, Near Chandlodiya Primary School, Chandlodiya, Ahmedabad"),
  ward(25, "Ghatlodiya", "North West", "Ahmedabad Municipal Corporation, Ghatlodiya Ward Office, Under Chanakya Bridge, Near Prabhat Chowk, Ghatlodiya, Ahmedabad"),
  ward(26, "Thaltej", "North West", "Ahmedabad Municipal Corporation, Thaltej Ward Office, Opposite Thakorvas Bus Stand, Near Thaltej Cross Road, S.G. Highway, Ahmedabad"),
  ward(27, "Bodakdev", "North West", "Ahmedabad Municipal Corporation, Bodakdev Ward Office, Old Memnagar Nagarpalika Office, Memnagar Gam, Ahmedabad"),
  ward(28, "Behrampura", "South", "Ahmedabad Municipal Corporation, Behrampura Ward Office, Near Ramdevnagar Cross Road, Beside Torrent Power Sub Station, Behrampura, Ahmedabad"),
  ward(29, "Indrapuri", "South", "Ahmedabad Municipal Corporation, Indrapuri Ward Office, Near Express Highway, Near Swaminarayan Nagar, Ahmedabad"),
  ward(30, "Khokhra", "South", "Ahmedabad Municipal Corporation, Khokhra Ward Office, Near Municipal Swimming Pool, Opp. Trimurti Flat, Khokhra, Ahmedabad"),
  ward(31, "Maninagar", "South", "Ahmedabad Municipal Corporation, Maninagar Ward Office, Behind Sindhi Market, Opp. Maninagar Railway Station, Ahmedabad"),
  ward(32, "Danilimda", "South", "Ahmedabad Municipal Corporation, Danilimda Ward Office, Opp. Vaikunthdham Mandir, Near Mangal Vikas Cross Road, Danilimda, Ahmedabad"),
  ward(33, "Lambha", "South", "Ahmedabad Municipal Corporation, Lambha Sub Zonal Office, Narol Aslali Highway, Near Freeway Trade Centre, Final Plot No. 56, Narol Gam, Ahmedabad"),
  ward(34, "Isanpur", "South", "Ahmedabad Municipal Corporation, Isanpur Ward Office, Isanpur Water Distribution Center, Ramwadi, Isanpur, Ahmedabad"),
  ward(35, "Vatva", "South", "Ahmedabad Municipal Corporation, Vatva Ward Office, Deria, Near Kashiba Hospital, Vatva Gam, Vatva, Ahmedabad"),
  ward(36, "Sarkhej", "South West", "Sarkhej Ward Office, Old Nagarpalika Office, Near Water Tank, Sarkhej Gam, Ahmedabad"),
  ward(37, "Jodhpur", "South West", "Jodhpur Ward Office, Near New Star Bazar, Beside Vandan Party Plot, Jodhpur, Ahmedabad"),
  ward(38, "Vejalpur", "South West", "Vejalpur City Civic Center, Beside Venus, Butbhawani Mandir Road, Vejalpur, Ahmedabad"),
  ward(39, "Maktampura", "South West", "Maktampura Ward Office, Near APMC Market, Maktampura, Ahmedabad"),
  ward(40, "Ranip", "West", "Ahmedabad Municipal Corporation, Near Chandlodiya Over Bridge, Near Chandlodiya Primary School, Chandlodiya, Ahmedabad"),
  ward(41, "Chandkheda Motera", "West", "Ahmedabad Municipal Corporation, Chandkheda Nagarpalika, Old Nagarpalika Office, Chandkheda Gam, Ahmedabad"),
  ward(42, "Sabarmati", "West", "Ahmedabad Municipal Corporation, Sabarmati Sub Zonal Office, Opp. Power House, Sabarmati, Ahmedabad"),
  ward(43, "Naranpura", "West", "Ahmedabad Municipal Corporation, Naranpura Ward Office, Near Kameshwar Mahadev Mandir, Naranpura, Ahmedabad"),
  ward(44, "Nava Vadaj", "West", "Ahmedabad Municipal Corporation, Nava Vadaj Sub Zonal Office, Purshottam Nagar, Opp. Parth Tower, Nava Vadaj, Ahmedabad"),
  ward(45, "SP Stadium", "West", "Ahmedabad Municipal Corporation, Sardar Patel Stadium Ward Office, Near Naranpura Crossing, Near Panchsheel Society, Naranpura, Ahmedabad"),
  ward(46, "Navrangpura", "West", "Ahmedabad Municipal Corporation, Navrangpura Sub Zonal Office, Near Navrangpura AMTS Bus Stop, Navrangpura, Ahmedabad"),
  ward(47, "Paldi", "West", "Ahmedabad Municipal Corporation, Paldi Sub Zonal Office, Beside Paldi Bus Stand, Paldi Cross Road, Ahmedabad"),
  ward(48, "Vasna", "West", "Ahmedabad Municipal Corporation, Vasna Sub Zonal Office, Near Swaminarayan Mandir, Opp. Divine School, Vasna, Ahmedabad"),
];

const candidateInfoByWard = {
  2: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress has announced a candidate here and re-nominated Nirav Baxi.",
    candidates: [
      {
        name: "Nirav Baxi",
        party: "INC",
        status: "party_announced",
      },
    ],
  },
  4: {
    candidateStatus: "party_announced",
    candidateSummary: "Ahmedabad Mirror reported that Congress announced candidates in Khadia, but MyCityPulse has not yet verified all names.",
    candidates: [],
  },
  6: {
    candidateStatus: "party_announced",
    candidateSummary: "Ahmedabad Mirror reported that Congress announced candidates in Shahibaug, but names are still being verified here.",
    candidates: [],
  },
  8: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress has announced candidates in Odhav, but MyCityPulse has not yet verified individual names.",
    candidates: [],
  },
  9: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress has announced candidates in Vastral, but names are still being verified here.",
    candidates: [],
  },
  10: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress has announced candidates in Bhaipura Hatkeshwar, but MyCityPulse has not yet verified individual names.",
    candidates: [],
  },
  11: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress has announced a candidate here and re-nominated Jagdish Rathod.",
    candidates: [
      {
        name: "Jagdish Rathod",
        party: "INC",
        status: "party_announced",
      },
    ],
  },
  12: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress has announced candidates in Ramol Hathijan, but MyCityPulse has not yet verified individual names.",
    candidates: [],
  },
  16: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress has announced candidates in India Colony, but names are still being verified here.",
    candidates: [],
  },
  17: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress has announced candidates in Thakkarbapa Nagar, but MyCityPulse has not yet verified individual names.",
    candidates: [],
  },
  19: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress has announced candidates in Sardar Nagar, but names are still being verified here.",
    candidates: [],
  },
  20: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress has announced candidates in Naroda, but MyCityPulse has not yet verified individual names.",
    candidates: [],
  },
  23: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress has announced candidates in Gota, but names are still being verified here.",
    candidates: [],
  },
  24: {
    candidateStatus: "party_announced",
    candidateSummary: "Ahmedabad Mirror reported that Congress announced candidates in Chandlodiya, but MyCityPulse has not yet verified all names.",
    candidates: [],
  },
  25: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress has announced candidates in Ghatlodiya, but names are still being verified here.",
    candidates: [],
  },
  26: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress has announced candidates in Thaltej, but MyCityPulse has not yet verified individual names.",
    candidates: [],
  },
  27: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress has announced candidates in Bodakdev, but names are still being verified here.",
    candidates: [],
  },
  29: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress has announced candidates in Indrapuri, but MyCityPulse has not yet verified individual names.",
    candidates: [],
  },
  31: {
    candidateStatus: "party_announced",
    candidateSummary: "Ahmedabad Mirror reported that Congress announced candidates in Maninagar, but MyCityPulse has not yet verified all names.",
    candidates: [],
  },
  32: {
    candidateStatus: "party_announced",
    candidateSummary:
      "Congress re-nominated Shehzad Khan Pathan. Older reporting identifies him as the Danilimda corporator, so this entry is a best-effort carryover rather than an official final list.",
    candidates: [
      {
        name: "Shehzad Khan Pathan",
        party: "INC",
        status: "party_announced",
        note: "Seat attribution carried forward from prior Danilimda reporting.",
      },
    ],
  },
  35: {
    candidateStatus: "party_announced",
    candidateSummary: "Ahmedabad Mirror reported that Congress announced candidates in Vatva, but MyCityPulse has not yet verified all names.",
    candidates: [],
  },
  40: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress has announced candidates in Ranip, but names are still being verified here.",
    candidates: [],
  },
  41: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress has announced a candidate here and re-nominated Rajshree Kesari.",
    candidates: [
      {
        name: "Rajshree Kesari",
        party: "INC",
        status: "party_announced",
      },
    ],
  },
  42: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress has announced candidates in Sabarmati, but MyCityPulse has not yet verified individual names.",
    candidates: [],
  },
  43: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress has announced candidates in Naranpura, but names are still being verified here.",
    candidates: [],
  },
  44: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress has announced candidates in Nava Vadaj, but MyCityPulse has not yet verified individual names.",
    candidates: [],
  },
  46: {
    candidateStatus: "party_announced",
    candidateSummary: "Ahmedabad Mirror reported that Congress announced candidates in Navrangpura, but MyCityPulse has not yet verified all names.",
    candidates: [],
  },
  47: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress has announced candidates in Paldi, but names are still being verified here.",
    candidates: [],
  },
};

export const AHMEDABAD_WARDS_2026 = baseWards.map((entry) => ({
  ...entry,
  ...(candidateInfoByWard[entry.number] || {
    candidateStatus: "awaiting_verification",
    candidateSummary: "No candidate names have been verified for this ward yet in MyCityPulse.",
    candidates: [],
  }),
}));

export const AHMEDABAD_ELECTION_2026 = {
  year: 2026,
  status: "candidate_updates",
  election_date: "2026-04-26",
  result_date: "2026-04-28",
  nomination_open: "2026-04-06",
  nomination_close: "2026-04-11",
  scrutiny_date: "2026-04-13",
  withdrawal_date: "2026-04-15",
  wards_total: AHMEDABAD_WARDS_2026.length,
  wards_populated: AHMEDABAD_WARDS_2026.length,
  seats_total: 192,
  polling_hours: "7:00 AM to 6:00 PM",
  candidateTracker: {
    lastReviewed: "2026-04-10",
    officialFinalWards: 0,
    partyAnnouncedWards: Object.values(candidateInfoByWard).length,
    namedEntries: 4,
    statusNote:
      "MyCityPulse currently shows a partial candidate tracker. Some ward-level Congress entries are party-announced; official final ward-wise candidate lists are still being verified.",
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
  wards: AHMEDABAD_WARDS_2026,
  scopeNote:
    "Ward names, zone mapping, and ward office addresses come from AMC's own complaint portal. Candidate information below is a separate layer: some entries are party-announced and some wards still have no verified names here.",
  locationNote:
    "DIGIPIN helps anchor your exact location, but MyCityPulse does not yet auto-map DIGIPIN to ward boundaries. Save your DIGIPIN, then confirm your Ahmedabad ward yourself.",
  sources: [
    {
      label: "AMC zone-wise ward list",
      note: "Official ward names, zones, and ward offices",
      url: "https://www.amccrs.com/AMCPortal/View/ZonewiseWardList.aspx?m=ZoneWardList",
    },
    {
      label: "Ahmedabad Mirror candidate report",
      note: "Congress first list, ward coverage, and re-nominated Ahmedabad names",
      url: "https://www.ahmedabadmirror.com/gujarat-civic-polls/81910963.html",
    },
    {
      label: "TOI on Shehzad Khan Pathan",
      note: "Earlier reporting identifying Pathan as Danilimda corporator",
      url: "https://timesofindia.indiatimes.com/city/ahmedabad/cong-appoints-pathan-as-lop-in-amc/articleshow/88843033.cms",
    },
    {
      label: "DIGIPIN technical document",
      note: "India Post digital address infrastructure",
      url: "https://www.indiapost.gov.in/Navigation_Documents/Static_Navigation/DIGIPIN%20Technical%20Document%20Final%20English.pdf",
    },
    {
      label: "Gujarat civic poll schedule",
      note: "DD News report on the State Election Commission announcement",
      url: "https://www.newsonair.gov.in/state-election-commission-officially-announces-schedule-for-upcoming-local-body-elections/",
    },
  ],
};
