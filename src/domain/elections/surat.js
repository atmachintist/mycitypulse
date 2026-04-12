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

const BJP_SOURCE_NOTE = "Named in BJP's Surat ward list published on April 10, 2026.";

const candidateInfoByWard = {
  1: {
    candidateStatus: "party_announced",
    candidateSummary: "The latest published BJP Surat list names a full four-candidate panel for Ward 1.",
    candidates: [
      candidate("Bhavishaben Bhavinbhai Patel", "BJP", BJP_SOURCE_NOTE),
      candidate("Nayanaben Sureshbhai Dobariya", "BJP", BJP_SOURCE_NOTE),
      candidate("Vijaybhai Ashokbhai Bhatia", "BJP", BJP_SOURCE_NOTE),
      candidate("Rajendrabhai Govanbhai Patel", "BJP", BJP_SOURCE_NOTE),
    ],
  },
  2: {
    candidateStatus: "party_announced",
    candidateSummary: "The latest published BJP Surat list names a full four-candidate panel for Ward 2.",
    candidates: [
      candidate("Chandrikaben Anilbhai Asodariya", "BJP", BJP_SOURCE_NOTE),
      candidate("Manishaben Prafullbhai Kher", "BJP", BJP_SOURCE_NOTE),
      candidate("Jaineshbhai Satishbhai Jadav", "BJP", BJP_SOURCE_NOTE),
      candidate("Manubhai Vallabhbhai Balar", "BJP", BJP_SOURCE_NOTE),
    ],
  },
  3: {
    candidateStatus: "party_announced",
    candidateSummary: "The latest published BJP Surat list names a full four-candidate panel for Ward 3.",
    candidates: [
      candidate("Mitaben Sanjaybhai Makwana", "BJP", BJP_SOURCE_NOTE),
      candidate("Kavyaben Alpeshbhai Patel", "BJP", BJP_SOURCE_NOTE),
      candidate("Vishalbhai Ishwarbhai Rathod", "BJP", BJP_SOURCE_NOTE),
      candidate("Sureshbhai Meghjibhai Dhomaliya", "BJP", BJP_SOURCE_NOTE),
    ],
  },
  5: {
    candidateStatus: "party_announced",
    candidateSummary: "The latest published BJP Surat list names a full four-candidate panel for Ward 5.",
    candidates: [
      candidate("Jayshreeben Manharbhai Vora", "BJP", BJP_SOURCE_NOTE),
      candidate("Swatiben Rakeshbhai Patel", "BJP", BJP_SOURCE_NOTE),
      candidate("Dr. Vikram (Vishnu) Amthabhai Desai", "BJP", BJP_SOURCE_NOTE),
      candidate("Mahendra Dabhulbhai Desai", "BJP", BJP_SOURCE_NOTE),
    ],
  },
  6: {
    candidateStatus: "party_announced",
    candidateSummary: "The latest published BJP Surat list names a full four-candidate panel for Ward 6.",
    candidates: [
      candidate("Jayshreeben Rajanbhai Variya", "BJP", BJP_SOURCE_NOTE),
      candidate("Ketan Girishbhai Desai", "BJP", BJP_SOURCE_NOTE),
      candidate("Daxesh Kishorbhai Mavani", "BJP", BJP_SOURCE_NOTE),
      candidate("Rameshbhai Labhubhai Borad", "BJP", BJP_SOURCE_NOTE),
    ],
  },
  7: {
    candidateStatus: "party_announced",
    candidateSummary: "The latest published BJP Surat list names a full four-candidate panel for Ward 7.",
    candidates: [
      candidate("Sonuben Anilkumar Ambaliya", "BJP", BJP_SOURCE_NOTE),
      candidate("Devyaniben Humbal", "BJP", BJP_SOURCE_NOTE),
      candidate("Ishwarbhai Madhubhai Narola", "BJP", BJP_SOURCE_NOTE),
      candidate("Raghubhai Valjibhai Khunt", "BJP", BJP_SOURCE_NOTE),
    ],
  },
  8: {
    candidateStatus: "party_announced",
    candidateSummary: "The latest published BJP Surat list names a full four-candidate panel for Ward 8.",
    candidates: [
      candidate("Vandana Thakorshabhai Ghodari", "BJP", BJP_SOURCE_NOTE),
      candidate("Maya Ishwarlal Patil", "BJP", BJP_SOURCE_NOTE),
      candidate("Bhupendrabhai Sukhdevbhai Rathod", "BJP", BJP_SOURCE_NOTE),
      candidate("Pareshbhai Sakariya", "BJP", BJP_SOURCE_NOTE),
    ],
  },
  9: {
    candidateStatus: "party_announced",
    candidateSummary: "The latest published BJP Surat list names three visible BJP names for Ward 9 in the accessible text.",
    candidates: [
      candidate("Hina Tank", "BJP", BJP_SOURCE_NOTE),
      candidate("Nancy Shashikantbhai Shah", "BJP", BJP_SOURCE_NOTE),
      candidate("Rajanbhai Bakulbhai Patel", "BJP", BJP_SOURCE_NOTE),
    ],
  },
  10: {
    candidateStatus: "party_announced",
    candidateSummary: "The latest published BJP Surat list names a full four-candidate panel for Ward 10.",
    candidates: [
      candidate("Minakshiben Samirbhai Papaiya", "BJP", BJP_SOURCE_NOTE),
      candidate("Urvashiben Niravbhai Patel", "BJP", BJP_SOURCE_NOTE),
      candidate("Rajubhai Ratilal Priyadarshi", "BJP", BJP_SOURCE_NOTE),
      candidate("Nilesh Sureshbhai Patel", "BJP", BJP_SOURCE_NOTE),
    ],
  },
  11: {
    candidateStatus: "party_announced",
    candidateSummary: "The latest published BJP Surat list names a full four-candidate panel for Ward 11.",
    candidates: [
      candidate("Alpaben Mehta", "BJP", BJP_SOURCE_NOTE),
      candidate("Vaishali Devang Shah", "BJP", BJP_SOURCE_NOTE),
      candidate("Parimalbhai Chasiya", "BJP", BJP_SOURCE_NOTE),
      candidate("Harsh Ashokbhai Mehta", "BJP", BJP_SOURCE_NOTE),
    ],
  },
  12: {
    candidateStatus: "party_announced",
    candidateSummary: "The latest published BJP Surat list names a full four-candidate panel for Ward 12.",
    candidates: [
      candidate("Hemaxi Ravishkumar Chauhan", "BJP", BJP_SOURCE_NOTE),
      candidate("Artiben Hanishbhai Patel", "BJP", BJP_SOURCE_NOTE),
      candidate("Kishorbhai Babubhai Mayani", "BJP", BJP_SOURCE_NOTE),
      candidate("Chiragkumar Ghanshyambhai Savaliya", "BJP", BJP_SOURCE_NOTE),
    ],
  },
  13: {
    candidateStatus: "party_announced",
    candidateSummary: "The latest published BJP Surat list names a full four-candidate panel for Ward 13.",
    candidates: [
      candidate("Mohiniben Damodardas Rathod", "BJP", BJP_SOURCE_NOTE),
      candidate("Manisha Mukesh Mahatama", "BJP", BJP_SOURCE_NOTE),
      candidate("Sandip Mukeshbhai Chalakwala", "BJP", BJP_SOURCE_NOTE),
      candidate("Sanjay Bansilal Dalal", "BJP", BJP_SOURCE_NOTE),
    ],
  },
  14: {
    candidateStatus: "party_announced",
    candidateSummary: "The latest published BJP Surat list names a full four-candidate panel for Ward 14.",
    candidates: [
      candidate("Sarojben Kalpeshbhai Patel", "BJP", BJP_SOURCE_NOTE),
      candidate("Mayaben Dharmendrabhai Mavani", "BJP", BJP_SOURCE_NOTE),
      candidate("Satishbhai Ukabhai Masuriya", "BJP", BJP_SOURCE_NOTE),
      candidate("Anil Maganbhai Sojitra", "BJP", BJP_SOURCE_NOTE),
    ],
  },
  15: {
    candidateStatus: "party_announced",
    candidateSummary: "The latest published BJP Surat list names a full four-candidate panel for Ward 15.",
    candidates: [
      candidate("Manishaben Bhimjibhai Ahir", "BJP", BJP_SOURCE_NOTE),
      candidate("Upaben Bhargavbhai Pandya", "BJP", BJP_SOURCE_NOTE),
      candidate("Dharmeshbhai Haribhai Balala", "BJP", BJP_SOURCE_NOTE),
      candidate("Maheshkumar Dhirubhai Makwana", "BJP", BJP_SOURCE_NOTE),
    ],
  },
  16: {
    candidateStatus: "party_announced",
    candidateSummary: "The latest published BJP Surat list names a full four-candidate panel for Ward 16.",
    candidates: [
      candidate("Sangeetaben Dineshbhai Parmar", "BJP", BJP_SOURCE_NOTE),
      candidate("Ritaben Jayantibhai Patoliya", "BJP", BJP_SOURCE_NOTE),
      candidate("Vikram Harsukhbhai Degama", "BJP", BJP_SOURCE_NOTE),
      candidate("Jagdishbhai Jethabhai Sutariya", "BJP", BJP_SOURCE_NOTE),
    ],
  },
  17: {
    candidateStatus: "party_announced",
    candidateSummary: "The latest published BJP Surat list names a full four-candidate panel for Ward 17.",
    candidates: [
      candidate("Manishaben Ghanshyambhai Jikadra", "BJP", BJP_SOURCE_NOTE),
      candidate("Kanchanben Kiritbhai Savaliya", "BJP", BJP_SOURCE_NOTE),
      candidate("Subhash Prajlal Hanani", "BJP", BJP_SOURCE_NOTE),
      candidate("Chimanbhai Shambhubhai Vora", "BJP", BJP_SOURCE_NOTE),
    ],
  },
  18: {
    candidateStatus: "party_announced",
    candidateSummary: "The latest published BJP Surat list names a full four-candidate panel for Ward 18.",
    candidates: [
      candidate("Vidhi Chhanabhai Rathod", "BJP", BJP_SOURCE_NOTE),
      candidate("Hinaben Sanjaykumar Vaghani", "BJP", BJP_SOURCE_NOTE),
      candidate("Dipakbhai Sagarbhai Rabari", "BJP", BJP_SOURCE_NOTE),
      candidate("Dinesh Upaji Purohit (Rajpurohit)", "BJP", BJP_SOURCE_NOTE),
    ],
  },
  19: {
    candidateStatus: "party_announced",
    candidateSummary: "The latest published BJP Surat list names a full four-candidate panel for Ward 19.",
    candidates: [
      candidate("Anitaben Manishbhai Rana", "BJP", BJP_SOURCE_NOTE),
      candidate("Jayshreeben Ramanlal Patel", "BJP", BJP_SOURCE_NOTE),
      candidate("Rameshbhai Ambarambhai Patel", "BJP", BJP_SOURCE_NOTE),
      candidate("Ashokkumar Mangilal Shah", "BJP", BJP_SOURCE_NOTE),
    ],
  },
  20: {
    candidateStatus: "party_announced",
    candidateSummary: "The latest published BJP Surat list names a full four-candidate panel for Ward 20.",
    candidates: [
      candidate("Pratibha Saurabh Desai", "BJP", BJP_SOURCE_NOTE),
      candidate("Hinaben Jayprakash Taliya", "BJP", BJP_SOURCE_NOTE),
      candidate("Rajeshbhai Natvarlal Rana", "BJP", BJP_SOURCE_NOTE),
      candidate("Rajnishbhai Gunvantray Desai", "BJP", BJP_SOURCE_NOTE),
    ],
  },
  21: {
    candidateStatus: "party_announced",
    candidateSummary: "The latest published BJP Surat list names a full four-candidate panel for Ward 21.",
    candidates: [
      candidate("Dipikaben Ankeshbhai Dhut", "BJP", BJP_SOURCE_NOTE),
      candidate("Dimpleben Chetanbhai Kapadiya", "BJP", BJP_SOURCE_NOTE),
      candidate("Ashokkumar Dhaneshbhai Randeriya", "BJP", BJP_SOURCE_NOTE),
      candidate("Prajesh Bharatbhai Undkat", "BJP", BJP_SOURCE_NOTE),
    ],
  },
  22: {
    candidateStatus: "party_announced",
    candidateSummary: "The latest published BJP Surat list names a full four-candidate panel for Ward 22.",
    candidates: [
      candidate("Shital Pratikkumar Patel", "BJP", BJP_SOURCE_NOTE),
      candidate("Rashmi Girdhari Sabu", "BJP", BJP_SOURCE_NOTE),
      candidate("Dipeshbhai Chandulal Patel", "BJP", BJP_SOURCE_NOTE),
      candidate("Himanshu Pravinsinh Raulji", "BJP", BJP_SOURCE_NOTE),
    ],
  },
  25: {
    candidateStatus: "party_announced",
    candidateSummary: "The latest published BJP Surat list names a full four-candidate panel for Ward 25.",
    candidates: [
      candidate("Kavitaben Enagundla", "BJP", BJP_SOURCE_NOTE),
      candidate("Sukhmaben Yuvrajbhai Patil", "BJP", BJP_SOURCE_NOTE),
      candidate("Sanjaybhai Keshavbhai Patil", "BJP", BJP_SOURCE_NOTE),
      candidate("Jayeshbhai Purshottambhai Chandker", "BJP", BJP_SOURCE_NOTE),
    ],
  },
  26: {
    candidateStatus: "party_announced",
    candidateSummary: "The latest published BJP Surat list names a full four-candidate panel for Ward 26.",
    candidates: [
      candidate("Varshaben Mayurbhai Baldaniya", "BJP", BJP_SOURCE_NOTE),
      candidate("Alkaben Anil Patil", "BJP", BJP_SOURCE_NOTE),
      candidate("Amitsingh Jamnasingh Rajput", "BJP", BJP_SOURCE_NOTE),
      candidate("Dr. Narendra (Naresh) Shantaram Patil", "BJP", BJP_SOURCE_NOTE),
    ],
  },
  27: {
    candidateStatus: "party_announced",
    candidateSummary: "The latest published BJP Surat list names a full four-candidate panel for Ward 27.",
    candidates: [
      candidate("Pratibhaben Patel", "BJP", BJP_SOURCE_NOTE),
      candidate("Anjali Shubham Upadhyay", "BJP", BJP_SOURCE_NOTE),
      candidate("Bhaidas Sitaram Patil", "BJP", BJP_SOURCE_NOTE),
      candidate("Sudhakar Lotanbhai Chaudhari", "BJP", BJP_SOURCE_NOTE),
    ],
  },
  28: {
    candidateStatus: "party_announced",
    candidateSummary: "The latest published BJP Surat list names a full four-candidate panel for Ward 28.",
    candidates: [
      candidate("Rajkuvar Manoharsinh Rathod", "BJP", BJP_SOURCE_NOTE),
      candidate("Kaminiben Sohmabhai Patel", "BJP", BJP_SOURCE_NOTE),
      candidate("Manishbhai Chimanbhai Patel", "BJP", BJP_SOURCE_NOTE),
      candidate("Pankaj Tulsiram Jadhav", "BJP", BJP_SOURCE_NOTE),
    ],
  },
  29: {
    candidateStatus: "party_announced",
    candidateSummary: "The latest published BJP Surat list names a full four-candidate panel for Ward 29.",
    candidates: [
      candidate("Sudha Rajeshbhai Pandey", "BJP", BJP_SOURCE_NOTE),
      candidate("Suhani Surajbhai Yadav", "BJP", BJP_SOURCE_NOTE),
      candidate("Mehul Kantilal Patel", "BJP", BJP_SOURCE_NOTE),
      candidate("Dharmendrakumar Mafatlal Patel", "BJP", BJP_SOURCE_NOTE),
    ],
  },
  30: {
    candidateStatus: "party_announced",
    candidateSummary: "The latest published BJP Surat list names a full four-candidate panel for Ward 30.",
    candidates: [
      candidate("Reenasingh Ajitsingh Rajput", "BJP", BJP_SOURCE_NOTE),
      candidate("Artiben Dipakbhai Chaudhari", "BJP", BJP_SOURCE_NOTE),
      candidate("Bharatbhai Arvindbhai Patel", "BJP", BJP_SOURCE_NOTE),
      candidate("Chiragkumar Harishchandra Solanki", "BJP", BJP_SOURCE_NOTE),
    ],
  },
};

