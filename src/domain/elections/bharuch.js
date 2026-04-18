import { createAwaitingWard, createGujaratElection } from "./createGujaratElection.js";

const BHARUCH_WARDS_2026 = [
  createAwaitingWard(1, "Bharuch (M) - Ward No.1", "Municipal", "Bharuch Municipality headquarters. Confirm the latest ward-office details locally until a dedicated corporation-style ward directory is published."),
  createAwaitingWard(2, "Bharuch (M) - Ward No.2", "Municipal", "Bharuch Municipality headquarters. Confirm the latest ward-office details locally until a dedicated corporation-style ward directory is published."),
  createAwaitingWard(3, "Bharuch (M) - Ward No.3", "Municipal", "Bharuch Municipality headquarters. Confirm the latest ward-office details locally until a dedicated corporation-style ward directory is published."),
  createAwaitingWard(4, "Bharuch (M) - Ward No.4", "Municipal", "Bharuch Municipality headquarters. Confirm the latest ward-office details locally until a dedicated corporation-style ward directory is published."),
  createAwaitingWard(5, "Bharuch (M) - Ward No.5", "Municipal", "Bharuch Municipality headquarters. Confirm the latest ward-office details locally until a dedicated corporation-style ward directory is published."),
  createAwaitingWard(6, "Bharuch (M) - Ward No.6", "Municipal", "Bharuch Municipality headquarters. Confirm the latest ward-office details locally until a dedicated corporation-style ward directory is published."),
  createAwaitingWard(7, "Bharuch (M) - Ward No.7", "Municipal", "Bharuch Municipality headquarters. Confirm the latest ward-office details locally until a dedicated corporation-style ward directory is published."),
  createAwaitingWard(8, "Bharuch (M) - Ward No.8", "Municipal", "Bharuch Municipality headquarters. Confirm the latest ward-office details locally until a dedicated corporation-style ward directory is published."),
  createAwaitingWard(9, "Bharuch (M) - Ward No.9", "Municipal", "Bharuch Municipality headquarters. Confirm the latest ward-office details locally until a dedicated corporation-style ward directory is published."),
  createAwaitingWard(13, "Bharuch (M) - Ward No.13", "Municipal", "Bharuch Municipality headquarters. Confirm the latest ward-office details locally until a dedicated corporation-style ward directory is published."),
  createAwaitingWard(14, "Bharuch (M) - Ward No.14", "Municipal", "Bharuch Municipality headquarters. Confirm the latest ward-office details locally until a dedicated corporation-style ward directory is published."),
];

export const BHARUCH_ELECTION_2026 = createGujaratElection({
  cityName: "Bharuch",
  body: "Bharuch Municipality",
  status: "ward_directory",
  wards: BHARUCH_WARDS_2026,
  seatsTotal: 44,
  lastUpdated: "2026-04-13T18:45:00+05:30",
  scopeNote:
    "Bharuch's election desk now reflects the post-nomination phase as of April 13, 2026. Candidate announcements and filed nominations are in motion, while ward-wise candidate names still await verification before publication.",
  sources: [
    {
      label: "Bharuch Municipality wards",
      note: "Ward list used as the current civic baseline for Bharuch",
      url: "https://civicatlas.in/municipality-bharuch-251222",
    },
    {
      label: "Bharuch district portal",
      note: "District government portal for Bharuch",
      url: "https://bharuch.gujarat.gov.in/",
    },
  ],
});
