const ward = (number, name, zone, officeAddress) => ({
  number,
  name,
  zone,
  officeAddress,
});

const candidate = (name, party, note) => ({
  name,
  party,
  status: "party_announced",
  ...(note ? { note } : {}),
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

const CONGRESS_NOTE = "Named in Congress's Vadodara municipal list published during the April 2026 nomination phase.";

const candidateInfoByWard = {
  1: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 1 panel, and BJP replaced its ST nominee with Bhursing Rathwa on April 12, 2026.",
    candidates: [
      candidate("Sonaben Jashabhai Desai", "INC", CONGRESS_NOTE),
      candidate("Pushpaben Vaghela", "INC", CONGRESS_NOTE),
      candidate("Nikul Khushalbhai Patel", "INC", CONGRESS_NOTE),
      candidate("Amiben Ravat", "INC", CONGRESS_NOTE),
      candidate("Bhursing Rathwa", "BJP", "TOI reported BJP replaced its original ST-seat nominee in Ward 1 on April 12, 2026."),
    ],
  },
  2: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 2 panel.",
    candidates: [
      candidate("Bhumiben Kantibhai Prajapati", "INC", CONGRESS_NOTE),
      candidate("Advocate Shibani B.", "INC", CONGRESS_NOTE),
      candidate("Chiragbhai Kanubhai Kadiya", "INC", CONGRESS_NOTE),
      candidate("Patel Dipakbhai Ambalal", "INC", CONGRESS_NOTE),
    ],
  },
  3: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 3 panel.",
    candidates: [
      candidate("Meenalben Goswami", "INC", CONGRESS_NOTE),
      candidate("Kruti Nishant Raval", "INC", CONGRESS_NOTE),
      candidate("Satishbhai Vasava", "INC", CONGRESS_NOTE),
      candidate("Nileshbhai Patel", "INC", CONGRESS_NOTE),
    ],
  },
  4: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 4 panel.",
    candidates: [
      candidate("Basera Mayaben Bholenath", "INC", CONGRESS_NOTE),
      candidate("Parmar Ranjanben Dahyabhai", "INC", CONGRESS_NOTE),
      candidate("Kapil Kishor Joshi", "INC", CONGRESS_NOTE),
      candidate("Vishal Jitendrabhai Patel", "INC", CONGRESS_NOTE),
    ],
  },
  5: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 5 panel.",
    candidates: [
      candidate("Rinaben Patel", "INC", CONGRESS_NOTE),
      candidate("Dharmishthaben Mahendrabhai Parmar", "INC", CONGRESS_NOTE),
      candidate("Mehulbhai Kahar", "INC", CONGRESS_NOTE),
      candidate("Kishanbhai Gunvantray Kapadiya", "INC", CONGRESS_NOTE),
    ],
  },
  6: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 6 panel.",
    candidates: [
      candidate("Sanjuda Begum Nasiruddin Saiyed", "INC", CONGRESS_NOTE),
      candidate("Solanki Parvatiben Prabhubhai", "INC", CONGRESS_NOTE),
      candidate("Harishbhai Od", "INC", CONGRESS_NOTE),
      candidate("Mehulbhai Dineshchandra Pandya", "INC", CONGRESS_NOTE),
    ],
  },
  7: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 7 panel.",
    candidates: [
      candidate("Rana Jagrutiben Dikshitbhai", "INC", CONGRESS_NOTE),
      candidate("Lalitaben Anilbhai Shah", "INC", CONGRESS_NOTE),
      candidate("Rajeshbhai Patni", "INC", CONGRESS_NOTE),
      candidate("Nirmal Thakkar", "INC", CONGRESS_NOTE),
    ],
  },
  8: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 8 panel.",
    candidates: [
      candidate("Sonalben Vipulbhai Barot", "INC", CONGRESS_NOTE),
      candidate("Kesarben Rajput", "INC", CONGRESS_NOTE),
      candidate("Amarlal Natvarbhai Vaghela", "INC", CONGRESS_NOTE),
      candidate("Swejal Vyas", "INC", CONGRESS_NOTE),
    ],
  },
  9: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 9 panel.",
    candidates: [
      candidate("Disha Shambhubhai Parekh", "INC", CONGRESS_NOTE),
      candidate("Meenaben Vasava", "INC", CONGRESS_NOTE),
      candidate("Alpeshbhai Parekh", "INC", CONGRESS_NOTE),
      candidate("Dhyersinh Jagtap", "INC", CONGRESS_NOTE),
    ],
  },
  10: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published two visible Ward 10 names in the accessible list.",
    candidates: [
      candidate("Hardikbhai Rameshchandra Amodiya", "INC", CONGRESS_NOTE),
      candidate("Daksh Mahendrabhai Patel (Darpan)", "INC", CONGRESS_NOTE),
    ],
  },
  11: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 11 panel.",
    candidates: [
      candidate("Binaben Pratapsinh Chavda", "INC", CONGRESS_NOTE),
      candidate("Anuradha Satishbhai Sharma", "INC", CONGRESS_NOTE),
      candidate("Kanubhai Prajapati", "INC", CONGRESS_NOTE),
      candidate("Tarunbhai Bhikhubhai Thakkar", "INC", CONGRESS_NOTE),
    ],
  },
  12: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 12 panel.",
    candidates: [
      candidate("Nitaben Kirankumar Tadvi", "INC", CONGRESS_NOTE),
      candidate("Bhavika Pradipbhai Chandoliya", "INC", CONGRESS_NOTE),
      candidate("Sachin Indravadan Mayavanshi", "INC", CONGRESS_NOTE),
      candidate("Rakeshbhai Jogdas Thakor", "INC", CONGRESS_NOTE),
    ],
  },
  13: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 13 panel.",
    candidates: [
      candidate("Priyanka Jayeshbhai Makwana", "INC", CONGRESS_NOTE),
      candidate("Vaishali Satyaprem Patel", "INC", CONGRESS_NOTE),
      candidate("Varun Harishbhai Mali", "INC", CONGRESS_NOTE),
      candidate("Balasaheb Surve", "INC", CONGRESS_NOTE),
    ],
  },
  14: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 14 panel.",
    candidates: [
      candidate("Hemangini Dirgayush Kolekar", "INC", CONGRESS_NOTE),
      candidate("Dipaben Atulbhai Shrivastav", "INC", CONGRESS_NOTE),
      candidate("Brahmbhatt Tirth Jatinbhai", "INC", CONGRESS_NOTE),
      candidate("Mohammadjavid Kasim Dhupelwala", "INC", CONGRESS_NOTE),
    ],
  },
  15: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 15 panel.",
    candidates: [
      candidate("Nilamben Dhanjaykumar Nigam", "INC", CONGRESS_NOTE),
      candidate("Parul Dharmeshbhai Patel", "INC", CONGRESS_NOTE),
      candidate("Rajendra Pratapsinh Barot", "INC", CONGRESS_NOTE),
      candidate("Ashish Joshi", "INC", CONGRESS_NOTE),
    ],
  },
  16: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 16 panel.",
    candidates: [
      candidate("Alkaben Shaileshbhai Patel", "INC", CONGRESS_NOTE),
      candidate("Chandniben Pankaj Sonvane", "INC", CONGRESS_NOTE),
      candidate("Gopal Ravjibhai Rabari", "INC", CONGRESS_NOTE),
      candidate("Chandrakant Shrivastav", "INC", CONGRESS_NOTE),
    ],
  },
  17: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 17 panel.",
    candidates: [
      candidate("Gayatriben Parmar", "INC", CONGRESS_NOTE),
      candidate("Vaishali Varne", "INC", CONGRESS_NOTE),
      candidate("Falgun Sorathiya", "INC", CONGRESS_NOTE),
      candidate("Parth Rohitbhai Patel", "INC", CONGRESS_NOTE),
    ],
  },
  18: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 18 panel.",
    candidates: [
      candidate("Panchal Kinnariben Mayurbhai", "INC", CONGRESS_NOTE),
      candidate("Bhavika Jayminbhai Patel", "INC", CONGRESS_NOTE),
      candidate("Maheshbhai Dahyabhai Solanki", "INC", CONGRESS_NOTE),
      candidate("Chandrashekhar Samarav Patil", "INC", CONGRESS_NOTE),
    ],
  },
  19: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 19 panel.",
    candidates: [
      candidate("Luhar Meghna Ramchandra", "INC", CONGRESS_NOTE),
      candidate("Laxmiben Surendrasinh Raj", "INC", CONGRESS_NOTE),
      candidate("Jaiswal Narendrabhai Manubhai", "INC", CONGRESS_NOTE),
      candidate("Manoj Gopalakrishnan Acharya", "INC", CONGRESS_NOTE),
    ],
  },
};

