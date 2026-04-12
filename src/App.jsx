import { useState, useEffect, useRef } from "react";
import { CITY_ISSUES, CIVIC_ORGS, WARD_CORPORATORS } from "./cityData.js";
import { lazy, Suspense } from "react";
import {
  CITY_IMAGES,
  STRESS,
  TYPO_C,
  TYPO_LABEL,
  TYPO_PUBLIC_DESC,
  fmt,
} from "./domain/cities/presentation.js";
import CompareTray from "./features/compare/CompareTray.jsx";
import { buildMailtoHref, openMailtoDraft } from "./lib/contact.js";
import { submitCocreatorInterest } from "./lib/submissions.js";
import useCitySearch from "./shared/hooks/useCitySearch.js";
import { parseUrl, updateUrlForCity, findCityByUrlSlug, updateUrlForCompare, updateUrlToHome } from "./lib/routing.js";

const CityPage = lazy(() => import("./features/city/CityPage.jsx"));
const CompareView = lazy(() => import("./features/compare/CompareView.jsx"));

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
    hasElections: true
  },
  {
    rank:8,  city:"Surat",                    state:"Gujarat",         population:7784000,  area:326.5, density:23841, tier:"Major City",  density_descriptor:"Very Dense",       urban_typology:"Overnight City",         one_liner:"Survived a plague and rebuilt into one of India's best-managed municipalities.",                                     stress:"Elevated", stress_reason:"High density but strong municipal track record; migration pressure rising",              formerName:null,          aliases:[],
    hasElections: true
  },
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
  {
    rank:20, city:"Vadodara",                 state:"Gujarat",         population:2300000,  area:148,   density:15541, tier:"Large City",  density_descriptor:"Very Dense",       urban_typology:"Managed Growth City",    one_liner:"Gujarat's cultural capital.",                                                                                      stress:"Moderate", stress_reason:"Dense but well-managed; flood risk in low-lying areas",                                  formerName:"Baroda",      aliases:["Baroda"],
    hasElections: true
  },
  { rank:21, city:"Pimpri-Chinchwad",         state:"Maharashtra",     population:2273000,  area:177,   density:12842, tier:"Large City",  density_descriptor:"Moderately Dense", urban_typology:"Blueprint City",         one_liner:"Pune's industrial twin.",                                                                                          stress:"Moderate", stress_reason:"Planned industrial city; air quality concern",                                             formerName:null,          aliases:["PCMC","Pimpri","Chinchwad"] },
  { rank:22, city:"Nashik",                   state:"Maharashtra",     population:1958000,  area:259,   density:7560,  tier:"Large City",  density_descriptor:"Moderate",         urban_typology:"Ancient Pulse",          one_liner:"On the Godavari, host to the Kumbh Mela.",                                                                         stress:"Elevated", stress_reason:"Pilgrimage surge pressure, river health, periurban growth",                          formerName:null,          aliases:["Nasik"] },
  { rank:23, city:"Faridabad",                state:"Haryana",         population:1880000,  area:219,   density:8584,  tier:"Large City",  density_descriptor:"Moderately Dense", urban_typology:"Overnight City",         one_liner:"Delhi's industrial shadow.",                                                                                       stress:"High",     stress_reason:"Among worst air quality in NCR, industrial waste, governance gaps",                     formerName:null,          aliases:[] },
  { rank:24, city:"Ludhiana",                 state:"Punjab",          population:1847000,  area:310,   density:5958,  tier:"Large City",  density_descriptor:"Moderate",         urban_typology:"Overnight City",         one_liner:"The hosiery and bicycle capital of India.",                                                                        stress:"High",     stress_reason:"Buddha Nullah pollution, dyeing industry effluents, unplanned growth",                  formerName:null,          aliases:[] },
  { rank:25, city:"Agra",                     state:"Uttar Pradesh",   population:1760000,  area:188.4, density:9342,  tier:"Large City",  density_descriptor:"Moderately Dense", urban_typology:"Ancient Pulse",          one_liner:"The city the Mughals built their empire around.",                                                                  stress:"High",     stress_reason:"Yamuna pollution, heritage-tourism pressure, air quality around Taj",                   formerName:null,          aliases:["Taj City"] },
  {
    rank:26, city:"Rajkot",                   state:"Gujarat",         population:1690000,  area:170,   density:9941,  tier:"Large City",  density_descriptor:"Moderately Dense", urban_typology:"Managed Growth City",    one_liner:"Gandhi's childhood city.",                                                                                         stress:"Moderate", stress_reason:"Moderate density, reasonable governance; heat stress rising",                          formerName:null,          aliases:[],
    hasElections: true
  },
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
  { rank:52, city:"Bhavnagar",                state:"Gujarat",         population:745000,   area:108,   density:6898,  tier:"Large City",  density_descriptor:"Moderate",         urban_typology:"Managed Growth City",    one_liner:"A port city where shipbreaking, trade, and civic growth all meet the Gulf.",                                      stress:"Elevated", stress_reason:"Industrial pressure, coastal exposure, and uneven urban services",                 formerName:null,          aliases:[], hasElections: true },
  { rank:53, city:"Jamnagar",                 state:"Gujarat",         population:668000,   area:75,    density:8907,  tier:"Large City",  density_descriptor:"Moderately Dense", urban_typology:"Managed Growth City",    one_liner:"Refinery wealth at the edge of a historic princely city.",                                                         stress:"Elevated", stress_reason:"Industrial emissions, coastal vulnerability, and growth around energy infrastructure", formerName:"Nawanagar",   aliases:["Nawanagar"], hasElections: true },
  { rank:54, city:"Junagadh",                 state:"Gujarat",         population:430000,   area:160,   density:2687,  tier:"Large City",  density_descriptor:"Spacious",         urban_typology:"Ancient Pulse",          one_liner:"A historic city under Girnar, carrying layers of empire and pilgrimage.",                                         stress:"Moderate", stress_reason:"Moderate urban scale, but drainage and heritage pressures remain",                 formerName:null,          aliases:[], hasElections: true },
  { rank:55, city:"Gandhinagar",              state:"Gujarat",         population:390000,   area:177,   density:2203,  tier:"Large City",  density_descriptor:"Spacious",         urban_typology:"Blueprint City",         one_liner:"A planned capital with wide sectors and a quieter civic rhythm than its neighbours.",                            stress:"Moderate", stress_reason:"Planned layout helps, though expansion pressure is rising on the edges",           formerName:null,          aliases:[], hasElections: true },
  { rank:56, city:"Anand",                    state:"Gujarat",         population:290000,   area:47,    density:6170,  tier:"Large City",  density_descriptor:"Moderate",         urban_typology:"Managed Growth City",    one_liner:"The milk capital's urban core is small, busy, and growing beyond its older footprint.",                          stress:"Moderate", stress_reason:"Steady growth, traffic pressure, and service capacity that needs to keep pace",     formerName:null,          aliases:[], hasElections: true },
  { rank:57, city:"Nadiad",                   state:"Gujarat",         population:225000,   area:32,    density:7031,  tier:"Large City",  density_descriptor:"Moderate",         urban_typology:"Ancient Pulse",          one_liner:"A dense central Gujarat city where older neighborhoods still shape daily movement.",                             stress:"Moderate", stress_reason:"Compact core, drainage pressure, and ageing civic assets",                         formerName:null,          aliases:[], hasElections: true },
  { rank:58, city:"Mehsana",                  state:"Gujarat",         population:220000,   area:32,    density:6875,  tier:"Large City",  density_descriptor:"Moderate",         urban_typology:"Managed Growth City",    one_liner:"An oil-and-dairy city balancing regional commerce with local service demands.",                                   stress:"Moderate", stress_reason:"Growth is manageable, but water and transport pressures are building",              formerName:"Mahesana",    aliases:["Mahesana"], hasElections: true },
  { rank:59, city:"Morbi",                    state:"Gujarat",         population:250000,   area:51,    density:4902,  tier:"Large City",  density_descriptor:"Moderate",         urban_typology:"Overnight City",         one_liner:"A ceramics powerhouse rebuilt after disaster and still expanding fast.",                                          stress:"Elevated", stress_reason:"Rapid industrial growth, infrastructure catch-up, and flood memory",                 formerName:null,          aliases:[], hasElections: true },
  { rank:60, city:"Surendranagar",            state:"Gujarat",         population:200000,   area:58,    density:3448,  tier:"Large City",  density_descriptor:"Moderate",         urban_typology:"Sleeping Giant",         one_liner:"A regional center whose civic profile is bigger than the national attention it gets.",                           stress:"Moderate", stress_reason:"Underinvestment relative to role, with heat and water stress to manage",            formerName:null,          aliases:["Surendranagar Dudhrej"], hasElections: true },
  { rank:61, city:"Bharuch",                  state:"Gujarat",         population:190000,   area:42,    density:4524,  tier:"Large City",  density_descriptor:"Moderate",         urban_typology:"Ancient Pulse",          one_liner:"One of India's oldest port cities, now shaped by river, industry, and logistics.",                               stress:"Elevated", stress_reason:"Industrial corridor pressure, Narmada flood risk, and ageing civic systems",         formerName:"Broach",      aliases:["Broach"], hasElections: true },
  { rank:62, city:"Porbandar",                state:"Gujarat",         population:152000,   area:35,    density:4343,  tier:"Large City",  density_descriptor:"Moderate",         urban_typology:"Border Effect City",     one_liner:"A coastal city where fishing, trade, and history all compete for space.",                                        stress:"Moderate", stress_reason:"Coastal exposure and service constraints, but still a manageable urban scale",       formerName:null,          aliases:[], hasElections: true },
  { rank:51, city:"Mira Bhayandar",           state:"Maharashtra",     population:907000,   area:79.4,  density:11425, tier:"Large City",  density_descriptor:"Moderately Dense", urban_typology:"Overnight City",         one_liner:"Mumbai's northern edge \u2014 where affordable housing met the sea.",                                                    stress:"High",     stress_reason:"Explosive growth without matching infrastructure, water supply dependence, connectivity gaps", formerName:null, aliases:["Mira Road","Bhayandar"] },
];

