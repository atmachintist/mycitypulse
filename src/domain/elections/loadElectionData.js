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
};

export async function loadElectionData(cityName) {
  const loader = ELECTION_LOADERS[cityName];

  if (!loader) {
    return null;
  }

  return loader();
}
