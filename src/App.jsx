import { useState, useEffect, useRef } from "react";
import { CITY_ISSUES, CIVIC_ORGS, WARD_CORPORATORS } from "./cityData.js";
import {
  CITY_IMAGES,
  STRESS,
  TYPO_C,
  TYPO_LABEL,
  TYPO_PUBLIC_DESC,
  fmt,
} from "./domain/cities/presentation.js";
import CityPage from "./features/city/CityPage.jsx";
import CompareView, { CompareTray } from "./features/compare/CompareView.jsx";
import useCitySearch from "./shared/hooks/useCitySearch.js";

// â”€â”€â”€ City Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const cities = [
  { rank:1,  city:"Delhi",                    state:"Delhi",           population:33807000, area:1484,  density:22781, tier:"Mega Metro",  density_descriptor:"Very Dense",       urban_typology:"Gravity City",           one_liner:"The republic's beating heart \u2014 every road, policy, and ambition seems to lead here.",                              stress:"Critical", stress_reason:"Extreme density, severe waste processing gap, governance fragmentation",                  formerName:null,          aliases:["New Delhi","NCT"] },
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
        { date: "2026-04-06", label: "Nomination opens", icon: "\uD83D\uDCDD" },
        { date: "2026-04-11", label: "Nomination closes", icon: "\uD83D\uDD12", urgent: true },
        { date: "2026-04-13", label: "Scrutiny", icon: "\u2713" },
        { date: "2026-04-15", label: "Candidates finalized", icon: "\uD83D\uDCCB" },
        { date: "2026-04-26", label: "Election day", icon: "\uD83D\uDDF3\uFE0F" },
        { date: "2026-04-28", label: "Results announced", icon: "\uD83D\uDCCA" }
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
  { rank:51, city:"Mira Bhayandar",           state:"Maharashtra",     population:907000,   area:79.4,  density:11425, tier:"Large City",  density_descriptor:"Moderately Dense", urban_typology:"Overnight City",         one_liner:"Mumbai's northern edge \u2014 where affordable housing met the sea.",                                                    stress:"High",     stress_reason:"Explosive growth without matching infrastructure, water supply dependence, connectivity gaps", formerName:null, aliases:["Mira Road","Bhayandar"] },
];

const DATASET_SCOPE = {
  cityCount: cities.length,
  stateCount: new Set(cities.map((city) => city.state)).size,
  issueProfileCount: Object.keys(CITY_ISSUES).length,
  orgDirectoryCount: Object.keys(CIVIC_ORGS).length,
  wardPanelCount: Object.keys(WARD_CORPORATORS).length,
  electionTrackerCount: cities.filter((city) => city.elections).length,
};


// Special:FilePath lets Wikimedia resolve the correct hash automatically â€” far more reliable than hardcoding thumb paths.

// â”€â”€â”€ Curated conversation starters â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PULSE_THREADS = [
  {
    tag: "\uD83D\uDCA7 Water",
    tagColor: "#0096c7",
    headline: "7 cities are approaching Day Zero. Is yours next?",
    body: "Bengaluru nearly ran out of groundwater in 2023. Chennai has seen it before. Jaipur, Agra, and Varanasi are watching the same warning signs.",
    cities: ["Bengaluru", "Chennai", "Jaipur", "Agra", "Varanasi"],
  },
  {
    tag: "\uD83C\uDFC6 Governance",
    tagColor: "#2dc653",
    headline: "How Indore stayed India's cleanest city for 7 years straight.",
    body: "It wasn't luck. Indore's Swachh Survekshan story is a masterclass in municipal consistency \u2014 and what every other city refuses to copy.",
    cities: ["Indore"],
  },
  {
    tag: "\uD83D\uDEA6 Traffic",
    tagColor: "#f4a261",
    headline: "Bengaluru's traffic isn't a problem. It's a policy choice.",
    body: "Bengaluru added 1,000 new vehicles per day in 2023. The city's road network has grown 10x slower. Someone decided this was acceptable.",
    cities: ["Bengaluru", "Delhi", "Mumbai"],
  },
  {
    tag: "\u26A1 Density",
    tagColor: "#e63946",
    headline: "48,000 people per square kilometre. Life inside Secunderabad.",
    body: "Kolkata, Howrah, Secunderabad \u2014 India's most compressed cities aren't collapsing. But they're holding on by a thread.",
    cities: ["Secunderabad", "Kolkata", "Howrah"],
  },
];

// â”€â”€â”€ Global Styles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

    /* â”€â”€ Panel navigation tabs (CityPage) â”€â”€ */
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

    /* â”€â”€ Ward table â”€â”€ */
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

    /* â”€â”€ Compare button on city cards â”€â”€ */
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

    /* â”€â”€ Compare tray (sticky bottom) â”€â”€ */
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