const DATASET_SCOPE = {
  cityCount: cities.length,
  stateCount: new Set(cities.map((city) => city.state)).size,
  issueProfileCount: Object.keys(CITY_ISSUES).length,
  orgDirectoryCount: Object.keys(CIVIC_ORGS).length,
  wardPanelCount: Object.keys(WARD_CORPORATORS).length,
  electionTrackerCount: cities.filter((city) => city.hasElections).length,
};

const GUJARAT_ELECTION_CITIES = [
  "Ahmedabad",
  "Surat",
  "Vadodara",
  "Rajkot",
  "Bhavnagar",
  "Jamnagar",
  "Junagadh",
  "Gandhinagar",
  "Anand",
  "Nadiad",
  "Mehsana",
  "Morbi",
  "Surendranagar",
  "Bharuch",
  "Porbandar",
];


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
    input, textarea, select { min-width: 0; }

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

    .hero-shell {
      min-height: 92vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 100px 24px 60px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .hero-inner {
      position: relative;
      z-index: 1;
      width: min(100%, 760px);
      animation: fadeUp 0.7s ease both;
    }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #fff3e7;
      border: 1px solid #f1d1b1;
      border-radius: 8px;
      padding: 6px 14px;
      margin-bottom: 28px;
    }
    .hero-ticker {
      margin: 0 auto 24px;
      max-width: 760px;
      overflow: hidden;
      border-radius: 8px;
      border: 1px solid #eadfce;
      background: rgba(255,255,255,0.85);
      box-shadow: 0 10px 30px rgba(98,81,57,0.08);
    }
    .hero-ticker-track {
      display: flex;
      width: max-content;
      min-width: 100%;
      animation: ticker 28s linear infinite;
    }
    .hero-mobile-notice {
      display: none;
      margin: 0 auto 20px;
      width: 100%;
      text-align: left;
      background: rgba(255,255,255,0.88);
      border: 1px solid #eadfce;
      border-radius: 8px;
      padding: 14px;
      box-shadow: 0 10px 30px rgba(98,81,57,0.08);
    }
    .hero-mobile-notice-title {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #E8660D;
      margin-bottom: 8px;
    }
    .hero-mobile-notice-copy {
      font-size: 13px;
      color: #554b40;
      line-height: 1.55;
      margin-bottom: 10px;
    }
    .hero-mobile-chip-row {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 2px;
      scrollbar-width: none;
    }
    .hero-mobile-chip-row::-webkit-scrollbar {
      display: none;
    }
    .hero-mobile-chip {
      border: 1px solid #eadfce;
      background: #fff;
      color: #1f1a14;
      padding: 7px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .hero-points,
    .hero-quick-links {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
    }
    .hero-points {
      margin: 0 auto 28px;
      max-width: 760px;
    }
    .hero-search-wrap {
      position: relative;
      max-width: 560px;
      margin: 0 auto 32px;
    }
    .hero-search-input {
      width: 100%;
      padding: 16px 56px 16px 24px;
      background: #fff;
      border: 1.5px solid #e0d5c6;
      border-radius: 8px;
      color: #1f1a14;
      font-size: 16px;
      outline: none;
      transition: border-color 0.2s;
    }
    .hero-search-cta {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      background: #E8660D;
      border-radius: 8px;
      padding: 8px 16px;
      color: #fff;
      font-size: 13px;
      font-weight: 700;
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

    .page-section {
      padding: 72px 32px;
    }
    .page-section-tight {
      padding: 56px 32px 40px;
    }
    .stack-header {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      align-items: flex-end;
      flex-wrap: wrap;
    }
    .city-legend-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 28px;
    }
    .city-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 32px;
      align-items: center;
    }
    .compare-card-grid {
      display: grid;
      gap: 14px;
    }
    .compare-table-scroll {
      overflow: hidden;
    }
    .compare-table {
      width: 100%;
      border-collapse: collapse;
    }
    .city-page-hero {
      min-height: 380px;
    }
    .city-page-back-btn {
      max-width: calc(100% - 64px);
    }
    .city-page-hero-copy {
      max-width: 100%;
    }
    .city-page-title {
      font-size: 48px;
      line-height: 1.1;
    }
    .city-panel-title {
      font-size: 32px;
      line-height: 1.2;
    }
    .city-stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }
    .city-dual-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .city-issue-card {
      display: flex;
      gap: 0;
    }
    .city-issue-header {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .join-fields-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 12px;
    }
    .hero-scrollcue {
      position: absolute;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%);
      color: #9a8f82;
      font-size: 12px;
      letter-spacing: 0.08em;
      text-align: center;
    }
    .footer-copy {
      color: #877d71;
      font-size: 12px;
      letter-spacing: 0.03em;
    }
    .site-nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 200;
      background: rgba(250,248,244,0.94);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(79,67,52,0.1);
      min-height: 58px;
      display: flex;
      align-items: center;
      padding: 0 clamp(16px, 4vw, 32px);
      gap: 24px;
    }
    .site-nav-search {
      flex: 1;
      max-width: 320px;
      position: relative;
    }
    .site-nav-links {
      display: flex;
      gap: 24px;
      align-items: center;
      margin-left: auto;
    }
    .mobile-nav-row {
      display: none;
    }
    .app-shell {
      padding-top: 58px;
    }
    .section-title {
      font-size: 36px;
      line-height: 1.2;
    }
    .join-copy-title {
      font-size: 38px;
      line-height: 1.25;
    }
    .join-form-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      align-items: center;
    }
    .join-form-actions button {
      flex-shrink: 0;
    }

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
    .compare-btn.selected {
      opacity: 1 !important;
      background: rgba(255,255,255,0.92);
      color: #E8660D;
    }

    @media (hover: hover) and (pointer: fine) {
      .city-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 14px 36px rgba(0,0,0,0.22);
      }
      .city-card:hover img {
        transform: scale(1.06);
      }
      .city-card:hover .compare-btn {
        opacity: 1;
      }
    }

    @media (hover: none), (pointer: coarse) {
      .compare-btn {
        opacity: 1;
      }
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
      display: flex; align-items: center; gap: 16px;
      box-shadow: 0 -4px 24px rgba(0,0,0,0.5);
      animation: slideUp 0.22s ease;
    }

    @media (max-width: 768px) {
      .page-section,
      .page-section-tight {
        padding-left: 20px;
        padding-right: 20px;
      }
      .city-grid { grid-template-columns: 1fr 1fr !important; }
      .site-nav {
        flex-wrap: wrap;
        align-items: stretch;
        padding-top: 10px;
        padding-bottom: 10px;
        gap: 10px;
      }
      .app-shell {
        padding-top: 104px;
      }
      .site-nav-search {
        display: none !important;
      }
      .site-nav-links {
        display: none !important;
      }
      .mobile-nav-row {
        display: flex;
        width: 100%;
        gap: 8px;
        overflow-x: auto;
        scrollbar-width: none;
      }
      .mobile-nav-row::-webkit-scrollbar {
        display: none;
      }
      .hero-headline { font-size: 36px !important; }
      .hero-sub { font-size: 16px !important; }
      .hero-shell {
        min-height: auto;
        justify-content: flex-start;
        padding: 32px 20px 44px;
      }
      .hero-inner {
        width: 100%;
      }
      .hero-badge {
        margin-bottom: 18px;
        padding: 6px 12px;
      }
      .hero-ticker {
        display: none;
      }
      .hero-mobile-notice {
        display: block;
      }
      .hero-points,
      .hero-quick-links {
        gap: 8px;
      }
      .hero-search-wrap {
        max-width: none;
        width: 100%;
      }
      .hero-search-input {
        padding: 14px 16px;
        font-size: 16px;
      }
      .hero-search-cta {
        display: none;
      }
      .stats-grid { grid-template-columns: 1fr 1fr !important; }
      .thread-grid { grid-template-columns: 1fr !important; }
      .panel-nav-inner { padding: 0 16px; }
      .ward-table td, .ward-table th { padding: 9px 10px; }
      .compare-tray { padding: 10px 16px; flex-wrap: wrap; gap: 10px; }
      .stack-header,
      .city-filters {
        gap: 12px;
      }
      .compare-card-grid {
        grid-template-columns: 1fr 1fr !important;
      }
      .city-legend-grid,
      .join-fields-grid {
        grid-template-columns: 1fr;
      }
      .city-stats-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      }
      .city-dual-grid {
        grid-template-columns: 1fr !important;
      }
      .city-page-back-btn {
        left: 20px !important;
        top: 70px !important;
        max-width: calc(100% - 40px);
      }
      .city-page-title {
        font-size: 40px !important;
      }
      .city-panel-title {
        font-size: 28px !important;
      }
      .city-page-hero-copy {
        left: 20px !important;
        right: 20px !important;
        bottom: 24px !important;
      }
      .city-issue-card {
        padding: 24px 20px 24px 0 !important;
      }
      .city-issue-header {
        flex-wrap: wrap;
      }
      .hero-scrollcue {
        display: none;
      }
      .section-title {
        font-size: 30px !important;
      }
      .join-copy-title {
        font-size: 32px !important;
      }
      .join-form-actions {
        align-items: stretch;
      }
      .footer-copy {
        line-height: 1.7;
      }
    }
    @media (max-width: 480px) {
      .page-section,
      .page-section-tight {
        padding-left: 16px;
        padding-right: 16px;
      }
      .app-shell {
        padding-top: 108px;
      }
      .city-grid { grid-template-columns: 1fr !important; }
      .compare-card-grid { grid-template-columns: 1fr !important; }
      .hero-headline { font-size: 28px !important; }
      .section-title {
        font-size: 25px !important;
      }
      .hero-shell {
        padding: 20px 16px 36px;
      }
      .hero-badge {
        width: 100%;
        justify-content: center;
      }
      .join-copy-title {
        font-size: 26px !important;
      }
      .stats-grid { grid-template-columns: 1fr !important; }
      .hero-scrollcue { width: calc(100% - 32px); }
      .compare-tray { padding: 10px 12px; }
      .compare-tray > * {
        width: 100%;
      }
      .city-page-hero {
        min-height: 340px;
      }
      .city-page-back-btn {
        left: 16px !important;
        top: 68px !important;
        padding: 8px 14px !important;
        font-size: 12px !important;
      }
      .city-page-title {
        font-size: 32px !important;
      }
      .city-panel-title {
        font-size: 24px !important;
      }
      .city-page-hero-copy {
        left: 16px !important;
        right: 16px !important;
        bottom: 20px !important;
      }
      .city-stats-grid {
        grid-template-columns: 1fr !important;
      }
      .city-issue-card {
        flex-direction: column !important;
        padding: 0 !important;
      }
      .city-issue-card > div:first-child {
        width: 100% !important;
        height: 5px;
        margin-right: 0 !important;
        border-radius: 14px 14px 0 0 !important;
      }
      .city-issue-card > div:last-child {
        padding: 20px;
      }
      .join-form-actions > * {
        width: 100%;
      }
    }
  `}</style>
);

// â”€â”€â”€ Nav â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Nav({ onLogoClick, onSearch, onOpenIssues, onOpenElections, onOpenAllCities, showElectionsLink = true }) {
  const [q, setQ] = useState("");
  const [isSearchReady, setIsSearchReady] = useState(false);
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
    <nav className="site-nav">
      {/* Logo */}
      <button onClick={onLogoClick} style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <span style={{ width: 8, height: 8, background: "#E8660D", borderRadius: "50%", display: "inline-block", animation: "pulse-dot 2s infinite" }} />
        <span style={{ color: "#1f1a14", fontWeight: 800, fontSize: 17, fontFamily: "Georgia, serif", letterSpacing: "-0.01em" }}>
          MyCityPulse
        </span>
      </button>

      {/* Nav search (desktop) */}
      <div ref={ref} className="site-nav-search">
        <input
          id="nav-city-search"
          name="navCitySearch"
          type="search"
          autoComplete="new-password"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          data-form-type="other"
          data-lpignore="true"
          readOnly={!isSearchReady}
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, selectCity)}
          onFocus={() => setIsSearchReady(true)}
          onMouseDown={() => setIsSearchReady(true)}
	  aria-label="Search cities from navigation"
          placeholder="Search any city..."
          style={{
            width: "100%", background: "#fff", border: "1px solid #e5ddd1",
            borderRadius: 24, padding: "7px 16px", color: "#1f1a14", fontSize: 13,
            outline: "none",
          }}
        />
        {results.length > 0 && (
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
            background: "#fff", borderRadius: 10, boxShadow: "0 12px 24px rgba(74,59,40,0.14)",
            border: "1px solid #eadfce", overflow: "hidden", zIndex: 300,
          }}>
            {results.map((c, index) => (
              <button key={c.city} onClick={() => selectCity(c)} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                width: "100%", padding: "10px 16px", background: activeIndex === index ? "#f7f2ea" : "none", border: "none",
                color: "#1f1a14", fontSize: 13, textAlign: "left", cursor: "pointer",
                borderBottom: "1px solid #f2eadf",
              }}
              onMouseEnter={() => setActiveIndex(index)}
              >
                <span>{c.city} <span style={{ color: "#8d8378", fontSize: 11 }}>{c.state}</span></span>
                <span style={{ fontSize: 10, background: STRESS[c.stress].color + "33", color: STRESS[c.stress].color, padding: "2px 8px", borderRadius: 10, fontWeight: 700 }}>{c.stress}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="site-nav-links">
        {showElectionsLink && (
          <button onClick={onOpenElections} style={{ color: "#675f53", fontSize: 13, letterSpacing: "0.02em", background: "none", border: "none", padding: 0, cursor: "pointer" }}>Elections</button>
        )}
        <button onClick={onOpenIssues} style={{ color: "#675f53", fontSize: 13, letterSpacing: "0.02em", background: "none", border: "none", padding: 0, cursor: "pointer" }}>Issues</button>
        <button onClick={onOpenAllCities} style={{ color: "#675f53", fontSize: 13, letterSpacing: "0.02em", background: "none", border: "none", padding: 0, cursor: "pointer" }}>All Cities</button>
        <a href="#join" style={{
          background: "#E8660D", color: "#fff", padding: "6px 18px",
          borderRadius: 8, fontSize: 12, fontWeight: 700, letterSpacing: "0.06em",
        }}>STAY IN TOUCH</a>
      </div>
      <div className="mobile-nav-row">
        {showElectionsLink && (
          <button onClick={onOpenElections} className="pill-btn">Elections</button>
        )}
        <button onClick={onOpenIssues} className="pill-btn">Issues</button>
        <button onClick={onOpenAllCities} className="pill-btn">All Cities</button>
        <a href="#join" className="pill-btn" style={{ display: "inline-flex", alignItems: "center" }}>Stay In Touch</a>
      </div>
    </nav>
  );
}

// â”€â”€â”€ Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Hero({ onCitySelect }) {
  const [q, setQ] = useState("");
  const [isSearchReady, setIsSearchReady] = useState(false);
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
  const gujaratElectionCities = GUJARAT_ELECTION_CITIES
    .map((name) => cities.find((city) => city.city === name))
    .filter(Boolean);

  return (
    <section className="hero-shell" style={{ background: "#f8f4ec" }}>
      <img
        src={CITY_IMAGES.Delhi || CITY_IMAGES.Mumbai}
        alt="Indian city street"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.18,
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(248,244,236,0.78) 0%, rgba(248,244,236,0.96) 70%, #f8f4ec 100%)" }} />

      <div className="hero-inner">
        <div className="hero-badge">
          <span style={{ width: 6, height: 6, background: "#E8660D", borderRadius: "50%", animation: "pulse-dot 2s infinite" }} />
          <span style={{ color: "#A55116", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em" }}>CITIZEN'S GUIDE TO INDIAN CITIES</span>
        </div>

        <div className="hero-ticker">
          <div className="hero-ticker-track">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 28,
                  padding: "10px 20px",
                  whiteSpace: "nowrap",
                  color: "#554b40",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                }}
              >
                <span style={{ color: "#E8660D", fontWeight: 800 }}>GUJARAT ELECTION UPDATE</span>
                <span>
                  Citizens in{" "}
                  {gujaratElectionCities.map((city, index) => (
                    <span key={city.city}>
                      <button
                        onClick={() => selectCity(city)}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          color: "#1f1a14",
                          fontSize: "inherit",
                          fontWeight: 700,
                          textDecoration: "underline",
                          textUnderlineOffset: "3px",
                          cursor: "pointer",
                        }}
                      >
                        {city.city}
                      </button>
                      {index < gujaratElectionCities.length - 2 ? ", " : ""}
                      {index === gujaratElectionCities.length - 2 ? " and " : ""}
                    </span>
                  ))}
                  {" "}can now check election updates inside their city sections.
                </span>
                <span style={{ color: "#8d8378" }}>Search your city and open the Elections panel.</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-mobile-notice">
          <div className="hero-mobile-notice-title">GUJARAT ELECTION UPDATE</div>
          <p className="hero-mobile-notice-copy">
            Open a city below to check election updates, wards, and candidate tracking.
          </p>
          <div className="hero-mobile-chip-row">
            {gujaratElectionCities.map((city) => (
              <button
                key={`mobile-${city.city}`}
                onClick={() => selectCity(city)}
                className="hero-mobile-chip"
              >
                {city.city}
              </button>
            ))}
          </div>
        </div>

        <h1 className="hero-headline" style={{
          fontSize: 56, fontFamily: "Georgia, serif", fontWeight: 700,
          color: "#1f1a14", lineHeight: 1.15, marginBottom: 20,
          letterSpacing: "-0.02em",
        }}>
          Understand your city<br />
          <span style={{ color: "#E8660D" }}>before it overwhelms you.</span>
        </h1>

        <p className="hero-sub" style={{
          fontSize: 18, color: "#5f564c", lineHeight: 1.7,
          maxWidth: 620, margin: "0 auto 36px",
        }}>
          MyCityPulse helps ordinary citizens find their city, see what pressures shape daily life, discover who is working on local problems, and follow municipal elections without digging through ten tabs.
        </p>

        <div className="hero-points">
          {[
            "Search your city in seconds",
            "Read issues in plain language",
            "Track wards and elections where available",
          ].map((item) => (
            <span
              key={item}
              style={{
                background: "#fff",
                border: "1px solid #eadfce",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 13,
                color: "#5b5247",
                fontWeight: 600,
              }}
            >
              {item}
            </span>
          ))}
        </div>

        <div ref={ref} className="hero-search-wrap">
          <div style={{ position: "relative" }}>
            <input
              id="hero-city-search"
              name="heroCitySearch"
              type="search"
              autoComplete="new-password"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              data-form-type="other"
              data-lpignore="true"
              readOnly={!isSearchReady}
              value={q}
              onChange={e => setQ(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, selectCity)}
              onFocus={e => {
                setIsSearchReady(true);
                e.target.style.borderColor = "rgba(232,102,13,0.6)";
              }}
              onMouseDown={() => setIsSearchReady(true)}
	      aria-label="Search cities"
              placeholder="Search your city..."
              className="hero-search-input"
              onBlur={e => {
                e.target.style.borderColor = "#e0d5c6";
              }}
            />
            <div className="hero-search-cta">
              {"Explore \u2192"}
            </div>
          </div>

          {results.length > 0 && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0,
              background: "#fff", borderRadius: 8, boxShadow: "0 12px 40px rgba(74,59,40,0.14)",
              border: "1px solid #eadfce", overflow: "hidden", zIndex: 300, textAlign: "left",
            }}>
              {results.map((c, index) => (
                <button key={c.city} onClick={() => selectCity(c)} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  width: "100%", padding: "12px 20px", background: activeIndex === index ? "#f7f2ea" : "none", border: "none",
                  color: "#1f1a14", fontSize: 14, cursor: "pointer",
                  borderBottom: "1px solid #f2eadf",
                }}
                onMouseEnter={() => setActiveIndex(index)}
                >
                  <div>
                    <span style={{ fontWeight: 600 }}>{c.city}</span>
                    <span style={{ color: "#8d8378", fontSize: 12, marginLeft: 8 }}>{c.state}</span>
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

        <div className="hero-quick-links">
          {quickCities.map(name => {
            const c = cities.find(x => x.city === name);
            return (
              <button key={name} onClick={() => onCitySelect(c)} style={{
                background: "#fff", border: "1px solid #eadfce",
                color: "#5b5247", padding: "7px 16px", borderRadius: 8,
                fontSize: 13, cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#f7f1e6"; e.currentTarget.style.color = "#1f1a14"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#5b5247"; }}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="hero-scrollcue">
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
    <div style={{ background: "#fffdf9", padding: "36px 32px", borderTop: "1px solid #eee2d3", borderBottom: "1px solid #eee2d3" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 24, textAlign: "center" }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: "#fff", border: "1px solid #eadfce", borderRadius: 8, padding: "18px 14px" }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: "#E8660D", fontFamily: "Georgia, serif", letterSpacing: "-0.03em" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#7d7266", marginTop: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 20, color: "#6f6559", fontSize: 13, lineHeight: 1.7, textAlign: "center" }}>
          Current scope: {DATASET_SCOPE.issueProfileCount} city issue briefs, {DATASET_SCOPE.orgDirectoryCount} civic ecosystem directories,
          {` ${DATASET_SCOPE.wardPanelCount}`} ward panels, and {DATASET_SCOPE.electionTrackerCount} live election tracker.
          Public facts and editorial judgments are intentionally separated elsewhere on the site.
        </p>
      </div>
    </div>
  );
}

function ElectionsHub({ onCitySelect }) {
  const electionCities = cities
    .filter((city) => city.hasElections)
    .sort((left, right) => left.city.localeCompare(right.city));

  return (
    <section id="elections" className="page-section-tight" style={{ background: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#E8660D", letterSpacing: "0.12em", marginBottom: 12 }}>
          MUNICIPAL ELECTIONS
        </div>
        <div className="stack-header" style={{ marginBottom: 24 }}>
          <div style={{ maxWidth: 680 }}>
            <h2 className="section-title" style={{ fontSize: 34, fontFamily: "Georgia, serif", fontWeight: 700, color: "#1a1a1a", marginBottom: 10 }}>
              Election updates, without the treasure hunt.
            </h2>
            <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7 }}>
              Open any election city directly here. Each city page carries the election timeline, ward lookup, and candidate status labels so people can see what is verified, what is only announced, and what still needs checking.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", background: "#fff4ea", border: "1px solid #ffd7b3", borderRadius: 8, padding: "7px 10px" }}>
              {electionCities.length} cities with election desks
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", background: "#f6f2ea", border: "1px solid #e6dccf", borderRadius: 8, padding: "7px 10px" }}>
              Gujarat civic polls on Apr 26, 2026
            </span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
          {electionCities.map((city) => (
            <button
              key={city.city}
              onClick={() => onCitySelect(city)}
              style={{
                textAlign: "left",
                background: "#faf8f4",
                border: "1px solid #ebe4d8",
                borderRadius: 8,
                padding: "16px 16px 14px",
                display: "grid",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                <strong style={{ fontSize: 17, color: "#1a1a1a" }}>{city.city}</strong>
                <span style={{ fontSize: 10, fontWeight: 800, color: "#E8660D", letterSpacing: "0.08em" }}>OPEN</span>
              </div>
              <div style={{ fontSize: 12, color: "#7a746c", lineHeight: 1.5 }}>{city.state}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#5b554c", background: "#fff", border: "1px solid #e6dccf", borderRadius: 8, padding: "4px 8px" }}>
                  Elections panel
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#5b554c", background: "#fff", border: "1px solid #e6dccf", borderRadius: 8, padding: "4px 8px" }}>
                  Ward lookup
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// â”€â”€â”€ City Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function TrustSection() {
  const cards = [
    {
      title: "Find your bearings",
      body: "Open your city and get a quick sense of what matters there: the pressure points, the local context, and the civic language people keep throwing around.",
    },
    {
      title: "See what is actually covered",
      body: `This release covers ${DATASET_SCOPE.cityCount} cities, but depth still varies. Some places have issue briefs, ward panels, and election desks. Others are still growing. We show that openly.`,
    },
    {
      title: "Know what to trust",
      body: "MyCityPulse is not a government portal. It mixes public facts, reported material, and editorial judgment so citizens can start somewhere sensible instead of starting from zero.",
    },
  ];

  return (
    <section className="page-section" style={{ paddingTop: 64, paddingBottom: 64, background: "#f4efe6", borderTop: "1px solid #ece1d3", borderBottom: "1px solid #ece1d3" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ maxWidth: 720, marginBottom: 28 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#E8660D", letterSpacing: "0.1em", marginBottom: 10 }}>START HERE</div>
          <h2 className="section-title" style={{ fontSize: 34, fontFamily: "Georgia, serif", fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>
            A lighter way to make sense of city life.
          </h2>
          <p style={{ fontSize: 16, color: "#666", lineHeight: 1.7 }}>
            Most people do not need another dense portal. They need a calm starting point. This is built to help citizens orient fast, read clearly, and keep moving.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
          {cards.map((card) => (
            <div key={card.title} style={{ background: "#fff", borderRadius: 8, padding: 24, boxShadow: "0 1px 6px rgba(0,0,0,0.04)", border: "1px solid #eadfce" }}>
              <h3 style={{ fontSize: 18, fontFamily: "Georgia, serif", fontWeight: 700, color: "#1a1a1a", marginBottom: 10 }}>{card.title}</h3>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, margin: 0 }}>{card.body}</p>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 20, fontSize: 13, color: "#7a6a5c", lineHeight: 1.7 }}>
          If something is thin, stale, or still under construction, that should be visible. The point is clarity, not posturing.
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
          loading="lazy"
          decoding="async"
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
    <section id="cities" className="page-section" style={{ background: "#FAF8F4" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#E8660D", letterSpacing: "0.1em", marginBottom: 10 }}>EXPLORE</div>
          <h2 className="section-title" style={{ fontSize: 36, fontFamily: "Georgia, serif", fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>
            Pick a city and begin where you live.
          </h2>
          <p style={{ fontSize: 16, color: "#666", maxWidth: 500, lineHeight: 1.6 }}>
            Search, filter, and open city pages built for citizens. Some are deeper than others today, but each one should help you get oriented faster than a generic search result page.
          </p>
          <div style={{ marginTop: 16, background: "#fff", borderRadius: 8, border: "1px solid #e8e5e0", padding: "16px 18px", maxWidth: 760 }}>
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
              borderRadius: 8, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
            }}
          >
            {legendOpen ? "\u25B2" : "\u25BC"} What do these tags mean?
          </button>
          {legendOpen && (
            <div className="city-legend-grid" style={{
              marginTop: 16, background: "#fff", borderRadius: 14,
              padding: "24px 28px", border: "1px solid #e8e5e0",
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
        <div className="city-filters">
          {/* Search */}
          <input
            value={q} onChange={e => setQ(e.target.value)}
            placeholder="Filter cities..."
            style={{
              padding: "7px 16px", border: "1.5px solid #e0ddd8", borderRadius: 24,
              fontSize: 13, outline: "none", background: "#fff", minWidth: 160, flex: "1 1 220px",
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
    <section id="pulse" className="page-section" style={{ background: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#E8660D", letterSpacing: "0.1em", marginBottom: 10 }}>NATIONAL PULSE</div>
          <h2 className="section-title" style={{ fontSize: 36, fontFamily: "Georgia, serif", fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>
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
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [submitState, setSubmitState] = useState("idle");
  const [deliveryMode, setDeliveryMode] = useState(null);
  const [permissions, setPermissions] = useState({
    updates: true,
    surveys: true,
    pilotGroup: false,
  });
  const [contributions, setContributions] = useState({
    cityResearch: true,
    issueVerification: false,
    wardUpdates: false,
    productFeedback: true,
  });

  const togglePermission = (key) => {
    setPermissions((current) => ({ ...current, [key]: !current[key] }));
  };

  const toggleContribution = (key) => {
    setContributions((current) => ({ ...current, [key]: !current[key] }));
  };

  const handleJoin = async () => {
    const validEmail = email.includes("@") && email.includes(".");
    const selectedContributions = Object.entries(contributions)
      .filter(([, selected]) => selected)
      .map(([key]) => key);

    if (!validEmail) {
      setError("Enter a valid email so we know where to reach you.");
      return;
    }

    if (selectedContributions.length === 0) {
      setError("Pick at least one way you’d like to cocreate with us.");
      return;
    }

    const payload = {
      email,
      fullName: fullName.trim(),
      city: city.trim(),
      permissions,
      contributions: selectedContributions,
      capturedAt: new Date().toISOString(),
    };

    try {
      setSubmitState("submitting");
      const result = await submitCocreatorInterest(payload);
      setDeliveryMode(result.delivery);
      if (result.delivery !== "remote") {
        openMailtoDraft({
          subject: `Cocreator interest from ${fullName.trim() || email}`,
          lines: [
            "Hi MyCityPulse,",
            "",
            "I want to join as a cocreator.",
            `Name: ${fullName.trim() || "Not shared"}`,
            `Email: ${email}`,
            `City: ${city.trim() || "Not shared"}`,
            `Interested in: ${selectedContributions.join(", ")}`,
            `Permissions: ${Object.entries(permissions).filter(([, value]) => value).map(([key]) => key).join(", ")}`,
          ],
        });
      }
      setError("");
      setDone(true);
    } catch {
      setError("We could not submit your interest right now. You can also reach us at hello@mycitypulse.in.");
    } finally {
      setSubmitState("idle");
    }
  };

  return (
    <section id="join" className="page-section" style={{ background: "#fffaf3", paddingTop: 80, paddingBottom: 80, borderTop: "1px solid #ede2d4" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#E8660D", letterSpacing: "0.12em", marginBottom: 16 }}>BECOME A COCREATOR</div>
        <h2 className="join-copy-title" style={{ fontSize: 38, fontFamily: "Georgia, serif", fontWeight: 700, color: "#1f1a14", lineHeight: 1.25, marginBottom: 16, letterSpacing: "-0.02em" }}>
          Stay close to what your city is becoming.
        </h2>
        <p style={{ fontSize: 16, color: "#655c50", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 36px" }}>
          Join the people helping us keep city pages sharper, clearer, and more useful. You can simply get updates, or help verify what is changing on the ground.
        </p>

        {done ? (
          <div style={{
            background: "#f4fbf5",
            border: "1px solid rgba(45,198,83,0.25)",
            borderRadius: 8,
            padding: "24px 22px",
            maxWidth: 560,
            margin: "0 auto",
          }}>
            <div style={{ color: "#2b8a48", fontSize: 16, fontFamily: "Georgia, serif", fontStyle: "italic", marginBottom: 10 }}>
              {deliveryMode === "remote"
                ? "\u2713 You're in. Your cocreator interest reached the MyCityPulse inbox."
                : "\u2713 Your cocreator interest is saved on this device."}
            </div>
            <p style={{ color: "#5c6b5f", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
              {deliveryMode === "remote"
                ? "We have your email, permissions, and contribution interests. This is now a real signup path, not just a local prototype."
                : "This browser does not have a live form endpoint configured yet. For a real reply today, email hello@mycitypulse.in and mention the city or civic work you'd like to help with."}
            </p>
            {deliveryMode !== "remote" && (
              <a
                href="mailto:hello@mycitypulse.in?subject=MyCityPulse%20Cocreator%20Interest"
                style={{ color: "#c76122", display: "inline-block", marginTop: 12, fontSize: 13, fontWeight: 700 }}
              >
                Email the team directly -&gt;
              </a>
            )}
          </div>
        ) : (
          <div style={{
            maxWidth: 620,
            margin: "0 auto",
            background: "#fff",
            border: "1px solid #eadfce",
            borderRadius: 8,
            padding: "24px 20px",
            textAlign: "left",
          }}>
            <div className="join-fields-grid">
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Your name"
                style={{
                  width: "100%", padding: "13px 18px",
                  background: "#fff", border: "1.5px solid #e3d7c9",
                  borderRadius: 8, color: "#1f1a14", fontSize: 14, outline: "none",
                }}
              />
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Your city"
                style={{
                  width: "100%", padding: "13px 18px",
                  background: "#fff", border: "1.5px solid #e3d7c9",
                  borderRadius: 8, color: "#1f1a14", fontSize: 14, outline: "none",
                }}
              />
            </div>

            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                width: "100%", padding: "13px 18px", marginBottom: 18,
                background: "#fff", border: "1.5px solid #e3d7c9",
                borderRadius: 8, color: "#1f1a14", fontSize: 14, outline: "none",
              }}
            />

            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#E8660D", letterSpacing: "0.08em", marginBottom: 10 }}>
                HOW YOU’D LIKE TO HELP
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[
                  ["cityResearch", "City research"],
                  ["issueVerification", "Issue verification"],
                  ["wardUpdates", "Ward and election updates"],
                  ["productFeedback", "Product feedback"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => toggleContribution(key)}
                    style={{
                      border: contributions[key] ? "1.5px solid #E8660D" : "1.5px solid #e3d7c9",
                      background: contributions[key] ? "rgba(232,102,13,0.14)" : "#fff",
                      color: contributions[key] ? "#8d3f12" : "#655c50",
                      padding: "9px 14px",
                      borderRadius: 999,
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {contributions[key] ? "\u2713 " : ""}{label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#E8660D", letterSpacing: "0.08em", marginBottom: 10 }}>
                WHAT WE MAY CONTACT YOU ABOUT
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                {[
                  ["updates", "Occasional product and city updates"],
                  ["surveys", "Requests for civic surveys, feedback, and verification"],
                  ["pilotGroup", "Early pilot access to new MyCityPulse features"],
                ].map(([key, label]) => (
                  <label key={key} style={{ display: "flex", alignItems: "center", gap: 10, color: "#655c50", fontSize: 14, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={permissions[key]}
                      onChange={() => togglePermission(key)}
                      style={{ accentColor: "#E8660D", width: 16, height: 16 }}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <p style={{ color: "#b45b21", fontSize: 13, lineHeight: 1.6, margin: "0 0 14px" }}>
                {error}
              </p>
            )}

            <div className="join-form-actions">
              <button
                onClick={handleJoin}
                disabled={submitState === "submitting"}
                style={{
                  background: "#E8660D", color: "#fff", border: "none",
                  padding: "13px 24px", borderRadius: 8, fontSize: 14, fontWeight: 700,
                  cursor: submitState === "submitting" ? "progress" : "pointer", letterSpacing: "0.04em", whiteSpace: "nowrap",
                  opacity: submitState === "submitting" ? 0.7 : 1,
                }}
              >
                {submitState === "submitting" ? "Submitting..." : "Stay in touch \u2192"}
              </button>
              <span style={{ fontSize: 12, color: "#8d8378" }}>
                No account creation. Just email plus clear permissions.
              </span>
            </div>
            <p style={{ fontSize: 12, color: "#92887c", lineHeight: 1.6, margin: "14px 0 0" }}>
              Without a configured form endpoint, this saves locally in the browser and offers email fallback. Add `VITE_COCREATOR_ENDPOINT` to make it a live signup.
            </p>
          </div>
        )}

        <p style={{ fontSize: 12, color: "#93897d", marginTop: 16 }}>
          No spam. Just city stories, targeted asks for help, and the permissions you checked above.
        </p>
      </div>
    </section>
  );
}

// â”€â”€â”€ Footer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Footer() {
  const year = new Date().getFullYear();
  const contactHref = buildMailtoHref({
    subject: "Hello from MyCityPulse",
    lines: [
      "Hi MyCityPulse,",
      "",
      "I’m reaching out from the website.",
    ],
  });
  return (
    <footer style={{ background: "#f4eee4", padding: "28px clamp(16px, 4vw, 32px)", textAlign: "center", borderTop: "1px solid #e6dac9" }}>
      <div className="footer-copy">
        {"\u00A9"} {year} MyCityPulse {"\u00B7"} <span style={{ color: "#9a8f82" }}>mycitypulse.in</span>
        <span style={{ color: "#c0b4a7", margin: "0 8px" }}>{"\u00B7"}</span>
        Built from public sources, Wikimedia, and MyCityPulse editorial analysis. Coverage depth varies by city.
        <span style={{ color: "#c0b4a7", margin: "0 8px" }}>{"\u00B7"}</span>
        <a href={contactHref} style={{ color: "#7f5a37" }}>Contact</a>
      </div>
    </footer>
  );
}

// â”€â”€â”€ Wards Panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function HomePage({ onCitySelect, onCompare, compareList }) {
  return (
    <>
      <Hero onCitySelect={onCitySelect} />
      <ElectionsHub onCitySelect={onCitySelect} />
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
  const [requestedCityPanel, setRequestedCityPanel] = useState(null);

  useEffect(() => {
    const title = selectedCity
      ? `${selectedCity.city} | MyCityPulse`
      : compareMode
        ? "Compare Cities | MyCityPulse"
        : "MyCityPulse | Indian Cities, Civic Issues, and Municipal Elections";
    const description = selectedCity
      ? `${selectedCity.city} city profile with civic stress, local issues, civic ecosystem, and election coverage where available.`
      : compareMode
        ? "Compare Indian cities across population, density, civic stress, and urban typology."
        : "MyCityPulse helps citizens understand Indian cities through public facts, civic issues, municipal election guides, and editorial city intelligence.";

    document.title = title;

    const ensureMeta = (name, attribute = "name") => {
      let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      return element;
    };

    ensureMeta("description").setAttribute("content", description);
    ensureMeta("og:title", "property").setAttribute("content", title);
    ensureMeta("og:description", "property").setAttribute("content", description);
    ensureMeta("twitter:title").setAttribute("content", title);
    ensureMeta("twitter:description").setAttribute("content", description);
  }, [compareMode, selectedCity]);

  // Initialize state from URL on page load
  useEffect(() => {
    const { citySlug, panel, compareMode } = parseUrl();

    if (compareMode) {
      setCompareMode(true);
      setSelectedCity(null);
      setRequestedCityPanel(null);
    } else if (citySlug) {
      const matched = findCityByUrlSlug(citySlug, cities);
      if (matched) {
        setSelectedCity(matched);
        setRequestedCityPanel(panel || null);
        setCompareMode(false);
      }
    } else {
      setSelectedCity(null);
      setCompareMode(false);
      setRequestedCityPanel(null);
    }
  }, []);

  // Listen for browser back/forward button clicks
  useEffect(() => {
    const handlePopState = () => {
      const { citySlug, panel, compareMode } = parseUrl();

      if (compareMode) {
        setCompareMode(true);
        setSelectedCity(null);
        setRequestedCityPanel(null);
      } else if (citySlug) {
        const matched = findCityByUrlSlug(citySlug, cities);
        if (matched) {
          setSelectedCity(matched);
          setRequestedCityPanel(panel || null);
          setCompareMode(false);
        }
      } else {
        setSelectedCity(null);
        setCompareMode(false);
        setRequestedCityPanel(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setCompareMode(false);
    setRequestedCityPanel(null);
    updateUrlForCity(city);
    window.scrollTo(0, 0);
  };
  const handleBack = () => {
    setSelectedCity(null);
    setRequestedCityPanel(null);
    updateUrlToHome();
  };

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
    updateUrlForCompare();
    window.scrollTo(0, 0);
  };

  const handleCloseCompare = () => {
    setCompareMode(false);
    updateUrlToHome();
  };

  const handlePanelChange = (panelId) => {
    if (selectedCity && panelId) {
      updateUrlForCity(selectedCity, panelId);
    }
  };

  const handleRemoveFromCompare = (cityName) => {
    setCompareList(prev => prev.filter(c => c.city !== cityName));
  };

  const handleAddToCompare = (city) => {
    setCompareList(prev => prev.length < 3 ? [...prev, city] : prev);
  };

  const scrollHomeSection = (sectionId) => {
    window.setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 0);
  };

  const handleOpenIssues = () => {
    if (selectedCity) {
      setRequestedCityPanel("issues");
      updateUrlForCity(selectedCity, "issues");
      return;
    }

    if (compareMode) {
      setCompareMode(false);
    }

    scrollHomeSection("pulse");
  };

  const handleOpenElections = () => {
    if (selectedCity) {
      setRequestedCityPanel("elections");
      updateUrlForCity(selectedCity, "elections");
      return;
    }

    if (compareMode) {
      setCompareMode(false);
    }

    scrollHomeSection("elections");
  };

  const handleOpenAllCities = () => {
    if (selectedCity || compareMode) {
      setSelectedCity(null);
      setCompareMode(false);
      setRequestedCityPanel(null);
      scrollHomeSection("cities");
      return;
    }

    scrollHomeSection("cities");
  };

  return (
    <>
      <GlobalStyles />
      <Nav
        onLogoClick={() => { handleBack(); setCompareMode(false); }}
        onSearch={handleCitySelect}
        onOpenIssues={handleOpenIssues}
        onOpenElections={handleOpenElections}
        onOpenAllCities={handleOpenAllCities}
        showElectionsLink={!selectedCity || Boolean(selectedCity.hasElections)}
      />
      <div className="app-shell">
        {compareMode
          ? (
            <Suspense fallback={<div style={{ padding: "48px 24px", textAlign: "center", color: "#666" }}>Loading compare view...</div>}>
              <CompareView
                allCities={cities}
                cities={compareList}
                onBack={handleCloseCompare}
                onCitySelect={handleCitySelect}
                onRemove={handleRemoveFromCompare}
                onAdd={handleAddToCompare}
              />
            </Suspense>
          )
          : selectedCity
            ? (
              <Suspense fallback={<div style={{ padding: "48px 24px", textAlign: "center", color: "#666" }}>Loading city page...</div>}>
                <CityPage
                  key={selectedCity.city}
                  city={selectedCity}
                  onBack={handleBack}
                  requestedPanel={requestedCityPanel}
                  onPanelHandled={() => setRequestedCityPanel(null)}
                  onPanelChange={handlePanelChange}
                />
              </Suspense>
            )
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


