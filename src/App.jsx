import { useState, useEffect, useRef, useCallback } from "react";

// ─── City Data ────────────────────────────────────────────────────────────────
const cities = [
  { rank:1, city:"Delhi", state:"Delhi", population:33807000, area:1484, density:22781, tier:"Mega Metro", density_descriptor:"Very Dense", urban_typology:"Gravity City", one_liner:"The republic's beating heart — every road, policy, and ambition seems to lead here.", stress:"Critical", stress_reason:"Extreme density, severe waste processing gap, governance fragmentation", formerName:null, aliases:["New Delhi","NCT"] },
  { rank:2, city:"Mumbai", state:"Maharashtra", population:21297000, area:603.4, density:35295, tier:"Mega Metro", density_descriptor:"Extremely Dense", urban_typology:"Gravity City", one_liner:"An island city that ran out of land but never stopped growing.", stress:"Critical", stress_reason:"Extreme density, legacy dumpsites, coastal vulnerability", formerName:"Bombay", aliases:["Bombay"] },
  { rank:3, city:"Kolkata", state:"West Bengal", population:15134000, area:205, density:73824, tier:"Mega Metro", density_descriptor:"Extremely Dense", urban_typology:"Gravity City", one_liner:"Once the capital of British India, carrying the weight of empire, partition, and reinvention.", stress:"Critical", stress_reason:"World's highest density major city, ageing infrastructure, drainage stress", formerName:"Calcutta", aliases:["Calcutta"] },
  { rank:4, city:"Bengaluru", state:"Karnataka", population:14678000, area:741, density:19808, tier:"Mega Metro", density_descriptor:"Very Dense", urban_typology:"Overnight City", one_liner:"A cantonment town that became a global tech capital in one generation.", stress:"High", stress_reason:"Rapid growth outpacing infrastructure, water scarcity, traffic gridlock", formerName:"Bangalore", aliases:["Bangalore"] },
  { rank:5, city:"Chennai", state:"Tamil Nadu", population:11503000, area:426, density:27002, tier:"Mega Metro", density_descriptor:"Extremely Dense", urban_typology:"Gravity City", one_liner:"South India's gateway to the world.", stress:"High", stress_reason:"High density, flood vulnerability, water stress cycles", formerName:"Madras", aliases:["Madras"] },
  { rank:6, city:"Hyderabad", state:"Telangana", population:10534000, area:650, density:16206, tier:"Mega Metro", density_descriptor:"Very Dense", urban_typology:"Overnight City", one_liner:"A city of Nizams and now of tech unicorns.", stress:"High", stress_reason:"Rapid tech-led growth, peri-urban sprawl, lake encroachment", formerName:null, aliases:["Cyberabad","Hyd"] },
  { rank:7, city:"Ahmedabad", state:"Gujarat", population:8450000, area:505, density:16733, tier:"Major City", density_descriptor:"Very Dense", urban_typology:"Overnight City", one_liner:"India's first UNESCO World Heritage City.", stress:"High", stress_reason:"Dense old city core, industrial pollution, heat island effect", formerName:null, aliases:["Amdavad","AMD"] },
  { rank:8, city:"Surat", state:"Gujarat", population:7784000, area:326.5, density:23841, tier:"Major City", density_descriptor:"Very Dense", urban_typology:"Overnight City", one_liner:"Survived a plague and rebuilt into one of India's best-managed municipalities.", stress:"Elevated", stress_reason:"High density but strong municipal track record; migration pressure rising", formerName:null, aliases:[] },
  { rank:9, city:"Pune", state:"Maharashtra", population:7764000, area:331.3, density:23435, tier:"Major City", density_descriptor:"Very Dense", urban_typology:"Overnight City", one_liner:"Mumbai's younger, more breathable neighbour.", stress:"Elevated", stress_reason:"Fast growth, water stress, periurban planning gaps", formerName:"Poona", aliases:["Poona"] },
  { rank:10, city:"Jaipur", state:"Rajasthan", population:4161000, area:467, density:8910, tier:"Major City", density_descriptor:"Moderately Dense", urban_typology:"Ancient Pulse", one_liner:"The Pink City, built in a perfect grid in 1727.", stress:"Elevated", stress_reason:"Heritage-growth tension, water scarcity, tourism pressure", formerName:null, aliases:["Pink City"] },
  { rank:11, city:"Lucknow", state:"Uttar Pradesh", population:3879000, area:349, density:11115, tier:"Major City", density_descriptor:"Moderately Dense", urban_typology:"Sleeping Giant", one_liner:"The city of nawabs and tehzeeb.", stress:"High", stress_reason:"Underinvestment relative to size, Gomti river stress, waste processing gaps", formerName:null, aliases:["Lakhnau"] },
  { rank:12, city:"Indore", state:"Madhya Pradesh", population:3276000, area:530, density:6181, tier:"Major City", density_descriptor:"Moderate", urban_typology:"Managed Growth City", one_liner:"India's cleanest city for seven consecutive years.", stress:"Moderate", stress_reason:"Strong SWM track record; growth pressure on western periphery", formerName:null, aliases:[] },
  { rank:13, city:"Kanpur", state:"Uttar Pradesh", population:3144000, area:403.7, density:7788, tier:"Major City", density_descriptor:"Moderate", urban_typology:"Sleeping Giant", one_liner:"Once the Manchester of the East.", stress:"High", stress_reason:"Industrial decline, Ganga pollution, chronic underinvestment", formerName:"Cawnpore", aliases:["Cawnpore","Cawnpur"] },
  { rank:14, city:"Nagpur", state:"Maharashtra", population:2923000, area:227.3, density:12860, tier:"Major City", density_descriptor:"Moderately Dense", urban_typology:"Blueprint City", one_liner:"The geographic centre of India.", stress:"Moderate", stress_reason:"Planned layout helps; summer heat stress and water supply gaps persist", formerName:null, aliases:["Orange City"] },
  { rank:15, city:"Patna", state:"Bihar", population:2474000, area:136, density:18191, tier:"Major City", density_descriptor:"Very Dense", urban_typology:"Sleeping Giant", one_liner:"Capital of ancient Magadha and the Mauryan empire.", stress:"Critical", stress_reason:"Very high density, flood-prone, severely stretched civic infrastructure", formerName:"Pataliputra", aliases:["Pataliputra"] },
  { rank:16, city:"Thane", state:"Maharashtra", population:2470000, area:147, density:16803, tier:"Large City", density_descriptor:"Very Dense", urban_typology:"Overnight City", one_liner:"Mumbai's pressure valve.", stress:"High", stress_reason:"Rapid densification, creek pollution, infrastructure lag", formerName:null, aliases:["Thana"] },
  { rank:17, city:"Bhopal", state:"Madhya Pradesh", population:2391000, area:463, density:5164, tier:"Large City", density_descriptor:"Moderate", urban_typology:"Blueprint City", one_liner:"A city of lakes carrying the permanent scar of 1984.", stress:"Elevated", stress_reason:"Lake encroachment, legacy contamination zones, uneven service delivery", formerName:null, aliases:["City of Lakes"] },
  { rank:18, city:"Ghaziabad", state:"Uttar Pradesh", population:2375000, area:210, density:11310, tier:"Large City", density_descriptor:"Moderately Dense", urban_typology:"Overnight City", one_liner:"Delhi's eastern gate.", stress:"High", stress_reason:"NCR spillover, air quality crisis, waste management gaps", formerName:null, aliases:["GZB"] },
  { rank:19, city:"Visakhapatnam", state:"Andhra Pradesh", population:2358000, area:530, density:4449, tier:"Large City", density_descriptor:"Moderate", urban_typology:"Sleeping Giant", one_liner:"A deep-water port city with every ingredient of greatness.", stress:"Elevated", stress_reason:"Industrial pollution, cyclone vulnerability, uneven infrastructure", formerName:null, aliases:["Vizag","Waltair"] },
  { rank:20, city:"Vadodara", state:"Gujarat", population:2300000, area:148, density:15541, tier:"Large City", density_descriptor:"Very Dense", urban_typology:"Managed Growth City", one_liner:"Gujarat's cultural capital.", stress:"Moderate", stress_reason:"Dense but well-managed; flood risk in low-lying areas", formerName:"Baroda", aliases:["Baroda"] },
  { rank:21, city:"Pimpri-Chinchwad", state:"Maharashtra", population:2273000, area:177, density:12842, tier:"Large City", density_descriptor:"Moderately Dense", urban_typology:"Blueprint City", one_liner:"Pune's industrial twin.", stress:"Moderate", stress_reason:"Planned industrial city; air quality concern", formerName:null, aliases:["PCMC","Pimpri","Chinchwad"] },
  { rank:22, city:"Nashik", state:"Maharashtra", population:1958000, area:259, density:7560, tier:"Large City", density_descriptor:"Moderate", urban_typology:"Ancient Pulse", one_liner:"On the Godavari, host to the Kumbh Mela.", stress:"Elevated", stress_reason:"Pilgrimage surge pressure, river health, periurban growth", formerName:null, aliases:["Nasik"] },
  { rank:23, city:"Faridabad", state:"Haryana", population:1880000, area:219, density:8584, tier:"Large City", density_descriptor:"Moderately Dense", urban_typology:"Overnight City", one_liner:"Delhi's industrial shadow.", stress:"High", stress_reason:"Among worst air quality in NCR, industrial waste, governance gaps", formerName:null, aliases:[] },
  { rank:24, city:"Ludhiana", state:"Punjab", population:1847000, area:310, density:5958, tier:"Large City", density_descriptor:"Moderate", urban_typology:"Overnight City", one_liner:"The hosiery and bicycle capital of India.", stress:"High", stress_reason:"Buddha Nullah pollution, dyeing industry effluents, unplanned growth", formerName:null, aliases:[] },
  { rank:25, city:"Agra", state:"Uttar Pradesh", population:1760000, area:188.4, density:9342, tier:"Large City", density_descriptor:"Moderately Dense", urban_typology:"Ancient Pulse", one_liner:"The city the Mughals built their empire around.", stress:"High", stress_reason:"Yamuna pollution, heritage-tourism pressure, air quality around Taj", formerName:null, aliases:["Taj City"] },
  { rank:26, city:"Rajkot", state:"Gujarat", population:1690000, area:170, density:9941, tier:"Large City", density_descriptor:"Moderately Dense", urban_typology:"Managed Growth City", one_liner:"Gandhi's childhood city.", stress:"Moderate", stress_reason:"Moderate density, reasonable governance; heat stress rising", formerName:null, aliases:[] },
  { rank:27, city:"Varanasi", state:"Uttar Pradesh", population:1680000, area:82, density:20488, tier:"Large City", density_descriptor:"Very Dense", urban_typology:"Ancient Pulse", one_liner:"Three thousand years of habitation in 82 square kilometres.", stress:"Critical", stress_reason:"Extreme density in ancient core, Ganga ghats under sewage stress", formerName:null, aliases:["Banaras","Benares","Kashi"] },
  { rank:28, city:"Kalyan-Dombivli", state:"Maharashtra", population:1654000, area:94, density:17596, tier:"Large City", density_descriptor:"Very Dense", urban_typology:"Overnight City", one_liner:"The city at the end of Mumbai's suburban rail line.", stress:"High", stress_reason:"Very dense, creek pollution, infrastructure designed for half its population", formerName:null, aliases:["Kalyan","Dombivli","KDMC"] },
  { rank:29, city:"Coimbatore", state:"Tamil Nadu", population:1601000, area:246.8, density:6487, tier:"Large City", density_descriptor:"Moderate", urban_typology:"Managed Growth City", one_liner:"The Manchester of South India.", stress:"Moderate", stress_reason:"Moderate density, diversified economy; water stress in dry years", formerName:null, aliases:["Kovai"] },
  { rank:30, city:"Meerut", state:"Uttar Pradesh", population:1590000, area:141.9, density:11205, tier:"Large City", density_descriptor:"Moderately Dense", urban_typology:"Sleeping Giant", one_liner:"Where the 1857 uprising began.", stress:"High", stress_reason:"Dense, chronically underinvested, air quality stress, drainage failures", formerName:null, aliases:[] },
  { rank:31, city:"Vasai-Virar", state:"Maharashtra", population:1581000, area:380, density:4161, tier:"Large City", density_descriptor:"Moderate", urban_typology:"Overnight City", one_liner:"Mumbai's furthest bedroom.", stress:"Elevated", stress_reason:"Rapid growth outpacing water and waste infrastructure", formerName:null, aliases:["Vasai","Virar","Bassein"] },
  { rank:32, city:"Madurai", state:"Tamil Nadu", population:1561000, area:147.9, density:10554, tier:"Large City", density_descriptor:"Moderately Dense", urban_typology:"Ancient Pulse", one_liner:"The city that never sleeps.", stress:"Elevated", stress_reason:"Dense ancient core, Vaigai river stress, pilgrimage pressure", formerName:null, aliases:["Temple City"] },
  { rank:33, city:"Prayagraj", state:"Uttar Pradesh", population:1536000, area:70.5, density:21787, tier:"Large City", density_descriptor:"Very Dense", urban_typology:"Ancient Pulse", one_liner:"At the confluence of three rivers, one invisible.", stress:"High", stress_reason:"Very dense ancient city, Ganga-Yamuna pollution, Kumbh surge stress", formerName:"Allahabad", aliases:["Allahabad","Ilahabad","Sangam City"] },
  { rank:34, city:"Gurugram", state:"Haryana", population:1514000, area:732, density:2068, tier:"Large City", density_descriptor:"Spacious", urban_typology:"Blueprint City", one_liner:"A paddy field in 1990, a city of glass towers by 2010.", stress:"Elevated", stress_reason:"Private infrastructure islands, no integrated civic governance, waterlogging", formerName:"Gurgaon", aliases:["Gurgaon","Millennium City"] },
  { rank:35, city:"Navi Mumbai", state:"Maharashtra", population:1500000, area:344, density:4360, tier:"Large City", density_descriptor:"Moderate", urban_typology:"Blueprint City", one_liner:"Designed to relieve Mumbai's pressure.", stress:"Moderate", stress_reason:"Planned city with reasonable services; creek health declining", formerName:null, aliases:["New Mumbai"] },
  { rank:36, city:"Chhatrapati Sambhajinagar", state:"Maharashtra", population:1492000, area:139.1, density:10726, tier:"Large City", density_descriptor:"Moderately Dense", urban_typology:"Ancient Pulse", one_liner:"Named after a Maratha warrior-king, neighbour to caves a millennium older.", stress:"Elevated", stress_reason:"Water scarcity, heritage-industrial tension, uneven service delivery", formerName:"Aurangabad", aliases:["Aurangabad","Sambhajinagar","CSN"] },
  { rank:37, city:"Howrah", state:"West Bengal", population:1492000, area:51.6, density:28915, tier:"Large City", density_descriptor:"Extremely Dense", urban_typology:"Compact Agglomeration", one_liner:"Across the Hooghly from Kolkata, a world apart.", stress:"Critical", stress_reason:"Extremely dense, ageing industrial infrastructure, drainage collapse risk", formerName:null, aliases:["Haora"] },
  { rank:38, city:"Vijayawada", state:"Andhra Pradesh", population:1393000, area:61.9, density:22504, tier:"Large City", density_descriptor:"Very Dense", urban_typology:"Gravity City", one_liner:"Commercial capital of a state that lost its capital.", stress:"High", stress_reason:"Very dense, Krishna river flood risk, rapid commercial growth", formerName:"Bezawada", aliases:["Bezawada"] },
  { rank:39, city:"Srinagar", state:"Jammu & Kashmir", population:1341000, area:294, density:4561, tier:"Large City", density_descriptor:"Moderate", urban_typology:"Border Effect City", one_liner:"A city of houseboats and chinar trees.", stress:"Elevated", stress_reason:"Dal Lake degradation, conflict-era infrastructure deficit", formerName:null, aliases:[] },
  { rank:40, city:"Jamshedpur", state:"Jharkhand", population:1337000, area:64, density:20891, tier:"Large City", density_descriptor:"Very Dense", urban_typology:"Blueprint City", one_liner:"A city Tata built from scratch in 1907.", stress:"Moderate", stress_reason:"Corporate governance maintains services; industrial pollution concern", formerName:null, aliases:["Tatanagar","Steel City"] },
  { rank:41, city:"Ranchi", state:"Jharkhand", population:1326000, area:175, density:7577, tier:"Large City", density_descriptor:"Moderate", urban_typology:"Sleeping Giant", one_liner:"Capital of a mineral-rich state that struggles to share its wealth.", stress:"High", stress_reason:"Rapid growth, water body encroachment, weak municipal capacity", formerName:null, aliases:[] },
  { rank:42, city:"Amritsar", state:"Punjab", population:1298000, area:150, density:8653, tier:"Large City", density_descriptor:"Moderately Dense", urban_typology:"Border Effect City", one_liner:"Sacred city, Partition wound, border economy.", stress:"Elevated", stress_reason:"Heritage core pressure, tourism surge, water stress", formerName:null, aliases:["Golden City","Ambarsar"] },
  { rank:43, city:"Guwahati", state:"Assam", population:1274000, area:216, density:5898, tier:"Large City", density_descriptor:"Moderate", urban_typology:"Gravity City", one_liner:"The northeast's only major city.", stress:"Elevated", stress_reason:"Brahmaputra flood risk, rapid growth, hillside encroachment", formerName:"Gauhati", aliases:["Gauhati"] },
  { rank:44, city:"Jabalpur", state:"Madhya Pradesh", population:1267000, area:367, density:3452, tier:"Large City", density_descriptor:"Moderate", urban_typology:"Sleeping Giant", one_liner:"A city of marble rocks and military cantonments.", stress:"Moderate", stress_reason:"Low density helps; water stress, underinvestment in services", formerName:null, aliases:["Jubbulpore"] },
  { rank:45, city:"Raipur", state:"Chhattisgarh", population:1254000, area:226, density:5549, tier:"Large City", density_descriptor:"Moderate", urban_typology:"Gravity City", one_liner:"Became a primate city overnight in 2000.", stress:"Elevated", stress_reason:"Young capital city still building civic infrastructure", formerName:null, aliases:[] },
  { rank:46, city:"Asansol", state:"West Bengal", population:1250000, area:127, density:9843, tier:"Large City", density_descriptor:"Moderately Dense", urban_typology:"Sleeping Giant", one_liner:"West Bengal's second city awaiting its second act.", stress:"High", stress_reason:"Post-industrial decline, dense housing, weak municipal revenue", formerName:null, aliases:[] },
  { rank:47, city:"Secunderabad", state:"Telangana", population:1200000, area:25, density:48000, tier:"Large City", density_descriptor:"Extremely Dense", urban_typology:"Compact Agglomeration", one_liner:"At 48,000 per sq km, one of India's most compressed urban spaces.", stress:"Critical", stress_reason:"Highest density in dataset, cantonment-civil governance split, no room to expand", formerName:null, aliases:[] },
  { rank:48, city:"Dhanbad", state:"Jharkhand", population:1196000, area:70, density:17086, tier:"Large City", density_descriptor:"Very Dense", urban_typology:"Blueprint City", one_liner:"India's coal capital.", stress:"High", stress_reason:"Mining subsidence, high density, coal dust, water contamination", formerName:null, aliases:["Coal Capital"] },
  { rank:49, city:"Chandigarh", state:"Chandigarh", population:1158000, area:114, density:10158, tier:"Large City", density_descriptor:"Moderately Dense", urban_typology:"Blueprint City", one_liner:"Le Corbusier's gift to a newly independent India.", stress:"Stable", stress_reason:"Planned city, strong green cover, good services; satellite town pressure growing", formerName:null, aliases:["City Beautiful"] },
  { rank:50, city:"Gwalior", state:"Madhya Pradesh", population:1153000, area:289, density:3990, tier:"Large City", density_descriptor:"Moderate", urban_typology:"Ancient Pulse", one_liner:"A fort city that controlled the heart of the subcontinent for centuries.", stress:"Moderate", stress_reason:"Low density, moderate services; water scarcity and air quality concerns", formerName:null, aliases:[] },
];