// â”€â”€â”€ Nav â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Nav({ onLogoClick, onSearch }) {
  const [q, setQ] = useState("");
  const ref = useRef(null);
  const { activeIndex, handleKeyDown, resetSearch, results, setActiveIndex } = useCitySearch({
    cities,
    query: q,
  });

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        resetSearch();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [resetSearch]);

  const selectCity = (city) => {
    onSearch(city);
    setQ("");
    resetSearch();
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
          onKeyDown={(e) => handleKeyDown(e, selectCity)}
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

// â”€â”€â”€ Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Hero({ onCitySelect }) {
  const [q, setQ] = useState("");
  const ref = useRef(null);
  const { activeIndex, handleKeyDown, resetSearch, results, setActiveIndex } = useCitySearch({
    cities,
    query: q,
  });

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        resetSearch();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [resetSearch]);

  const quickCities = ["Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Pune", "Chennai"];
  const selectCity = (city) => {
    onCitySelect(city);
    setQ("");
    resetSearch();
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
          MyCityPulse is an editorial guide to {DATASET_SCOPE.cityCount} large Indian city profiles in the current dataset, combining public data, reported civic issues, and citizen entry points without pretending every page is complete.
        </p>

        {/* Search */}
        <div ref={ref} style={{ position: "relative", maxWidth: 480, margin: "0 auto 32px" }}>
          <div style={{ position: "relative" }}>
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, selectCity)}
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
              {"Explore \u2192"}
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
        {"SCROLL TO EXPLORE \u2193"}
      </div>
    </section>
  );
}

// â”€â”€â”€ Stats Banner â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function StatsBanner() {
  const criticalCount = cities.filter(c => c.stress === "Critical").length;
  const stats = [
    { value: `${DATASET_SCOPE.cityCount}`, label: "City Profiles" },
    { value: `${DATASET_SCOPE.stateCount}`, label: "States / UTs in Dataset" },
    { value: `${criticalCount}`, label: "Critical Stress Cities" },
    { value: `${DATASET_SCOPE.issueProfileCount}`, label: "Issue Profiles Published" },
  ];
  return (
    <div style={{ background: "#1a1a1a", padding: "28px 32px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 24, textAlign: "center" }}>
          {stats.map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 32, fontWeight: 900, color: "#E8660D", fontFamily: "Georgia, serif", letterSpacing: "-0.03em" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 20, color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.7, textAlign: "center" }}>
          Current scope: {DATASET_SCOPE.issueProfileCount} city issue briefs, {DATASET_SCOPE.orgDirectoryCount} civic ecosystem directories,
          {` ${DATASET_SCOPE.wardPanelCount}`} ward panels, and {DATASET_SCOPE.electionTrackerCount} live election tracker.
          Public facts and editorial judgments are intentionally separated elsewhere on the site.
        </p>
      </div>
    </div>
  );
}

// â”€â”€â”€ City Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function TrustSection() {
  const cards = [
    {
      title: "Is this official?",
      body: "No. MyCityPulse is a citizen-facing guide, not a government portal. Where possible, we use public or official source material for basics like population, wards, and elections, then layer editorial interpretation on top.",
    },
    {
      title: "Is this complete?",
      body: `Not yet. This release covers ${DATASET_SCOPE.cityCount} city profiles across ${DATASET_SCOPE.stateCount} states / UTs, but only ${DATASET_SCOPE.issueProfileCount} cities currently have issue briefs and ${DATASET_SCOPE.wardPanelCount} have ward panels. Missing depth is shown openly instead of hidden behind vague claims.`,
    },
    {
      title: "What should citizens use it for?",
      body: "Use it to orient yourself quickly: understand what kind of city you are in, what pressure points matter, who is working on them, and where to dig deeper next. Treat it as a starting point, not the final word.",
    },
  ];

  return (
    <section style={{ padding: "56px 32px", background: "#fff7f0", borderTop: "1px solid #f0e3d7", borderBottom: "1px solid #f0e3d7" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ maxWidth: 720, marginBottom: 28 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#E8660D", letterSpacing: "0.1em", marginBottom: 10 }}>READ THIS LIKE A CITIZEN</div>
          <h2 style={{ fontSize: 34, fontFamily: "Georgia, serif", fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>
            Ambitious does not have to mean overstated.
          </h2>
          <p style={{ fontSize: 16, color: "#666", lineHeight: 1.7 }}>
            The product should feel bold because it helps people see their city clearly, not because it implies certainty it has not earned.
            We show scope, judgment, and incompleteness directly so users know what to trust and what still needs work.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
          {cards.map((card) => (
            <div key={card.title} style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 1px 6px rgba(0,0,0,0.06)", borderTop: "3px solid #E8660D" }}>
              <h3 style={{ fontSize: 18, fontFamily: "Georgia, serif", fontWeight: 700, color: "#1a1a1a", marginBottom: 10 }}>{card.title}</h3>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, margin: 0 }}>{card.body}</p>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 20, fontSize: 13, color: "#7a6a5c", lineHeight: 1.7 }}>
          If something looks stale, thin, or incorrect, that should be visible in the interface. The right next step is not to sound bigger; it is to show what is sourced, what is editorial, and what is still being built.
        </p>
      </div>
    </section>
  );
}

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

      {/* Dark gradient overlay â€” bottom-heavy for legibility */}
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
          title={TYPO_PUBLIC_DESC[city.urban_typology]}
          style={{
            fontSize: 10, fontWeight: 700,
            color: TYPO_C[city.urban_typology],
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(6px)",
            padding: "3px 8px", borderRadius: 8, cursor: "help",
          }}>{TYPO_LABEL[city.urban_typology]}</span>
      </div>

      {/* Top-right: stress badge */}
      <div style={{ position: "absolute", top: 12, right: 12 }}>
        <span
          title={`${city.stress} Stress \u2014 ${STRESS[city.stress]?.tagline}`}
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
          {city.state} {"\u00B7"} {fmt(city.population)} people
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
          {inCompare ? "\u2713 Comparing" : "+ Compare"}
        </button>
      )}
    </div>
  );
}