export const VADODARA_WARDS_2026 = baseWards.map((entry) => ({
  ...entry,
  ...(candidateInfoByWard[entry.number] || {
    candidateStatus: "awaiting_verification",
    candidateSummary: "No candidate names have been verified for this ward yet in MyCityPulse.",
    candidates: [],
  }),
}));

export const VADODARA_ELECTION_2026 = {
  year: 2026,
  status: "candidate_updates",
  lastUpdated: "2026-04-12T14:10:00+05:30",
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
    lastReviewed: "2026-04-12",
    officialFinalWards: 0,
    partyAnnouncedWards: VADODARA_WARDS_2026.filter((wardEntry) => wardEntry.candidateStatus === "party_announced").length,
    namedEntries: VADODARA_WARDS_2026.reduce((sum, wardEntry) => sum + wardEntry.candidates.length, 0),
    statusNote:
      "MyCityPulse now shows Congress's current ward-wise Vadodara list across all 19 wards, plus BJP's April 12 replacement of its Ward 1 ST-seat nominee. These entries remain party-announced until the post-scrutiny final candidate list is cross-checked.",
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
      label: "Vadodara Congress candidate list",
      note: "Ward-wise Congress candidate names published during the April 2026 nomination phase",
      url: "https://voterlist.co.in/congress-candidate-list-for-vadodra-ahmedabad-municipal-election-2026/",
    },
    {
      label: "TOI Vadodara BJP change",
      note: "BJP replaced its Ward 1 ST-seat nominee on April 12, 2026",
      url: "https://timesofindia.indiatimes.com/city/vadodara/bjp-swaps-vmc-candidate-at-last-minute-over-voter-list-issue/articleshow/130198545.cms",
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
