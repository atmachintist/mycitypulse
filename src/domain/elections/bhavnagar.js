import { createGujaratElection, createNumberedWards } from "./createGujaratElection.js";

const BHAVNAGAR_WARDS_2026 = createNumberedWards({
  cityName: "Bhavnagar",
  totalWards: 13,
  zone: "Municipal",
  officeAddress:
    "Bhavnagar Municipal Corporation headquarters, Bhavnagar Mahanagar Seva Sadan, Sir Mangal Sinhji Road, Near Kalanala, Bhavnagar.",
});

export const BHAVNAGAR_ELECTION_2026 = createGujaratElection({
  cityName: "Bhavnagar",
  body: "Bhavnagar Municipal Corporation (BMC)",
  status: "ward_directory",
  wards: BHAVNAGAR_WARDS_2026,
  seatsTotal: 52,
  lastUpdated: "2026-04-13T18:45:00+05:30",
  scopeNote:
    "Bhavnagar's election desk now reflects the post-nomination phase as of April 13, 2026. Candidate announcements and filed nominations are in motion, but ward-wise candidate names are still being verified before MyCityPulse attaches them to specific wards.",
  sources: [
    {
      label: "Bhavnagar Municipal Corporation official site",
      note: "Official BMC headquarters and civic site",
      url: "https://bmcgujarat.com/",
    },
    {
      label: "Bhavnagar BMC about page",
      note: "Official corporation overview and contact details",
      url: "https://bmcgujarat.com/en/corporation/bmc/about-bmc/",
    },
    {
      label: "List of municipal corporations in India",
      note: "Reference for Bhavnagar's 13-ward corporation structure",
      url: "https://en.wikipedia.org/wiki/List_of_municipal_corporations_in_India",
    },
  ],
});
