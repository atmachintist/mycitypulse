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
  15: {
    candidateStatus: "party_announced",
    candidateSummary: "Ahmedabad Mirror reported BJP's Bapunagar panel and Congress has also announced candidates in this ward, but MyCityPulse is only naming the BJP names we could verify from the current report.",
    candidates: [
      {
        name: "Pravin Patel",
        party: "BJP",
        status: "party_announced",
        note: "Ahmedabad Mirror reported this as part of BJP's Bapunagar panel on April 10, 2026.",
      },
      {
        name: "Jayashriben Datta",
        party: "BJP",
        status: "party_announced",
        note: "Ahmedabad Mirror reported this as part of BJP's Bapunagar panel on April 10, 2026.",
      },
      {
        name: "Gopal Shengaar",
        party: "BJP",
        status: "party_announced",
        note: "Ahmedabad Mirror reported this as part of BJP's Bapunagar panel on April 10, 2026.",
      },
    ],
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
    candidateSummary: "Ahmedabad Mirror reported four BJP names as selected for Bodakdev. These are still labelled party-announced here until a formal final ward list is cross-checked after scrutiny.",
    candidates: [
      {
        name: "Devang Dani",
        party: "BJP",
        status: "party_announced",
        note: "Ahmedabad Mirror reported this as part of BJP's Bodakdev panel on April 10, 2026.",
      },
      {
        name: "Dharamsinh Desai",
        party: "BJP",
        status: "party_announced",
        note: "Ahmedabad Mirror reported this as part of BJP's Bodakdev panel on April 10, 2026.",
      },
      {
        name: "Parul Vaibhav Makwana",
        party: "BJP",
        status: "party_announced",
        note: "Ahmedabad Mirror reported this as part of BJP's Bodakdev panel on April 10, 2026.",
      },
      {
        name: "Bhavnaben Patel",
        party: "BJP",
        status: "party_announced",
        note: "Ahmedabad Mirror reported this as part of BJP's Bodakdev panel on April 10, 2026.",
      },
    ],
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
  36: {
    candidateStatus: "party_announced",
    candidateSummary: "Ahmedabad Mirror reported four BJP names as selected for Sarkhej. These remain tagged party-announced here pending scrutiny and withdrawal checks.",
    candidates: [
      {
        name: "Raju Shukla",
        party: "BJP",
        status: "party_announced",
        note: "Ahmedabad Mirror reported this as part of BJP's Sarkhej panel on April 10, 2026.",
      },
      {
        name: "Jethiben Bharwad",
        party: "BJP",
        status: "party_announced",
        note: "Ahmedabad Mirror reported this as part of BJP's Sarkhej panel on April 10, 2026.",
      },
      {
        name: "Hema Shah",
        party: "BJP",
        status: "party_announced",
        note: "Ahmedabad Mirror reported this as part of BJP's Sarkhej panel on April 10, 2026.",
      },
      {
        name: "Divyesh Tripathi",
        party: "BJP",
        status: "party_announced",
        note: "Ahmedabad Mirror reported this as part of BJP's Sarkhej panel on April 10, 2026.",
      },
    ],
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
  37: {
    candidateStatus: "party_announced",
    candidateSummary: "Ahmedabad Mirror named two BJP candidates in Jodhpur, but the report snippet we verified did not surface the full four-name panel.",
    candidates: [
      {
        name: "Vinod Patel",
        party: "BJP",
        status: "party_announced",
        note: "Ahmedabad Mirror reported this as part of BJP's Jodhpur panel on April 10, 2026.",
      },
      {
        name: "Bhagyash Patel",
        party: "BJP",
        status: "party_announced",
        note: "Ahmedabad Mirror reported this as part of BJP's Jodhpur panel on April 10, 2026.",
      },
    ],
  },
  38: {
    candidateStatus: "party_announced",
    candidateSummary: "Ahmedabad Mirror reported four BJP names as selected for Vejalpur. These remain marked party-announced here until a formal post-scrutiny ward list is cross-checked.",
    candidates: [
      {
        name: "Parul Dave",
        party: "BJP",
        status: "party_announced",
        note: "Ahmedabad Mirror reported this as part of BJP's Vejalpur panel on April 10, 2026.",
      },
      {
        name: "Rajesh Thakor",
        party: "BJP",
        status: "party_announced",
        note: "Ahmedabad Mirror reported this as part of BJP's Vejalpur panel on April 10, 2026.",
      },
      {
        name: "Devang Mehta",
        party: "BJP",
        status: "party_announced",
        note: "Ahmedabad Mirror reported this as part of BJP's Vejalpur panel on April 10, 2026.",
      },
      {
        name: "Julie Chauhan",
        party: "BJP",
        status: "party_announced",
        note: "Ahmedabad Mirror reported this as part of BJP's Vejalpur panel on April 10, 2026.",
      },
    ],
  },
};

const CONGRESS_NOTE = "Named in Congress's Ahmedabad municipal list published during the April 2026 nomination phase.";

Object.assign(candidateInfoByWard, {
  1: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 1 panel.",
    candidates: [
      candidate("Ushaben Jayeshkumar Brahmbhatt", "INC", CONGRESS_NOTE),
      candidate("Bhatsara Nita Ashokkumar", "INC", CONGRESS_NOTE),
      candidate("Dineshbhai Lallubhai Desai", "INC", CONGRESS_NOTE),
      candidate("Jalay Ashokbhai Chauhan", "INC", CONGRESS_NOTE),
    ],
  },
  2: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 2 panel.",
    candidates: [
      candidate("Nefal Jitendrabhai Panchal", "INC", CONGRESS_NOTE),
      candidate("Sonalben Gautambhai Patel", "INC", CONGRESS_NOTE),
      candidate("Gajjar Purav Chandrakantbhai", "INC", CONGRESS_NOTE),
      candidate("Pradipbhai Patel", "INC", CONGRESS_NOTE),
    ],
  },
  3: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 3 panel.",
    candidates: [
      candidate("Varsha Mukeshbhai Katara", "INC", CONGRESS_NOTE),
      candidate("Rajshri Vijaykumar Kesari", "INC", CONGRESS_NOTE),
      candidate("Subodh Kumud", "INC", CONGRESS_NOTE),
      candidate("Sudhirkumar Chotalal Patel", "INC", CONGRESS_NOTE),
    ],
  },
  4: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 4 panel.",
    candidates: [
      candidate("Pushpaben Harishbhai Vaghela", "INC", CONGRESS_NOTE),
      candidate("Hiralben Umangbhai Bhavsar", "INC", CONGRESS_NOTE),
      candidate("Makwana Ajit Ganeshbhai", "INC", CONGRESS_NOTE),
      candidate("Dipenkumar Manubhai Patel", "INC", CONGRESS_NOTE),
    ],
  },
  5: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 5 panel.",
    candidates: [
      candidate("Chandaben Ganeshji Parmar", "INC", CONGRESS_NOTE),
      candidate("Ritaben Devjibhai Patel", "INC", CONGRESS_NOTE),
      candidate("Vinodbhai Jayantilal Patel", "INC", CONGRESS_NOTE),
      candidate("Jigarbhai Chandrakantbhai Pandya", "INC", CONGRESS_NOTE),
    ],
  },
  6: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 6 panel.",
    candidates: [
      candidate("Jyotsnaben Kiranbhai Chavda", "INC", CONGRESS_NOTE),
      candidate("Ramilaben Arjunbhai Dabhi", "INC", CONGRESS_NOTE),
      candidate("Rameshgiri Motigiri Goswami", "INC", CONGRESS_NOTE),
      candidate("Premal Mayurbhai Trivedi", "INC", CONGRESS_NOTE),
    ],
  },
  7: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 7 panel.",
    candidates: [
      candidate("Manishaben Parmar", "INC", CONGRESS_NOTE),
      candidate("Pujaben Prajapati", "INC", CONGRESS_NOTE),
      candidate("Parag Ratilal Panchal", "INC", CONGRESS_NOTE),
      candidate("Amitkumar Arvindbhai Ojha", "INC", CONGRESS_NOTE),
    ],
  },
  8: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 8 panel.",
    candidates: [
      candidate("Ramilaben Dineshji Thakor", "INC", CONGRESS_NOTE),
      candidate("Anitaben Salemi Goms", "INC", CONGRESS_NOTE),
      candidate("Manojbhai Haribhai Parmar", "INC", CONGRESS_NOTE),
      candidate("Sureshasinh Rohitasinh Viher", "INC", CONGRESS_NOTE),
    ],
  },
  9: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 9 panel.",
    candidates: [
      candidate("Shraddhaben Nomeshbhai Sheja", "INC", CONGRESS_NOTE),
      candidate("Shitalben Devendrabhai Kadiya", "INC", CONGRESS_NOTE),
      candidate("Maheshbhai Trikamlal Vaghela", "INC", CONGRESS_NOTE),
      candidate("Dineshbhai Harshadbhai Thakor", "INC", CONGRESS_NOTE),
    ],
  },
  10: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published three visible Ward 10 names in the accessible list.",
    candidates: [
      candidate("Jayaben Jitubhai Solanki", "INC", CONGRESS_NOTE),
      candidate("Kapilaben Jadav", "INC", CONGRESS_NOTE),
      candidate("Amit Ganpatbhai Nayak", "INC", CONGRESS_NOTE),
    ],
  },
  11: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 11 panel.",
    candidates: [
      candidate("Ankitaben Jigneshbhai Panchal", "INC", CONGRESS_NOTE),
      candidate("Romaben Shyamlal Ramani", "INC", CONGRESS_NOTE),
      candidate("Shanabhai Govindbhai Bhoi", "INC", CONGRESS_NOTE),
      candidate("Omprakash Tiwari", "INC", CONGRESS_NOTE),
    ],
  },
  12: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 12 panel.",
    candidates: [
      candidate("Kaminiben Mehulkumar Raval", "INC", CONGRESS_NOTE),
      candidate("Ridhyiben Bharatbhai Parmar", "INC", CONGRESS_NOTE),
      candidate("Jigneshbhai Mohanbhai Davda", "INC", CONGRESS_NOTE),
      candidate("Jigar Vyas", "INC", CONGRESS_NOTE),
    ],
  },
  13: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 13 panel.",
    candidates: [
      candidate("Chetnaben Gaurangbhai Rathod", "INC", CONGRESS_NOTE),
      candidate("Chhayaben Arvindkumar Sonvane", "INC", CONGRESS_NOTE),
      candidate("Bhavik Solanki", "INC", CONGRESS_NOTE),
      candidate("Devangkumar Ashok Pradhan", "INC", CONGRESS_NOTE),
    ],
  },
  14: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published three visible Ward 14 names in the accessible list.",
    candidates: [
      candidate("Kaminiben Jha", "INC", CONGRESS_NOTE),
      candidate("Parth Raghunath Desai", "INC", CONGRESS_NOTE),
      candidate("Nikulsinh Tomar", "INC", CONGRESS_NOTE),
    ],
  },
  15: {
    candidateStatus: "party_announced",
    candidateSummary: "Ahmedabad now has both BJP and Congress names visible in Ward 15 from current reporting.",
    candidates: [
      candidate("Pravin Patel", "BJP", "Ahmedabad Mirror reported this as part of BJP's Bapunagar panel on April 10, 2026."),
      candidate("Jayashriben Datta", "BJP", "Ahmedabad Mirror reported this as part of BJP's Bapunagar panel on April 10, 2026."),
      candidate("Gopal Shengaar", "BJP", "Ahmedabad Mirror reported this as part of BJP's Bapunagar panel on April 10, 2026."),
      candidate("Durgeshkuvar Narayansinh Sisodiya", "INC", CONGRESS_NOTE),
      candidate("Govindbhai Patni", "INC", CONGRESS_NOTE),
      candidate("Maneklal D. Thakor", "INC", CONGRESS_NOTE),
    ],
  },
  16: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 16 panel.",
    candidates: [
      candidate("Jayshreeben Devdattbhai Parmar", "INC", CONGRESS_NOTE),
      candidate("Darshanaben Vipulbhai Thakor", "INC", CONGRESS_NOTE),
      candidate("Rameshkumar S. Mali", "INC", CONGRESS_NOTE),
      candidate("Milap Bharatbhai Patel", "INC", CONGRESS_NOTE),
    ],
  },
  17: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 17 panel.",
    candidates: [
      candidate("Indiraben Shamjibhai Parmar", "INC", CONGRESS_NOTE),
      candidate("Ashaben Dantani", "INC", CONGRESS_NOTE),
      candidate("Brijesh Sharma", "INC", CONGRESS_NOTE),
      candidate("Akbar Husenbhai Bhatti", "INC", CONGRESS_NOTE),
    ],
  },
  18: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 18 panel.",
    candidates: [
      candidate("Miraben Makwana", "INC", CONGRESS_NOTE),
      candidate("Hetalben Riteshkumar Sarvaiya", "INC", CONGRESS_NOTE),
      candidate("Vinodbhai Umedji Thakor", "INC", CONGRESS_NOTE),
      candidate("Tejabhai Vanzol", "INC", CONGRESS_NOTE),
    ],
  },
  19: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 19 panel.",
    candidates: [
      candidate("Ashaben Vinodkumar Parmar", "INC", CONGRESS_NOTE),
      candidate("Hemlata Tejaskumar Bhatt", "INC", CONGRESS_NOTE),
      candidate("Jitendra Triklamlal Sharma", "INC", CONGRESS_NOTE),
      candidate("Avadh Ashikbhai Patel", "INC", CONGRESS_NOTE),
    ],
  },
  21: {
    candidateStatus: "party_announced",
    candidateSummary: "Recent reporting identified BJP's Umedsing Yadav in Kuber Nagar, but MyCityPulse has not yet verified the full 2026 ward panel.",
    candidates: [
      candidate(
        "Umedsing Yadav",
        "BJP",
        "Times of India reported on April 12, 2026 that BJP fielded Umedsing Yadav from Kubernagar ward.",
      ),
    ],
  },
  22: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published one visible Ward 22 name in the accessible list.",
    candidates: [candidate("Premilaben Yashwant Yogi", "INC", CONGRESS_NOTE)],
  },
  32: {
    candidateStatus: "party_announced",
    candidateSummary: "Current reporting confirms Shehzad Khan Pathan for Congress and Jamnaben Vegda for AAP in Danilimda, though MyCityPulse has not yet verified the full four-seat ward panel.",
    candidates: [
      candidate(
        "Shehzad Khan Pathan",
        "INC",
        "Times of India reported on April 12, 2026 that Shehzad Khan Pathan is contesting from Danilimda.",
      ),
      candidate(
        "Jamnaben Vegda",
        "AAP",
        "Times of India reported on April 12, 2026 that Jamnaben Vegda is contesting from Danilimda on an AAP ticket.",
      ),
    ],
  },
  34: {
    candidateStatus: "party_announced",
    candidateSummary: "Recent reporting identified BJP's Maulik Patel in Isanpur, but MyCityPulse has not yet verified the full 2026 ward panel.",
    candidates: [
      candidate(
        "Maulik Patel",
        "BJP",
        "Times of India reported on April 12, 2026 that BJP fielded Maulik Patel in Isanpur ward.",
      ),
    ],
  },
  40: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 40 panel.",
    candidates: [
      candidate("Surekhaben Rajendrabhai Chaudhary", "INC", CONGRESS_NOTE),
      candidate("Avaniben Prashantkumar Chauhan", "INC", CONGRESS_NOTE),
      candidate("Kapilbhai Desai", "INC", CONGRESS_NOTE),
      candidate("Pravinbhai Kantibhai Parmar", "INC", CONGRESS_NOTE),
    ],
  },
  41: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 41 panel.",
    candidates: [
      candidate("Gitaben Manishbhai Parmar", "INC", CONGRESS_NOTE),
      candidate("Payal Hasmukhbhai Patel", "INC", CONGRESS_NOTE),
      candidate("Darji Vijaybhai Jayantibhai", "INC", CONGRESS_NOTE),
      candidate("Sandip Bhikhabhai Patel", "INC", CONGRESS_NOTE),
    ],
  },
  42: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 42 panel.",
    candidates: [
      candidate("Priyankaben Janakkumar Parekh", "INC", CONGRESS_NOTE),
      candidate("Nehaben Jitendrabhai Patel", "INC", CONGRESS_NOTE),
      candidate("Kirankumar Dhulabhai Ojha", "INC", CONGRESS_NOTE),
      candidate("Rajendrakumar Ramanlal Sengar", "INC", CONGRESS_NOTE),
    ],
  },
  43: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 43 panel.",
    candidates: [
      candidate("Falguniben Narayanbhai Desai", "INC", CONGRESS_NOTE),
      candidate("Sangitaben Selvaraj Gounder", "INC", CONGRESS_NOTE),
      candidate("Gaurangbhai Maganbhai Makwana", "INC", CONGRESS_NOTE),
      candidate("Tilakram Ramsurat Tiwari", "INC", CONGRESS_NOTE),
    ],
  },
  44: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a full Ward 44 panel.",
    candidates: [
      candidate("Bhavanaben Upadhyay", "INC", CONGRESS_NOTE),
      candidate("Tarunaben Patre", "INC", CONGRESS_NOTE),
      candidate("Sanjaybhai Gadhvi", "INC", CONGRESS_NOTE),
      candidate("Apurva Patel", "INC", CONGRESS_NOTE),
    ],
  },
  45: {
    candidateStatus: "party_announced",
    candidateSummary: "Congress published a visible Ward 45 panel in the accessible list.",
    candidates: [
      candidate("Chauhan Kusumben Kanubhai", "INC", CONGRESS_NOTE),
      candidate("Ranjanben Jagdish Purohit", "INC", CONGRESS_NOTE),
      candidate("Mehul Trilokbhai Prajapati", "INC", CONGRESS_NOTE),
      candidate("Harsh Dilipray Yagnik", "INC", CONGRESS_NOTE),
    ],
  },
  47: {
    candidateStatus: "party_announced",
    candidateSummary: "Recent reporting identified BJP's Kranti Maulik Ashok Bhatt in Paldi, but MyCityPulse has not yet verified the full 2026 ward panel.",
    candidates: [
      candidate(
        "Kranti Maulik Ashok Bhatt (Kranti Koumil Gandhi)",
        "BJP",
        "Times of India reported on April 12, 2026 that BJP fielded Kranti Maulik Ashok Bhatt from Paldi ward.",
      ),
    ],
  },
  48: {
    candidateStatus: "party_announced",
    candidateSummary: "Withdrawal-day reporting confirms BJP's Bhagwati Bharwad was declared elected unopposed in Vasna, but MyCityPulse has not yet verified the rest of the ward panel.",
    candidates: [
      candidate(
        "Bhagwati Bharwad",
        "BJP",
        "Times of India reported on April 16, 2026 that Bhagwati Bharwad was declared elected unopposed in Vasna ward.",
      ),
    ],
  },
});

