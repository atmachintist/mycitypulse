// Data verification registry for the 15 Gujarat cities covered during the
// April 2026 civic polls. Keep the surface area small so the UI can render a
// low-token, trust-inducing badge next to any election fact.
//
// Source of truth (as of 2026-04-18):
//   https://sec-poll.gujarat.gov.in/Index.aspx
//   Gujarat State Election Commission (SEC) — municipal corporation schedule
//
// If we haven't yet independently cross-checked a specific field for a city,
// mark the field as `pending` and surface a visible "Pending SEC verification"
// chip so citizens never mistake unverified data for official data.

export const VERIFICATION_SOURCE = {
  name: "Gujarat State Election Commission",
  shortName: "SEC",
  url: "https://sec-poll.gujarat.gov.in/Index.aspx",
  asOf: "2026-04-18",
};

// status values:
//   "verified"  — cross-checked against SEC on VERIFICATION_SOURCE.asOf
//   "partial"   — schedule + ward count confirmed, candidate list evolving
//   "pending"   — not yet cross-checked — show an amber "Pending" chip
export const CITY_VERIFICATION_2026 = {
  // Cities currently in the live municipal-corporation poll set
  Ahmedabad:     { schedule: "verified", wards: "verified", candidates: "partial" },
  Surat:         { schedule: "verified", wards: "verified", candidates: "partial" },
  Vadodara:      { schedule: "verified", wards: "verified", candidates: "partial" },
  Rajkot:        { schedule: "verified", wards: "verified", candidates: "partial" },
  Bhavnagar:     { schedule: "verified", wards: "verified", candidates: "partial" },
  Jamnagar:      { schedule: "verified", wards: "verified", candidates: "partial" },
  Anand:         { schedule: "verified", wards: "verified", candidates: "partial" },
  Nadiad:        { schedule: "verified", wards: "verified", candidates: "partial" },
  Mehsana:       { schedule: "verified", wards: "verified", candidates: "partial" },
  Morbi:         { schedule: "verified", wards: "verified", candidates: "partial" },
  Surendranagar: { schedule: "verified", wards: "verified", candidates: "partial" },
  Porbandar:     { schedule: "verified", wards: "verified", candidates: "partial" },
  Navsari:       { schedule: "verified", wards: "verified", candidates: "pending" },
  Gandhidham:    { schedule: "verified", wards: "verified", candidates: "pending" },
  Vapi:          { schedule: "verified", wards: "verified", candidates: "pending" },

  // Top-15 cities by population that are NOT in the current live poll set —
  // still shown for context but everything is "pending" so the site never
  // implies a live corporation poll where there is none.
  Junagadh:      { schedule: "pending",  wards: "pending",  candidates: "pending" },
  Gandhinagar:   { schedule: "pending",  wards: "pending",  candidates: "pending" },
  Bharuch:       { schedule: "pending",  wards: "pending",  candidates: "pending" },
};

export const VERIFICATION_LABELS = {
  verified: { label: "SEC verified", tone: "verified", icon: "\u2713" },
  partial:  { label: "Partial SEC confirmation", tone: "partial", icon: "\u25D0" },
  pending:  { label: "Pending SEC verification", tone: "pending", icon: "!" },
};

export function getCityVerification(cityName) {
  return CITY_VERIFICATION_2026[cityName] || {
    schedule: "pending",
    wards: "pending",
    candidates: "pending",
  };
}

export function getOverallVerification(cityName) {
  const status = getCityVerification(cityName);
  const values = Object.values(status);

  if (values.every((v) => v === "verified")) return "verified";
  if (values.some((v) => v === "verified" || v === "partial")) return "partial";
  return "pending";
}
