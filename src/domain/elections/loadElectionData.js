const ELECTION_LOADERS = {
  Ahmedabad: () => import("./ahmedabad.js").then((module) => module.AHMEDABAD_ELECTION_2026),
  Surat: () => import("./surat.js").then((module) => module.SURAT_ELECTION_2026),
  Vadodara: () => import("./vadodara.js").then((module) => module.VADODARA_ELECTION_2026),
  Rajkot: () => import("./rajkot.js").then((module) => module.RAJKOT_ELECTION_2026),
  Bhavnagar: () => import("./bhavnagar.js").then((module) => module.BHAVNAGAR_ELECTION_2026),
  Jamnagar: () => import("./jamnagar.js").then((module) => module.JAMNAGAR_ELECTION_2026),
  Junagadh: () => import("./junagadh.js").then((module) => module.JUNAGADH_ELECTION_2026),
  Gandhinagar: () => import("./gandhinagar.js").then((module) => module.GANDHINAGAR_ELECTION_2026),
  Anand: () => import("./anand.js").then((module) => module.ANAND_ELECTION_2026),
  Nadiad: () => import("./nadiad.js").then((module) => module.NADIAD_ELECTION_2026),
  Mehsana: () => import("./mehsana.js").then((module) => module.MEHSANA_ELECTION_2026),
  Morbi: () => import("./morbi.js").then((module) => module.MORBI_ELECTION_2026),
  Surendranagar: () => import("./surendranagar.js").then((module) => module.SURENDRANAGAR_ELECTION_2026),
  Bharuch: () => import("./bharuch.js").then((module) => module.BHARUCH_ELECTION_2026),
  Porbandar: () => import("./porbandar.js").then((module) => module.PORBANDAR_ELECTION_2026),
  Navsari: () => import("./navsari.js").then((module) => normalizeNewStyle(module.NAVSARI_ELECTION_DATA_2026)),
  Gandhidham: () => import("./gandhidham.js").then((module) => normalizeNewStyle(module.GANDHIDHAM_ELECTION_DATA_2026)),
  Vapi: () => import("./vapi.js").then((module) => normalizeNewStyle(module.VAPI_ELECTION_DATA_2026)),
};

// Newer election modules (Navsari/Gandhidham/Vapi) use totalWards/totalSeats
// while older ones use wards_total/seats_total. Normalize so every consumer —
// UI and the validator — sees the same shape.
function normalizeNewStyle(data) {
  if (!data) return null;
  const wards = Array.isArray(data.wards) ? data.wards : [];
  return {
    ...data,
    wards_total: data.wards_total ?? data.totalWards ?? wards.length,
    seats_total: data.seats_total ?? data.totalSeats ?? wards.length * 4,
    election_date: data.election_date ?? data.pollingDate,
    result_date: data.result_date ?? data.countingDate,
  };
}

export async function loadElectionData(cityName) {
  const loader = ELECTION_LOADERS[cityName];

  if (!loader) {
    return null;
  }

  return loader();
}
