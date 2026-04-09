import { useState, useEffect, useRef } from "react";
import { CITY_ISSUES, CIVIC_ORGS, CITIES_WITH_DATA, WARD_CORPORATORS } from "./cityData.js";
import ElectionsCard from "./components/ElectionsCard";

// ─── City Data ────────────────────────────────────────────────────────────────
const cities = [
  { rank:1,  city:"Delhi",                    state:"Delhi",           population:33807000, area:1484,  density:22781, tier:"Mega Metro",  density_descriptor:"Very Dense",       urban_typology:"Gravity City",           one_liner:"The republic's beating heart — every road, policy, and ambition seems to lead here.",                              stress:"Critical", stress_reason:"Extreme density, severe waste processing gap, governance fragmentation",                  formerName:null,          aliases:["New Delhi","NCT"] },
  { rank:2,  city:"Mumbai",                   state:"Maharashtra",     population:21297000, area:603.4, density:35295, tier:"Mega Metro",  density_descriptor:"Extremely Dense",  urban_typology:"Gravity City",           one_liner:"An island city that ran out of land but never stopped growing.",                                                    stress:"Critical", stress_reason:"Extreme density, legacy dumpsites, coastal vulnerability",                                 formerName:"Bombay",      aliases:["Bombay"] },
  { rank:3,  city:"Kolkata",                  state:"West Bengal",     population:15134000, area:205,   density:73824, tier:"Mega Metro",  density_descriptor:"Extremely Dense",  urban_typology:"Gravity City",           one_liner:"Once the capital of British India, carrying the weight of empire, partition, and reinvention.",                       stress:"Critical", stress_reason:"World's highest density major city, ageing infrastructure, drainage stress",             formerName:"Calcutta",    aliases:["Calcutta"] },
  { rank:4,  city:"Bengaluru",                state:"Karnataka",       population:14678000, area:741,   density:19808, tier:"Mega Metro",  density_descriptor:"Very Dense",       urban_typology:"Overnight City",         one_liner:"A cantonment town that became a global tech capital in one generation.",                                              stress:"High",     stress_reason:"Rapid growth outpacing infrastructure, water scarcity, traffic gridlock",                  formerName:"Bangalore",   aliases:["Bangalore"] },
  { rank:5,  city:"Chennai",                  state:"Tamil Nadu",      population:11503000, area:426,   density:27002, tier:"Mega Metro",  density_descriptor:"Extremely Dense",  urban_typology:"Gravity City",           one_liner:"South India's gateway to the world.",                                                                              stress:"High",     stress_reason:"High density, flood vulnerability, water stress cycles",                                   formerName:"Madras",      aliases:["Madras"] },
  { rank:6,  city:"Hyderabad",                state:"Telangana",       population:10534000, area:650,   density:16206, tier:"Mega Metro",  density_descriptor:"Very Dense",       urban_typology:"Overnight City",         one_liner:"A city of Nizams and now of tech unicorns.",                                                                       stress:"High",     stress_reason:"Rapid tech-led growth, peri-urban sprawl, lake encroachment",                              formerName:null,          aliases:["Cyberabad","Hyd"] },
  {
    rank:7,  city:"Ahmedabad",                state:"Gujarat",         population:8450000,  area:505,   density:16733, tier:"Major City",  density_descriptor:"Very Dense",       urban_typology:"Overnight City",         one_liner:"India's first UNESCO World Heritage City.",                                                                        stress:"High",     stress_reason:"Dense old city core, industrial pollution, heat island effect",                            formerName:null,          aliases:["Amdavad","AMD"],
    elections: {
      year: 2026,
      status: "nomination",
      election_date: "2026-04-26",
      result_date: "2026-04-28",
      nomination_close: "2026-04-11",
      wards_total: 48,
      wards_verified: 21,
      seats_total: 192,
      timeline: [
        { date: "2026-04-06", label: "Nomination opens", icon: "📝" },
        { date: "2026-04-11", label: "Nomination closes", icon: "🔒", urgent: true },
        { date: "2026-04-13", label: "Scrutiny", icon: "✓" },
        { date: "2026-04-15", label: "Candidates finalized", icon: "📋" },
        { date: "2026-04-26", label: "Election day", icon: "🗳️" },
        { date: "2026-04-28", label: "Results announced", icon: "📊" }
      ],
      verified_wards: [
        { number: 1, name: "Gota" },
        { number: 2, name: "Chandlodia" },
        { number: 3, name: "Ranip" },
        { number: 4, name: "Sabarmati" },
        { number: 5, name: "Nava Wadaj" },
        { number: 6, name: "Juna Wadaj" },
        { number: 7, name: "Ghatlodia" },
        { number: 8, name: "Thaltej" },
        { number: 9, name: "Naranpura" },
        { number: 10, name: "Stadium" },
        { number: 11, name: "Sardarnagar" },
        { number: 12, name: "Naroda" },
        { number: 14, name: "Kubernagar" },
        { number: 19, name: "Bodakdev" },
        { number: 20, name: "Jodhpur" },
        { number: 22, name: "Stadium West" },
        { number: 23, name: "Thakkarbapanagar" },
        { number: 25, name: "Viratnagar" },
        { number: 26, name: "Ambawadi" },
        { number: 27, name: "Navrangpura" },
        { number: 40, name: "Paldi" },
        { number: 41, name: "Vasna" }
      ],
      wards: [
        { number: 1, name: "Gota" },
        { number: 2, name: "Chandlodia" },
        { number: 3, name: "Ranip" },
        { number: 4, name: "Sabarmati" },
        { number: 5, name: "Nava Wadaj" },
        { number: 6, name: "Juna Wadaj" },
        { number: 7, name: "Ghatlodia" },
        { number: 8, name: "Thaltej" },
        { number: 9, name: "Naranpura" },
        { number: 10, name: "Stadium" },
        { number: 11, name: "Sardarnagar" },
        { number: 12, name: "Naroda" },
        { number: 14, name: "Kubernagar" },
        { number: 19, name: "Bodakdev" },
        { number: 20, name: "Jodhpur" },
        { number: 22, name: "Stadium West" },
        { number: 23, name: "Thakkarbapanagar" },
        { number: 25, name: "Viratnagar" },
        { number: 26, name: "Ambawadi" },
        { number: 27, name: "Navrangpura" },
        { number: 40, name: "Paldi" },
        { number: 41, name: "Vasna" }
      ]
    }
  },
  { rank:8,  city:"Surat",                    state:"Gujarat",         population:7784000,  area:326.5, density:23841, tier:"Major City",  density_descriptor:"Very Dense",       urban_typology:"Overnight City",         one_liner:"Survived a plague and rebuilt into one of India's best-managed municipalities.",                                     stress:"Elevated", stress_reason:"High density but strong municipal track record; migration pressure rising",              formerName:null,          aliases:[] },
  { rank:9,  city:"Pune",                     state:"Maharashtra",     population:7764000,  area:331.3, density:23435, tier:"Major City",  density_descriptor:"Very Dense",       urban_typology:"Overnight City",         one_liner:"Mumbai's younger, more breathable neighbour.",                                                                     stress:"Elevated", stress_reason:"Fast growth, water stress, periurban planning gaps",                                      formerName:"Poona",       aliases:["Poona"] },
  { rank:10, city:"Jaipur",                   state:"Rajasthan",       population:4161000,  area:467,   density:8910,  tier:"Major City",  density_descriptor:"Moderately Dense", urban_typology:"Ancient Pulse",          one_liner:"The Pink City, built in a perfect grid in 1727.",                                                                  stress:"Elevated", stress_reason:"Heritage-growth tension, water scarcity, tourism pressure",                              formerName:null,          aliases:["Pink City"] },
  { rank:11, city:"Lucknow",                  state:"Uttar Pradesh",   population:3879000,  area:349,   density:11115, tier:"Major City",  density_descriptor:"Moderately Dense", urban_typology:"Sleeping Giant",         one_liner:"The city of nawabs and tehzeeb.",                                                                                  stress:"High",     stress_reason:"Underinvestment relative to size, Gomti river stress, waste processing gaps",              formerName:null,          aliases:["Lakhnau"] },
  { rank:12, city:"Indore",                   state:"Madhya Pradesh",  population:3276000,  area:530,   density:6181,  tier:"Major City",  density_descriptor:"Moderate",         urban_typology:"Managed Growth City",    one_liner:"India's cleanest city for seven consecutive years.",                                                               stress:"Moderate", stress_reason:"Strong SWM track record; growth pressure on western periphery",                         formerName:null,          aliases:[] },
  { rank:13, city:"Kanpur",                   state:"Uttar Pradesh",   population:3144000,  area:403.7, density:7788,  tier:"Major City",  density_descriptor:"Moderate",         urban_typology:"Sleeping Giant",         one_liner:"Once the Manchester of the East.",                                                                                 stress:"High",     stress_reason:"Industrial decline, Ganga pollution, chronic underinvestment",                             formerName:"Cawnpore",    aliases:["Cawnpore","Cawnpur"] },
  { rank:14, city:"Nagpur",                   state:"Maharashtra",     population:2923000,  area:227.3, density:12860, tier:"Major City",  density_descriptor:"Moderately Dense", urban_typology:"Blueprint City",         one_liner:"The geographic centre of India.",                                                                                  stress:"Moderate", stress_reason:"Planned layout helps; summer heat stress and water supply gaps persist",                formerName:null,          aliases:["Orange City"] },
  { rank:15, city:"Patna",                    state:"Bihar",           population:2474000,  area:136,   density:18191, tier:"Major City",  density_descriptor:"Very Dense",       urban_typology:"Sleeping Giant",         one_liner:"Capital of ancient Magadha and the Mauryan empire.",                                                               stress:"Critical", stress_reason:"Very high density, flood-prone, severely stretched civic infrastructure",                formerName:"Pataliputra", aliases:["Pataliputra"] },
  { rank:16, city:"Thane",                    state:"Maharashtra",     population:2470000,  area:147,   density:16803, tier:"Large City",  density_descriptor:"Very Dense",       urban_typology:"Overnight City",         one_liner:"Mumbai's pressure valve.",                                                                                         stress:"High",     stress_reason:"Rapid densification, creek pollution, infrastructure lag",                                 formerName:null,          aliases:["Thana"] },
  { rank:17, city:"Bhopal",                   state:"Madhya Pradesh",  population:2391000,  area:463,   density:5164,  tier:"Large City",  density_descriptor:"Moderate",         urban_typology:"Blueprint City",         one_liner:"A city of lakes carrying the permanent scar of 1984.",                                                            stress:"Elevated", stress_reason:"Lake encroachment, legacy contamination zones, uneven service delivery",               formerName:null,          aliases:["City of Lakes"] },
  { rank:18, city:"Ghaziabad",                state:"Uttar Pradesh",   population:2375000,  area:210,   density:11310, tier:"Large City",  density_descriptor:"Moderately Dense", urban_typology:"Overnight City",         one_liner:"Delhi's eastern gate.",                                                                                            stress:"High",     stress_reason:"NCR spillover, air quality crisis, waste management gaps",                                 formerName:null,          aliases:["GZB"] },
  { rank:19, city:"Visakhapatnam",            state:"Andhra Pradesh",  population:2358000,  area:530,   density:4449,  tier:"Large City",  density_descriptor:"Moderate",         urban_typology:"Sleeping Giant",         one_liner:"A deep-water port city with every ingredient of greatness.",                                                       stress:"Elevated", stress_reason:"Industrial pollution, cyclone vulnerability, uneven infrastructure",                   formerName:null,          aliases:["Vizag","Waltair"] },
  { rank:20, city:"Vadodara",                 state:"Gujarat",         population:2300000,  area:148,   density:15541, tier:"Large City",  density_descriptor:"Very Dense",       urban_typology:"Managed Growth City",    one_liner:"Gujarat's cultural capital.",                                                                                      stress:"Moderate", stress_reason:"Dense but well-managed; flood risk in low-lying areas",                                  formerName:"Baroda",      aliases:["Baroda"] },
  { rank:21, city:"Pimpri-Chinchwad",         state:"Maharashtra",     population:2273000,  area:177,   density:12842, tier:"Large City",  density_descriptor:"Moderately Dense", urban_typology:"Blueprint City",         one_liner:"Pune's industrial twin.",                                                                                          stress:"Moderate", stress_reason:"Planned industrial city; air quality concern",                                             formerName:null,          aliases:["PCMC","Pimpri","Chinchwad"] },
  { rank:22, city:"Nashik",                   state:"Maharashtra",     population:1958000,  area:259,   density:7560,  tier:"Large City",  density_descriptor:"Moderate",         urban_typology:"Ancient Pulse",          one_liner:"On the Godavari, host to the Kumbh Mela.",                                                                         stress:"Elevated", stress_reason:"Pilgrimage surge pressure, river health, periurban growth",                          formerName:null,          aliases:["Nasik"] },
  { rank:23, city:"Faridabad",                state:"Haryana",         population:1880000,  area:219,   density:8584,  tier:"Large City",  density_descriptor:"Moderately Dense", urban_typology:"Overnight City",         one_liner:"Delhi's industrial shadow.",                                                                                       stress:"High",     stress_reason:"Among worst air quality in NCR, industrial waste, governance gaps",                     formerName:null,          aliases:[] },
  { rank:24, city:"Ludhiana",                 state:"Punjab",          population:1847000,  area:310,   density:5958,  tier:"Large City",  density_descriptor:"Moderate",         urban_typology:"Overnight City",         one_liner:"The hosiery and bicycle capital of India.",                                                                        stress:"High",     stress_reason:"Buddha Nullah pollution, dyeing industry effluents, unplanned growth",                  formerName:null,          aliases:[] },
  { rank:25, city:"Agra",                     state:"Uttar Pradesh",   population:1760000,  area:188.4, density:9342,  tier:"Large City",  density_descriptor:"Moderately Dense", urban_typology:"Ancient Pulse",          one_liner:"The city the Mughals built their empire around.",                                                                  stress:"High",     stress_reason:"Yamuna pollution, heritage-tourism pressure, air quality around Taj",                   formerName:null,          aliases:["Taj City"] },
  { rank:26, city:"Rajkot",                   state:"Gujarat",         population:1690000,  area:170,   density:9941,  tier:"Large City",  density_descriptor:"Moderately Dense", urban_typology:"Managed Growth City",    one_liner:"Gandhi's childhood city.",                                                                                         stress:"Moderate", stress_reason:"Moderate density, reasonable governance; heat stress rising",                          formerName:null,          aliases:[] },
  { rank:27, city:"Varanasi",                 state:"Uttar Pradesh",   population:1680000,  area:82,    density:20488, tier:"Large City",  density_descriptor:"Very Dense",       urban_typology:"Ancient Pulse",          one_liner:"Three thousand years of habitation in 82 square kilometres.",                                                     stress:"Critical", stress_reason:"Extreme density in ancient core, Ganga ghats under sewage stress",                   formerName:null,          aliases:["Banaras","Benares","Kashi"] },
  { rank:28, city:"Kalyan-Dombivli",          state:"Maharashtra",     population:1654000,  area:94,    density:17596, tier:"Large City",  density_descriptor:"Very Dense",       urban_typology:"Overnight City",         one_liner:"The city at the end of Mumbai's suburban rail line.",                                                              stress:"High",     stress_reason:"Very dense, creek pollution, infrastructure designed for half its population",          formerName:null,          aliases:["Kalyan","Dombivli","KDMC"] },
  { rank:29, city:"Coimbatore",               state:"Tamil Nadu",      population:1601000,  area:246.8, density:6487,  tier:"Large City",  density_descriptor:"Moderate",         urban_typology:"Managed Growth City",    one_liner:"The Manchester of South India.",                                                                                   stress:"Moderate", stress_reason:"Moderate density, diversified economy; water stress in dry years",                    formerName:null,          aliases:["Kovai"] },
  { rank:30, city:"Meerut",                   state:"Uttar Pradesh",   population:1590000,  area:141.9, density:11205, tier:"Large City",  density_descriptor:"Moderately Dense", urban_typology:"Sleeping Giant",         one_liner:"Where the 1857 uprising began.",                                                                                   stress:"High",     stress_reason:"Dense, chronically underinvested, air quality stress, drainage failures",              formerName:null,          aliases:[] },
  { rank:31, city:"Vasai-Virar",              state:"Maharashtra",     population:1581000,  area:380,   density:4161,  tier:"Large City",  density_descriptor:"Moderate",         urban_typology:"Overnight City",         one_liner:"Mumbai's furthest bedroom.",                                                                                       stress:"Elevated", stress_reason:"Rapid growth outpacing water and waste infrastructure",                              formerName:null,          aliases:["Vasai","Virar","Bassein"] },
  { rank:32, city:"Madurai",                  state:"Tamil Nadu",      population:1561000,  area:147.9, density:10554, tier:"Large City",  density_descriptor:"Moderately Dense", urban_typology:"Ancient Pulse",          one_liner:"The city that never sleeps.",                                                                                      stress:"Elevated", stress_reason:"Dense ancient core, Vaigai river stress, pilgrimage pressure",                      formerName:null,          aliases:["Temple City"] },
  { rank:33, city:"Prayagraj",                state:"Uttar Pradesh",   population:1536000,  area:70.5,  density:21787, tier:"Large City",  density_descriptor:"Very Dense",       urban_typology:"Ancient Pulse",          one_liner:"At the confluence of three rivers, one invisible.",                                                               stress:"High",     stress_reason:"Very dense ancient city, Ganga-Yamuna pollution, Kumbh surge stress",                  formerName:"Allahabad",   aliases:["Allahabad","Ilahabad","Sangam City"] },
  { rank:34, city:"Gurugram",                 state:"Haryana",         population:1514000,  area:732,   density:2068,  tier:"Large City",  density_descriptor:"Spacious",         urban_typology:"Blueprint City",         one_liner:"A paddy field in 1990, a city of glass towers by 2010.",                                                          stress:"Elevated", stress_reason:"Private infrastructure islands, no integrated civic governance, waterlogging",       formerName:"Gurgaon",     aliases:["Gurgaon","Millennium City"] },
  { rank:35, city:"Navi Mumbai",              state:"Maharashtra",     population:1500000,  area:344,   density:4360,  tier:"Large City",  density_descriptor:"Moderate",         urban_typology:"Blueprint City",         one_liner:"Designed to relieve Mumbai's pressure.",                                                                           stress:"Moderate", stress_reason:"Planned city with reasonable services; creek health declining",                      formerName:null,          aliases:["New Mumbai"] },
  { rank:36, city:"Chhatrapati Sambhajinagar",state:"Maharashtra",     population:1492000,  area:139.1, density:10726, tier:"Large City",  density_descriptor:"Moderately Dense", urban_typology:"Ancient Pulse",          one_liner:"Named after a Maratha warrior-king, neighbour to caves a millennium older.",                                        stress:"Elevated", stress_reason:"Water scarcity, heritage-industrial tension, uneven service delivery",                formerName:"Aurangabad",  aliases:["Aurangabad","Sambhajinagar","CSN"] },
  { rank:37, city:"Howrah",                   state:"West Bengal",     population:1492000,  area:51.6,  density:28915, tier:"Large City",  density_descriptor:"Extremely Dense",  urban_typology:"Compact Agglomeration",  one_liner:"Across the Hooghly from Kolkata, a world apart.",                                                                 stress:"Critical", stress_reason:"Extremely dense, ageing industrial infrastructure, drainage collapse risk",          formerName:null,          aliases:["Haora"] },
  { rank:38, city:"Vijayawada",               state:"Andhra Pradesh",  population:1393000,  area:61.9,  density:22504, tier:"Large City",  density_descriptor:"Very Dense",       urban_typology:"Gravity City",           one_liner:"Commercial capital of a state that lost its capital.",                                                             stress:"High",     stress_reason:"Very dense, Krishna river flood risk, rapid commercial growth",                      formerName:"Bezawada",    aliases:["Bezawada"] },
  { rank:39, city:"Srinagar",                 state:"Jammu & Kashmir", population:1341000,  area:294,   density:4561,  tier:"Large City",  density_descriptor:"Moderate",         urban_typology:"Border Effect City",     one_liner:"A city of houseboats and chinar trees.",                                                                           stress:"Elevated", stress_reason:"Dal Lake degradation, conflict-era infrastructure deficit",                         formerName:null,          aliases:[] },
  { rank:40, city:"Jamshedpur",               state:"Jharkhand",       population:1337000,  area:64,    density:20891, tier:"Large City",  density_descriptor:"Very Dense",       urban_typology:"Blueprint City",         one_liner:"A city Tata built from scratch in 1907.",                                                                         stress:"Moderate", stress_reason:"Corporate governance maintains services; industrial pollution concern",             formerName:null,          aliases:["Tatanagar","Steel City"] },
  { rank:41, city:"Ranchi",                   state:"Jharkhand",       population:1326000,  area:175,   density:7577,  tier:"Large City",  density_descriptor:"Moderate",         urban_typology:"Sleeping Giant",         one_liner:"Capital of a mineral-rich state that struggles to share its wealth.",                                              stress:"High",     stress_reason:"Rapid growth, water body encroachment, weak municipal capacity",                    formerName:null,          aliases:[] },
  { rank:42, city:"Amritsar",                 state:"Punjab",          population:1298000,  area:150,   density:8653,  tier:"Large City",  density_descriptor:"Moderately Dense", urban_typology:"Border Effect City",     one_liner:"Sacred city, Partition wound, border economy.",                                                                   stress:"Elevated", stress_reason:"Heritage core pressure, tourism surge, water stress",                               formerName:null,          aliases:["Golden City","Ambarsar"] },
  { rank:43, city:"Guwahati",                 state:"Assam",           population:1274000,  area:216,   density:5898,  tier:"Large City",  density_descriptor:"Moderate",         urban_typology:"Gravity City",           one_liner:"The northeast's only major city.",                                                                                 stress:"Elevated", stress_reason:"Brahmaputra flood risk, rapid growth, hillside encroachment",                     formerName:"Gauhati",     aliases:["Gauhati"] },
  { rank:44, city:"Jabalpur",                 state:"Madhya Pradesh",  population:1267000,  area:367,   density:3452,  tier:"Large City",  density_descriptor:"Moderate",         urban_typology:"Sleeping Giant",         one_liner:"A city of marble rocks and military cantonments.",                                                                 stress:"Moderate", stress_reason:"Low density helps; water stress, underinvestment in services",                     formerName:null,          aliases:["Jubbulpore"] },
  { rank:45, city:"Raipur",                   state:"Chhattisgarh",    population:1254000,  area:226,   density:5549,  tier:"Large City",  density_descriptor:"Moderate",         urban_typology:"Gravity City",           one_liner:"Became a primate city overnight in 2000.",                                                                         stress:"Elevated", stress_reason:"Young capital city still building civic infrastructure",                          formerName:null,          aliases:[] },
  { rank:46, city:"Asansol",                  state:"West Bengal",     population:1250000,  area:127,   density:9843,  tier:"Large City",  density_descriptor:"Moderately Dense", urban_typology:"Sleeping Giant",         one_liner:"West Bengal's second city awaiting its second act.",                                                              stress:"High",     stress_reason:"Post-industrial decline, dense housing, weak municipal revenue",                    formerName:null,          aliases:[] },
  { rank:47, city:"Secunderabad",             state:"Telangana",       population:1200000,  area:25,    density:48000, tier:"Large City",  density_descriptor:"Extremely Dense",  urban_typology:"Compact Agglomeration",  one_liner:"At 48,000 per sq km, one of India's most compressed urban spaces.",                                               stress:"Critical", stress_reason:"Highest density in dataset, cantonment-civil governance split, no room to expand",  formerName:null,          aliases:[] },
  { rank:48, city:"Dhanbad",                  state:"Jharkhand",       population:1196000,  area:70,    density:17086, tier:"Large City",  density_descriptor:"Very Dense",       urban_typology:"Blueprint City",         one_liner:"India's coal capital.",                                                                                            stress:"High",     stress_reason:"Mining subsidence, high density, coal dust, water contamination",                  formerName:null,          aliases:["Coal Capital"] },
  { rank:49, city:"Chandigarh",               state:"Chandigarh",      population:1158000,  area:114,   density:10158, tier:"Large City",  density_descriptor:"Moderately Dense", urban_typology:"Blueprint City",         one_liner:"Le Corbusier's gift to a newly independent India.",                                                               stress:"Stable",   stress_reason:"Planned city, strong green cover, good services; satellite town pressure growing",  formerName:null,          aliases:["City Beautiful"] },
  { rank:50, city:"Gwalior",                  state:"Madhya Pradesh",  population:1153000,  area:289,   density:3990,  tier:"Large City",  density_descriptor:"Moderate",         urban_typology:"Ancient Pulse",          one_liner:"A fort city that controlled the heart of the subcontinent for centuries.",                                          stress:"Moderate", stress_reason:"Low density, moderate services; water scarcity and air quality concerns",          formerName:null,          aliases:[] },
  { rank:51, city:"Mira Bhayandar",           state:"Maharashtra",     population:907000,   area:79.4,  density:11425, tier:"Large City",  density_descriptor:"Moderately Dense", urban_typology:"Overnight City",         one_liner:"Mumbai's northern edge — where affordable housing met the sea.",                                                    stress:"High",     stress_reason:"Explosive growth without matching infrastructure, water supply dependence, connectivity gaps", formerName:null, aliases:["Mira Road","Bhayandar"] },
];

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