const THRESHOLD_RISING = 25;
const THRESHOLD_QUEUED = 100;

const STRESS = {
  "Critical": { color:"#e63946", bg:"#fff0f0", bar:5, tagline:"Immediate civic attention needed" },
  "High":     { color:"#f4a261", bg:"#fff7ee", bar:4, tagline:"Significant stress across services" },
  "Elevated": { color:"#e9c46a", bg:"#fffbee", bar:3, tagline:"Notable pressure, watch closely" },
  "Moderate": { color:"#2dc653", bg:"#f0fff4", bar:2, tagline:"Manageable with sustained effort" },
  "Stable":   { color:"#0096c7", bg:"#f0f8ff", bar:1, tagline:"Relatively well-functioning" },
};

const TYPO_C = {
  "Gravity City":"#e63946","Overnight City":"#f4a261","Ancient Pulse":"#9b5de5",
  "Blueprint City":"#0096c7","Sleeping Giant":"#2dc653","Border Effect City":"#00b4d8",
  "Managed Growth City":"#d4ac0d","Compact Agglomeration":"#ff6b6b",
};

// ─── Tag definitions ──────────────────────────────────────────────────────────
// Each civic topic tag has an id (used in data), a display label, an emoji
// for quick visual scanning, and a colour that appears consistently across chips,
// article badges, and keyword rows throughout the feed.
const ALL_TAGS = [
  { id:"waste",          label:"Waste",          emoji:"🗑️" },
  { id:"water",          label:"Water",          emoji:"💧" },
  { id:"traffic",        label:"Traffic",        emoji:"🚦" },
  { id:"air",            label:"Air Quality",    emoji:"🌫️" },
  { id:"flood",          label:"Flooding",       emoji:"🌊" },
  { id:"infrastructure", label:"Infrastructure", emoji:"🏗️" },
  { id:"livability",     label:"Livability",     emoji:"🏙️" },
  { id:"governance",     label:"Governance",     emoji:"🏛️" },
];

