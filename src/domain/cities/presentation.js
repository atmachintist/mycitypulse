export const STRESS = {
  Critical: { color: "#e63946", bg: "#fff0f0", bar: 5, tagline: "Immediate civic attention needed" },
  High: { color: "#f4a261", bg: "#fff7ee", bar: 4, tagline: "Significant stress across services" },
  Elevated: { color: "#e9c46a", bg: "#fffbee", bar: 3, tagline: "Notable pressure, watch closely" },
  Moderate: { color: "#2dc653", bg: "#f0fff4", bar: 2, tagline: "Manageable with sustained effort" },
  Stable: { color: "#0096c7", bg: "#f0f8ff", bar: 1, tagline: "Relatively well-functioning" },
};

export const TYPO_C = {
  "Gravity City": "#e63946",
  "Overnight City": "#f4a261",
  "Ancient Pulse": "#9b5de5",
  "Blueprint City": "#0096c7",
  "Sleeping Giant": "#2dc653",
  "Border Effect City": "#00b4d8",
  "Managed Growth City": "#d4ac0d",
  "Compact Agglomeration": "#ff6b6b",
};

export const TYPO_LABEL = {
  "Gravity City": "Anchor City",
  "Overnight City": "Rapid-Growth City",
  "Ancient Pulse": "Historic City",
  "Blueprint City": "Planned City",
  "Sleeping Giant": "Underinvested City",
  "Border Effect City": "Border City",
  "Managed Growth City": "Managed-Growth City",
  "Compact Agglomeration": "Dense Satellite City",
};

export const TYPO_PUBLIC_DESC = {
  "Gravity City": "A city that pulls jobs, capital, institutions, and migration from a wide surrounding region.",
  "Overnight City": "Expanded quickly in one or two generations, often on the back of industry, real estate, or tech. Infrastructure is still catching up.",
  "Ancient Pulse": "A long-settled urban center where older street patterns, institutions, and heritage continue to shape daily life.",
  "Blueprint City": "Large parts of the city were laid out deliberately by planners, public agencies, or industrial builders before full growth arrived.",
  "Sleeping Giant": "A large city with strategic importance, but weaker investment, governance, or economic pull than its size suggests.",
  "Border Effect City": "Its economy and governance are shaped by a state border, national border, cantonment, or similar frontier condition.",
  "Managed Growth City": "Growing quickly, but has so far absorbed expansion more effectively than many peer cities.",
  "Compact Agglomeration": "A very dense city tied closely to a larger metro, often carrying spillover population and infrastructure pressure.",
};

const W = (fileName) => `https://commons.wikimedia.org/wiki/Special:FilePath/${fileName}`;

export const CITY_IMAGES = {
  Delhi: W("India_Gate-Delhi_India11.JPG"),
  Mumbai: W("Mumbai_03-2016_30_Gateway_of_India.jpg"),
  Kolkata: W("Howrah_bridge_at_night.jpg"),
  Bengaluru: W("Vidhana_Soudha_Bangalore.jpg"),
  Chennai: W("Marina_Beach,_Chennai_101.JPG"),
  Hyderabad: W("Charminar_Hyderabad.jpg"),
  Ahmedabad: W("Adalaj_step_well.jpg"),
  Surat: W("Surat_Castle.jpg"),
  Pune: W("Shaniwarwada_gate.JPG"),
  Jaipur: W("Hawa_Mahal,_Jaipur,_Rajasthan.JPG"),
  Lucknow: W("Bara_Imambara.jpg"),
  Indore: W("Rajwada_Indore.jpg"),
  Kanpur: W("Kanpur_City.jpg"),
  Nagpur: W("Deekshabhoomi_Nagpur.jpg"),
  Patna: W("Golghar_Patna.jpg"),
  Thane: W("Thane_city,_from_Yeoor_Hills_(48557019466).jpg"),
  Bhopal: W("Upper_Lake,_Bhopal.jpg"),
  Ghaziabad: W("Clock_House.jpg"),
  Visakhapatnam: W("Rushikonda_beach.jpg"),
  Vadodara: W("Laxmi_Vilas_Palace_(Maratha_Palace),_Vadodara.JPG"),
  "Pimpri-Chinchwad": W("Pimpri-Chinchwad.jpg"),
  Nashik: W("Trimbakeshwar_temple.jpg"),
  Faridabad: W("Suraj_Kund_Festival.JPG"),
  Ludhiana: W("Clock_Tower_Ludhiana.jpg"),
  Agra: W("Taj_Mahal_(Edited).jpeg"),
  Rajkot: W("Beautiful_sky_of_Rajkot_city.jpg"),
  Varanasi: W("Varanasi_ghats.jpg"),
  "Kalyan-Dombivli": W("Dombivli.jpg"),
  Coimbatore: W("Marudhamalai_temple.jpg"),
  Meerut: W("Meerut.jpg"),
  "Vasai-Virar": W("Entrance_arched_door_to_Bassein_Fort.JPG"),
  Madurai: W("Meenakshi_Amman_Temple,_Madurai.JPG"),
  Prayagraj: W("Triveni_Sangam.JPG"),
  Gurugram: W("Gurgaon-night-skyline.jpg"),
  "Navi Mumbai": W("Vashi_Navi_Mumbai.jpg"),
  "Chhatrapati Sambhajinagar": W("Bibi_ka_Maqbara.jpg"),
  Howrah: W("Howrah_Bridge.jpg"),
  Vijayawada: W("Kanka_Durga_Temple.JPG"),
  Srinagar: W("Dal_Lake,_Srinagar.jpg"),
  Jamshedpur: W("Jubilee_Park_Jamshedpur.jpg"),
  Ranchi: W("Hundru_Falls,_Ranchi.jpg"),
  Amritsar: W("Golden_Temple-Amritsar.JPG"),
  Guwahati: W("Kamakhya_Temple.jpg"),
  Jabalpur: W("Dhuandhar_falls.jpg"),
  Raipur: W("Raipur_Skyline_2019.png"),
  Asansol: W("Maithon_Dam.jpg"),
  Secunderabad: W("Secunderabad_railway_station_.jpg"),
  Dhanbad: W("Dhanbadcity.jpg"),
  Chandigarh: W("Rock_Garden_of_Chandigarh.jpg"),
  Gwalior: W("Gwalior_Fort.jpg"),
  "Mira Bhayandar": W("Mira_Road_Skyline.jpg"),
};

export function fmt(value) {
  if (value >= 10000000) return `${(value / 10000000).toFixed(1)} crore`;
  if (value >= 100000) return `${(value / 100000).toFixed(1)} lakh`;
  return value.toLocaleString();
}