const TYPO_DESC = {
  "Gravity City":          "Pulls everything toward it — people, capital, decisions. The dominant force in its region.",
  "Overnight City":        "Transformed beyond recognition in a generation, usually on the back of a tech or industrial boom. Infrastructure is forever catching up.",
  "Ancient Pulse":         "Older than most nations. Its civic DNA is shaped by thousands of years of habitation. History isn't just past here — it's infrastructure.",
  "Blueprint City":        "Conceived by a planner before it was inhabited. Order is built in, but organic life has to be earned.",
  "Sleeping Giant":        "Has every ingredient for prominence — size, history, location — but has been overlooked or underinvested. Watching its next chapter.",
  "Border Effect City":    "Shaped by what lies across the border — whether a state, a nation, or a military line. Geopolitics lives in its economy.",
  "Managed Growth City":   "Found a way to grow without collapsing under its own weight. Often cited as a model, which brings its own pressure.",
  "Compact Agglomeration": "An extremely dense urban pocket, often absorbed into a larger metro. Extraordinary density in a small footprint.",
};

// Special:FilePath lets Wikimedia resolve the correct hash automatically — far more reliable than hardcoding thumb paths.
const W = (f) => `https://commons.wikimedia.org/wiki/Special:FilePath/${f}`;
const CITY_IMAGES = {
  "Delhi":                    W("India_Gate-Delhi_India11.JPG"),
  "Mumbai":                   W("Mumbai_03-2016_30_Gateway_of_India.jpg"),
  "Kolkata":                  W("Howrah_bridge_at_night.jpg"),
  "Bengaluru":                W("Vidhana_Soudha_Bangalore.jpg"),
  "Chennai":                  W("Marina_Beach,_Chennai_101.JPG"),
  "Hyderabad":                W("Charminar_Hyderabad.jpg"),
  "Ahmedabad":                W("Adalaj_step_well.jpg"),
  "Surat":                    W("Surat_Castle.jpg"),
  "Pune":                     W("Shaniwarwada_gate.JPG"),
  "Jaipur":                   W("Hawa_Mahal,_Jaipur,_Rajasthan.JPG"),
  "Lucknow":                  W("Bara_Imambara.jpg"),
  "Indore":                   W("Rajwada_Indore.jpg"),
  "Kanpur":                   W("IIT_Kanpur_Main_Building.jpg"),
  "Nagpur":                   W("Deekshabhoomi,_Nagpur.jpg"),
  "Patna":                    W("Golghar_Patna.jpg"),
  "Thane":                    W("Upvan_Lake_Thane.jpg"),
  "Bhopal":                   W("Upper_Lake,_Bhopal.jpg"),
  "Ghaziabad":                W("Hindon_River_Ghaziabad.jpg"),
  "Visakhapatnam":            W("Rushikonda_beach.jpg"),
  "Vadodara":                 W("Laxmi_Vilas_Palace_(Maratha_Palace),_Vadodara.JPG"),
  "Pimpri-Chinchwad":         W("Pimpri-Chinchwad.jpg"),
  "Nashik":                   W("Trimbakeshwar_temple.jpg"),
  "Faridabad":                W("Suraj_Kund_Festival.JPG"),
  "Ludhiana":                 W("Ludhiana_city.jpg"),
  "Agra":                     W("Taj_Mahal_(Edited).jpeg"),
  "Rajkot":                   W("Rajkot_night_view.jpg"),
  "Varanasi":                 W("Varanasi_ghats.jpg"),
  "Kalyan-Dombivli":          W("Kalyan_fort.jpg"),
  "Coimbatore":               W("Marudhamalai_temple.jpg"),
  "Meerut":                   W("Meerut.jpg"),
  "Vasai-Virar":              W("Entrance_arched_door_to_Bassein_Fort.JPG"),
  "Madurai":                  W("Meenakshi_Amman_Temple,_Madurai.JPG"),
  "Prayagraj":                W("Triveni_Sangam.JPG"),
  "Gurugram":                 W("DLF_CyberCity_Gurgaon.jpg"),
  "Navi Mumbai":              W("Vashi_Navi_Mumbai.jpg"),
  "Chhatrapati Sambhajinagar":W("Bibi_ka_Maqbara.jpg"),
  "Howrah":                   W("Howrah_Bridge.jpg"),
  "Vijayawada":               W("Kanka_Durga_Temple.JPG"),
  "Srinagar":                 W("Dal_Lake,_Srinagar.jpg"),
  "Jamshedpur":               W("Jubilee_Park_Jamshedpur.jpg"),
  "Ranchi":                   W("Hundru_Falls,_Ranchi.jpg"),
  "Amritsar":                 W("Golden_Temple-Amritsar.JPG"),
  "Guwahati":                 W("Kamakhya_Temple.jpg"),
  "Jabalpur":                 W("Dhuandhar_falls.jpg"),
  "Raipur":                   W("Purkhouti_Muktangan.jpg"),
  "Asansol":                  W("Maithon_Dam.jpg"),
  "Secunderabad":             W("Secunderabad_railway_station.jpg"),
  "Dhanbad":                  W("Topchanchi_lake.jpg"),
  "Chandigarh":               W("Rock_Garden_of_Chandigarh.jpg"),
  "Gwalior":                  W("Gwalior_Fort.jpg"),
  "Mira Bhayandar":           W("Mira_Road_skyline.jpg"),
};

