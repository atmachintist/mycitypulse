const ELECTION_LOADERS = {
  Ahmedabad: () => import("./ahmedabad.js").then((module) => module.AHMEDABAD_ELECTION_2026),
  Surat: () => import("./surat.js").then((module) => module.SURAT_ELECTION_2026),
  Vadodara: () => import("./vadodara.js").then((module) => module.VADODARA_ELECTION_2026),
  Rajkot: () => import("./rajkot.js").then((module) => module.RAJKOT_ELECTION_2026),
};

export async function loadElectionData(cityName) {
  const loader = ELECTION_LOADERS[cityName];

  if (!loader) {
    return null;
  }

  return loader();
}
