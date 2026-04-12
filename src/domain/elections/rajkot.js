const ward = (number, name, zone, officeAddress) => ({
  number,
  name,
  zone,
  officeAddress,
});

const officeSummary = (zone, summary) =>
  `Rajkot Municipal Corporation ward network (${zone}): ${summary}`;

const baseWards = [
  ward(1, "Ward 1", "West", officeSummary("West Zone", "Main ward office near Ramapir Chowkdi, beside Fire Brigade, 150 Feet Ring Road.")),
  ward(2, "Ward 2", "Central / West", officeSummary("Central / West", "Served through sub-ward offices at Geet Gurjari Society (Rameshwar Chowk), Bajrangwadi Main Road, and Shroff Road near the water tank.")),
  ward(3, "Ward 3", "Central", officeSummary("Central Zone", "Served through sub-ward offices near Bedinaka Tower, Junction Police Chowki, and Popatpara Pumping Station.")),
  ward(4, "Ward 4", "Central / East", officeSummary("Central / East", "Served through Morbi Road near Old City Station and Lati Plot at the 5/12 corner.")),
  ward(5, "Ward 5", "East", officeSummary("East Zone", "Served through sub-ward offices opposite Ranchhoddasji Ashram on Kuwadva Road, behind the RTO near Hudko Community Hall, and near Govindbag Vegetable Market on Arya Nagar Main Road.")),
  ward(6, "Ward 6", "East", officeSummary("East Zone", "Served through sub-ward offices near Shakti Industries on Kabirvan Main Road, Manda Dungar Main Road, and beside Rajmoti Oil Mill on Bhavnagar Road.")),
  ward(7, "Ward 7", "Central", officeSummary("Central Zone", "Served through offices near Astron Cinema on Tagore Road, Vijay Plot near Avantikabai Hall, Apna Bazar on Bhupendra Road, and Hathikhana near Arya Samaj.")),
  ward(8, "Ward 8", "West", officeSummary("West Zone", "Served through sub-ward offices at Sojitra Nagar on Raiya Road, Nana Mava Circle, and Jan Kalyan Gate near the drainage pumping station.")),
  ward(9, "Ward 9", "West", officeSummary("West Zone", "Served through offices near Paradise Hall / Trilok Park and near Kismat Hotel close to Raiya Chowkdi on 150 Feet Ring Road.")),
  ward(10, "Ward 10", "West", officeSummary("West Zone", "Ward office at Royal Park-08 Corner on 150 Feet Ring Road.")),
  ward(11, "Ward 11", "West", officeSummary("West Zone", "Ward office near Nana Mava Circle.")),
  ward(12, "Ward 12", "West / South", officeSummary("West / South", "Served through Mavdi Road near Jithariya Hanuman and Vavdi Gram Panchayat Office.")),
  ward(13, "Ward 13", "West / South", officeSummary("West / South", "Served through Krishna Nagar Main Road, Amar Nagar Main Road near School No. 81, and 80 Feet Road opposite Gokuldham Awas Yojana.")),
  ward(14, "Ward 14", "South", officeSummary("South Zone", "Served through Sinduriya Khan Shopping Center on Kothariya Road, Lakadiya Pul opposite Kothariya Colony, and Bhaktinagar Society opposite Gurukul Gate on Dhebar Road.")),
  ward(15, "Ward 15", "South", officeSummary("South Zone", "Served through 80 Feet Road beside Conservancy Store and Dudh Sagar Road beside Mother Teresa School.")),
  ward(16, "Ward 16", "South", officeSummary("South Zone", "Served through Mehul Nagar-6 behind Nilkanth Cinema, Vivekanand Nagar by the stream edge, and Arvind Maniyar Hudco Quarters near the water tank.")),
  ward(17, "Ward 17", "South", officeSummary("South Zone", "Served through Sahakar Nagar Main Road beside School No. 51, Atika Industrial Area on Dhebar Road, and Sukhramnagar near the water tank.")),
  ward(18, "Ward 18", "South", officeSummary("South Zone", "Served through Khodaldham Residency-4 on Swati Park Road, Kothariya village, and nearby ward facilities in the Kothariya corridor.")),
];