// ─── Curated conversation starters ───────────────────────────────────────────
const PULSE_THREADS = [
  {
    tag: "💧 Water",
    tagColor: "#0096c7",
    headline: "7 cities are approaching Day Zero. Is yours next?",
    body: "Bengaluru nearly ran out of groundwater in 2023. Chennai has seen it before. Jaipur, Agra, and Varanasi are watching the same warning signs.",
    cities: ["Bengaluru", "Chennai", "Jaipur", "Agra", "Varanasi"],
  },
  {
    tag: "🏆 Governance",
    tagColor: "#2dc653",
    headline: "How Indore stayed India's cleanest city for 7 years straight.",
    body: "It wasn't luck. Indore's Swachh Survekshan story is a masterclass in municipal consistency — and what every other city refuses to copy.",
    cities: ["Indore"],
  },
  {
    tag: "🚦 Traffic",
    tagColor: "#f4a261",
    headline: "Bengaluru's traffic isn't a problem. It's a policy choice.",
    body: "Bengaluru added 1,000 new vehicles per day in 2023. The city's road network has grown 10x slower. Someone decided this was acceptable.",
    cities: ["Bengaluru", "Delhi", "Mumbai"],
  },
  {
    tag: "⚡ Density",
    tagColor: "#e63946",
    headline: "48,000 people per square kilometre. Life inside Secunderabad.",
    body: "Kolkata, Howrah, Secunderabad — India's most compressed cities aren't collapsing. But they're holding on by a thread.",
    cities: ["Secunderabad", "Kolkata", "Howrah"],
  },
];

// ─── Utilities ────────────────────────────────────────────────────────────────
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0));
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
    dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

function scoreMatch(c, q) {
  if (!q) return Infinity;
  const ql = q.toLowerCase().trim();
  const targets = [c.city.toLowerCase(), c.state.toLowerCase(), c.formerName?.toLowerCase(), ...c.aliases.map(a => a.toLowerCase())].filter(Boolean);
  if (targets.some(t => t.includes(ql))) return 0;
  if (ql.length < 4) return Infinity;
  let best = Infinity;
  for (const t of targets) {
    const d = levenshtein(ql, t.slice(0, ql.length + 2));
    if (d <= 2) best = Math.min(best, d);
    for (const word of t.split(/[\s-]/)) {
      if (word.length >= 4) { const wd = levenshtein(ql, word.slice(0, ql.length + 2)); if (wd <= 2) best = Math.min(best, wd); }
    }
  }
  return best;
}