// â”€â”€â”€ City Grid â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
            {DATASET_SCOPE.cityCount} city profiles in this release.
          </h2>
          <p style={{ fontSize: 16, color: "#666", maxWidth: 500, lineHeight: 1.6 }}>
            A working dataset of large Indian cities, mapped through public facts and MyCityPulse editorial lenses. Some cities are deep, some are still being built, and the interface should make that obvious.
          </p>
          <div style={{ marginTop: 16, background: "#fff", borderRadius: 14, border: "1px solid #e8e5e0", padding: "16px 18px", maxWidth: 760 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9a6b3d", letterSpacing: "0.08em", marginBottom: 8 }}>CURRENT SCOPE</div>
            <p style={{ margin: 0, fontSize: 14, color: "#666", lineHeight: 1.7 }}>
              This release covers {DATASET_SCOPE.cityCount} city profiles across {DATASET_SCOPE.stateCount} states / UTs.
              Issue briefs are currently published for {DATASET_SCOPE.issueProfileCount} cities, civic ecosystem directories for {DATASET_SCOPE.orgDirectoryCount},
              {` `}ward panels for {DATASET_SCOPE.wardPanelCount}, and election tracking for {DATASET_SCOPE.electionTrackerCount}.
            </p>
          </div>
          <button
            onClick={() => setLegendOpen(o => !o)}
            style={{
              marginTop: 14, background: "none", border: "1.5px solid #e0ddd8",
              color: "#888", fontSize: 12, fontWeight: 600, padding: "6px 16px",
              borderRadius: 20, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
            }}
          >
            {legendOpen ? "\u25B2" : "\u25BC"} What do these tags mean?
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
                <div style={{ fontSize: 10, fontWeight: 700, color: "#E8660D", letterSpacing: "0.1em", marginBottom: 14 }}>CITY CATEGORIES</div>
                {Object.entries(TYPO_PUBLIC_DESC).map(([type, desc]) => (
                  <div key={type} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: TYPO_C[type], background: TYPO_C[type] + "18", padding: "2px 8px", borderRadius: 8, flexShrink: 0, marginTop: 2, whiteSpace: "nowrap" }}>{TYPO_LABEL[type]}</span>
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

// â”€â”€â”€ National Pulse â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
            These are editorial civic threads that cut across city lines, not a real-time trend feed. They help citizens see recurring patterns across places without pretending to be live national data.
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

// â”€â”€â”€ Join CTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
            {"\u2713 You're in. We'll be in touch."}
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
              {"Join \u2192"}
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

// â”€â”€â”€ Footer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: "#080b0f", padding: "28px 32px", textAlign: "center" }}>
      <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, letterSpacing: "0.06em" }}>
        {"\u00A9"} {year} MyCityPulse {"\u00B7"} <span style={{ color: "rgba(255,255,255,0.15)" }}>mycitypulse.in</span>
        <span style={{ color: "rgba(255,255,255,0.1)", margin: "0 8px" }}>{"\u00B7"}</span>
        Built from public sources, Wikimedia, and MyCityPulse editorial analysis. Coverage depth varies by city.
      </div>
    </footer>
  );
}

// â”€â”€â”€ Wards Panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function HomePage({ onCitySelect, onCompare, compareList }) {
  return (
    <>
      <Hero onCitySelect={onCitySelect} />
      <StatsBanner />
      <TrustSection />
      <NationalPulse onCitySelect={onCitySelect} />
      <CityGrid onCitySelect={onCitySelect} onCompare={onCompare} compareList={compareList} />
      <JoinCTA />
      <Footer />
    </>
  );
}

// â”€â”€â”€ App â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
              allCities={cities}
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