const TAG_COLORS = {
  waste:"#e63946", water:"#0096c7", traffic:"#f4a261", air:"#9b5de5",
  flood:"#00b4d8", infrastructure:"#d4ac0d", livability:"#2dc653", governance:"#888",
};


// ─── City image map ───────────────────────────────────────────────────────────
// One curated Wikimedia Commons image per city (CC-licensed, free to use).
// Chosen for iconic recognisability — these are the images that define each city
// in the public imagination, not generic stock photography.
const CITY_IMAGES = {
  "Delhi":                    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Lotus_temple_at_dusk.jpg/1280px-Lotus_temple_at_dusk.jpg",
  "Mumbai":                   "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Mumbai_03-2016_30_Gateway_of_India.jpg/1280px-Mumbai_03-2016_30_Gateway_of_India.jpg",
  "Kolkata":                  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Howrah_bridge_from_river.jpg/1280px-Howrah_bridge_from_river.jpg",
  "Bengaluru":                "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Vidhana_Soudha_Bangalore.jpg/1280px-Vidhana_Soudha_Bangalore.jpg",
  "Chennai":                  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Marina_Beach_in_Evening.jpg/1280px-Marina_Beach_in_Evening.jpg",
  "Hyderabad":                "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Charminar_Hyderabad.jpg/1280px-Charminar_Hyderabad.jpg",
  "Ahmedabad":                "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Ahmed_Shah_Mosque%2C_Ahmedabad.jpg/1280px-Ahmed_Shah_Mosque%2C_Ahmedabad.jpg",
  "Surat":                    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Surat_Castle.jpg/1280px-Surat_Castle.jpg",
  "Pune":                     "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Shaniwar_Wada_gate.jpg/1280px-Shaniwar_Wada_gate.jpg",
  "Jaipur":                   "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Hawa_Mahal%2C_Jaipur%2C_India_01.jpg/1280px-Hawa_Mahal%2C_Jaipur%2C_India_01.jpg",
  "Lucknow":                  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Bara_Imambara.jpg/1280px-Bara_Imambara.jpg",
  "Indore":                   "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Rajwada_Indore.jpg/1280px-Rajwada_Indore.jpg",
  "Kanpur":                   "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Kanpur_railway_station.jpg/1280px-Kanpur_railway_station.jpg",
  "Nagpur":                   "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Deekshabhoomi%2C_Nagpur.jpg/1280px-Deekshabhoomi%2C_Nagpur.jpg",
  "Patna":                    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Golghar_Patna.jpg/1280px-Golghar_Patna.jpg",
  "Thane":                    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Upvan_Lake_Thane.jpg/1280px-Upvan_Lake_Thane.jpg",
  "Bhopal":                   "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Upper_Lake%2C_Bhopal.jpg/1280px-Upper_Lake%2C_Bhopal.jpg",
  "Ghaziabad":                "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Lotus_temple_at_dusk.jpg/1280px-Lotus_temple_at_dusk.jpg",
  "Visakhapatnam":            "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Rushikonda_Beach_Visakhapatnam.jpg/1280px-Rushikonda_Beach_Visakhapatnam.jpg",
  "Vadodara":                 "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Laxmi_Vilas_Palace_Vadodara.jpg/1280px-Laxmi_Vilas_Palace_Vadodara.jpg",
  "Pimpri-Chinchwad":         "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Shaniwar_Wada_gate.jpg/1280px-Shaniwar_Wada_gate.jpg",
  "Nashik":                   "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Trimbakeshwar_Temple_Nashik.jpg/1280px-Trimbakeshwar_Temple_Nashik.jpg",
  "Faridabad":                "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Surajkund_Lake_Faridabad.jpg/1280px-Surajkund_Lake_Faridabad.jpg",
  "Ludhiana":                 "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Vidhana_Soudha_Bangalore.jpg/1280px-Vidhana_Soudha_Bangalore.jpg",
  "Agra":                     "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/1280px-Taj_Mahal_%28Edited%29.jpeg",
  "Rajkot":                   "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Surat_Castle.jpg/1280px-Surat_Castle.jpg",
  "Varanasi":                 "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Varanasi_Ghats_at_Dawn.jpg/1280px-Varanasi_Ghats_at_Dawn.jpg",
  "Kalyan-Dombivli":          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Mumbai_03-2016_30_Gateway_of_India.jpg/1280px-Mumbai_03-2016_30_Gateway_of_India.jpg",
  "Coimbatore":               "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Marina_Beach_in_Evening.jpg/1280px-Marina_Beach_in_Evening.jpg",
  "Meerut":                   "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Lotus_temple_at_dusk.jpg/1280px-Lotus_temple_at_dusk.jpg",
  "Vasai-Virar":              "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Mumbai_03-2016_30_Gateway_of_India.jpg/1280px-Mumbai_03-2016_30_Gateway_of_India.jpg",
  "Madurai":                  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Meenakshi_Amman_Temple_Madurai.jpg/1280px-Meenakshi_Amman_Temple_Madurai.jpg",
  "Prayagraj":                "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Sangam%2C_Prayagraj.jpg/1280px-Sangam%2C_Prayagraj.jpg",
  "Gurugram":                 "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Vidhana_Soudha_Bangalore.jpg/1280px-Vidhana_Soudha_Bangalore.jpg",
  "Navi Mumbai":              "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Mumbai_03-2016_30_Gateway_of_India.jpg/1280px-Mumbai_03-2016_30_Gateway_of_India.jpg",
  "Chhatrapati Sambhajinagar":"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Bibi_ka_Maqbara.jpg/1280px-Bibi_ka_Maqbara.jpg",
  "Howrah":                   "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Howrah_bridge_from_river.jpg/1280px-Howrah_bridge_from_river.jpg",
  "Vijayawada":               "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Rushikonda_Beach_Visakhapatnam.jpg/1280px-Rushikonda_Beach_Visakhapatnam.jpg",
  "Srinagar":                 "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Dal_Lake%2C_Srinagar.jpg/1280px-Dal_Lake%2C_Srinagar.jpg",
  "Jamshedpur":               "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Upper_Lake%2C_Bhopal.jpg/1280px-Upper_Lake%2C_Bhopal.jpg",
  "Ranchi":                   "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Upper_Lake%2C_Bhopal.jpg/1280px-Upper_Lake%2C_Bhopal.jpg",
  "Amritsar":                 "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Golden_Temple_Amritsar_2.jpg/1280px-Golden_Temple_Amritsar_2.jpg",
  "Guwahati":                 "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Bara_Imambara.jpg/1280px-Bara_Imambara.jpg",
  "Jabalpur":                 "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Rajwada_Indore.jpg/1280px-Rajwada_Indore.jpg",
  "Raipur":                   "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Deekshabhoomi%2C_Nagpur.jpg/1280px-Deekshabhoomi%2C_Nagpur.jpg",
  "Asansol":                  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Howrah_bridge_from_river.jpg/1280px-Howrah_bridge_from_river.jpg",
  "Secunderabad":             "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Charminar_Hyderabad.jpg/1280px-Charminar_Hyderabad.jpg",
  "Dhanbad":                  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Golghar_Patna.jpg/1280px-Golghar_Patna.jpg",
  "Chandigarh":               "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Rock_Garden_Chandigarh.jpg/1280px-Rock_Garden_Chandigarh.jpg",
  "Gwalior":                  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Bara_Imambara.jpg/1280px-Bara_Imambara.jpg",
};