export const SURAT_WARDS_2026 = baseWards.map((entry) => ({
  ...entry,
  ...(candidateInfoByWard[entry.number] || {
    candidateStatus: "awaiting_verification",
    candidateSummary: "No candidate names have been verified for this ward yet in MyCityPulse.",
    candidates: [],
  }),
}));

export const SURAT_ELECTION_2026 = {
  year: 2026,
  status: "candidate_updates",
  lastUpdated: "2026-04-12T11:30:00+05:30",
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
    lastReviewed: "2026-04-12",
    officialFinalWards: 0,
    partyAnnouncedWards: SURAT_WARDS_2026.filter((wardEntry) => wardEntry.candidateStatus === "party_announced").length,
    namedEntries: SURAT_WARDS_2026.reduce((sum, wardEntry) => sum + wardEntry.candidates.length, 0),
    statusNote:
      "MyCityPulse now shows BJP's latest published Surat ward panels for 27 wards. The accessible list we could verify did not surface Ward 4, Ward 23, or Ward 24, so those stay blank here pending another source or the post-scrutiny final list.",
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
      label: "Surat BJP candidate list",
      note: "Ward-wise BJP candidate names published on April 10, 2026",
      url: "https://voterlist.co.in/bjp-surat-municipal-election-2026-candidate-list/",
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