export const AHMEDABAD_WARDS_2026 = baseWards.map((entry) => ({
  ...entry,
  ...(candidateInfoByWard[entry.number] || {
    candidateStatus: "party_announced",
    candidateSummary:
      "BJP's full Ahmedabad ward slate was announced on April 10, 2026, but MyCityPulse has not yet verified the individual candidate names for this ward.",
    candidates: [],
  }),
}));

export const AHMEDABAD_ELECTION_2026 = {
  year: 2026,
  status: "candidate_updates",
  lastUpdated: "2026-04-18T08:45:00+05:30",
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
    lastReviewed: "2026-04-18",
    officialFinalWards: 0,
    partyAnnouncedWards: AHMEDABAD_WARDS_2026.filter((wardEntry) => wardEntry.candidateStatus === "party_announced").length,
    namedEntries: AHMEDABAD_WARDS_2026.reduce((sum, wardEntry) => sum + wardEntry.candidates.length, 0),
    statusNote:
      "MyCityPulse now treats all 48 Ahmedabad wards as live candidate-tracker wards because BJP's full AMC slate was announced on April 10, 2026. Individual names are shown where MyCityPulse has verified them from ward-wise Congress, BJP, and withdrawal-day reporting through April 16-18.",
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
      note: "Congress first list plus BJP ward panels reported on April 10, 2026",
      url: "https://www.ahmedabadmirror.com/gujarat-civic-polls/81910963.html",
    },
    {
      label: "Ahmedabad Congress candidate list",
      note: "Ward-wise Congress candidate names published during the April 2026 nomination phase",
      url: "https://voterlist.co.in/congress-candidate-list-for-vadodra-ahmedabad-municipal-election-2026/",
    },
    {
      label: "Ahmedabad Mirror BJP panel report",
      note: "BJP ward panels reported as selected candidates for AMC wards",
      url: "https://www.ahmedabadmirror.com/bjp-calls-candidates-for-ahmedabad-municipal-polls-list-announced/81911300.html",
    },
    {
      label: "DeshGujarat Ahmedabad BJP list",
      note: "Report confirming BJP announced all 192 AMC candidates ward-wise on April 10, 2026",
      url: "https://deshgujarat.com/2026/04/10/gujarat-bjp-declares-list-of-candidates-for-ahmedabad-municipal-corporation-amc-election/",
    },
    {
      label: "TOI Ahmedabad BJP full slate",
      note: "TOI report confirming BJP declared all 192 AMC candidates by April 11, 2026",
      url: "https://timesofindia.indiatimes.com/city/ahmedabad/civic-polls-bjp-repeats-only-32-sitting-councillors-in-ahmedabad/articleshow/130178920.cms",
    },
    {
      label: "TOI Ahmedabad withdrawal update",
      note: "Withdrawal-day changes including name swaps reported on April 15, 2026",
      url: "https://timesofindia.indiatimes.com/city/ahmedabad",
    },
  ],
};