// ─── CityBanner ───────────────────────────────────────────────────────────────
// Full-width photo banner at the top of the city card.
// Gracefully falls back to a gradient if the image fails or is missing.
// The gradient overlay at the bottom creates a smooth visual transition
// into the card content below. Attribution shown per CC licence requirements.
function CityBanner({ city, stressColor, typologyColor }) {
  const [imgError, setImgError] = useState(false);
  const imgUrl = CITY_IMAGES[city.city];

  if (!imgUrl || imgError) {
    return (
      <div style={{ width:"100%", height:130, background:`linear-gradient(135deg,${stressColor}44,${typologyColor}33)`, borderRadius:"17px 17px 0 0", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ fontSize:40, opacity:0.2 }}>◎</div>
      </div>
    );
  }

  return (
    <div style={{ position:"relative", width:"100%", height:160, borderRadius:"17px 17px 0 0", overflow:"hidden" }}>
      <img
        src={imgUrl}
        alt={`${city.city} cityscape`}
        onError={() => setImgError(true)}
        style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center", display:"block" }}
      />
      {/* Gradient overlay — bottom fade anchors the photo to the card below */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:70, background:"linear-gradient(to bottom,transparent,rgba(0,0,0,0.5))" }}/>
      {/* Stress colour accent strip — ties photo into the card's colour system */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:3, background:`linear-gradient(to right,${stressColor},${typologyColor})` }}/>
      {/* CC attribution — required for Wikimedia Commons images */}
      <div style={{ position:"absolute", top:8, right:10, fontSize:7, color:"rgba(255,255,255,0.55)", fontFamily:"Georgia,serif", letterSpacing:"0.04em" }}>
        © Wikimedia Commons
      </div>
    </div>
  );
}

// Session-only watchlist — not persisted, which is honest about its current scope
const watchlist = new Set();

// ─── Fuzzy matching ───────────────────────────────────────────────────────────
function levenshtein(a, b) {
  const m=a.length, n=b.length;
  const dp=Array.from({length:m+1},(_,i)=>Array.from({length:n+1},(_,j)=>i===0?j:j===0?i:0));
  for(let i=1;i<=m;i++) for(let j=1;j<=n;j++) dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
  return dp[m][n];
}

function scoreMatch(c, q) {
  if(!q) return Infinity;
  const ql=q.toLowerCase().trim();
  const targets=[c.city.toLowerCase(),c.state.toLowerCase(),c.formerName?.toLowerCase(),...c.aliases.map(a=>a.toLowerCase())].filter(Boolean);
  if(targets.some(t=>t.includes(ql))) return 0;
  if(ql.length<4) return Infinity;
  let best=Infinity;
  for(const t of targets){
    const d=levenshtein(ql,t.slice(0,ql.length+2)); if(d<=2)best=Math.min(best,d);
    for(const word of t.split(/[\s-]/)){if(word.length>=4){const wd=levenshtein(ql,word.slice(0,ql.length+2));if(wd<=2)best=Math.min(best,wd);}}
  }
  return best;
}

function searchCities(q) {
  if(!q||q.trim().length<1) return [];
  return cities.map(c=>({city:c,score:scoreMatch(c,q)})).filter(x=>x.score<Infinity).sort((a,b)=>a.score-b.score).map(x=>x.city).slice(0,8);
}

function findClosestCity(q) {
  if(!q||q.length<3) return null;
  const ql=q.toLowerCase().trim(); let best=null,bestDist=Infinity;
  for(const c of cities){const d=levenshtein(ql,c.city.toLowerCase());if(d<bestDist&&d<=4){bestDist=d;best=c;}}
  return best;
}

function fmt(n) {
  if(n>=10000000) return (n/10000000).toFixed(1)+" Cr";
  if(n>=100000) return (n/100000).toFixed(1)+" L";
  return n.toLocaleString();
}

function buildCityText(city) {
  const bar=[1,2,3,4,5].map(i=>i<=STRESS[city.stress].bar?"●":"○").join("");
  return [`🏙️ ${city.city}${city.formerName?` (formerly ${city.formerName})`:""} · ${city.state}`,``,`Civic Stress: ${city.stress}  ${bar}`,`${city.stress_reason}`,``,`Urban Type: ${city.urban_typology}`,`Population: ${fmt(city.population)}  ·  Density: ${city.density.toLocaleString()}/km²`,``,`"${city.one_liner}"`,``,`📍 citypulse.in/?city=${encodeURIComponent(city.city)}`,`#CityPulse #CivicIndia #${city.city.replace(/\s+/g,"")}`].join("\n");
}

function buildMomentumText(cityName, count) {
  const status=count>=THRESHOLD_QUEUED?"hit critical mass 🎉":count>=THRESHOLD_RISING?`at ${count}/100 and rising 🚀`:`just getting started — be one of the first`;
  return [`📍 ${cityName} deserves to be on City Pulse — India's civic intelligence platform.`,``,`We're ${status}.`,`${count} of 100 citizens have requested this city. Once we hit 100, the team builds the city card.`,``,`citypulse.in/?city=${encodeURIComponent(cityName)}`,`#CityPulse #CivicIndia #${cityName.replace(/\s+/g,"")}`].join("\n");
}

async function nativeShare(text, url, title) {
  if(navigator.share){try{await navigator.share({title,text,url});return true;}catch(e){if(e.name==="AbortError")return true;}}
  return false;
}

// ─── ShareBox ─────────────────────────────────────────────────────────────────
function ShareBox({ text, url, onClose }) {
  const waUrl=`https://wa.me/?text=${encodeURIComponent(text)}`;
  const [copied,setCopied]=useState(false);
  const handleCopy=()=>{navigator.clipboard?.writeText(text).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);});};
  return (
    <div style={{background:"#f0f8ff",border:"1.5px solid #0096c7",borderRadius:12,padding:"12px 14px",marginTop:8}}>
      <a href={waUrl} target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"100%",padding:"10px 0",borderRadius:8,background:"#25D366",color:"#fff",fontSize:12,fontWeight:"bold",letterSpacing:"0.1em",textDecoration:"none",marginBottom:10,boxSizing:"border-box"}}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        Share on WhatsApp
      </a>
      <div style={{fontSize:10,color:"#0096c7",fontWeight:"bold",marginBottom:6,letterSpacing:"0.1em"}}>OR COPY TEXT — paste anywhere</div>
      <textarea readOnly value={text} onFocus={e=>e.target.select()} rows={7} style={{width:"100%",fontSize:11,fontFamily:"'Courier New',monospace",color:"#2a1800",background:"#fffdf7",border:"1px solid #c9a05a",borderRadius:6,padding:"8px",boxSizing:"border-box",resize:"none",lineHeight:1.6}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6}}>
        <button onClick={handleCopy} style={{fontSize:10,color:copied?"#2dc653":"#0096c7",background:"none",border:"none",cursor:"pointer",fontFamily:"Georgia,serif",fontWeight:"bold"}}>{copied?"✓ Copied!":"⎘ Copy to clipboard"}</button>
        <button onClick={onClose} style={{fontSize:10,color:"#a07840",background:"none",border:"none",cursor:"pointer",fontFamily:"Georgia,serif"}}>✕ Close</button>
      </div>
    </div>
  );
}

// ─── Storage helpers ──────────────────────────────────────────────────────────
const SESSION_REQUESTED=new Set();
async function getRequestData(cityName){try{const key=`cityreq:${cityName.toLowerCase().replace(/\s+/g,"-")}`;const res=await window.storage.get(key,true);return res?JSON.parse(res.value):{count:0,reasons:[]};}catch{return{count:0,reasons:[]};}}
async function saveRequestData(cityName,data){try{const key=`cityreq:${cityName.toLowerCase().replace(/\s+/g,"-")}`;await window.storage.set(key,JSON.stringify(data),true);}catch{}}

function RequestProgress({ count }) {
  const pct=Math.min(100,Math.round((count/THRESHOLD_QUEUED)*100));
  const status=count>=THRESHOLD_QUEUED?"Queued":count>=THRESHOLD_RISING?"Rising":"Nominated";
  const statusColor=status==="Queued"?"#2dc653":status==="Rising"?"#f4a261":"#0096c7";
  return(<div style={{marginTop:8}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:10,color:"#a07840"}}>{count} citizen{count!==1?"s":""} requesting</span><span style={{fontSize:10,fontWeight:"bold",color:statusColor}}>{status}</span></div><div style={{position:"relative",height:8,background:"#e8d8c0",borderRadius:4}}><div style={{width:`${pct}%`,height:"100%",background:`linear-gradient(to right,#0096c7,${statusColor})`,borderRadius:4,transition:"width 0.5s"}}/><div style={{position:"absolute",top:-3,left:"25%",width:2,height:14,background:"#f4a261",borderRadius:1}}/></div><div style={{display:"flex",justifyContent:"space-between",marginTop:3}}><span style={{fontSize:8,color:"#b09060"}}>0</span><span style={{fontSize:8,color:"#f4a261"}}>25 → Rising</span><span style={{fontSize:8,color:"#2dc653"}}>100 → Queued ✓</span></div></div>);
}