const candidateInfoByWard = {
  1: {
    candidateStatus: "party_announced",
    candidateSummary: "ABP Asmita reported BJP's full four-name panel for Rajkot Ward 1 on April 10, 2026.",
    candidates: [
      { name: "Anjana Murjariya", party: "BJP", status: "party_announced" },
      { name: "Sejal Chaudhary", party: "BJP", status: "party_announced" },
      { name: "Jayrajsinh Jadeja", party: "BJP", status: "party_announced" },
      { name: "Paresh Thakar", party: "BJP", status: "party_announced" },
    ],
  },
  2: {
    candidateStatus: "party_announced",
    candidateSummary: "ABP Asmita reported BJP's full four-name panel for Rajkot Ward 2 on April 10, 2026.",
    candidates: [
      { name: "Dakshaben Vaghela", party: "BJP", status: "party_announced" },
      { name: "Minaba Jadeja", party: "BJP", status: "party_announced" },
      { name: "Shailesh Vasani", party: "BJP", status: "party_announced" },
      { name: "Dhairya Parekh", party: "BJP", status: "party_announced" },
    ],
  },
  3: {
    candidateStatus: "party_announced",
    candidateSummary: "ABP Asmita reported BJP's full four-name panel for Rajkot Ward 3 on April 10, 2026.",
    candidates: [
      { name: "Alpa Dave", party: "BJP", status: "party_announced" },
      { name: "Hina Belani", party: "BJP", status: "party_announced" },
      { name: "Ajay Majethiya", party: "BJP", status: "party_announced" },
      { name: "Narendrasinh Jadeja", party: "BJP", status: "party_announced" },
    ],
  },
  4: {
    candidateStatus: "party_announced",
    candidateSummary: "ABP Asmita reported BJP's full four-name panel for Rajkot Ward 4 on April 10, 2026.",
    candidates: [
      { name: "Kankuben Udhareja", party: "BJP", status: "party_announced" },
      { name: "Rajeshwari Malaviya", party: "BJP", status: "party_announced" },
      { name: "Bharatbhai Limbasiya", party: "BJP", status: "party_announced" },
      { name: "Kalubhai Kungsiya", party: "BJP", status: "party_announced" },
    ],
  },
  5: {
    candidateStatus: "party_announced",
    candidateSummary: "ABP Asmita reported BJP's full four-name panel for Rajkot Ward 5 on April 10, 2026.",
    candidates: [
      { name: "Rasilaben Sakariya", party: "BJP", status: "party_announced" },
      { name: "Smitaben Gohil", party: "BJP", status: "party_announced" },
      { name: "Sanjay Chavda", party: "BJP", status: "party_announced" },
      { name: "Dilip Lunagariya", party: "BJP", status: "party_announced" },
    ],
  },
  6: {
    candidateStatus: "party_announced",
    candidateSummary: "ABP Asmita reported BJP's full four-name panel for Rajkot Ward 6 on April 10, 2026.",
    candidates: [
      { name: "Dharmishthaben Parmar", party: "BJP", status: "party_announced" },
      { name: "Poonamben Morvadiya", party: "BJP", status: "party_announced" },
      { name: "Anil Chauhan", party: "BJP", status: "party_announced" },
      { name: "Paresh Pipliya", party: "BJP", status: "party_announced" },
    ],
  },
};

export const RAJKOT_WARDS_2026 = baseWards.map((entry) => ({
  ...entry,
  ...(candidateInfoByWard[entry.number] || {
    candidateStatus: "awaiting_verification",
    candidateSummary: "No candidate names have been verified for this ward yet in MyCityPulse.",
    candidates: [],
  }),
}));

export const RAJKOT_ELECTION_2026 = {
  year: 2026,
  status: "ward_directory",
  lastUpdated: "2026-04-11T12:20:00+05:30",
  election_date: "2026-04-26",
  result_date: "2026-04-28",
  nomination_open: "2026-04-06",
  nomination_close: "2026-04-11",
  scrutiny_date: "2026-04-13",
  withdrawal_date: "2026-04-15",
  wards_total: RAJKOT_WARDS_2026.length,
  wards_populated: RAJKOT_WARDS_2026.length,
  seats_total: 72,
  polling_hours: "7:00 AM to 6:00 PM",
  candidateTracker: {
    lastReviewed: "2026-04-11",
    officialFinalWards: 0,
    partyAnnouncedWards: 6,
    namedEntries: 24,
    statusNote:
      "MyCityPulse now shows BJP's announced candidates for Rajkot wards 1 to 6 from April 10 reporting. Other wards still remain unfilled here until we can verify more names.",
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
  wards: RAJKOT_WARDS_2026,
  scopeNote:
    "RMC publicly lists 18 wards and also publishes a ward-office network with many sub-ward offices. MyCityPulse shows one citizen-readable office summary per ward rather than pretending each Rajkot ward has only one office point.",
  locationNote:
    "DIGIPIN helps anchor your exact location, but MyCityPulse does not yet auto-map DIGIPIN to Rajkot ward boundaries. Save your DIGIPIN, then confirm your Rajkot ward yourself.",
  sources: [
    {
      label: "RMC elected body",
      note: "Official ward structure and elected representation by ward",
      url: "https://www.rmc.gov.in/ElectedBody",
    },
    {
      label: "RMC ward office network",
      note: "Official zone offices and ward / sub-ward office addresses",
      url: "https://egov.rmc.gov.in/RMCOffices",
    },
    {
      label: "ABP Asmita Rajkot BJP list",
      note: "BJP ward-wise Rajkot candidate panels reported on April 10, 2026",
      url: "https://gujarati.abplive.com/news/rajkot/72-bjp-candidates-declared-in-18-wards-of-rajkot-municipal-corporation-977024/amp",
    },
    {
      label: "Gujarat local body poll schedule",
      note: "NDTV report after the Gujarat SEC announcement",
      url: "https://www.ndtv.com/india-news/gujarat-local-body-polls-on-april-26-votes-to-be-counted-on-april-28-11298953",
    },
    {
      label: "DIGIPIN technical document",
      note: "India Post digital address infrastructure",
      url: "https://www.indiapost.gov.in/Navigation_Documents/Static_Navigation/DIGIPIN%20Technical%20Document%20Final%20English.pdf",
    },
  ],
};