function searchCities(q) {
  if (!q || q.trim().length < 1) return [];
  return cities.map(c => ({ city: c, score: scoreMatch(c, q) })).filter(x => x.score < Infinity).sort((a, b) => a.score - b.score).map(x => x.city).slice(0, 6);
}

function fmt(n) {
  if (n >= 10000000) return (n / 10000000).toFixed(1) + " crore";
  if (n >= 100000) return (n / 100000).toFixed(1) + " lakh";
  return n.toLocaleString();
}

// ─── Global Styles ─────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; overflow-x: hidden; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #FAF8F4; color: #1a1a1a; overflow-x: hidden; max-width: 100vw; }
    a { text-decoration: none; }
    button { font-family: inherit; cursor: pointer; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse-dot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.5; transform: scale(1.4); }
    }
    @keyframes ticker {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    .city-card {
      border-radius: 14px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
      box-shadow: 0 2px 12px rgba(0,0,0,0.14);
    }
    .city-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 14px 36px rgba(0,0,0,0.22);
    }
    .city-card:hover img {
      transform: scale(1.06);
    }

    .pill-btn {
      border: 1.5px solid #e0ddd8;
      background: #fff;
      color: #555;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
    }
    .pill-btn:hover { border-color: #1a1a1a; color: #1a1a1a; }
    .pill-btn.active { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }

    .pulse-thread-card {
      background: #fff;
      border-radius: 14px;
      padding: 24px;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
      border-top: 3px solid transparent;
    }
    .pulse-thread-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.1);
    }

    /* ── Panel navigation tabs (CityPage) ── */
    .panel-nav {
      position: sticky;
      top: 58px;
      z-index: 100;
      background: #fff;
      border-bottom: 1px solid #e8e5e0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .panel-nav::-webkit-scrollbar { display: none; }
    .panel-nav-inner {
      display: flex;
      max-width: 900px;
      margin: 0 auto;
      padding: 0 32px;
      min-width: max-content;
    }
    .panel-tab {
      padding: 14px 20px;
      border: none;
      background: none;
      font-size: 13px;
      font-weight: 600;
      color: #888;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      white-space: nowrap;
      transition: color 0.15s, border-color 0.15s;
      letter-spacing: 0.01em;
    }
    .panel-tab:hover { color: #333; }
    .panel-tab.active { color: #E8660D; border-bottom-color: #E8660D; }

    /* ── Ward table ── */
    .ward-table { width: 100%; border-collapse: collapse; }
    .ward-table th {
      text-align: left; padding: 10px 14px;
      font-size: 10px; font-weight: 700; color: #aaa;
      letter-spacing: 0.08em; text-transform: uppercase;
      border-bottom: 1px solid #f0ede8; background: #FAF8F4;
    }
    .ward-table td {
      padding: 11px 14px; font-size: 13px; color: #444;
      border-bottom: 1px solid #f0ede8; vertical-align: middle;
    }
    .ward-table tr:last-child td { border-bottom: none; }
    .ward-table tr:hover td { background: #faf8f4; }
    .ward-num { font-size: 11px; color: #bbb; font-weight: 600; }
    .ward-name { font-weight: 700; color: #1a1a1a; }
    .ward-corp { color: #555; }
    .party-badge {
      display: inline-block;
      font-size: 10px; font-weight: 800;
      padding: 3px 9px; border-radius: 10px;
      letter-spacing: 0.04em; color: #fff;
    }

    /* ── Compare button on city cards ── */
    .compare-btn {
      position: absolute;
      bottom: 12px; right: 12px;
      background: rgba(232,102,13,0.92);
      color: #fff; border: none;
      padding: 5px 13px; border-radius: 16px;
      font-size: 11px; font-weight: 700;
      cursor: pointer; opacity: 0;
      transition: opacity 0.18s;
      backdrop-filter: blur(4px);
      z-index: 10; letter-spacing: 0.02em;
    }
    .city-card:hover .compare-btn { opacity: 1; }
    .compare-btn.selected {
      opacity: 1 !important;
      background: rgba(255,255,255,0.92);
      color: #E8660D;
    }

    /* ── Compare tray (sticky bottom) ── */
    @keyframes slideUp {
      from { transform: translateY(100%); }
      to   { transform: translateY(0); }
    }
    .compare-tray {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 500;
      background: #0D1117;
      border-top: 1px solid rgba(255,255,255,0.1);
      padding: 12px 32px;
      display: flex; align-items: center; gap: 16;
      box-shadow: 0 -4px 24px rgba(0,0,0,0.5);
      animation: slideUp 0.22s ease;
    }

    @media (max-width: 768px) {
      .city-grid { grid-template-columns: 1fr 1fr !important; }
      .hero-headline { font-size: 36px !important; }
      .hero-sub { font-size: 16px !important; }
      .nav-links { display: none !important; }
      .stats-grid { grid-template-columns: 1fr 1fr !important; }
      .thread-grid { grid-template-columns: 1fr !important; }
      .panel-nav-inner { padding: 0 16px; }
      .ward-table td, .ward-table th { padding: 9px 10px; }
      .compare-tray { padding: 10px 16px; flex-wrap: wrap; gap: 10px; }
    }
    @media (max-width: 480px) {
      .city-grid { grid-template-columns: 1fr !important; }
      .hero-headline { font-size: 28px !important; }
    }
  `}</style>
);

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav({ onLogoClick, onSearch }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const ref = useRef(null);

  useEffect(() => {
    setResults(q.length >= 2 ? searchCities(q) : []);
  }, [q]);

  useEffect(() => {
    setActiveIndex(results.length > 0 ? 0 : -1);
  }, [results]);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setResults([]);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectCity = (city) => {
    onSearch(city);
    setQ("");
    setResults([]);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!results.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((index) => (index <= 0 ? results.length - 1 : index - 1));
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      selectCity(results[activeIndex] || results[0]);
      return;
    }

    if (e.key === "Escape") {
      setResults([]);
      setActiveIndex(-1);
    }
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      background: "rgba(13,17,23,0.96)", backdropFilter: "blur(10px)",
      borderBottom: "1px solid rgba(255,255,255,0.07)",
      height: 58, display: "flex", alignItems: "center",
      padding: "0 32px", gap: 24,
    }}>
      {/* Logo */}
      <button onClick={onLogoClick} style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <span style={{ width: 8, height: 8, background: "#E8660D", borderRadius: "50%", display: "inline-block", animation: "pulse-dot 2s infinite" }} />
        <span style={{ color: "#fff", fontWeight: 800, fontSize: 17, fontFamily: "Georgia, serif", letterSpacing: "-0.01em" }}>
          MyCityPulse
        </span>
      </button>

      {/* Nav search (desktop) */}
      <div ref={ref} style={{ flex: 1, maxWidth: 320, position: "relative" }} className="nav-links">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={handleKeyDown}
	  aria-label="Search cities from navigation"
          placeholder="Search any city..."
          style={{
            width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 24, padding: "7px 16px", color: "#fff", fontSize: 13,
            outline: "none",
          }}
        />
        {results.length > 0 && (
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
            background: "#1a1e26", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden", zIndex: 300,
          }}>
            {results.map((c, index) => (
              <button key={c.city} onClick={() => selectCity(c)} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                width: "100%", padding: "10px 16px", background: activeIndex === index ? "rgba(255,255,255,0.08)" : "none", border: "none",
                color: "#fff", fontSize: 13, textAlign: "left", cursor: "pointer",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
              onMouseEnter={() => setActiveIndex(index)}
              >
                <span>{c.city} <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>{c.state}</span></span>
                <span style={{ fontSize: 10, background: STRESS[c.stress].color + "33", color: STRESS[c.stress].color, padding: "2px 8px", borderRadius: 10, fontWeight: 700 }}>{c.stress}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="nav-links" style={{ display: "flex", gap: 24, alignItems: "center", marginLeft: "auto" }}>
        <a href="#pulse" style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, letterSpacing: "0.02em" }}>Issues</a>
        <a href="#cities" style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, letterSpacing: "0.02em" }}>All Cities</a>
        <a href="#join" style={{
          background: "#E8660D", color: "#fff", padding: "6px 18px",
          borderRadius: 20, fontSize: 12, fontWeight: 700, letterSpacing: "0.06em",
        }}>JOIN</a>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ onCitySelect }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const ref = useRef(null);

  useEffect(() => {
    setResults(q.length >= 2 ? searchCities(q) : []);
  }, [q]);

  useEffect(() => {
    setActiveIndex(results.length > 0 ? 0 : -1);
  }, [results]);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setResults([]);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const quickCities = ["Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Pune", "Chennai"];
  const selectCity = (city) => {
    onCitySelect(city);
    setQ("");
    setResults([]);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!results.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((index) => (index <= 0 ? results.length - 1 : index - 1));
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      selectCity(results[activeIndex] || results[0]);
      return;
    }

    if (e.key === "Escape") {
      setResults([]);
      setActiveIndex(-1);
    }
  };

  return (
    <section style={{
      minHeight: "92vh", background: "linear-gradient(160deg, #0D1117 0%, #141920 60%, #0f1620 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "100px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden",
    }}>
      {/* Background grid pattern */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.04,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 760, animation: "fadeUp 0.7s ease both" }}>
        {/* Eyebrow */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(232,102,13,0.12)", border: "1px solid rgba(232,102,13,0.3)",
          borderRadius: 20, padding: "5px 14px", marginBottom: 28,
        }}>
          <span style={{ width: 6, height: 6, background: "#E8660D", borderRadius: "50%", animation: "pulse-dot 2s infinite" }} />
          <span style={{ color: "#E8660D", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em" }}>CIVIC INTELLIGENCE FOR URBAN INDIA</span>
        </div>

        {/* Headline */}
        <h1 className="hero-headline" style={{
          fontSize: 56, fontFamily: "Georgia, serif", fontWeight: 700,
          color: "#fff", lineHeight: 1.15, marginBottom: 20,
          letterSpacing: "-0.02em",
        }}>
          Your city has a story.<br />
          <span style={{ color: "#E8660D" }}>Are you reading it?</span>
        </h1>

        {/* Sub */}
        <p className="hero-sub" style={{
          fontSize: 18, color: "rgba(255,255,255,0.55)", lineHeight: 1.7,
          maxWidth: 580, margin: "0 auto 40px", fontFamily: "Georgia, serif",
        }}>
          MyCityPulse tracks how India's 50 largest cities work — their stress, their stories, and the conversations they're starting.
        </p>

        {/* Search */}
        <div ref={ref} style={{ position: "relative", maxWidth: 480, margin: "0 auto 32px" }}>
          <div style={{ position: "relative" }}>
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              onKeyDown={handleKeyDown}
	      aria-label="Search cities"
              placeholder="Search your city..."
              style={{
                width: "100%", padding: "16px 56px 16px 24px",
                background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)",
                borderRadius: 40, color: "#fff", fontSize: 16, outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = "rgba(232,102,13,0.6)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"}
            />
            <div style={{
              position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
              background: "#E8660D", borderRadius: 28, padding: "8px 16px",
              color: "#fff", fontSize: 13, fontWeight: 700,
            }}>
              Explore →
            </div>
          </div>

          {/* Dropdown */}
          {results.length > 0 && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0,
              background: "#1a1e26", borderRadius: 14, boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden", zIndex: 300, textAlign: "left",
            }}>
              {results.map((c, index) => (
                <button key={c.city} onClick={() => selectCity(c)} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  width: "100%", padding: "12px 20px", background: activeIndex === index ? "rgba(255,255,255,0.06)" : "none", border: "none",
                  color: "#fff", fontSize: 14, cursor: "pointer",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
                onMouseEnter={() => setActiveIndex(index)}
                >
                  <div>
                    <span style={{ fontWeight: 600 }}>{c.city}</span>
                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginLeft: 8 }}>{c.state}</span>
                  </div>
                  <span style={{
                    fontSize: 11, background: STRESS[c.stress].color + "22",
                    color: STRESS[c.stress].color, padding: "3px 10px", borderRadius: 10, fontWeight: 700,
                  }}>{c.stress}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick city pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
          {quickCities.map(name => {
            const c = cities.find(x => x.city === name);
            return (
              <button key={name} onClick={() => onCitySelect(c)} style={{
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.75)", padding: "6px 16px", borderRadius: 20,
                fontSize: 13, cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.25)", fontSize: 12, letterSpacing: "0.12em" }}>
        SCROLL TO EXPLORE ↓
      </div>
    </section>
  );
}

// ─── Stats Banner ─────────────────────────────────────────────────────────────
function StatsBanner() {
  const criticalCount = cities.filter(c => c.stress === "Critical").length;
  const stats = [
    { value: "50", label: "Cities Tracked" },
    { value: "25+", label: "States Covered" },
    { value: `${criticalCount}`, label: "In Critical Stress" },
    { value: "8", label: "Civic Issue Lenses" },
  ];
  return (
    <div style={{ background: "#1a1a1a", padding: "28px 32px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24, textAlign: "center" }}>
          {stats.map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 32, fontWeight: 900, color: "#E8660D", fontFamily: "Georgia, serif", letterSpacing: "-0.03em" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── City Card ────────────────────────────────────────────────────────────────
function CityCard({ city, onSelect, onCompare, inCompare }) {
  const sc = STRESS[city.stress];
  const imgUrl = CITY_IMAGES[city.city];
  const [imgErr, setImgErr] = useState(false);

  return (
    <div
      className="city-card"
      onClick={() => onSelect(city)}
      style={{
        position: "relative",
        height: 260,
        overflow: "hidden",
        borderRadius: 14,
        cursor: "pointer",
        border: "none",
      }}
    >
      {/* Background image or gradient fallback */}
      {imgUrl && !imgErr ? (
        <img
          src={imgUrl}
          alt={city.city}
          onError={() => setImgErr(true)}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center",
            transition: "transform 0.4s ease",
          }}
        />
      ) : (
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(135deg, ${sc.color}88, #0D1117)`,
        }} />
      )}

      {/* Dark gradient overlay — bottom-heavy for legibility */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.18) 100%)",
      }} />

      {/* Top-left: rank + typology */}
      <div style={{
        position: "absolute", top: 12, left: 12,
        display: "flex", gap: 6, alignItems: "center",
      }}>
        <div style={{
          background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 10,
          fontWeight: 800, padding: "3px 8px", borderRadius: 8, backdropFilter: "blur(6px)",
        }}>#{city.rank}</div>
        <span
          title={TYPO_DESC[city.urban_typology]}
          style={{
            fontSize: 10, fontWeight: 700,
            color: TYPO_C[city.urban_typology],
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(6px)",
            padding: "3px 8px", borderRadius: 8, cursor: "help",
          }}>{city.urban_typology}</span>
      </div>

      {/* Top-right: stress badge */}
      <div style={{ position: "absolute", top: 12, right: 12 }}>
        <span
          title={`${city.stress} Stress — ${STRESS[city.stress]?.tagline}`}
          style={{
            fontSize: 10, fontWeight: 700, color: sc.color,
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)",
            border: `1px solid ${sc.color}66`,
            padding: "3px 9px", borderRadius: 10, cursor: "help",
          }}>{city.stress}</span>
      </div>

      {/* Bottom: city name, state, one-liner */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "20px 16px 16px",
      }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", lineHeight: 1.15, letterSpacing: "-0.3px" }}>
          {city.city}
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2, marginBottom: 8 }}>
          {city.state} · {fmt(city.population)} people
        </div>
        <p style={{
          fontSize: 12, color: "rgba(255,255,255,0.82)", fontFamily: "Georgia, serif",
          fontStyle: "italic", lineHeight: 1.45, margin: 0,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          "{city.one_liner}"
        </p>
      </div>

      {/* Compare toggle */}
      {onCompare && (
        <button
          className={`compare-btn${inCompare ? " selected" : ""}`}
          onClick={e => { e.stopPropagation(); onCompare(city); }}
          title={inCompare ? "Remove from comparison" : "Add to comparison"}
        >
          {inCompare ? "✓ Comparing" : "+ Compare"}
        </button>
      )}
    </div>
  );
}