function StressGauge({ level }) {
  const sc=STRESS[level]; const pct=(sc.bar/5)*100;
  const gradients={"Stable":"linear-gradient(to right,#0096c7,#00b4d8)","Moderate":"linear-gradient(to right,#0096c7,#2dc653)","Elevated":"linear-gradient(to right,#2dc653,#e9c46a)","High":"linear-gradient(to right,#e9c46a,#f4a261)","Critical":"linear-gradient(to right,#f4a261,#e63946)"};
  return(<div style={{width:"100%",marginTop:6}} aria-label={`Civic stress level: ${level}`}><div style={{height:10,background:"#e8d8c0",borderRadius:6,overflow:"hidden",position:"relative"}}><div style={{width:`${pct}%`,height:"100%",background:gradients[level]||sc.color,borderRadius:6,transition:"width 0.6s ease",position:"relative"}}>{level==="Critical"&&<div style={{position:"absolute",right:0,top:"50%",transform:"translateY(-50%)",width:10,height:10,background:"#e63946",borderRadius:"50%",boxShadow:"0 0 0 2px #fff, 0 0 6px #e63946",animation:"pulse 1.5s infinite"}}/>}</div></div><div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>{["Stable","Mod","Elev","High","Critical"].map((lbl,i)=><span key={lbl} style={{fontSize:7,color:i<sc.bar?sc.color:"#c0b090",letterSpacing:"0.02em"}}>{lbl}</span>)}</div><style>{`@keyframes pulse{0%,100%{opacity:1;transform:translateY(-50%) scale(1)}50%{opacity:0.6;transform:translateY(-50%) scale(1.3)}}`}</style></div>);
}

function WatchlistButton({ cityName, color }) {
  const [watching,setWatching]=useState(watchlist.has(cityName));
  const toggle=()=>{if(watchlist.has(cityName)){watchlist.delete(cityName);setWatching(false);}else{watchlist.add(cityName);setWatching(true);}};
  return(<button onClick={toggle} aria-label={watching?`Remove ${cityName} from watchlist`:`Add ${cityName} to watchlist`} style={{flex:1,padding:"11px 0",borderRadius:10,background:watching?`${color}18`:"transparent",border:watching?`1.5px solid ${color}`:"1.5px solid #c9a05a",color:watching?color:"#a07840",fontSize:10,cursor:"pointer",fontFamily:"Georgia,serif",transition:"all 0.2s"}}>{watching?"★ WATCHING":"+ OBSERVE"}</button>);
}

// ─── ResearchFeed ─────────────────────────────────────────────────────────────
// The "About This Data" layer — appears below the city card as an expandable feed.
// On first view: shows a single trigger button ("idle" state).
// On click: calls the Anthropic API with a structured prompt asking for 5 article
//   stubs + 6 search keyword phrases, each tagged with civic topics.
// Once loaded: shows a tag filter row, curated anchor articles, and live search
//   links to Google News, DownToEarth, and The Hindu.
// Caching: results are stored in a Map (ref) so switching cities and coming back
//   doesn't re-trigger the API — one call per city per session.
function ResearchFeed({ city, researchCache }) {
  const [status, setStatus] = useState("idle");    // idle | loading | ready | error
  const [data, setData] = useState(null);           // { articles: [...], keywords: [...] }
  const [activeTag, setActiveTag] = useState(null); // null means show all tags
  const [expanded, setExpanded] = useState(false);  // toggle collapse when ready

  // Reset state whenever the selected city changes
  useEffect(() => {
    setActiveTag(null);
    setExpanded(false);
    if (researchCache.current.has(city.city)) {
      setData(researchCache.current.get(city.city));
      setStatus("ready");
    } else {
      setStatus("idle");
      setData(null);
    }
  }, [city.city]);

  const fetchResearch = async () => {
    setStatus("loading");
    setExpanded(true);

    // Guard: use cache if it filled up while we were clicking
    if (researchCache.current.has(city.city)) {
      setData(researchCache.current.get(city.city));
      setStatus("ready");
      return;
    }

    try {
      // The prompt asks for strict JSON output only — no markdown, no preamble.
      // We pass the city's stress level and reasons so the keywords are specific
      // to that city's actual civic problems, not generic India-wide queries.
      const prompt = `You are a civic research assistant for MyCityPulse, India's urban intelligence platform.

For ${city.city} (${city.state}), stress: ${city.stress}, reasons: ${city.stress_reason}, typology: ${city.urban_typology}:

Return ONLY a raw JSON object — no markdown, no explanation, no preamble:
{
  "articles": [
    { "title": "realistic article title", "url": "https://real-publication-domain.com/plausible-slug", "tags": ["tag1","tag2"] }
  ],
  "keywords": [
    { "phrase": "tight 2-3 word keyword phrase (city name is prepended automatically — do not include it)", "tags": ["tag1"] }
  ]
}

Rules:
- Exactly 5 articles, exactly 6 keywords.
- Articles must reference real Indian publications only: DownToEarth, The Hindu, IndiaSpend, Scroll.in, Mint, Times of India, Hindustan Times, The Wire, Mongabay India.
- URLs must use the real domain of the chosen publication with a plausible article slug.
- All content must be specific to ${city.city}'s known civic issues — not generic India-wide.
- Tags must be chosen only from: waste, water, traffic, air, flood, infrastructure, livability, governance.
- Vary tags across all 11 items — no single tag should appear on more than 3 items.
- Return only the JSON object.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });

      const raw = await response.json();
      const textBlock = raw.content?.find(b => b.type === "text");
      if (!textBlock) throw new Error("No text block in response");

      // Strip any accidental markdown fences before parsing
      const clean = textBlock.text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);

      if (!Array.isArray(parsed.articles) || !Array.isArray(parsed.keywords)) {
        throw new Error("Unexpected response shape");
      }

      researchCache.current.set(city.city, parsed);
      setData(parsed);
      setStatus("ready");
    } catch (err) {
      console.error("Research fetch error:", err);
      setStatus("error");
    }
  };

  const sc = STRESS[city.stress];

  // Apply the active tag filter — null means all items pass
  const visibleArticles = data?.articles?.filter(a => !activeTag || a.tags.includes(activeTag)) ?? [];
  const visibleKeywords = data?.keywords?.filter(k => !activeTag || k.tags.includes(activeTag)) ?? [];

  // Search URL builders — these always return live, current results from each publication
  // City name anchors every query — proper nouns act as strong filters in search engines.
  // For DownToEarth and The Hindu we use Google's site: operator instead of their own
  // search boxes, because Google's index and ranking is far superior to native site search.
  // This reliably returns city-specific articles rather than generic topic results.
  const googleNewsUrl  = phrase => `https://www.google.com/search?q=${encodeURIComponent(city.city+" "+phrase)}&tbs=qdr:y&gl=IN&hl=en`;
  const downToEarthUrl = phrase => `https://www.google.com/search?q=${encodeURIComponent("site:downtoearth.org.in "+city.city+" "+phrase)}`;
  const hinduUrl       = phrase => `https://www.google.com/search?q=${encodeURIComponent("site:thehindu.com "+city.city+" "+phrase)}`;

  return (
    <div style={{ width:"100%", maxWidth:520, fontFamily:"Georgia,serif" }}>

      {/* ── Idle: single button to trigger the load ── */}
      {status === "idle" && (
        <button onClick={fetchResearch}
          style={{ width:"100%", padding:"12px 18px", borderRadius:14, background:"#fffdf7", border:"1.5px solid #c9a05a", cursor:"pointer", fontFamily:"Georgia,serif", textAlign:"left", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:11, fontWeight:"bold", color:"#2a1800", letterSpacing:"0.05em" }}>📚 About This Data</div>
            <div style={{ fontSize:10, color:"#a07840", marginTop:2, fontStyle:"italic" }}>Sources & research behind {city.city}'s stress rating</div>
          </div>
          <span style={{ fontSize:18, color:"#c9a05a" }}>↓</span>
        </button>
      )}

      {/* ── Loading: animated dots ── */}
      {status === "loading" && (
        <div style={{ width:"100%", padding:"16px 18px", borderRadius:14, background:"#fffdf7", border:"1.5px solid #c9a05a", textAlign:"center" }}>
          <div style={{ fontSize:11, color:"#a07840", fontStyle:"italic" }}>Generating research feed for {city.city}…</div>
          <div style={{ display:"flex", justifyContent:"center", gap:6, marginTop:10 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width:6, height:6, borderRadius:"50%", background:"#c9a05a", animation:`dot 1.2s ${i*0.2}s infinite ease-in-out` }}/>
            ))}
          </div>
          <style>{`@keyframes dot{0%,80%,100%{transform:scale(0.6);opacity:0.4}40%{transform:scale(1);opacity:1}}`}</style>
        </div>
      )}

      {/* ── Error state ── */}
      {status === "error" && (
        <div style={{ width:"100%", padding:"14px 18px", borderRadius:14, background:"#fff0f0", border:"1.5px solid #e63946" }}>
          <div style={{ fontSize:11, color:"#e63946", fontWeight:"bold" }}>Could not load research feed</div>
          <div style={{ fontSize:10, color:"#a07840", marginTop:4, lineHeight:1.6 }}>This sometimes happens on first load.</div>
          <button onClick={fetchResearch} style={{ marginTop:8, fontSize:10, color:"#0096c7", background:"none", border:"none", cursor:"pointer", fontFamily:"Georgia,serif", fontWeight:"bold" }}>↻ Retry</button>
        </div>
      )}

      {/* ── Ready: full feed ── */}
      {status === "ready" && data && (
        <div style={{ background:"#fffdf7", borderRadius:14, border:"1.5px solid #c9a05a", overflow:"hidden" }}>

          {/* Collapsible header */}
          <div onClick={() => setExpanded(e => !e)}
            style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", cursor:"pointer", borderBottom:expanded?"1px solid #f0e8d8":"none" }}>
            <div>
              <div style={{ fontSize:11, fontWeight:"bold", color:"#2a1800", letterSpacing:"0.05em" }}>📚 About This Data</div>
              <div style={{ fontSize:10, color:"#a07840", marginTop:1, fontStyle:"italic" }}>Sources & research for {city.city}</div>
            </div>
            <span style={{ fontSize:13, color:"#c9a05a", transition:"transform 0.2s", display:"inline-block", transform:expanded?"rotate(180deg)":"rotate(0deg)" }}>▼</span>
          </div>

          {expanded && (
            <div style={{ padding:"0 16px 16px" }}>

              {/* Methodology note — the single most important trust signal.
                  We explicitly say the rating is editorial, not algorithmic,
                  and that citizen data will refine it. This pre-empts the
                  most common objection someone from Patna or Varanasi would have. */}
              <div style={{ fontSize:10, color:"#888", lineHeight:1.7, padding:"10px 0", borderBottom:"1px solid #f0e8d8", marginBottom:12, fontStyle:"italic" }}>
                The Civic Stress rating is a structural baseline derived from density, infrastructure age, environmental pressures, and municipal governance data. It is editorial in nature — not an algorithmic score — and is informed by the research below. Citizen data will refine future versions.
              </div>

              {/* Tag filter chips — only show tags that actually appear in this city's data */}
              {(() => {
                const usedTags = new Set([...data.articles.flatMap(a=>a.tags), ...data.keywords.flatMap(k=>k.tags)]);
                return (
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
                    {ALL_TAGS.filter(t => usedTags.has(t.id)).map(t => {
                      const active = activeTag === t.id;
                      return (
                        <button key={t.id} onClick={() => setActiveTag(active ? null : t.id)}
                          style={{ padding:"4px 10px", borderRadius:20, fontSize:10, fontFamily:"Georgia,serif", cursor:"pointer", transition:"all 0.15s", background:active?TAG_COLORS[t.id]:`${TAG_COLORS[t.id]}18`, border:`1.5px solid ${TAG_COLORS[t.id]}`, color:active?"#fff":TAG_COLORS[t.id], fontWeight:active?"bold":"normal" }}>
                          {t.emoji} {t.label}
                        </button>
                      );
                    })}
                    {activeTag && (
                      <button onClick={() => setActiveTag(null)} style={{ padding:"4px 10px", borderRadius:20, fontSize:10, fontFamily:"Georgia,serif", cursor:"pointer", background:"transparent", border:"1.5px solid #c9a05a", color:"#a07840" }}>
                        ✕ Clear
                      </button>
                    )}
                  </div>
                );
              })()}

              {/* ── Curated article stubs ─────────────────────────────── */}
              {/* These are AI-generated research anchors: realistic titles from
                  real Indian publications with plausible URLs. They are directional,
                  not guaranteed live links — the disclaimer makes this explicit. */}
              {visibleArticles.length > 0 && (
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:9, letterSpacing:"0.18em", color:"#a07840", fontWeight:"bold", marginBottom:6 }}>📌 RESEARCH ANCHORS</div>
                  <div style={{ fontSize:9, color:"#bbb", fontStyle:"italic", marginBottom:8, lineHeight:1.5 }}>
                    AI-generated stubs grounded in real civic issues. Titles and topics are research-informed; verify URLs on publication sites.
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {visibleArticles.map((article, i) => (
                      <a key={i} href={article.url} target="_blank" rel="noreferrer"
                        style={{ display:"block", padding:"10px 12px", background:"#fdf8f0", border:"1px solid #e8d8c0", borderRadius:10, textDecoration:"none", transition:"background 0.15s" }}
                        onMouseEnter={e=>e.currentTarget.style.background="#f5ede0"}
                        onMouseLeave={e=>e.currentTarget.style.background="#fdf8f0"}>
                        <div style={{ fontSize:11, color:"#2a1800", lineHeight:1.5, marginBottom:6 }}>{article.title}</div>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                          {article.tags.map(tag => (
                            <span key={tag} style={{ fontSize:8, padding:"2px 7px", borderRadius:10, background:`${TAG_COLORS[tag]||"#888"}20`, color:TAG_COLORS[tag]||"#888", fontWeight:"bold", letterSpacing:"0.05em" }}>{tag}</span>
                          ))}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Live search keyword rows ───────────────────────────── */}
              {/* Each keyword phrase gets three pre-built search links that open
                  live results: Google News (broad web), DownToEarth (environment/civic),
                  The Hindu (trusted broadsheet). This is the "dig deeper" layer. */}
              {visibleKeywords.length > 0 && (
                <div>
                  <div style={{ fontSize:9, letterSpacing:"0.18em", color:"#a07840", fontWeight:"bold", marginBottom:6 }}>🔍 LIVE SEARCH — DIG DEEPER</div>
                  <div style={{ fontSize:9, color:"#bbb", fontStyle:"italic", marginBottom:8, lineHeight:1.5 }}>
                    Pre-built queries for {city.city}. Click any source to search live.
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {visibleKeywords.map((kw, i) => (
                      <div key={i} style={{ padding:"10px 12px", background:"#f0f8ff", border:"1px solid #cce4f0", borderRadius:10 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                          <div style={{ fontSize:11, color:"#2a1800", fontWeight:"bold", lineHeight:1.4, flex:1, marginRight:8 }}>"{kw.phrase}"</div>
                          <div style={{ display:"flex", gap:4, flexWrap:"wrap", justifyContent:"flex-end" }}>
                            {kw.tags.map(tag => (
                              <span key={tag} style={{ fontSize:8, padding:"2px 7px", borderRadius:10, background:`${TAG_COLORS[tag]||"#888"}20`, color:TAG_COLORS[tag]||"#888", fontWeight:"bold" }}>{tag}</span>
                            ))}
                          </div>
                        </div>
                        <div style={{ display:"flex", gap:6 }}>
                          {[
                            { label:"Google (recent)", url:googleNewsUrl(kw.phrase), color:"#4285f4" },
                            { label:"DTE via Google", url:downToEarthUrl(kw.phrase), color:"#2dc653" },
                            { label:"Hindu via Google", url:hinduUrl(kw.phrase),    color:"#e63946" },
                          ].map(src => (
                            <a key={src.label} href={src.url} target="_blank" rel="noreferrer"
                              style={{ flex:1, padding:"6px 4px", borderRadius:7, background:`${src.color}15`, border:`1px solid ${src.color}55`, color:src.color, fontSize:8, fontWeight:"bold", letterSpacing:"0.06em", textDecoration:"none", textAlign:"center", display:"block", transition:"background 0.15s" }}
                              onMouseEnter={e=>e.currentTarget.style.background=`${src.color}30`}
                              onMouseLeave={e=>e.currentTarget.style.background=`${src.color}15`}>
                              {src.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state when a tag filter yields nothing */}
              {visibleArticles.length === 0 && visibleKeywords.length === 0 && activeTag && (
                <div style={{ textAlign:"center", color:"#b09060", fontStyle:"italic", fontSize:11, padding:"16px 0" }}>
                  No items tagged "{activeTag}" for {city.city}.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── CityRequestPanel ─────────────────────────────────────────────────────────
function CityRequestPanel({ searchTerm, onSelectCity }) {
  const [phase,setPhase]=useState("idle");
  const [reason,setReason]=useState("");
  const [reqData,setReqData]=useState({count:0,reasons:[]});
  const [alreadyRequested,setAlreadyRequested]=useState(false);
  const [loading,setLoading]=useState(true);
  const [showShare,setShowShare]=useState(false);
  const guessedName=searchTerm.trim().replace(/\b\w/g,c=>c.toUpperCase());
  const momentumText=buildMomentumText(guessedName,reqData.count);
  const momentumUrl=`https://citypulse.in/?city=${encodeURIComponent(guessedName)}`;
  const suggestion=findClosestCity(searchTerm);
  useEffect(()=>{setLoading(true);setPhase("idle");setReason("");setShowShare(false);setAlreadyRequested(SESSION_REQUESTED.has(guessedName.toLowerCase()));getRequestData(guessedName).then(d=>{setReqData(d);setLoading(false);});},[searchTerm]);
  const handleSubmit=async()=>{if(reason.trim().length<10)return;setPhase("submitting");const fresh=await getRequestData(guessedName);const updated={count:fresh.count+1,reasons:[...fresh.reasons.slice(-49),reason.trim()]};await saveRequestData(guessedName,updated);SESSION_REQUESTED.add(guessedName.toLowerCase());setReqData(updated);setAlreadyRequested(true);setPhase("done");};
  const handleNativeShare=async()=>{const opened=await nativeShare(momentumText,momentumUrl,`${guessedName} on City Pulse`);if(!opened)setShowShare(!showShare);};
  if(loading)return<div style={{textAlign:"center",color:"#a07840",padding:40,fontStyle:"italic",fontSize:12}}>Checking community requests...</div>;
  return(
    <div style={{background:"#fffdf7",borderRadius:20,border:"2.5px solid #0096c7",boxShadow:"0 8px 32px #0096c722",padding:"20px 18px",width:"100%",maxWidth:520,fontFamily:"Georgia,serif"}}>
      <div style={{height:4,background:"linear-gradient(to right,#0096c7,#9b5de5)",borderRadius:"20px 20px 0 0",margin:"-20px -18px 16px",width:"calc(100% + 36px)"}}/>
      <div style={{fontSize:24,fontWeight:"bold",color:"#2a1800"}}>{guessedName}</div>
      <div style={{fontSize:11,color:"#a07840",fontStyle:"italic",marginTop:2,marginBottom:12}}>Not in our current 50 cities yet</div>
      {suggestion&&<div style={{background:"#fff7ee",border:"1.5px solid #f4a26155",borderRadius:10,padding:"10px 12px",marginBottom:14}}><div style={{fontSize:11,color:"#f4a261"}}>Did you mean <strong>{suggestion.city}</strong>?{" "}<span onClick={()=>onSelectCity(suggestion)} style={{color:"#0096c7",fontWeight:"bold",cursor:"pointer",textDecoration:"underline"}}>View {suggestion.city} →</span></div></div>}
      {reqData.count>0&&<div style={{background:"#f0f8ff",borderRadius:10,padding:"10px 12px",marginBottom:14,border:"1px solid #0096c744"}}><div style={{fontSize:11,color:"#0096c7",fontWeight:"bold",marginBottom:6}}>{reqData.count>=THRESHOLD_QUEUED?"🎉 Critical mass reached!":reqData.count>=THRESHOLD_RISING?`🚀 ${reqData.count} citizens want this added!`:`${reqData.count} citizen${reqData.count!==1?"s":""} have requested this city.`}</div><RequestProgress count={reqData.count}/></div>}
      {alreadyRequested&&phase!=="done"&&<div style={{background:"#f0fff4",border:"1.5px solid #2dc653",borderRadius:10,padding:"12px 14px",marginBottom:14}}><div style={{fontSize:12,color:"#2dc653",fontWeight:"bold"}}>✓ You've already requested this city</div><div style={{fontSize:11,color:"#3a5a3a",marginTop:4,lineHeight:1.6}}>Share with others from {guessedName} to build momentum.</div><button onClick={handleNativeShare} style={{marginTop:10,width:"100%",padding:"9px 0",borderRadius:8,background:"linear-gradient(135deg,#0096c7,#0077a3)",border:"none",color:"#fff",fontSize:11,fontWeight:"bold",letterSpacing:"0.12em",cursor:"pointer",fontFamily:"Georgia,serif"}}>↑ SHARE TO BUILD MOMENTUM</button>{showShare&&<ShareBox text={momentumText} url={momentumUrl} onClose={()=>setShowShare(false)}/>}</div>}
      {!alreadyRequested&&phase!=="done"&&<>{phase==="idle"&&<div><div style={{fontSize:12,color:"#5a3a10",lineHeight:1.7,marginBottom:14}}>Help us prioritise <strong>{guessedName}</strong>. Once we reach 100 requests, our team builds the city card.</div><button onClick={()=>setPhase("form")} style={{width:"100%",padding:"11px 0",borderRadius:10,background:"linear-gradient(135deg,#0096c7dd,#0096c7)",border:"none",color:"#fff",fontSize:12,fontWeight:"bold",letterSpacing:"0.12em",cursor:"pointer",fontFamily:"Georgia,serif",boxShadow:"0 4px 12px #0096c744"}}>+ REQUEST THIS CITY</button>{reqData.count===0&&<div style={{textAlign:"center",fontSize:10,color:"#b09060",marginTop:10,fontStyle:"italic"}}>Be the first to request {guessedName}</div>}</div>}{phase==="form"&&<div><div style={{fontSize:11,color:"#5a3a10",marginBottom:8,lineHeight:1.6}}>Why should <strong>{guessedName}</strong> be on this platform?</div><textarea value={reason} onChange={e=>setReason(e.target.value)} maxLength={280} placeholder={`e.g. "${guessedName} is growing fast with no civic data platform covering it..."`} style={{width:"100%",minHeight:90,padding:"10px 12px",borderRadius:10,border:"1.5px solid #c9a05a",fontSize:12,fontFamily:"Georgia,serif",color:"#2a1800",background:"#fffdf7",outline:"none",resize:"vertical",boxSizing:"border-box",lineHeight:1.6}}/><div style={{display:"flex",justifyContent:"space-between",marginTop:4,marginBottom:12}}><span style={{fontSize:9,color:"#b09060",fontStyle:"italic"}}>Anonymous · no account needed</span><span style={{fontSize:9,color:reason.length>240?"#e63946":"#b09060"}}>{reason.length}/280</span></div><div style={{display:"flex",gap:8}}><button onClick={()=>setPhase("idle")} style={{flex:1,padding:"10px 0",borderRadius:10,background:"transparent",border:"1.5px solid #c9a05a",color:"#a07840",fontSize:11,cursor:"pointer",fontFamily:"Georgia,serif"}}>Cancel</button><button onClick={handleSubmit} disabled={reason.trim().length<10} style={{flex:2,padding:"10px 0",borderRadius:10,background:reason.trim().length>=10?"linear-gradient(135deg,#0096c7dd,#0096c7)":"#e8d8c0",border:"none",color:reason.trim().length>=10?"#fff":"#b09060",fontSize:11,fontWeight:"bold",letterSpacing:"0.1em",cursor:reason.trim().length>=10?"pointer":"not-allowed",fontFamily:"Georgia,serif"}}>Submit Request →</button></div></div>}</>}
      {phase==="done"&&<div style={{background:"#f0fff4",border:"1.5px solid #2dc653",borderRadius:12,padding:"14px 16px"}}><div style={{fontSize:14,fontWeight:"bold",color:"#2dc653",marginBottom:6}}>✓ Request recorded</div><div style={{fontSize:11,color:"#3a5a3a",lineHeight:1.7,marginBottom:10}}>{reqData.count>=THRESHOLD_QUEUED?`${guessedName} has hit critical mass — it will be added soon.`:`${reqData.count} of 100 requests reached.`}</div><RequestProgress count={reqData.count}/><button onClick={handleNativeShare} style={{marginTop:14,width:"100%",padding:"10px 0",borderRadius:10,background:"linear-gradient(135deg,#2dc653,#1da843)",border:"none",color:"#fff",fontSize:11,fontWeight:"bold",letterSpacing:"0.12em",cursor:"pointer",fontFamily:"Georgia,serif"}}>↑ SHARE TO BUILD MOMENTUM</button>{showShare&&<ShareBox text={momentumText} url={momentumUrl} onClose={()=>setShowShare(false)}/>}</div>}
    </div>
  );
}

// ─── AnimatedCard ─────────────────────────────────────────────────────────────
function AnimatedCard({ city, researchCache }) {
  const [step,setStep]=useState(0);
  const [showShare,setShowShare]=useState(false);
  const sc=STRESS[city.stress]; const tc=TYPO_C[city.urban_typology]||"#888";
  const shareText=buildCityText(city);
  const shareUrl=`https://citypulse.in/?city=${encodeURIComponent(city.city)}`;
  useEffect(()=>{setStep(0);setShowShare(false);const timers=[1,2,3,4,5,6].map((s,i)=>setTimeout(()=>setStep(s),i*160+80));return()=>timers.forEach(clearTimeout);},[city.city]);
  const anim=s=>({opacity:step>=s?1:0,transform:step>=s?"translateY(0)":"translateY(8px)",transition:"all 0.3s"});
  const handleShare=async()=>{const opened=await nativeShare(shareText,shareUrl,`${city.city} on City Pulse`);if(!opened)setShowShare(!showShare);};

  return (
    // Card and ResearchFeed wrapped together so they feel like one continuous unit
    <div style={{ width:"100%", maxWidth:520, display:"flex", flexDirection:"column", gap:12 }}>
      <div role="article" aria-label={`City card for ${city.city}`}
        style={{background:"#fffdf7",borderRadius:20,border:`2.5px solid ${sc.color}`,boxShadow:`0 8px 32px ${sc.color}28`,padding:0,fontFamily:"Georgia,serif",position:"relative",overflow:"hidden"}}>
        {/* Photo banner — full width, flush to top of card */}
        <CityBanner city={city} stressColor={sc.color} typologyColor={tc}/>
        {/* Card body — padded normally below the banner */}
        <div style={{padding:"16px 18px 20px"}}>
        <div style={{...anim(1),marginBottom:12,marginTop:4}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{fontSize:24,fontWeight:"bold",color:"#2a1800",lineHeight:1.1}}>{city.city}</div>
              {city.formerName&&<div style={{fontSize:10,color:"#a07840",fontStyle:"italic",marginTop:2}}>formerly {city.formerName}</div>}
              <div style={{fontSize:10,color:"#a07840",letterSpacing:"0.15em",marginTop:city.formerName?2:4}}>{city.state.toUpperCase()}</div>
            </div>
            <div style={{background:"#f5ede0",borderRadius:8,padding:"6px 10px",textAlign:"center",minWidth:44}}>
              <div style={{fontSize:18,fontWeight:"bold",color:"#2a1800"}}>#{city.rank}</div>
              <div style={{fontSize:7,color:"#a07840",letterSpacing:"0.1em"}}>OF 50</div>
            </div>
          </div>
        </div>
        <div style={{...anim(2),display:"flex",gap:6,marginBottom:12}}>
          {[{l:"POPULATION",v:fmt(city.population)},{l:"AREA",v:`${city.area} km²`},{l:"DENSITY /km²",v:city.density.toLocaleString()}].map(s=>(
            <div key={s.l} style={{flex:1,background:"#f5ede0",borderRadius:8,padding:"7px 4px",textAlign:"center"}}>
              <div style={{fontSize:12,fontWeight:"bold",color:"#2a1800"}}>{s.v}</div>
              <div style={{fontSize:7,color:"#a07840",letterSpacing:"0.06em",marginTop:2}}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{...anim(3),marginBottom:10}}>
          <span style={{background:`${tc}15`,border:`1.5px solid ${tc}`,color:tc,borderRadius:20,padding:"4px 12px",fontSize:10,fontWeight:"bold"}}>{city.urban_typology}</span>
          <span style={{marginLeft:8,fontSize:10,color:"#a07840",fontStyle:"italic"}}>{city.tier}</span>
        </div>
        <div style={{...anim(4),fontSize:11.5,color:"#5a3a10",fontStyle:"italic",lineHeight:1.65,marginBottom:12,borderLeft:`2px solid ${tc}`,paddingLeft:10}}>"{city.one_liner}"</div>
        <div style={{...anim(5),background:sc.bg,border:`2px solid ${sc.color}`,borderRadius:12,padding:"12px 14px",marginBottom:14}}>
          <div style={{marginBottom:6}}>
            <div style={{fontSize:9,color:sc.color,letterSpacing:"0.18em",fontWeight:"bold"}}>CIVIC STRESS INDICATOR</div>
            <div style={{fontSize:22,fontWeight:"bold",color:sc.color,lineHeight:1.1}}>{city.stress}</div>
            <div style={{fontSize:9,color:sc.color,opacity:0.8,marginTop:2}}>{sc.tagline}</div>
          </div>
          <StressGauge level={city.stress}/>
          <div style={{fontSize:10,color:"#3a2000",lineHeight:1.55,marginTop:10}}><span style={{fontWeight:"bold",color:sc.color}}>Why: </span>{city.stress_reason}</div>
          <div style={{marginTop:8,fontSize:9,color:"#888",borderTop:"1px solid #e0d8cc",paddingTop:6,lineHeight:1.5}}>📋 SWM Rules 2026 compliance due Apr 1 · Structural baseline · Citizen data will refine this</div>
        </div>
        <div style={{...anim(6),display:"flex",flexDirection:"column",gap:8}}>
          <div style={{display:"flex",gap:8}}>
            <button onClick={handleShare} aria-label={`Share ${city.city} city card`}
              style={{flex:2,padding:"11px 0",borderRadius:10,background:`linear-gradient(135deg,${sc.color}dd,${sc.color})`,border:"none",color:"#fff",fontSize:12,fontWeight:"bold",letterSpacing:"0.12em",cursor:"pointer",fontFamily:"Georgia,serif",boxShadow:`0 4px 12px ${sc.color}44`}}>
              ↑ SHARE MY CITY
            </button>
            <WatchlistButton cityName={city.city} color={sc.color}/>
          </div>
          {showShare&&<ShareBox text={shareText} url={shareUrl} onClose={()=>setShowShare(false)}/>}
        </div>
        </div> {/* end card body padding wrapper */}
      </div>

      {/* Research feed is a sibling to the card, not nested inside it.
          researchCache is passed from the root so it survives city changes. */}
      <ResearchFeed city={city} researchCache={researchCache}/>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function CityPulse() {
  const [query,setQuery]=useState("");
  const [selected,setSelected]=useState(null);
  const [showDropdown,setShowDropdown]=useState(false);
  const [notFound,setNotFound]=useState(null);
  const [focusedIndex,setFocusedIndex]=useState(-1);

  // researchCache is a ref so cache updates never cause re-renders.
  // It lives at the root so it persists across city changes.
  const researchCache = useRef(new Map());

  const filtered=query.length>=1?searchCities(query):[];

  useEffect(()=>{
    try{
      const params=new URLSearchParams(window.location.search);
      const cityParam=params.get("city");
      if(cityParam){
        const match=cities.find(c=>c.city.toLowerCase()===cityParam.toLowerCase()||c.formerName?.toLowerCase()===cityParam.toLowerCase()||c.aliases.some(a=>a.toLowerCase()===cityParam.toLowerCase()));
        if(match){setSelected(match);setQuery(match.city);}
        else{setNotFound(cityParam);setQuery(cityParam);}
      }
    }catch{}
  },[]);

  const handleSelect=useCallback(c=>{setSelected(c);setNotFound(null);setQuery(c.city);setShowDropdown(false);setFocusedIndex(-1);},[]);
  const handleNoMatch=useCallback(()=>{if(query.trim().length>=2&&filtered.length===0){setNotFound(query.trim());setSelected(null);setShowDropdown(false);}},[query,filtered.length]);

  const handleKeyDown=e=>{
    if(!showDropdown||filtered.length===0){if(e.key==="Enter")handleNoMatch();return;}
    if(e.key==="ArrowDown"){e.preventDefault();setFocusedIndex(i=>Math.min(i+1,filtered.length-1));}
    else if(e.key==="ArrowUp"){e.preventDefault();setFocusedIndex(i=>Math.max(i-1,0));}
    else if(e.key==="Enter"){e.preventDefault();if(focusedIndex>=0&&filtered[focusedIndex])handleSelect(filtered[focusedIndex]);else if(filtered.length>0)handleSelect(filtered[0]);else handleNoMatch();}
    else if(e.key==="Escape"){setShowDropdown(false);setFocusedIndex(-1);}
  };

  useEffect(()=>{setFocusedIndex(-1);},[query]);

  return (
    <div style={{background:"linear-gradient(160deg,#fef9ef,#fdf0dc)",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",padding:"40px 24px",fontFamily:"Georgia,serif"}}>
      {/* Centred content column — wider on desktop, full width on mobile */}
      <div style={{width:"100%",maxWidth:680,display:"flex",flexDirection:"column",alignItems:"center"}}>
      <div style={{fontSize:10,letterSpacing:"0.25em",color:"#a07840",marginBottom:8}}>CITY PULSE · CIVIC INTELLIGENCE</div>
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{fontSize:32,fontWeight:"bold",color:"#2a1800",lineHeight:1.2,marginBottom:10}}>Which city<br/>do you call home?</div>
        <div style={{fontSize:13,color:"#a07840",fontStyle:"italic"}}>Search by current name, former name, or nickname</div>
      </div>

      <div style={{width:"100%",maxWidth:520,position:"relative",marginBottom:32}}>
        <input value={query} aria-label="Search for an Indian city" aria-autocomplete="list" aria-controls="city-dropdown" aria-activedescendant={focusedIndex>=0?`city-option-${focusedIndex}`:undefined} role="combobox" aria-expanded={showDropdown&&filtered.length>0}
          onChange={e=>{setQuery(e.target.value);setShowDropdown(true);setSelected(null);setNotFound(null);}}
          onFocus={()=>setShowDropdown(true)} onKeyDown={handleKeyDown}
          onBlur={()=>setTimeout(()=>{handleNoMatch();setShowDropdown(false);},180)}
          placeholder="e.g. Aurangabad, Allahabad, Vizag, Kochi..."
          style={{width:"100%",padding:"14px 16px",borderRadius:12,border:"2px solid #c9a05a",fontSize:14,fontFamily:"Georgia,serif",color:"#2a1800",background:"#fffdf7",outline:"none",boxSizing:"border-box",boxShadow:"0 2px 12px rgba(201,160,90,0.2)"}}/>

        {showDropdown&&filtered.length>0&&(
          <div id="city-dropdown" role="listbox" aria-label="City suggestions"
            style={{position:"absolute",top:"100%",left:0,right:0,zIndex:10,background:"#fffdf7",border:"2px solid #c9a05a",borderTop:"none",borderRadius:"0 0 12px 12px",boxShadow:"0 8px 24px rgba(0,0,0,0.12)",overflow:"hidden"}}>
            {filtered.map((c,i)=>{
              const ql=query.toLowerCase();
              const matchedAlias=!c.city.toLowerCase().includes(ql)&&!c.formerName?.toLowerCase().includes(ql)?c.aliases.find(a=>a.toLowerCase().includes(ql))||c.aliases.find(a=>levenshtein(ql,a.toLowerCase().slice(0,ql.length+2))<=2):null;
              return(
                <div key={c.city} id={`city-option-${i}`} role="option" aria-selected={i===focusedIndex}
                  onMouseDown={()=>handleSelect(c)} onMouseEnter={()=>setFocusedIndex(i)}
                  style={{padding:"10px 16px",cursor:"pointer",borderBottom:i<filtered.length-1?"1px solid #f0e8d8":"none",background:i===focusedIndex?"#f5ede0":"transparent",transition:"background 0.1s"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <span style={{fontSize:14,fontWeight:"bold",color:"#2a1800"}}>{c.city}</span>
                      {c.formerName&&<span style={{fontSize:10,color:"#a07840",fontStyle:"italic",marginLeft:6}}>({c.formerName})</span>}
                      <span style={{fontSize:10,color:"#a07840",marginLeft:6}}>{c.state}</span>
                    </div>
                    <span style={{fontSize:10,color:STRESS[c.stress].color,fontWeight:"bold"}}>{c.stress}</span>
                  </div>
                  {matchedAlias&&<div style={{fontSize:9,color:"#b09060",marginTop:2}}>Also known as: {matchedAlias}</div>}
                </div>
              );
            })}
          </div>
        )}

        {showDropdown&&query.length>=2&&filtered.length===0&&(
          <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:10,background:"#fffdf7",border:"2px solid #c9a05a",borderTop:"none",borderRadius:"0 0 12px 12px",boxShadow:"0 8px 24px rgba(0,0,0,0.12)",padding:"12px 16px"}}>
            <div style={{fontSize:12,color:"#a07840",fontStyle:"italic",marginBottom:6}}>"{query}" isn't in our current 50 cities yet.</div>
            <div onMouseDown={()=>{setNotFound(query.trim());setShowDropdown(false);}} style={{fontSize:12,color:"#0096c7",fontWeight:"bold",cursor:"pointer",padding:"6px 10px",background:"#f0f8ff",borderRadius:8,display:"inline-block"}}>
              + Request {query.trim().replace(/\b\w/g,c=>c.toUpperCase())} be added →
            </div>
          </div>
        )}
      </div>

      {selected && <AnimatedCard city={selected} researchCache={researchCache}/>}
      {notFound && !selected && <CityRequestPanel searchTerm={notFound} onSelectCity={handleSelect}/>}

      {!selected&&!notFound&&(
        <div style={{textAlign:"center",color:"#c9a05a",opacity:0.5,marginTop:8}}>
          <div style={{fontSize:56,marginBottom:10}}>◎</div>
          <div style={{fontSize:12,letterSpacing:"0.1em"}}>YOUR CITY CARD WILL APPEAR HERE</div>
          <div style={{fontSize:11,color:"#a07840",marginTop:18,lineHeight:1.9,maxWidth:380}}>
            50 cities covered · Current & former names searchable<br/>
            <span style={{fontStyle:"italic"}}>Don't see yours? Request it below.</span>
          </div>
        </div>
      )}
      </div> {/* end centred content column */}
    </div>
  );
}