// ─── City Grid ────────────────────────────────────────────────────────────────
function CityGrid({ onCitySelect, onCompare, compareList }) {
  const [tierFilter, setTierFilter] = useState("All");
  const [stressFilter, setStressFilter] = useState("All");
  const [q, setQ] = useState("");
  const [legendOpen, setLegendOpen] = useState(false);

  const tiers = ["All", "Mega Metro", "Major City", "Large City"];
  const stresses = ["All", "Critical", "High", "Elevated", "Moderate", "Stable"];

  const filtered = cities.filter(c => {
    if (tierFilter !== "All" && c.tier !== tierFilter) return false;
    if (stressFilter !== "All" && c.stress !== stressFilter) return false;
    if (q) {
      const ql = q.toLowerCase();
      return c.city.toLowerCase().includes(ql) || c.state.toLowerCase().includes(ql);
    }
    return true;
  });

  return (
    <section id="cities" style={{ padding: "72px 32px", background: "#FAF8F4" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#E8660D", letterSpacing: "0.1em", marginBottom: 10 }}>EXPLORE</div>
          <h2 style={{ fontSize: 36, fontFamily: "Georgia, serif", fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>
            50 cities. One pulse.
          </h2>
          <p style={{ fontSize: 16, color: "#666", maxWidth: 500, lineHeight: 1.6 }}>
            Every major Indian city, mapped by civic stress, urban typology, and the story it's telling right now.
          </p>
          <button
            onClick={() => setLegendOpen(o => !o)}
            style={{
              marginTop: 14, background: "none", border: "1.5px solid #e0ddd8",
              color: "#888", fontSize: 12, fontWeight: 600, padding: "6px 16px",
              borderRadius: 20, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
            }}
          >
            {legendOpen ? "▲" : "▼"} What do these tags mean?
          </button>
          {legendOpen && (
            <div style={{
              marginTop: 16, background: "#fff", borderRadius: 14,
              padding: "24px 28px", border: "1px solid #e8e5e0",
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28,
            }}>
              {/* Stress levels */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#E8660D", letterSpacing: "0.1em", marginBottom: 14 }}>CIVIC STRESS LEVELS</div>
                {Object.entries(STRESS).map(([level, s]) => (
                  <div key={level} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: s.color, background: s.bg, padding: "2px 8px", borderRadius: 8, flexShrink: 0, marginTop: 2 }}>{level}</span>
                    <span style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>{s.tagline}</span>
                  </div>
                ))}
              </div>
              {/* Urban typologies */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#E8660D", letterSpacing: "0.1em", marginBottom: 14 }}>URBAN TYPOLOGIES</div>
                {Object.entries(TYPO_DESC).map(([type, desc]) => (
                  <div key={type} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: TYPO_C[type], background: TYPO_C[type] + "18", padding: "2px 8px", borderRadius: 8, flexShrink: 0, marginTop: 2, whiteSpace: "nowrap" }}>{type}</span>
                    <span style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 32, alignItems: "center" }}>
          {/* Search */}
          <input
            value={q} onChange={e => setQ(e.target.value)}
            placeholder="Filter cities..."
            style={{
              padding: "7px 16px", border: "1.5px solid #e0ddd8", borderRadius: 24,
              fontSize: 13, outline: "none", background: "#fff", minWidth: 160,
            }}
          />
          {/* Tier pills */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {tiers.map(t => (
              <button key={t} onClick={() => setTierFilter(t)} className={`pill-btn${tierFilter === t ? " active" : ""}`}>{t}</button>
            ))}
          </div>
          {/* Stress pills */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {stresses.map(s => (
              <button key={s} onClick={() => setStressFilter(s)} className={`pill-btn${stressFilter === s ? " active" : ""}`}
                style={stressFilter === s && s !== "All" ? { background: STRESS[s]?.color, borderColor: STRESS[s]?.color } : {}}>
                {s}
              </button>
            ))}
          </div>
          <span style={{ fontSize: 12, color: "#aaa", marginLeft: "auto" }}>{filtered.length} cities</span>
        </div>

        {/* Grid */}
        <div className="city-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {filtered.map(c => (
            <CityCard
              key={c.city} city={c} onSelect={onCitySelect}
              onCompare={onCompare}
              inCompare={compareList?.some(x => x.city === c.city)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── National Pulse ───────────────────────────────────────────────────────────
function NationalPulse({ onCitySelect }) {
  return (
    <section id="pulse" style={{ padding: "72px 32px", background: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#E8660D", letterSpacing: "0.1em", marginBottom: 10 }}>NATIONAL PULSE</div>
          <h2 style={{ fontSize: 36, fontFamily: "Georgia, serif", fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>
            What India's cities are talking about.
          </h2>
          <p style={{ fontSize: 16, color: "#666", maxWidth: 520, lineHeight: 1.6 }}>
            These are the civic conversations that cut across city lines — the issues that matter everywhere, even if they look different from Bengaluru to Patna.
          </p>
        </div>

        <div className="thread-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
          {PULSE_THREADS.map((t, i) => (
            <div key={i} className="pulse-thread-card" style={{ borderTopColor: t.tagColor }}>
              <div style={{ marginBottom: 12 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: t.tagColor,
                  background: t.tagColor + "18", padding: "4px 10px", borderRadius: 8,
                }}>{t.tag}</span>
              </div>
              <h3 style={{ fontSize: 18, fontFamily: "Georgia, serif", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.35, marginBottom: 10 }}>
                {t.headline}
              </h3>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, marginBottom: 16 }}>{t.body}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {t.cities.map(name => {
                  const c = cities.find(x => x.city === name);
                  return c ? (
                    <button key={name} onClick={() => onCitySelect(c)} style={{
                      fontSize: 11, background: "#f5f3ee", border: "none", color: "#444",
                      padding: "4px 10px", borderRadius: 8, cursor: "pointer", fontWeight: 600,
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#e8e5e0"}
                    onMouseLeave={e => e.currentTarget.style.background = "#f5f3ee"}
                    >{name}</button>
                  ) : null;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Join CTA ─────────────────────────────────────────────────────────────────
function JoinCTA() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section id="join" style={{ background: "#0D1117", padding: "80px 32px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#E8660D", letterSpacing: "0.12em", marginBottom: 16 }}>BECOME A COCREATOR</div>
        <h2 style={{ fontSize: 38, fontFamily: "Georgia, serif", fontWeight: 700, color: "#fff", lineHeight: 1.25, marginBottom: 16, letterSpacing: "-0.02em" }}>
          Help shape India's<br />civic conversation.
        </h2>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 36px", fontFamily: "Georgia, serif" }}>
          MyCityPulse is being built in public, with a small group of curious urban Indians who care about how their cities actually work. We call them cocreators.
        </p>

        {done ? (
          <div style={{ color: "#2dc653", fontSize: 16, fontFamily: "Georgia, serif", fontStyle: "italic" }}>
            ✓ You're in. We'll be in touch.
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8, maxWidth: 440, margin: "0 auto", flexWrap: "wrap" }}>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                flex: 1, minWidth: 200, padding: "13px 20px",
                background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.12)",
                borderRadius: 30, color: "#fff", fontSize: 14, outline: "none",
              }}
            />
            <button
              onClick={() => { if (email.includes("@")) setDone(true); }}
              style={{
                background: "#E8660D", color: "#fff", border: "none",
                padding: "13px 28px", borderRadius: 30, fontSize: 14, fontWeight: 700,
                cursor: "pointer", letterSpacing: "0.04em", whiteSpace: "nowrap",
              }}
            >
              Join →
            </button>
          </div>
        )}

        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginTop: 16 }}>
          No spam. Just city stories and occasional asks for your opinion.
        </p>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: "#080b0f", padding: "28px 32px", textAlign: "center" }}>
      <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, letterSpacing: "0.06em" }}>
        © 2025 MyCityPulse · <span style={{ color: "rgba(255,255,255,0.15)" }}>mycitypulse.in</span>
        <span style={{ color: "rgba(255,255,255,0.1)", margin: "0 8px" }}>·</span>
        City data: public domain sources, Wikimedia, Census of India
      </div>
    </footer>
  );
}

// ─── Wards Panel ─────────────────────────────────────────────────────────────
function WardsPanel({ city }) {
  const data = WARD_CORPORATORS[city.city];
  const [q, setQ] = useState("");
  const [zoneFilter, setZoneFilter] = useState("All");

  if (!data) return null;

  const filtered = data.wards.filter(ward => {
    const matchZone = zoneFilter === "All" || ward.zone === zoneFilter;
    const ql = q.toLowerCase().trim();
    const matchQ = !ql || ward.name.toLowerCase().includes(ql) || ward.corporator.toLowerCase().includes(ql) || ward.party.toLowerCase().includes(ql);
    return matchZone && matchQ;
  });

  return (
    <div style={{ background: "#FAF8F4", padding: "52px 32px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ fontSize: 11, fontWeight: 700, color: "#E8660D", letterSpacing: "0.12em", marginBottom: 12 }}>PANEL 4 — WARD REPRESENTATIVES</div>
        <h2 style={{ fontSize: 32, fontFamily: "Georgia, serif", fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
          Who represents your ward.
        </h2>
        <p style={{ fontSize: 15, color: "#888", lineHeight: 1.6, marginBottom: 32 }}>
          Elected corporators for {city.city} — {data.body} · {data.lastElection} elections · Term ends {data.termEnds}.
        </p>

        {/* Party tally */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 24, marginBottom: 28, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#aaa", letterSpacing: "0.1em", marginBottom: 16 }}>PARTY COMPOSITION · {data.totalWards} TOTAL WARDS</div>
          <div style={{ display: "flex", gap: 0, height: 10, borderRadius: 6, overflow: "hidden", marginBottom: 16 }}>
            {data.partyTally.map(p => (
              <div key={p.party} style={{ flex: p.seats, background: p.color, opacity: 0.85 }} />
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {data.partyTally.map(p => (
              <div key={p.party} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: p.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{p.party}</span>
                <span style={{ fontSize: 13, color: "#aaa" }}>{p.seats} seats</span>
              </div>
            ))}
          </div>
          {data.partyTally.length === 1 && data.partyTally[0].party === "BJP" && (
            <p style={{ fontSize: 12, color: "#bbb", marginTop: 14, fontStyle: "italic", borderTop: "1px solid #f0ede8", paddingTop: 12 }}>
              Opposition nominations were withdrawn/rejected in the February 2021 elections. BJP won all {data.totalWards} seats uncontested.
            </p>
          )}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20, alignItems: "center" }}>
          <input
            value={q} onChange={e => setQ(e.target.value)}
            placeholder="Search ward or corporator..."
            style={{
              padding: "8px 16px", border: "1.5px solid #e0ddd8", borderRadius: 24,
              fontSize: 13, outline: "none", background: "#fff", minWidth: 200, flex: 1, maxWidth: 300,
            }}
          />
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["All", ...data.zones].map(z => (
              <button key={z} onClick={() => setZoneFilter(z)}
                className={`pill-btn${zoneFilter === z ? " active" : ""}`}>
                {z}
              </button>
            ))}
          </div>
          <span style={{ fontSize: 12, color: "#aaa", marginLeft: "auto" }}>{filtered.length} wards</span>
        </div>

        {/* Ward table */}
        <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ overflowX: "auto" }}>
            <table className="ward-table">
              <thead>
                <tr>
                  <th style={{ width: 50 }}>#</th>
                  <th>Ward</th>
                  <th>Zone</th>
                  <th>Corporator</th>
                  <th>Party</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "32px 16px", color: "#bbb", fontSize: 14 }}>
                      No wards match your search.
                    </td>
                  </tr>
                ) : filtered.map(ward => (
                  <tr key={ward.ward}>
                    <td><span className="ward-num">{ward.ward}</span></td>
                    <td><span className="ward-name">{ward.name}</span></td>
                    <td style={{ color: "#888", fontSize: 12 }}>{ward.zone}</td>
                    <td><span className="ward-corp">{ward.corporator}</span></td>
                    <td>
                      <span className="party-badge" style={{ background: ward.partyColor }}>
                        {ward.party}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Data note */}
        <p style={{ fontSize: 12, color: "#bbb", marginTop: 16, lineHeight: 1.6 }}>
          {data.wardNote} · Source: {data.electionCommission} · Elections held {data.lastElection}.
        </p>
      </div>
    </div>
  );
}

// ─── City Page ────────────────────────────────────────────────────────────────
function CityPage({ city, onBack }) {
  const sc = STRESS[city.stress];
  const typoColor = TYPO_C[city.urban_typology];
  const imgUrl = CITY_IMAGES[city.city];
  const [imgErr, setImgErr] = useState(false);
  const hasData = CITIES_WITH_DATA.has(city.city);
  const issues = CITY_ISSUES[city.city] || [];
  const orgs = CIVIC_ORGS[city.city] || [];
  const wardData = WARD_CORPORATORS[city.city] || null;

  const [activePanel, setActivePanel] = useState("health");

  const panels = [
    { id: "health",    label: "🏙 City Health" },
    { id: "issues",    label: "⚡ Live Issues" },
    { id: "ecosystem", label: "🤝 Civic Ecosystem" },
    ...(city.elections ? [{ id: "elections", label: "🗳️ Elections" }] : []),
    ...(wardData ? [{ id: "wards", label: "🗳 Wards & Corporators" }] : []),
  ];

  useEffect(() => { window.scrollTo(0, 0); setActivePanel("health"); }, [city]);

  const stats = [
    { label: "Population", value: fmt(city.population) },
    { label: "Area", value: `${city.area.toLocaleString()} km²` },
    { label: "Density", value: `${city.density.toLocaleString()}/km²` },
    { label: "Rank in India", value: `#${city.rank}` },
  ];

  return (
    <div style={{ background: "#FAF8F4", minHeight: "100vh" }}>

      {/* ── Hero Banner ── */}
      <div style={{ height: 380, position: "relative", overflow: "hidden", background: "#0D1117" }}>
        {imgUrl && !imgErr ? (
          <img src={imgUrl} alt={city.city} onError={() => setImgErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 }} />
        ) : (
          <div style={{ height: "100%", background: `linear-gradient(135deg, ${sc.color}44, ${typoColor}33)` }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(13,17,23,0.2) 0%, rgba(13,17,23,0.85) 100%)" }} />
        <button onClick={onBack} style={{
          position: "absolute", top: 76, left: 32,
          background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff", padding: "8px 18px", borderRadius: 20, fontSize: 13,
          cursor: "pointer", backdropFilter: "blur(8px)",
        }}>← All Cities</button>
        <div style={{ position: "absolute", bottom: 32, left: 32, right: 32 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            <span title={`${city.stress} Stress — ${STRESS[city.stress]?.tagline}`} style={{ fontSize: 11, fontWeight: 700, color: sc.color, background: "rgba(0,0,0,0.55)", padding: "4px 12px", borderRadius: 12, backdropFilter: "blur(4px)", cursor: "help" }}>{city.stress} Stress</span>
            <span title={TYPO_DESC[city.urban_typology]} style={{ fontSize: 11, fontWeight: 700, color: typoColor, background: "rgba(0,0,0,0.55)", padding: "4px 12px", borderRadius: 12, backdropFilter: "blur(4px)", cursor: "help" }}>{city.urban_typology}</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", background: "rgba(0,0,0,0.55)", padding: "4px 12px", borderRadius: 12, backdropFilter: "blur(4px)" }}>{city.tier}</span>
          </div>
          <h1 style={{ fontSize: 48, fontFamily: "Georgia, serif", fontWeight: 800, color: "#fff", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 8 }}>
            {city.city}
          </h1>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 15 }}>
            {city.state}{city.formerName ? ` · formerly ${city.formerName}` : ""}
          </div>
        </div>
      </div>

      {/* ── Sticky Panel Navigation ── */}
      <nav className="panel-nav" aria-label="City page sections">
        <div className="panel-nav-inner">
          {panels.map(p => (
            <button
              key={p.id}
              className={`panel-tab${activePanel === p.id ? " active" : ""}`}
              onClick={() => { setActivePanel(p.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              aria-current={activePanel === p.id ? "page" : undefined}
            >
              {p.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Panel 1: City Health ── */}
      {activePanel === "health" && (
      <div style={{ background: "#FAF8F4", padding: "52px 32px 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>

          {/* Section label */}
          <div style={{ fontSize: 11, fontWeight: 700, color: "#E8660D", letterSpacing: "0.12em", marginBottom: 20 }}>PANEL 1 — CITY HEALTH</div>

          {/* One-liner */}
          <blockquote style={{
            fontSize: 22, fontFamily: "Georgia, serif", fontStyle: "italic",
            color: "#2a2a2a", lineHeight: 1.6, borderLeft: `4px solid ${sc.color}`,
            paddingLeft: 24, marginBottom: 40,
          }}>"{city.one_liner}"</blockquote>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
            {stats.map(s => (
              <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: "20px 16px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#1a1a1a", fontFamily: "Georgia, serif" }}>{s.value}</div>
                <div style={{ fontSize: 10, color: "#aaa", marginTop: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Data freshness note */}
          <p style={{ fontSize: 11, color: "#bbb", marginBottom: 24, lineHeight: 1.6 }}>
            Population & area: Census of India projections · Stress & typology: MyCityPulse editorial, last reviewed 2024 · Issues & organisations: last updated 2024.
          </p>

          {/* Stress + Typology */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 64 }}>
            <div style={{ background: "#fff", borderRadius: 14, padding: 28, borderTop: `3px solid ${sc.color}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: sc.color, letterSpacing: "0.12em", marginBottom: 10 }}>CIVIC STRESS</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: sc.color, fontFamily: "Georgia, serif", marginBottom: 6 }}>{city.stress}</div>
              <div style={{ height: 6, background: "#f0ede8", borderRadius: 4, overflow: "hidden", marginBottom: 14 }}>
                <div style={{ width: `${(sc.bar / 5) * 100}%`, height: "100%", background: sc.color, borderRadius: 4 }} />
              </div>
              <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7 }}>{city.stress_reason}</p>
            </div>
            <div style={{ background: "#fff", borderRadius: 14, padding: 28, borderTop: `3px solid ${typoColor}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: typoColor, letterSpacing: "0.12em", marginBottom: 10 }}>URBAN TYPOLOGY</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: typoColor, fontFamily: "Georgia, serif", marginBottom: 12 }}>{city.urban_typology}</div>
              <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7 }}>{TYPO_DESC[city.urban_typology]}</p>
            </div>
          </div>
        </div>
      </div>
      )} {/* end health panel */}

      {/* ── Panel 2: Live Issues ── */}
      {activePanel === "issues" && (
      <div style={{ background: "#fff", padding: "52px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#E8660D", letterSpacing: "0.12em", marginBottom: 12 }}>PANEL 2 — LIVE ISSUES</div>
          <h2 style={{ fontSize: 32, fontFamily: "Georgia, serif", fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
            What's happening in {city.city}.
          </h2>
          <p style={{ fontSize: 15, color: "#888", marginBottom: 40, lineHeight: 1.6 }}>
            The issues that shape daily life in this city — explained plainly, without jargon.
          </p>

          {!hasData ? (
            <div style={{ background: "#FAF8F4", borderRadius: 14, padding: "40px 32px", textAlign: "center", border: "2px dashed #e0ddd8" }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>🗂️</div>
              <div style={{ fontSize: 16, fontFamily: "Georgia, serif", fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
                We're building {city.city}'s issue profile.
              </div>
              <p style={{ fontSize: 14, color: "#888", maxWidth: 400, margin: "0 auto 20px", lineHeight: 1.6 }}>
                Know the civic issues shaping {city.city}? Know organizations working on them? Help us build this.
              </p>
              <a href="#join" style={{ background: "#E8660D", color: "#fff", padding: "10px 24px", borderRadius: 24, fontSize: 13, fontWeight: 700, display: "inline-block" }}>
                Become a Cocreator →
              </a>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {issues.map((issue, i) => (
                <div key={i} style={{
                  background: "#FAF8F4", borderRadius: 14, padding: "28px 28px 28px 0",
                  display: "flex", gap: 0, overflow: "hidden",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                }}>
                  {/* Color strip */}
                  <div style={{ width: 5, flexShrink: 0, background: issue.categoryColor, borderRadius: "14px 0 0 14px", marginRight: 28 }} />
                  <div style={{ flex: 1 }}>
                    {/* Tag + severity */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: issue.categoryColor, background: issue.categoryColor + "18", padding: "3px 10px", borderRadius: 8 }}>
                        {issue.tag}
                      </span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
                        color: STRESS[issue.severity]?.color || "#888",
                        background: (STRESS[issue.severity]?.color || "#888") + "15",
                        padding: "3px 8px", borderRadius: 6,
                      }}>{issue.severity}</span>
                    </div>
                    {/* Title */}
                    <h3 style={{ fontSize: 18, fontFamily: "Georgia, serif", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.4, marginBottom: 12 }}>
                      {issue.title}
                    </h3>
                    {/* Body */}
                    <p style={{ fontSize: 14, color: "#555", lineHeight: 1.75, marginBottom: 16 }}>
                      {issue.body}
                    </p>
                    {/* What's being done */}
                    <div style={{ background: "#fff", borderRadius: 8, padding: "12px 16px", borderLeft: "3px solid #e0ddd8" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#aaa", letterSpacing: "0.08em", display: "block", marginBottom: 4 }}>WHAT'S BEING DONE</span>
                      <p style={{ fontSize: 13, color: "#777", lineHeight: 1.6, margin: 0 }}>{issue.whatsBeing}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      )} {/* end issues panel */}

      {/* ── Panel 3: Civic Ecosystem ── */}
      {activePanel === "ecosystem" && (
      <div style={{ background: "#FAF8F4", padding: "52px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#E8660D", letterSpacing: "0.12em", marginBottom: 12 }}>PANEL 3 — CIVIC ECOSYSTEM</div>
          <h2 style={{ fontSize: 32, fontFamily: "Georgia, serif", fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
            Who's fighting for {city.city}.
          </h2>
          <p style={{ fontSize: 15, color: "#888", marginBottom: 40, lineHeight: 1.6 }}>
            Organizations, collectives, and initiatives doing real civic work in this city. They were here before you found them.
          </p>

          {orgs.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 14, padding: "40px 32px", textAlign: "center", border: "2px dashed #e0ddd8" }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>🤝</div>
              <div style={{ fontSize: 16, fontFamily: "Georgia, serif", fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
                Know who's working on {city.city}?
              </div>
              <p style={{ fontSize: 14, color: "#888", maxWidth: 400, margin: "0 auto 20px", lineHeight: 1.6 }}>
                Help us map the civic ecosystem — NGOs, RWAs, collectives, journalists doing good work here.
              </p>
              <a href="#join" style={{ background: "#E8660D", color: "#fff", padding: "10px 24px", borderRadius: 24, fontSize: 13, fontWeight: 700, display: "inline-block" }}>
                Nominate an Organization →
              </a>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {orgs.map((org, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 14, padding: 28, boxShadow: "0 1px 4px rgba(0,0,0,0.05)", borderTop: `3px solid ${org.focusColor}` }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 17, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>{org.name}</div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: org.focusColor, background: org.focusColor + "18", padding: "3px 10px", borderRadius: 8 }}>
                        {org.focus}
                      </span>
                    </div>
                    <a href={org.link} target="_blank" rel="noreferrer" style={{
                      fontSize: 12, fontWeight: 700, color: "#E8660D",
                      border: "1.5px solid #E8660D", padding: "6px 16px",
                      borderRadius: 20, whiteSpace: "nowrap", flexShrink: 0,
                    }}>Visit →</a>
                  </div>
                  <p style={{ fontSize: 14, color: "#555", lineHeight: 1.75, marginBottom: 14 }}>{org.what}</p>
                  <div style={{ background: "#FAF8F4", borderRadius: 8, padding: "12px 16px", borderLeft: `3px solid ${org.focusColor}` }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#aaa", letterSpacing: "0.08em", display: "block", marginBottom: 4 }}>HOW TO GET INVOLVED</span>
                    <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, margin: 0 }}>{org.how}</p>
                  </div>
                </div>
              ))}

              {/* Nominate more */}
              <div style={{ borderRadius: 14, padding: "24px 28px", border: "2px dashed #e0ddd8", textAlign: "center" }}>
                <p style={{ fontSize: 14, color: "#aaa", margin: "0 0 12px" }}>Know an organization doing good work in {city.city} that should be here?</p>
                <a href="#join" style={{ fontSize: 13, fontWeight: 700, color: "#E8660D" }}>Nominate them →</a>
              </div>
            </div>
          )}
        </div>
      </div>
      )} {/* end ecosystem panel */}

      {/* ── Panel 4: Elections ── */}
      {activePanel === "elections" && city.elections && (
      <div style={{ background: "#fff", padding: "52px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#667eea", letterSpacing: "0.12em", marginBottom: 12 }}>PANEL 4 — ELECTIONS</div>
          <h2 style={{ fontSize: 32, fontFamily: "Georgia, serif", fontWeight: 700, color: "#1a1a1a", marginBottom: 40 }}>
            Municipal Elections
          </h2>
          <ElectionsCard election={city.elections} cityName={city.city} />
        </div>
      </div>
      )} {/* end elections panel */}

      {/* ── Panel 5: Wards & Corporators ── */}
      {activePanel === "wards" && <WardsPanel city={city} />}

      {/* ── Closing CTA (shown on all panels) ── */}
      <div style={{ background: "#0D1117", padding: "60px 32px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 26, fontFamily: "Georgia, serif", fontWeight: 700, color: "#fff", marginBottom: 12 }}>
            {city.city} is your city too.
          </div>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: 440, margin: "0 auto 28px", fontFamily: "Georgia, serif" }}>
            MyCityPulse exists to make the civic layer of your city legible — and to connect you with the people already working to fix it. Join the conversation.
          </p>
          <a href="mailto:hello@mycitypulse.in" style={{
            background: "#E8660D", color: "#fff", padding: "13px 32px",
            borderRadius: 30, fontSize: 14, fontWeight: 700, display: "inline-block", letterSpacing: "0.02em",
          }}>
            Become a Cocreator →
          </a>
        </div>
      </div>

    </div>
  );
}

// ─── Compare Tray ─────────────────────────────────────────────────────────────
function CompareTray({ cities, onCompare, onRemove, onClear }) {
  if (cities.length === 0) return null;
  return (
    <div className="compare-tray">
      <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", flexShrink: 0 }}>
        COMPARING
      </span>
      <div style={{ display: "flex", gap: 8, flex: 1, flexWrap: "wrap", alignItems: "center" }}>
        {cities.map(c => (
          <div key={c.city} style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "rgba(255,255,255,0.08)", borderRadius: 20,
            padding: "5px 12px", fontSize: 13, color: "#fff",
          }}>
            <span style={{ fontWeight: 600 }}>{c.city}</span>
            <button onClick={() => onRemove(c.city)} style={{
              background: "none", border: "none", color: "rgba(255,255,255,0.4)",
              cursor: "pointer", fontSize: 15, lineHeight: 1, padding: 0,
            }}>×</button>
          </div>
        ))}
        {cities.length < 3 && (
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontStyle: "italic" }}>
            + pick up to {3 - cities.length} more
          </span>
        )}
      </div>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button onClick={onClear} style={{
          background: "none", border: "1px solid rgba(255,255,255,0.15)",
          color: "rgba(255,255,255,0.45)", padding: "7px 14px",
          borderRadius: 20, fontSize: 12, cursor: "pointer",
        }}>Clear</button>
        {cities.length >= 2 && (
          <button onClick={onCompare} style={{
            background: "#E8660D", border: "none", color: "#fff",
            padding: "7px 20px", borderRadius: 20, fontSize: 13,
            fontWeight: 700, cursor: "pointer",
          }}>Compare {cities.length} cities →</button>
        )}
      </div>
    </div>
  );
}

// ─── City Compare Card (header in CompareView) ────────────────────────────────
function CityCompareCard({ city, onRemove, onCitySelect }) {
  const imgUrl = CITY_IMAGES[city.city];
  const [imgErr, setImgErr] = useState(false);
  return (
    <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
      <div style={{ height: 90, position: "relative", background: "#0D1117" }}>
        {imgUrl && !imgErr && (
          <img src={imgUrl} alt={city.city} onError={() => setImgErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.75))" }} />
        <div style={{ position: "absolute", bottom: 8, left: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>{city.city}</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)" }}>{city.state}</div>
        </div>
        <button onClick={() => onRemove(city.city)} style={{
          position: "absolute", top: 6, right: 6,
          background: "rgba(0,0,0,0.55)", border: "none", color: "#fff",
          width: 20, height: 20, borderRadius: "50%", cursor: "pointer",
          fontSize: 12, lineHeight: "20px", textAlign: "center",
        }}>×</button>
      </div>
      <div style={{ padding: "10px 12px" }}>
        <button onClick={() => onCitySelect(city)} style={{
          background: "none", border: "1.5px solid #E8660D", color: "#E8660D",
          fontSize: 11, fontWeight: 700, padding: "4px 0",
          borderRadius: 14, cursor: "pointer", width: "100%",
        }}>Full profile →</button>
      </div>
    </div>
  );
}

// ─── Compare View ─────────────────────────────────────────────────────────────
function CompareView({ cities, onBack, onCitySelect, onRemove, onAdd }) {
  const [addQ, setAddQ] = useState("");
  const [addResults, setAddResults] = useState([]);
  const [activeAddIndex, setActiveAddIndex] = useState(-1);

  useEffect(() => {
    const results = addQ.length >= 2
      ? searchCities(addQ).filter(c => !cities.find(x => x.city === c.city)).slice(0, 5)
      : [];
    setAddResults(results);
  }, [addQ, cities]);

  useEffect(() => {
    setActiveAddIndex(addResults.length > 0 ? 0 : -1);
  }, [addResults]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const selectAddCity = (city) => {
    onAdd(city);
    setAddQ("");
    setAddResults([]);
    setActiveAddIndex(-1);
  };

  const handleAddKeyDown = (e) => {
    if (!addResults.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveAddIndex((index) => (index + 1) % addResults.length);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveAddIndex((index) => (index <= 0 ? addResults.length - 1 : index - 1));
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      selectAddCity(addResults[activeAddIndex] || addResults[0]);
      return;
    }

    if (e.key === "Escape") {
      setAddResults([]);
      setActiveAddIndex(-1);
    }
  };

  const metrics = [
    { label: "National Rank",    val: c => `#${c.rank}`,                          cval: c => c.rank,         best: "lower"   },
    { label: "Population",       val: c => fmt(c.population),                      cval: c => c.population,   best: "neutral" },
    { label: "Area",             val: c => `${c.area.toLocaleString()} km²`,       cval: c => c.area,         best: "neutral" },
    { label: "Density / km²",    val: c => c.density.toLocaleString(),             cval: c => c.density,      best: "neutral" },
    { label: "Civic Stress",     val: c => c.stress,                               cval: c => STRESS[c.stress].bar, best: "lower", isStress: true },
    { label: "Urban Typology",   val: c => c.urban_typology,                       best: "neutral" },
    { label: "City Tier",        val: c => c.tier,                                 best: "neutral" },
    { label: "State",            val: c => c.state,                                best: "neutral" },
    { label: "Former Name",      val: c => c.formerName || "—",                    best: "neutral" },
  ];

  const cols = cities.length;

  return (
    <div style={{ background: "#FAF8F4", minHeight: "100vh", padding: "40px 32px 80px" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#E8660D", letterSpacing: "0.12em", marginBottom: 8 }}>COMPARE CITIES</div>
            <h1 style={{ fontSize: 32, fontFamily: "Georgia, serif", fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>
              Side by side.
            </h1>
            <p style={{ fontSize: 14, color: "#999", lineHeight: 1.5 }}>
              Select up to 3 cities. Highlighted values indicate the stronger result where comparable.
            </p>
          </div>
          <button onClick={onBack} style={{
            background: "#fff", border: "1.5px solid #e0ddd8", color: "#555",
            padding: "9px 22px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>← Back to cities</button>
        </div>

        {/* City header cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)${cols < 3 ? " 180px" : ""}`,
          gap: 14, marginBottom: 24,
        }}>
          {cities.map(c => (
            <CityCompareCard key={c.city} city={c} onRemove={onRemove} onCitySelect={onCitySelect} />
          ))}

          {/* Add city slot */}
          {cols < 3 && (
            <div style={{ position: "relative" }}>
              <div style={{
                border: "2px dashed #ddd", borderRadius: 14, minHeight: 130,
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", gap: 10, padding: 16,
              }}>
                <div style={{ fontSize: 22, color: "#ccc" }}>+</div>
                <input
                  value={addQ} onChange={e => setAddQ(e.target.value)}
                  onKeyDown={handleAddKeyDown}
                  placeholder="Add city..."
                  style={{
                    width: "100%", padding: "7px 12px", border: "1.5px solid #e0ddd8",
                    borderRadius: 20, fontSize: 12, outline: "none", background: "#fff", textAlign: "center",
                  }}
                />
              </div>
              {addResults.length > 0 && (
                <div style={{
                  position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50, marginTop: 4,
                  background: "#fff", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  border: "1px solid #e8e5e0", overflow: "hidden",
                }}>
                  {addResults.map((c, index) => (
                    <button key={c.city} onClick={() => selectAddCity(c)}
                      style={{
                        display: "block", width: "100%", padding: "9px 14px",
                        background: activeAddIndex === index ? "#faf8f4" : "none", border: "none", textAlign: "left",
                        fontSize: 13, cursor: "pointer", borderBottom: "1px solid #f0ede8",
                      }}
                      onMouseEnter={() => setActiveAddIndex(index)}
                    >
                      <span style={{ fontWeight: 600, color: "#1a1a1a" }}>{c.city}</span>
                      <span style={{ color: "#aaa", marginLeft: 8, fontSize: 11 }}>{c.state}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Metrics comparison table */}
        <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <colgroup>
              <col style={{ width: "22%" }} />
              {cities.map(c => <col key={c.city} style={{ width: `${78 / cols}%` }} />)}
            </colgroup>
            <thead>
              <tr style={{ background: "#FAF8F4", borderBottom: "2px solid #f0ede8" }}>
                <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#bbb", letterSpacing: "0.08em" }}>METRIC</th>
                {cities.map(c => (
                  <th key={c.city} style={{ padding: "12px 20px", textAlign: "left", fontSize: 13, fontWeight: 800, color: "#1a1a1a", borderLeft: "1px solid #f0ede8" }}>
                    {c.city}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map(m => {
                let bestCity = null;
                if (m.cval && m.best !== "neutral" && cities.length > 1) {
                  const vals = cities.map(c => ({ city: c.city, v: m.cval(c) }));
                  bestCity = m.best === "lower"
                    ? vals.reduce((a, b) => a.v <= b.v ? a : b).city
                    : vals.reduce((a, b) => a.v >= b.v ? a : b).city;
                }
                return (
                  <tr key={m.label} style={{ borderBottom: "1px solid #f5f3ef" }}>
                    <td style={{
                      padding: "13px 20px", fontSize: 11, fontWeight: 700,
                      color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em",
                      background: "#FAFAF8",
                    }}>{m.label}</td>
                    {cities.map(c => {
                      const sc = STRESS[c.stress];
                      const isBest = bestCity === c.city;
                      return (
                        <td key={c.city} style={{
                          padding: "13px 20px", fontSize: 14,
                          background: isBest ? "#fff9f6" : "#fff",
                          borderLeft: "1px solid #f5f3ef",
                        }}>
                          {m.isStress ? (
                            <span style={{
                              fontSize: 12, fontWeight: 800, color: sc.color,
                              background: sc.bg, padding: "3px 10px", borderRadius: 8,
                              display: "inline-block",
                            }}>{c.stress}</span>
                          ) : (
                            <span style={{ fontWeight: isBest ? 800 : 400, color: isBest ? "#E8660D" : "#444" }}>
                              {m.val(c)}
                            </span>
                          )}
                          {isBest && !m.isStress && (
                            <span style={{ fontSize: 9, color: "#E8660D", marginLeft: 6, fontWeight: 700, verticalAlign: "middle" }}>▲</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p style={{ fontSize: 11, color: "#ccc", marginTop: 14, lineHeight: 1.6 }}>
          ▲ marks the stronger value where comparison is meaningful (lower rank number = higher rank; lower stress = healthier city). Population, area and density are shown without judgment.
        </p>
      </div>
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
function HomePage({ onCitySelect, onCompare, compareList }) {
  return (
    <>
      <Hero onCitySelect={onCitySelect} />
      <StatsBanner />
      <NationalPulse onCitySelect={onCitySelect} />
      <CityGrid onCitySelect={onCitySelect} onCompare={onCompare} compareList={compareList} />
      <JoinCTA />
      <Footer />
    </>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [compareList, setCompareList]   = useState([]);
  const [compareMode, setCompareMode]   = useState(false);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setCompareMode(false);
    window.scrollTo(0, 0);
  };
  const handleBack = () => { setSelectedCity(null); };

  const handleCompareToggle = (city) => {
    setCompareList(prev =>
      prev.find(c => c.city === city.city)
        ? prev.filter(c => c.city !== city.city)
        : prev.length < 3 ? [...prev, city] : prev
    );
  };

  const handleOpenCompare = () => {
    setCompareMode(true);
    setSelectedCity(null);
    window.scrollTo(0, 0);
  };

  const handleCloseCompare = () => { setCompareMode(false); };

  const handleRemoveFromCompare = (cityName) => {
    setCompareList(prev => prev.filter(c => c.city !== cityName));
  };

  const handleAddToCompare = (city) => {
    setCompareList(prev => prev.length < 3 ? [...prev, city] : prev);
  };

  return (
    <>
      <GlobalStyles />
      <Nav
        onLogoClick={() => { handleBack(); setCompareMode(false); }}
        onSearch={handleCitySelect}
      />
      <div style={{ paddingTop: 58 }}>
        {compareMode
          ? <CompareView
              cities={compareList}
              onBack={handleCloseCompare}
              onCitySelect={handleCitySelect}
              onRemove={handleRemoveFromCompare}
              onAdd={handleAddToCompare}
            />
          : selectedCity
            ? <CityPage city={selectedCity} onBack={handleBack} />
            : <HomePage
                onCitySelect={handleCitySelect}
                onCompare={handleCompareToggle}
                compareList={compareList}
              />
        }
      </div>
      {!compareMode && !selectedCity && (
        <CompareTray
          cities={compareList}
          onCompare={handleOpenCompare}
          onRemove={handleRemoveFromCompare}
          onClear={() => setCompareList([])}
        />
      )}
    </>
  );
}
