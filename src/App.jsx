import { useState, useEffect, useRef } from "react";
import { CITY_ISSUES, CIVIC_ORGS, WARD_CORPORATORS } from "./cityData.js";
import { useLayoutEffect } from "react";
import { lazy, Suspense } from "react";
import "./App.css";
import {
  CITY_IMAGES,
  STRESS,
  TYPO_C,
  TYPO_LABEL,
  TYPO_PUBLIC_DESC,
  fmt,
} from "./domain/cities/presentation.js";
import CompareTray from "./features/compare/CompareTray.jsx";
import { openMailtoDraft } from "./lib/contact.js";
import { submitCocreatorInterest } from "./lib/submissions.js";
import ContactDialog from "./components/ContactDialog.jsx";
import useCitySearch from "./shared/hooks/useCitySearch.js";
import { parseUrl, updateUrlForCity, findCityByUrlSlug, updateUrlForCompare, updateUrlToHome } from "./lib/routing.js";
import HowItWorks from "./components/HowItWorks.jsx";
import { loadElectionData } from "./domain/elections/loadElectionData.js";
import {
  CURRENT_GUJARAT_MUNICIPAL_ELECTION_CITIES_2026,
  GUJARAT_ELECTION_CITY_ROSTER_2026,
  LIVE_GUJARAT_WARD_EXPECTATIONS_2026,
} from "./domain/elections/gujaratElectionConfig.js";
import {
  VERIFICATION_SOURCE,
  VERIFICATION_LABELS,
} from "./domain/elections/verification.js";

const CityPage = lazy(() => import("./features/city/CityPage.jsx"));
const CompareView = lazy(() => import("./features/compare/CompareView.jsx"));
const StoryViewer = lazy(() => import("./features/stories/StoryViewer.jsx"));

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
  { rank:54, city:"Junagadh",                 state:"Gujarat",         population:430000,   area:160,   density:2687,  tier:"Large City",  density_descriptor:"Spacious",         urban_typology:"Ancient Pulse",          one_liner:"A historic city under Girnar, carrying layers of empire and pilgrimage.",                                         stress:"Moderate", stress_reason:"Moderate urban scale, but drainage and heritage pressures remain",                 formerName:null,          aliases:[], hasElections: false },
  { rank:55, city:"Gandhinagar",              state:"Gujarat",         population:390000,   area:177,   density:2203,  tier:"Large City",  density_descriptor:"Spacious",         urban_typology:"Blueprint City",         one_liner:"A planned capital with wide sectors and a quieter civic rhythm than its neighbours.",                            stress:"Moderate", stress_reason:"Planned layout helps, though expansion pressure is rising on the edges",           formerName:null,          aliases:[], hasElections: false },
  { rank:56, city:"Anand",                    state:"Gujarat",         population:290000,   area:47,    density:6170,  tier:"Large City",  density_descriptor:"Moderate",         urban_typology:"Managed Growth City",    one_liner:"The milk capital's urban core is small, busy, and growing beyond its older footprint.",                          stress:"Moderate", stress_reason:"Steady growth, traffic pressure, and service capacity that needs to keep pace",     formerName:null,          aliases:[], hasElections: true },
  { rank:56.5, city:"Gandhidham",             state:"Gujarat",         population:250000,   area:52,    density:4808,  tier:"Large City",  density_descriptor:"Moderate",         urban_typology:"Overnight City",         one_liner:"A Kutch port city built by displacement, logistics, and fast commercial expansion.",                              stress:"Elevated", stress_reason:"Port growth, freight movement, and infrastructure catch-up are all hitting at once", formerName:null,          aliases:["Kandla-Gandhidham"], hasElections: true },
  { rank:57, city:"Nadiad",                   state:"Gujarat",         population:225000,   area:32,    density:7031,  tier:"Large City",  density_descriptor:"Moderate",         urban_typology:"Ancient Pulse",          one_liner:"A dense central Gujarat city where older neighborhoods still shape daily movement.",                             stress:"Moderate", stress_reason:"Compact core, drainage pressure, and ageing civic assets",                         formerName:null,          aliases:[], hasElections: true },
  { rank:58, city:"Mehsana",                  state:"Gujarat",         population:220000,   area:32,    density:6875,  tier:"Large City",  density_descriptor:"Moderate",         urban_typology:"Managed Growth City",    one_liner:"An oil-and-dairy city balancing regional commerce with local service demands.",                                   stress:"Moderate", stress_reason:"Growth is manageable, but water and transport pressures are building",              formerName:"Mahesana",    aliases:["Mahesana"], hasElections: true },
  { rank:59, city:"Morbi",                    state:"Gujarat",         population:250000,   area:51,    density:4902,  tier:"Large City",  density_descriptor:"Moderate",         urban_typology:"Overnight City",         one_liner:"A ceramics powerhouse rebuilt after disaster and still expanding fast.",                                          stress:"Elevated", stress_reason:"Rapid industrial growth, infrastructure catch-up, and flood memory",                 formerName:null,          aliases:[], hasElections: true },
  { rank:60, city:"Surendranagar",            state:"Gujarat",         population:200000,   area:58,    density:3448,  tier:"Large City",  density_descriptor:"Moderate",         urban_typology:"Sleeping Giant",         one_liner:"A regional center whose civic profile is bigger than the national attention it gets.",                           stress:"Moderate", stress_reason:"Underinvestment relative to role, with heat and water stress to manage",            formerName:null,          aliases:["Surendranagar Dudhrej"], hasElections: true },
  { rank:61, city:"Bharuch",                  state:"Gujarat",         population:190000,   area:42,    density:4524,  tier:"Large City",  density_descriptor:"Moderate",         urban_typology:"Ancient Pulse",          one_liner:"One of India's oldest port cities, now shaped by river, industry, and logistics.",                               stress:"Elevated", stress_reason:"Industrial corridor pressure, Narmada flood risk, and ageing civic systems",         formerName:"Broach",      aliases:["Broach"], hasElections: false },
  { rank:62, city:"Porbandar",                state:"Gujarat",         population:152000,   area:35,    density:4343,  tier:"Large City",  density_descriptor:"Moderate",         urban_typology:"Border Effect City",     one_liner:"A coastal city where fishing, trade, and history all compete for space.",                                        stress:"Moderate", stress_reason:"Coastal exposure and service constraints, but still a manageable urban scale",       formerName:null,          aliases:[], hasElections: true },
  { rank:62.5, city:"Vapi",                   state:"Gujarat",         population:235000,   area:37,    density:6351,  tier:"Large City",  density_descriptor:"Moderate",         urban_typology:"Overnight City",         one_liner:"An industrial border city where factories, freight, and housing pressure are all growing fast.",                stress:"Elevated", stress_reason:"Industrial emissions, migration pressure, and service capacity are all under strain", formerName:null,          aliases:[], hasElections: true },
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

const GUJARAT_ELECTION_CITY_OBJECTS = GUJARAT_ELECTION_CITY_ROSTER_2026
  .map((name) => cities.find((city) => city.city === name))
  .filter(Boolean);

function buildElectionCoverageSummary(election) {
  const wards = Array.isArray(election?.wards) ? election.wards : [];
  const totalWards = wards.length || election?.wards_total || 0;
  const listedWards = wards.filter((ward) => ward.number && ward.name && ward.officeAddress).length;
  const namedWards = wards.filter((ward) => Array.isArray(ward.candidates) && ward.candidates.length > 0).length;
  const trackedWards = wards.filter(
    (ward) => ward.candidateStatus === "party_announced" || ward.candidateStatus === "official_final",
  ).length;
  const finalWards = wards.filter((ward) => ward.candidateStatus === "official_final").length;
  const namedCandidates = wards.reduce(
    (sum, ward) => sum + (Array.isArray(ward.candidates) ? ward.candidates.length : 0),
    0,
  );

  return {
    totalWards,
    listedWards,
    namedWards,
    trackedWards,
    finalWards,
    namedCandidates,
    listedPercent: totalWards > 0 ? Math.round((listedWards / totalWards) * 100) : 0,
    coveragePercent: totalWards > 0 ? Math.round((trackedWards / totalWards) * 100) : 0,
    namedPercent: totalWards > 0 ? Math.round((namedWards / totalWards) * 100) : 0,
    reviewedAt: election?.candidateTracker?.lastReviewed || election?.lastUpdated || null,
  };
}

function formatElectionMetricValue(value, fallback = "Pending") {
  return value > 0 ? value : fallback;
}


const INDIA_HOTSPOT_POSITIONS = {
  Delhi: { x: 148, y: 54 },
  Mumbai: { x: 90, y: 146 },
  Kolkata: { x: 244, y: 96 },
  Bengaluru: { x: 128, y: 196 },
  Chennai: { x: 156, y: 214 },
  Hyderabad: { x: 153, y: 156 },
  Ahmedabad: { x: 95, y: 104 },
  Surat: { x: 94, y: 130 },
  Pune: { x: 102, y: 162 },
  Jaipur: { x: 124, y: 84 },
};

const GUJARAT_HOTSPOT_POSITIONS = {
  Ahmedabad: { x: 126, y: 88 },
  Surat: { x: 84, y: 164 },
  Vadodara: { x: 152, y: 116 },
  Rajkot: { x: 64, y: 96 },
  Bhavnagar: { x: 136, y: 144 },
  Jamnagar: { x: 34, y: 78 },
  Navsari: { x: 92, y: 176 },
  Vapi: { x: 92, y: 188 },
  Gandhidham: { x: 28, y: 38 },
  Anand: { x: 140, y: 108 },
  Nadiad: { x: 136, y: 100 },
  Mehsana: { x: 108, y: 56 },
  Morbi: { x: 72, y: 72 },
  Surendranagar: { x: 100, y: 84 },
  Porbandar: { x: 24, y: 126 },
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

const AREA_PROTOTYPES = [
  {
    name: "Navrangpura",
    city: "Ahmedabad",
    status: "Average",
    statusTone: { emoji: "🟡", color: "#A66A00", bg: "#FFF3C6" },
    summary: "A busy core with visible pressure around collection timing and public dumping points.",
    why: [
      "Waste complaints increased this week",
      "2 hotspots nearby",
    ],
    peopleToday: [
      "14 marked Dirty",
      "3 reported Burning",
    ],
    nearby: [
      { name: "Satellite", status: "Good", emoji: "🟢", color: "#1E7F4F", note: "Cleaner bins and fewer repeat complaints" },
      { name: "Vastrapur", status: "Poor", emoji: "🔴", color: "#B42318", note: "Overflowing points returning near peak hours" },
    ],
    deeperWhy: [
      "Collection delays reported on two inner roads",
      "Segregation compliance looks weak in mixed commercial lanes",
    ],
    exploreMore: [
      "Morning waste volume is rising faster than pickup cadence",
      "Resident reports cluster near food streets and market edges",
    ],
  },
  {
    name: "Satellite",
    city: "Ahmedabad",
    status: "Good",
    statusTone: { emoji: "🟢", color: "#1E7F4F", bg: "#DDF7E7" },
    summary: "Generally cleaner streets, with only a few recurring spillover points.",
    why: [
      "Complaints stayed lower than nearby areas",
      "Bins were cleared on time across key roads",
    ],
    peopleToday: [
      "9 marked Clean",
      "1 reported Overflowing",
    ],
    nearby: [
      { name: "Navrangpura", status: "Average", emoji: "🟡", color: "#A66A00", note: "More inconsistency around busy commercial stretches" },
      { name: "Vastrapur", status: "Poor", emoji: "🔴", color: "#B42318", note: "Higher repeat flags near public bins" },
    ],
    deeperWhy: [
      "Resident behavior looks steadier in segregated pickup zones",
      "Hotspots are limited to a small cluster near late-night food activity",
    ],
    exploreMore: [
      "Cleaner roads correlate with stronger society-level compliance",
      "Complaint spikes are shorter and easier to verify here",
    ],
  },
  {
    name: "Vastrapur",
    city: "Ahmedabad",
    status: "Poor",
    statusTone: { emoji: "🔴", color: "#B42318", bg: "#FEE4E2" },
    summary: "More visible overflow and repeat complaints, especially near lake-facing activity pockets.",
    why: [
      "Overflow reports rose near two public bins",
      "Burning complaints appeared twice this week",
    ],
    peopleToday: [
      "11 marked Dirty",
      "2 reported Burning",
    ],
    nearby: [
      { name: "Satellite", status: "Good", emoji: "🟢", color: "#1E7F4F", note: "Nearby benchmark with cleaner collection timing" },
      { name: "Navrangpura", status: "Average", emoji: "🟡", color: "#A66A00", note: "Pressure exists, but not as severe today" },
    ],
    deeperWhy: [
      "Commercial activity is outrunning current collection frequency",
      "Repeat dumping points suggest weaker enforcement near shared bins",
    ],
    exploreMore: [
      "Complaint density is clustering instead of spreading evenly",
      "Neighboring areas suggest this is operational, not citywide",
    ],
  },
  {
    name: "Adajan",
    city: "Surat",
    status: "Average",
    statusTone: { emoji: "🟡", color: "#A66A00", bg: "#FFF3C6" },
    summary: "A mixed picture today, with solid collection on some roads and repeat issues on others.",
    why: [
      "Dirty markings increased around two stretches",
      "One hotspot stayed active after cleanup",
    ],
    peopleToday: [
      "8 marked Dirty",
      "2 reported Overflowing",
    ],
    nearby: [
      { name: "Vesu", status: "Good", emoji: "🟢", color: "#1E7F4F", note: "Less repeat friction today" },
      { name: "Katargam", status: "Poor", emoji: "🔴", color: "#B42318", note: "More visible backlog near shared points" },
    ],
    deeperWhy: [
      "Collection timing appears uneven across residential and market pockets",
      "Complaint recurrence suggests some bins are still too few for the footfall",
    ],
    exploreMore: [
      "Nearby comparisons imply operational fixes could move this quickly",
      "Resident participation looks strong enough to support faster feedback loops",
    ],
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
    img, svg, video, canvas { max-width: 100%; }

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
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
      box-shadow: 0 4px 16px rgba(31,26,20,0.10);
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
      border-radius: 8px;
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
      border-radius: 8px;
      padding: 24px;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      box-shadow: 0 2px 12px rgba(31,26,20,0.06);
      border: 1px solid #ece1d3;
      border-top: 3px solid transparent;
    }
    .pulse-thread-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 24px rgba(31,26,20,0.10);
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
      padding: 64px 32px;
    }
    .page-section-tight {
      padding: 52px 32px 36px;
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
    .hotspot-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(260px, 0.9fr);
      gap: 18px;
      align-items: start;
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
      word-break: break-word;
      overflow-wrap: anywhere;
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
      background: rgba(255,252,247,0.92);
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
    .mobile-nav-row .pill-btn {
      flex-shrink: 0;
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
      padding: 6px 13px; border-radius: 8px;
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
        box-shadow: 0 18px 36px rgba(31,26,20,0.18);
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
      justify-content: space-between;
      box-shadow: 0 -4px 24px rgba(0,0,0,0.5);
      animation: slideUp 0.22s ease;
    }

    @media (max-width: 1024px) {
      .page-section,
      .page-section-tight {
        padding-left: 24px;
        padding-right: 24px;
      }
      .site-nav {
        gap: 16px;
        padding-left: 20px;
        padding-right: 20px;
      }
      .site-nav-links {
        gap: 18px;
      }
      .city-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      }
      .thread-grid {
        grid-template-columns: 1fr !important;
      }
      .city-page-title {
        font-size: 44px;
      }
      .section-title {
        font-size: 32px !important;
      }
      .join-copy-title {
        font-size: 34px !important;
      }
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
      .compare-tray > div:last-child {
        width: 100%;
      }
      .compare-tray > div:last-child button {
        flex: 1;
      }
      .stack-header,
      .city-filters {
        gap: 12px;
      }
      .stack-header > * {
        width: 100%;
      }
      .city-filters > * {
        width: 100%;
      }
      .compare-card-grid {
        grid-template-columns: 1fr 1fr !important;
      }
      .hotspot-grid {
        grid-template-columns: 1fr !important;
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
      .city-info-card,
      .city-split-card,
      .city-empty-state {
        padding-left: 20px !important;
        padding-right: 20px !important;
      }
      .city-bottom-cta a {
        width: 100%;
        text-align: center;
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
    @media (max-width: 640px) {
      .site-nav {
        gap: 8px;
      }
      .compare-tray {
        padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
      }
      .hero-headline {
        font-size: 30px !important;
        line-height: 1.2 !important;
      }
      .hero-sub {
        font-size: 15px !important;
      }
      .section-title {
        font-size: 27px !important;
      }
      .city-panel-title {
        font-size: 25px !important;
      }
      .city-page-title {
        font-size: 34px !important;
      }
    }
    @media (max-width: 375px) {
      .hero-headline { font-size: 24px !important; }
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
      .hotspot-grid { grid-template-columns: 1fr !important; }
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
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      .city-stats-grid {
        grid-template-columns: 1fr !important;
      }
      .city-stat-card {
        padding: 14px 12px !important;
      }
      .city-hero-quote {
        font-size: 18px !important;
        padding-left: 16px !important;
        margin-bottom: 28px !important;
      }
      .city-info-card,
      .city-split-card,
      .city-empty-state {
        padding: 18px 16px !important;
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
function Nav({
  onLogoClick,
  onSearch,
  onOpenIssues,
  onOpenElections,
  onOpenAllCities,
  showElectionsLink = true,
}) {
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
        <button onClick={onOpenIssues} style={{ color: "#675f53", fontSize: 13, letterSpacing: "0.02em", background: "none", border: "none", padding: 0, cursor: "pointer" }}>Your Area</button>
        {showElectionsLink && (
          <button onClick={onOpenElections} style={{ color: "#675f53", fontSize: 13, letterSpacing: "0.02em", background: "none", border: "none", padding: 0, cursor: "pointer" }}>Elections</button>
        )}
        <button onClick={onOpenAllCities} style={{ color: "#675f53", fontSize: 13, letterSpacing: "0.02em", background: "none", border: "none", padding: 0, cursor: "pointer" }}>All Cities</button>
        <a href="#join" style={{
          background: "#E8660D", color: "#fff", padding: "6px 18px",
          borderRadius: 8, fontSize: 12, fontWeight: 700, letterSpacing: "0.06em",
        }}>STAY IN TOUCH</a>
      </div>
      <div className="mobile-nav-row">
        <button onClick={onOpenIssues} className="pill-btn">Your Area</button>
        {showElectionsLink && (
          <button onClick={onOpenElections} className="pill-btn">Elections</button>
        )}
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
  const useCasePool = [
    "Report litter, garbage, or dumping in a park in under a minute",
    "Check which ward a dirty public space belongs to before filing a complaint",
    "Verify if your ward match looks wrong and correct it",
    "Track garbage and drainage issues in your neighborhood",
    "Search ward directories before contacting the right office",
    "Share a civic issue from your area with the ward and landmark together",
    "Open your city page and get the local cleanup context quickly",
    "Use coordinates for any location instead of guessing the ward",
    "Confirm your saved ward before sending issue details",
    "Spot which civic problems matter most in your city",
    "Find your city's live municipal election desk fast",
    "Check candidate status ward by ward before voting day",
  ];
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((today - startOfYear) / 86400000);
  const tickerItems = Array.from({ length: 5 }, (_, index) => {
    return useCasePool[(dayOfYear + index) % useCasePool.length];
  });

  return (
    <section className="hero-shell" style={{ background: "#131722", minHeight: "100vh", paddingTop: 112, paddingBottom: 56, justifyContent: "flex-start" }}>
      <img
        src={CITY_IMAGES.Delhi || CITY_IMAGES.Mumbai}
        alt="Indian city street"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.3,
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(19,23,34,0.5) 0%, rgba(19,23,34,0.78) 52%, rgba(244,239,232,0.98) 100%)" }} />

      <div className="hero-inner" style={{ width: "min(1120px, 100%)" }}>
        <div className="hero-ticker" aria-label="MyCityPulse ticker" style={{ maxWidth: "100%", marginBottom: 22, background: "rgba(255,255,255,0.9)" }}>
          <div className="hero-ticker-track">
            {[...tickerItems, ...tickerItems].map((item, index) => (
              <div key={`${item}-${index}`} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", whiteSpace: "nowrap" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: index % 2 === 0 ? "#E8660D" : "#1f6f5f", flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#3f372f" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, alignItems: "stretch" }}>
          <div style={{ background: "rgba(17,21,31,0.76)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "32px clamp(20px, 4vw, 38px)", textAlign: "left", boxShadow: "0 28px 60px rgba(7,10,16,0.26)" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", color: "#ffd9bf", background: "rgba(201,94,31,0.14)", border: "1px solid rgba(201,94,31,0.32)", padding: "8px 10px", borderRadius: 8, marginBottom: 18 }}>
              LIVE CIVIC DESK
            </div>
            <h1 className="hero-headline" style={{ fontSize: "clamp(38px, 6vw, 68px)", fontFamily: "Georgia, serif", fontWeight: 700, color: "#fff", lineHeight: 0.98, letterSpacing: "-0.03em", margin: "0 0 16px" }}>
              See your city.
              <br />
              Find the ward.
              <br />
              Act with context.
            </h1>
            <p style={{ maxWidth: 640, margin: "0 0 24px", fontSize: 17, color: "rgba(255,255,255,0.76)", lineHeight: 1.75 }}>
              MyCityPulse is a civic interface for people trying to make sense of a city fast. Search a city, read the pressure, open the ward or election layer, and move from vague frustration to a cleaner next step.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
              {[
                "Search first, not guess first",
                "Ward context where available",
                "Election verification still built in",
              ].map((item) => (
                <span key={item} style={{ fontSize: 12, fontWeight: 700, color: "#fff", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "8px 10px" }}>
                  {item}
                </span>
              ))}
            </div>

            <div ref={ref} className="hero-search-wrap" style={{ maxWidth: 700, marginBottom: 18 }}>
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
                  placeholder="Search your city to open its civic desk"
                  className="hero-search-input"
                  style={{
                    width: "100%", padding: "20px 160px 20px 20px",
                    background: "rgba(255,255,255,0.96)", border: "1px solid rgba(255,255,255,0.16)",
                    borderRadius: 8, color: "#1f1a14", fontSize: 16,
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = "rgba(255,255,255,0.16)";
                  }}
                />
                <div className="hero-search-cta" style={{ right: 10, background: "#E8660D", padding: "10px 16px", borderRadius: 8 }}>
                  Open city desk
                </div>
              </div>

              {results.length > 0 && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0,
                  background: "#fff", borderRadius: 8, boxShadow: "0 12px 40px rgba(10,12,18,0.22)",
                  border: "1px solid #eadfce", overflow: "hidden", zIndex: 300, textAlign: "left",
                }}>
                  {results.map((c, index) => (
                    <button key={c.city} onClick={() => selectCity(c)} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      width: "100%", padding: "14px 18px", background: activeIndex === index ? "#f7f2ea" : "none", border: "none",
                      color: "#1f1a14", fontSize: 14, cursor: "pointer",
                      borderBottom: "1px solid #f2eadf",
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                    >
                      <div>
                        <span style={{ fontWeight: 700 }}>{c.city}</span>
                        <span style={{ color: "#8d8378", fontSize: 12, marginLeft: 8 }}>{c.state}</span>
                      </div>
                      <span style={{
                        fontSize: 11, background: STRESS[c.stress].color + "22",
                        color: STRESS[c.stress].color, padding: "4px 10px", borderRadius: 8, fontWeight: 800,
                      }}>{c.stress}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="hero-quick-links" style={{ justifyContent: "flex-start", marginBottom: 0 }}>
              {quickCities.map(name => {
                const c = cities.find(x => x.city === name);
                return (
                  <button key={name} onClick={() => onCitySelect(c)} style={{
                    background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)",
                    color: "#fff", padding: "9px 14px", borderRadius: 8,
                    fontSize: 13, cursor: "pointer", fontWeight: 600,
                  }}>
                    {name}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ background: "rgba(255,250,243,0.94)", border: "1px solid rgba(53,46,36,0.08)", borderRadius: 8, padding: 22, textAlign: "left" }}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", color: "#c95e1f", marginBottom: 10 }}>STARTING POINT</div>
              <div style={{ fontSize: 32, fontFamily: "Georgia, serif", lineHeight: 1.06, color: "#1f1a14", marginBottom: 10 }}>
                One cleaner path through city confusion.
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                {[
                  "Search the city you care about.",
                  "Open issues, wards, or elections depending on the job.",
                  "Use the desk as context before filing, comparing, or sharing.",
                ].map((item) => (
                  <div key={item} style={{ display: "grid", gridTemplateColumns: "10px 1fr", gap: 10, alignItems: "start" }}>
                    <span style={{ width: 10, height: 10, borderRadius: 999, background: "#E8660D", marginTop: 6 }} />
                    <span style={{ color: "#554b40", lineHeight: 1.65, fontSize: 14 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "rgba(20,25,35,0.9)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: 22, textAlign: "left" }}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", color: "#9fe0d5", marginBottom: 10 }}>LIVE PRIORITIES</div>
              <div style={{ display: "grid", gap: 10 }}>
                {tickerItems.slice(0, 4).map((item, index) => (
                  <div key={item} style={{ display: "grid", gridTemplateColumns: "34px 1fr", gap: 12, alignItems: "start", padding: "10px 0", borderTop: index === 0 ? "none" : "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.08)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 12 }}>
                      {index + 1}
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.78)", fontSize: 14, lineHeight: 1.6 }}>{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// â”€â”€â”€ Stats Banner â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function StatsBanner() {
  const criticalCount = cities.filter(c => c.stress === "Critical").length;
  const stats = [
    { value: `${DATASET_SCOPE.cityCount}`, label: "Cities In View" },
    { value: `${DATASET_SCOPE.issueProfileCount}`, label: "Issue Lanes Live" },
    { value: `${criticalCount}`, label: "High-Stakes Cities" },
    { value: `${DATASET_SCOPE.electionTrackerCount}`, label: "Election Desks Live" },
  ];
  return (
    <div className="stats-strip" style={{ background: "#181610", padding: "40px 32px", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "end", flexWrap: "wrap", marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", color: "#f0b993", marginBottom: 10 }}>AT A GLANCE</div>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontFamily: "Georgia, serif", color: "#fff", margin: 0, lineHeight: 1.05 }}>
              Coverage you can actually feel.
            </h2>
          </div>
          <p style={{ maxWidth: 460, margin: 0, color: "rgba(255,255,255,0.68)", lineHeight: 1.7, fontSize: 14 }}>
            The product now opens with a stronger sense of scope: how many city desks are live, how much civic reporting depth exists, and where the sharpest pressure sits.
          </p>
        </div>
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 18 }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "20px 18px" }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.54)", marginBottom: 10, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 800 }}>{s.label}</div>
              <div style={{ fontSize: 38, fontWeight: 900, color: "#fff", fontFamily: "Georgia, serif", letterSpacing: "-0.03em" }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ElectionsHub({ onCitySelect }) {
  const electionCities = cities
    .filter((city) => city.hasElections)
    .sort((left, right) => left.city.localeCompare(right.city));

  return (
    <section id="elections" className="page-section-tight" style={{ background: "#f2ede5", paddingTop: 64, paddingBottom: 64 }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18, alignItems: "end", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#E8660D", letterSpacing: "0.12em", marginBottom: 12 }}>
              MUNICIPAL ELECTION DESKS
            </div>
            <h2 className="section-title" style={{ fontSize: 40, fontFamily: "Georgia, serif", fontWeight: 700, color: "#1a1a1a", marginBottom: 12, lineHeight: 1.05 }}>
              Election coverage with less civic guesswork.
            </h2>
            <p style={{ fontSize: 15, color: "#5f5549", lineHeight: 1.75, maxWidth: 760, margin: 0 }}>
              These city desks pull the timeline, ward search, candidate status, and local verification tools into one place. The section should now feel more like a control room than a loose list of links.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", background: "#fff", border: "1px solid #d9cdbd", borderRadius: 8, padding: "8px 10px" }}>
              {electionCities.length} live election cities
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", background: "#fff7ef", border: "1px solid #f0d4b4", borderRadius: 8, padding: "8px 10px" }}>
              Gujarat polls: April 26, 2026
            </span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {electionCities.map((city) => (
            <button
              key={city.city}
              onClick={() => onCitySelect(city)}
              style={{
                textAlign: "left",
                background: "#fff",
                border: "1px solid #ddd1c3",
                borderRadius: 8,
                padding: "20px 18px",
                display: "grid",
                gap: 12,
                boxShadow: "0 16px 34px rgba(31,26,20,0.06)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "start" }}>
                <div>
                  <strong style={{ fontSize: 22, color: "#1a1a1a", fontFamily: "Georgia, serif", display: "block", marginBottom: 4 }}>{city.city}</strong>
                  <span style={{ fontSize: 13, color: "#7a746c" }}>{city.state}</span>
                </div>
                <span style={{ fontSize: 10, fontWeight: 800, color: "#E8660D", letterSpacing: "0.08em", background: "#fff4ea", borderRadius: 8, padding: "6px 8px" }}>OPEN</span>
              </div>
              <div style={{ fontSize: 14, color: "#5f5549", lineHeight: 1.65 }}>
                Open the election timeline, search a ward, and check how much of the candidate layer is verified.
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#5b554c", background: "#f6f1ea", borderRadius: 8, padding: "6px 8px" }}>
                  Election panel
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#5b554c", background: "#f6f1ea", borderRadius: 8, padding: "6px 8px" }}>
                  Ward lookup
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#5b554c", background: "#f6f1ea", borderRadius: 8, padding: "6px 8px" }}>
                  Candidate status
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function buildHotspotEntries(citySet, positions) {
  return citySet
    .map((city) => {
      const coverageScore =
        (city.hasElections ? 24 : 0) +
        (WARD_CORPORATORS[city.city] ? 18 : 0) +
        (CITY_ISSUES[city.city]?.length ? 16 : 0) +
        (CIVIC_ORGS[city.city]?.length ? 10 : 0);
      const populationScore = Math.min(42, Math.round(city.population / 250000));
      const stressScore = STRESS[city.stress]?.bar ? STRESS[city.stress].bar * 3 : 6;
      const activityScore = coverageScore + populationScore + stressScore;

      return {
        ...city,
        hotspot: positions[city.city],
        activityScore,
      };
    })
    .filter((city) => city.hotspot)
    .sort((left, right) => right.activityScore - left.activityScore);
}

function HotspotMapCard({ title, subtitle, entries, width, height, onCitySelect, background }) {
  const topScore = entries[0]?.activityScore || 1;

  return (
    <div style={{ background: "#fff", border: "1px solid #eadfce", borderRadius: 8, padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", flexWrap: "wrap", marginBottom: 16 }}>
        <div>
          <h3 style={{ fontSize: 22, fontFamily: "Georgia, serif", color: "#1a1a1a", marginBottom: 6 }}>{title}</h3>
          <p style={{ fontSize: 13, color: "#6e655a", lineHeight: 1.6, margin: 0 }}>{subtitle}</p>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#8b6f4e", background: "#fbf5ec", border: "1px solid #eadfce", borderRadius: 8, padding: "6px 10px" }}>
          Top {entries.length} cities
        </span>
      </div>

      <div className="hotspot-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(260px, 0.9fr)", gap: 18, alignItems: "start" }}>
        <div className="hotspot-map-shell" style={{ background, borderRadius: 8, border: "1px solid #ede2d4", padding: 12 }}>
          <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title} style={{ display: "block", width: "100%", height: "auto" }}>
            <rect x="0" y="0" width={width} height={height} rx="18" fill="#fffaf3" />
            <path d="M18 24C50 18 78 42 114 34C155 26 175 8 216 24C254 39 279 75 288 108C297 142 286 172 257 194C225 218 166 212 125 205C87 198 47 208 25 184C3 160 4 119 10 90C16 62 2 38 18 24Z" fill="rgba(232,102,13,0.08)" stroke="rgba(232,102,13,0.22)" strokeWidth="2" />
            {entries.map((city, index) => {
              const radius = 7 + Math.round((city.activityScore / topScore) * 14);
              const fill = index < 3 ? "rgba(232,102,13,0.78)" : "rgba(31,111,95,0.72)";
              const stroke = index < 3 ? "#a3470d" : "#165247";

              return (
                <g key={city.city}>
                  <circle cx={city.hotspot.x} cy={city.hotspot.y} r={radius} fill={fill} stroke={stroke} strokeWidth="2" />
                  <circle cx={city.hotspot.x} cy={city.hotspot.y} r="2.5" fill="#fff" />
                  <text x={city.hotspot.x + radius + 6} y={city.hotspot.y + 4} fontSize="10" fill="#4f4334" fontWeight="700">
                    {city.city}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="hotspot-list" style={{ display: "grid", gap: 10 }}>
          {entries.map((city, index) => (
            <button
              key={city.city}
              onClick={() => onCitySelect(city)}
              style={{
                display: "grid",
                gridTemplateColumns: "42px minmax(0, 1fr) auto",
                gap: 12,
                alignItems: "center",
                textAlign: "left",
                background: "#faf8f4",
                border: "1px solid #eadfce",
                borderRadius: 8,
                padding: "12px 14px",
              }}
            >
              <div style={{ width: 32, height: 32, borderRadius: 8, background: index < 3 ? "#E8660D" : "#1f6f5f", color: "#fff", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 800 }}>
                #{index + 1}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1f1a14", marginBottom: 2 }}>{city.city}</div>
                <div style={{ fontSize: 12, color: "#7b7165", lineHeight: 1.5 }}>{city.state}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#1f1a14" }}>{city.activityScore}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#8c7f71", letterSpacing: "0.06em" }}>SIGNAL</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CitizenHotspots({ onCitySelect }) {
  const topIndiaCities = buildHotspotEntries(
    cities.filter((city) => city.rank <= 10),
    INDIA_HOTSPOT_POSITIONS,
  );
  const topGujaratCities = buildHotspotEntries(
    [...cities]
      .filter((city) => city.state === "Gujarat")
      .sort((left, right) => right.population - left.population)
      .slice(0, 10),
    GUJARAT_HOTSPOT_POSITIONS,
  );

  return (
    <section className="page-section" style={{ background: "#fffaf6", borderTop: "1px solid #eee2d3", borderBottom: "1px solid #eee2d3" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ maxWidth: 760, marginBottom: 28 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#E8660D", letterSpacing: "0.1em", marginBottom: 10 }}>CITIZEN HOTSPOTS</div>
          <h2 className="section-title" style={{ fontSize: 36, fontFamily: "Georgia, serif", fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>
            Where citizens may need the clearest help next.
          </h2>
          <p style={{ fontSize: 16, color: "#666", lineHeight: 1.7, marginBottom: 10 }}>
            These lightweight maps surface the places where MyCityPulse currently has the strongest mix of coverage, civic pressure, and action-ready tools.
          </p>
          <p style={{ fontSize: 13, color: "#7b7165", lineHeight: 1.7, margin: 0 }}>
            This is a directional reading, not live citizen telemetry. It is here to help people explore where context is strongest today, not to pretend we can measure the whole country in real time.
          </p>
        </div>

        <div style={{ display: "grid", gap: 18 }}>
          <HotspotMapCard
            title="Top 10 Cities of India"
            subtitle="A national prototype hotspot view for the 10 highest-ranked Indian cities in this dataset."
            entries={topIndiaCities}
            width={300}
            height={220}
            background="#fff8ef"
            onCitySelect={onCitySelect}
          />
          <HotspotMapCard
            title="Top 10 Cities of Gujarat"
            subtitle="A Gujarat-focused hotspot view for the 10 largest Gujarat cities in this dataset."
            entries={topGujaratCities}
            width={260}
            height={220}
            background="#f7fbf8"
            onCitySelect={onCitySelect}
          />
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
      body: "Open your city and get your bearings fast: what people are dealing with, where the pressure sits, and what local civic context actually matters.",
    },
    {
      title: "See what is actually covered",
      body: `Coverage currently spans ${DATASET_SCOPE.cityCount} cities, but depth still varies. Some places already have issue briefs, ward panels, and election desks. Others are still growing, and that should stay visible.`,
    },
    {
      title: "Know what to trust",
      body: "MyCityPulse is not a government portal. It combines public facts, reported material, and editorial judgment so citizens can start somewhere sensible instead of starting from zero.",
    },
  ];

  return (
    <section className="page-section" style={{ paddingTop: 64, paddingBottom: 64, background: "#fffdf9", borderTop: "1px solid #ece1d3", borderBottom: "1px solid #ece1d3" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ maxWidth: 720, marginBottom: 28 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#E8660D", letterSpacing: "0.1em", marginBottom: 10 }}>START HERE</div>
          <h2 className="section-title" style={{ fontSize: 38, fontFamily: "Georgia, serif", fontWeight: 700, color: "#1a1a1a", marginBottom: 12, lineHeight: 1.05 }}>
            Built like a civic desk, not a brochure.
          </h2>
          <p style={{ fontSize: 16, color: "#666", lineHeight: 1.7 }}>
            MyCityPulse is meant to meet people where city life actually gets felt: on the street, near the park, around the overflowing corner, inside the confusion of not knowing who is responsible. The job is to help citizens orient fast and act without losing the plot.
          </p>
        </div>

        <div className="trust-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
          {cards.map((card) => (
            <div key={card.title} style={{ background: "#fff", borderRadius: 8, padding: 24, border: "1px solid #eadfce" }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", color: "#1f6f5f", marginBottom: 10 }}>PRINCIPLE</div>
              <h3 style={{ fontSize: 22, fontFamily: "Georgia, serif", fontWeight: 700, color: "#1a1a1a", marginBottom: 10, lineHeight: 1.15 }}>{card.title}</h3>
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
  const actionLabel = city.hasElections
    ? "Open city guide, wards, and elections"
    : WARD_CORPORATORS[city.city]
      ? "Open city guide and ward context"
      : "Open city guide";

  return (
    <div
      className="city-card"
      onClick={() => onSelect(city)}
      style={{
        position: "relative",
        height: 320,
        overflow: "hidden",
        borderRadius: 8,
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

      {/* Top-left: entry cue + typology */}
      <div style={{
        position: "absolute", top: 12, left: 12,
        display: "flex", gap: 6, alignItems: "center",
      }}>
        <div style={{
          background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 10,
          fontWeight: 800, padding: "3px 8px", borderRadius: 8, backdropFilter: "blur(6px)",
        }}>CITY GUIDE</div>
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
      <div className="city-card-copy">
        <div className="city-card-meta">
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.72)" }}>{city.state}</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.38)" }}>•</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.72)" }}>{fmt(city.population)} people</span>
        </div>
        <div style={{ fontSize: 28, fontFamily: "Georgia, serif", fontWeight: 700, color: "#fff", lineHeight: 1.02, letterSpacing: "-0.02em" }}>
          {city.city}
        </div>
        <p style={{
          fontSize: 13, color: "rgba(255,255,255,0.82)", lineHeight: 1.6, margin: "10px 0 0",
          display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {city.one_liner}
        </p>
        <div style={{ marginTop: 16, fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.92)", letterSpacing: "0.05em" }}>
          {actionLabel}
        </div>
      </div>

      {/* Compare toggle */}
      {onCompare && (
        <button
          className={`compare-btn${inCompare ? " selected" : ""}`}
          onClick={e => { e.stopPropagation(); onCompare(city); }}
          title={inCompare ? "Remove from comparison" : "Add to comparison"}
        >
          {inCompare ? "\u2713 Comparing" : "Compare"}
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
  const [showAllCities, setShowAllCities] = useState(false);

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
  const shouldLimitResults = !showAllCities && !q && tierFilter === "All" && stressFilter === "All";
  const visibleCities = shouldLimitResults ? filtered.slice(0, 12) : filtered;

  return (
      <section id="cities" className="page-section city-grid-section" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#E8660D", letterSpacing: "0.1em", marginBottom: 10 }}>EXPLORE</div>
            <h2 className="section-title" style={{ fontSize: 42, fontFamily: "Georgia, serif", fontWeight: 700, color: "#1a1a1a", marginBottom: 12, lineHeight: 1.05 }}>
              Open a city desk and get oriented fast.
            </h2>
            <p style={{ fontSize: 16, color: "#666", maxWidth: 500, lineHeight: 1.6 }}>
              Search, filter, and open city pages built to reduce civic fog. Some are deeper than others today, but each one should help a citizen get somewhere faster than a generic search result page.
            </p>
          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              "Start with the city you know",
              "Open wards where available",
              "Compare only when useful",
            ].map((item) => (
              <span
                key={item}
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#5f5549",
                  background: "#fffaf5",
                  border: "1px solid #e8ddd0",
                  borderRadius: 8,
                  padding: "7px 10px",
                }}
              >
                {item}
              </span>
            ))}
          </div>
            <div className="city-scope-card" style={{ marginTop: 16, background: "#fffaf5", borderRadius: 8, border: "1px solid #e8e5e0", padding: "18px 20px", maxWidth: 760 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9a6b3d", letterSpacing: "0.08em", marginBottom: 8 }}>CURRENT SCOPE</div>
            <p style={{ margin: 0, fontSize: 14, color: "#666", lineHeight: 1.7 }}>
              MyCityPulse currently covers {DATASET_SCOPE.cityCount} city profiles across {DATASET_SCOPE.stateCount} states / UTs.
              Today that includes issue briefs for {DATASET_SCOPE.issueProfileCount} cities, civic ecosystem directories for {DATASET_SCOPE.orgDirectoryCount},
              {` `}ward panels for {DATASET_SCOPE.wardPanelCount}, and election desks for {DATASET_SCOPE.electionTrackerCount}.
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
              marginTop: 16, background: "#fffaf5", borderRadius: 8,
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
        <div className="city-grid-toolbar">
          <div className="city-grid-toolbar-top">
            <span style={{ fontSize: 12, color: "#8f8478", fontWeight: 700 }}>
              {shouldLimitResults ? `${visibleCities.length} of ${filtered.length} cities shown` : `${filtered.length} cities ready to open`}
            </span>
          </div>
        <div className="city-grid-filters">
        <div className="city-filters">
          {/* Search */}
          <input
            value={q} onChange={e => setQ(e.target.value)}
            placeholder="Search by city or state"
            className="city-grid-search"
            style={{ minWidth: 160, flex: "1 1 220px" }}
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
        </div>
        </div>
        </div>

        {/* Grid */}
          <div className="city-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {visibleCities.map(c => (
            <CityCard
              key={c.city} city={c} onSelect={onCitySelect}
              onCompare={onCompare}
              inCompare={compareList?.some(x => x.city === c.city)}
            />
          ))}
        </div>
        {shouldLimitResults && filtered.length > visibleCities.length && (
          <div className="city-grid-more">
            <button
              type="button"
              className="city-grid-more-btn"
              onClick={() => setShowAllCities(true)}
            >
              Show all {filtered.length} cities
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// â”€â”€â”€ National Pulse â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function NationalPulse({ onCitySelect }) {
  return (
    <section id="pulse" className="page-section" style={{ background: "#fffaf7" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#E8660D", letterSpacing: "0.1em", marginBottom: 10 }}>NATIONAL PULSE</div>
          <h2 className="section-title" style={{ fontSize: 36, fontFamily: "Georgia, serif", fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>
            Patterns citizens keep running into across cities.
          </h2>
          <p style={{ fontSize: 16, color: "#666", maxWidth: 520, lineHeight: 1.6 }}>
            These are editorial civic threads that cut across city lines. They are here to help citizens recognise recurring patterns across places without pretending to be a live national trend feed.
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
    <section id="join" className="page-section join-band" style={{ paddingTop: 72, paddingBottom: 72, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#E8660D", letterSpacing: "0.12em", marginBottom: 16 }}>BECOME A COCREATOR</div>
        <h2 className="join-copy-title" style={{ fontSize: 38, fontFamily: "Georgia, serif", fontWeight: 700, color: "#fff", lineHeight: 1.25, marginBottom: 16, letterSpacing: "-0.02em" }}>
          Help keep this useful for the people living it.
        </h2>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.72)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 36px" }}>
          Join the people helping MyCityPulse stay grounded in what citizens actually see, feel, and need. You can simply get updates, or help verify what is changing on the ground.
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
                ? "We have your email, permissions, and contribution interests. You are now part of the group helping keep MyCityPulse useful, grounded, and honest."
                : "This browser does not have a live form endpoint configured yet. For a real reply today, email hello@mycitypulse.in and mention the city or civic work you want to help with."}
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
          <div className="join-card" style={{ maxWidth: 760, textAlign: "left" }}>
            <div className="join-field-grid">
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Your name"
                className="join-field"
              />
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Your city"
                className="join-field"
              />
            </div>

            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="join-field-wide"
            />

            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#E8660D", letterSpacing: "0.08em", marginBottom: 10 }}>
                HOW YOU’D LIKE TO HELP
              </div>
              <div className="join-chip-row">
                {[
                  ["cityResearch", "City research"],
                  ["issueVerification", "Issue verification"],
                  ["wardUpdates", "Ward and election updates"],
                  ["productFeedback", "Product feedback"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => toggleContribution(key)}
                    className={`join-toggle${contributions[key] ? " active" : ""}`}
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
                  No account creation. Just a way to stay reachable, with clear permissions.
                </span>
              </div>
            <p style={{ fontSize: 12, color: "#92887c", lineHeight: 1.6, margin: "14px 0 0" }}>
              Without a configured form endpoint, this saves locally in the browser and offers email fallback. Add `VITE_COCREATOR_ENDPOINT` to turn this into a live signup path.
            </p>
          </div>
        )}

          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.56)", marginTop: 16 }}>
            No spam. Just thoughtful updates, specific asks for help, and the permissions you chose.
          </p>
      </div>
    </section>
  );
}

// â”€â”€â”€ Footer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Footer() {
  const year = new Date().getFullYear();
  const [contactOpen, setContactOpen] = useState(false);
  return (
    <footer className="footer-band" style={{ padding: "28px clamp(16px, 4vw, 32px)", textAlign: "center", borderTop: "1px solid #e6dac9" }}>
      <div className="footer-copy">
        {"\u00A9"} {year} MyCityPulse {"\u00B7"} <span style={{ color: "#9a8f82" }}>mycitypulse.in</span>
        <span style={{ color: "#c0b4a7", margin: "0 8px" }}>{"\u00B7"}</span>
        Built from public sources, Wikimedia, and MyCityPulse editorial analysis, with coverage depth that still varies by city.
        <span style={{ color: "#c0b4a7", margin: "0 8px" }}>{"\u00B7"}</span>
        <button
          type="button"
          onClick={() => setContactOpen(true)}
          style={{ color: "#7f5a37", background: "none", border: "none", padding: 0, font: "inherit", cursor: "pointer", textDecoration: "underline" }}
        >
          Contact
        </button>
      </div>
      <ContactDialog
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        title="Get in touch"
        subject="Hello from MyCityPulse"
        source="footer-contact"
      />
    </footer>
  );
}

// â”€â”€â”€ Wards Panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function AreaPrototypeHome({ onCitySelect }) {
  const [selectedAreaName, setSelectedAreaName] = useState(AREA_PROTOTYPES[0].name);
  const [query, setQuery] = useState(AREA_PROTOTYPES[0].name);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [reactions, setReactions] = useState({
    clean: 18,
    dirty: 14,
    burning: 3,
    overflowing: 5,
  });
  const [whyOpen, setWhyOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const searchRef = useRef(null);

  const selectedArea = AREA_PROTOTYPES.find((area) => area.name === selectedAreaName) || AREA_PROTOTYPES[0];
  const areaCity = cities.find((city) => city.city === selectedArea.city);
  const filteredAreas = AREA_PROTOTYPES.filter((area) => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return true;
    }
    return area.name.toLowerCase().includes(q) || area.city.toLowerCase().includes(q);
  }).slice(0, 6);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setResultsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const selectArea = (area) => {
    setSelectedAreaName(area.name);
    setQuery(area.name);
    setResultsOpen(false);
  };

  const recordReaction = (key) => {
    setReactions((current) => ({ ...current, [key]: current[key] + 1 }));
  };

  const jumpToCompare = () => {
    const section = document.getElementById("area-compare");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const reactionButtons = [
    { key: "clean", label: "Clean", emoji: "👍" },
    { key: "dirty", label: "Dirty", emoji: "👎" },
    { key: "burning", label: "Burning", emoji: "🔥" },
    { key: "overflowing", label: "Overflowing", emoji: "🚫" },
  ];

  return (
    <>
      <section id="your-area" className="hero-shell" style={{ background: "#F8F3EA", minHeight: "auto", paddingTop: 96, paddingBottom: 40, justifyContent: "flex-start" }}>
        <img
          src={CITY_IMAGES.Ahmedabad || CITY_IMAGES.Surat || CITY_IMAGES.Delhi}
          alt="Street in an Indian city"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.16 }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(246,241,232,0.76) 0%, rgba(246,241,232,0.92) 52%, #F6F1E8 100%)" }} />
        <div className="hero-inner" style={{ width: "min(100%, 920px)" }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", color: "#C76122", marginBottom: 14 }}>
            START WITH YOUR AREA
          </div>
          <h1 className="hero-headline" style={{ fontSize: 42, fontFamily: "Georgia, serif", fontWeight: 700, color: "#1F1A14", lineHeight: 1.15, margin: "0 0 14px", maxWidth: 720 }}>
            Start with the place people are actually dealing with.
          </h1>
          <p style={{ maxWidth: 640, fontSize: 17, lineHeight: 1.65, color: "#5F5549", marginBottom: 28 }}>
            MyCityPulse begins with lived reality. Search your area, see the local signal, find its ward, and act before the civic maze starts sending you in circles.
          </p>

          <div ref={searchRef} style={{ position: "relative", marginBottom: 22, maxWidth: 620 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#7B6D5F", marginBottom: 8 }}>Search your area or city</div>
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setResultsOpen(true);
              }}
              onFocus={() => setResultsOpen(true)}
              placeholder="Search your area or city"
              style={{
                width: "100%",
                padding: "18px 18px",
                borderRadius: 8,
                border: "1.5px solid #DECDB9",
                background: "rgba(255,255,255,0.92)",
                fontSize: 16,
                color: "#1F1A14",
                outline: "none",
                boxShadow: "0 12px 36px rgba(98,81,57,0.08)",
              }}
            />
            {resultsOpen && filteredAreas.length > 0 && (
              <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, background: "#fff", border: "1px solid #E8DCCB", borderRadius: 8, overflow: "hidden", boxShadow: "0 16px 40px rgba(64,43,20,0.12)", zIndex: 20 }}>
                {filteredAreas.map((area) => (
                  <button
                    key={area.name}
                    onClick={() => selectArea(area)}
                    style={{ width: "100%", border: "none", borderBottom: "1px solid #F2E9DE", background: area.name === selectedArea.name ? "#FBF5EE" : "#fff", padding: "14px 16px", textAlign: "left", display: "flex", justifyContent: "space-between", gap: 16 }}
                  >
                    <span style={{ color: "#1F1A14", fontWeight: 700 }}>{area.name} <span style={{ color: "#8D8378", fontWeight: 500 }}>{area.city}</span></span>
                    <span style={{ color: area.statusTone.color, fontSize: 13, fontWeight: 700 }}>{area.statusTone.emoji} {area.status}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ background: "rgba(255,255,255,0.88)", borderRadius: 8, border: "1px solid #E9DDCF", padding: "22px", boxShadow: "0 10px 28px rgba(82,61,37,0.08)", textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", flexWrap: "wrap", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 13, color: "#7B6D5F", marginBottom: 8 }}>Your Area</div>
                <div style={{ fontSize: 34, fontFamily: "Georgia, serif", color: "#1F1A14", lineHeight: 1.1 }}>{selectedArea.name}</div>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 8, background: selectedArea.statusTone.bg, color: selectedArea.statusTone.color, fontWeight: 800 }}>
                <span>{selectedArea.statusTone.emoji}</span>
                <span>{selectedArea.status}</span>
              </div>
            </div>

            <div style={{ fontSize: 14, color: "#5F5549", lineHeight: 1.7, marginBottom: 18 }}>
              {selectedArea.summary}
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#1F1A14", marginBottom: 8 }}>Why</div>
              <div style={{ display: "grid", gap: 8 }}>
                {selectedArea.why.map((item) => (
                  <div key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start", color: "#4F4334", fontSize: 15 }}>
                    <span style={{ color: "#C76122" }}>•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ fontSize: 13, color: "#7B6D5F", marginBottom: 10 }}>What does this area feel like right now?</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, marginBottom: 16 }}>
              {reactionButtons.map((item) => (
                <button
                  key={item.key}
                  onClick={() => recordReaction(item.key)}
                  style={{ border: "1px solid #E3D6C7", background: "#fff", borderRadius: 8, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#1F1A14", fontSize: 14, fontWeight: 700 }}
                >
                  <span>{item.emoji} {item.label}</span>
                  <span style={{ color: "#8D8378", fontSize: 13 }}>{reactions[item.key]}</span>
                </button>
              ))}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
              <button onClick={jumpToCompare} style={{ border: "none", background: "#E8660D", color: "#fff", borderRadius: 8, padding: "12px 16px", fontSize: 14, fontWeight: 700 }}>
                Compare nearby areas →
              </button>
              {areaCity && (
                <button onClick={() => onCitySelect(areaCity)} style={{ border: "1px solid #D7C9BA", background: "#fff", color: "#5F5549", borderRadius: 8, padding: "12px 16px", fontSize: 14, fontWeight: 700 }}>
                  Open {selectedArea.city} city page
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="page-section" style={{ background: "#FFFDF9", paddingTop: 28, paddingBottom: 28 }}>
        <div style={{ maxWidth: 920, margin: "0 auto", display: "grid", gap: 18 }}>
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #ECDFCF", padding: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", color: "#C76122", marginBottom: 10 }}>PEOPLE NEARBY TODAY</div>
              <div style={{ display: "grid", gap: 10, marginBottom: 18 }}>
                {selectedArea.peopleToday.map((item) => (
                  <div key={item} style={{ fontSize: 16, color: "#1F1A14" }}>• {item}</div>
                ))}
              </div>
              <button style={{ border: "1px dashed #D9C8B5", background: "#fff", color: "#6F6255", borderRadius: 8, padding: "12px 14px", fontSize: 14, fontWeight: 700 }}>
                + Add a photo later
              </button>
            </div>

            <div style={{ background: "#FFF7ED", borderRadius: 8, border: "1px solid #E6D9C8", padding: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", color: "#7B6D5F", marginBottom: 10 }}>ONE-LINE READ</div>
              <div style={{ fontSize: 18, fontFamily: "Georgia, serif", color: "#1F1A14", lineHeight: 1.5 }}>
                {selectedArea.summary}
              </div>
            </div>
          </div>

          <div id="area-compare" style={{ background: "#fff", borderRadius: 8, border: "1px solid #ECDFCF", padding: 20 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", color: "#C76122", marginBottom: 8 }}>NEARBY AREAS</div>
              <div style={{ fontSize: 28, fontFamily: "Georgia, serif", color: "#1F1A14" }}>See your area in local context.</div>
            </div>
            <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              {selectedArea.nearby.slice(0, 2).map((area) => (
                <div key={area.name} style={{ background: "#fff", borderRadius: 8, border: "1px solid #E7DCCD", padding: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontSize: 22, fontFamily: "Georgia, serif", color: "#1F1A14" }}>{area.name}</div>
                    <div style={{ color: area.color, fontWeight: 800 }}>{area.emoji} {area.status}</div>
                  </div>
                  <div style={{ fontSize: 14, color: "#5F5549", lineHeight: 1.65 }}>{area.note}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ background: "#FFF9F3", borderRadius: 8, border: "1px solid #E8DED0", padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", color: "#C76122", marginBottom: 8 }}>WHY?</div>
                  <div style={{ fontSize: 24, fontFamily: "Georgia, serif", color: "#1F1A14" }}>Why this area feels like this</div>
                </div>
                <button onClick={() => setWhyOpen((open) => !open)} style={{ border: "1px solid #D8CABA", background: "#fff", borderRadius: 8, padding: "10px 14px", fontWeight: 700, color: "#5F5549" }}>
                  {whyOpen ? "Hide" : "Open"}
                </button>
              </div>
              {whyOpen && (
                <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
                  {selectedArea.deeperWhy.map((item) => (
                    <div key={item} style={{ fontSize: 15, color: "#4F4334", lineHeight: 1.7 }}>• {item}</div>
                  ))}
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
                    <button style={{ border: "none", background: "#1F1A14", color: "#fff", borderRadius: 8, padding: "10px 14px", fontWeight: 700 }}>See local trends →</button>
                    {areaCity && (
                      <button onClick={() => onCitySelect(areaCity)} style={{ border: "1px solid #D8CABA", background: "#fff", color: "#5F5549", borderRadius: 8, padding: "10px 14px", fontWeight: 700 }}>
                        Go deeper →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #E8DED0", padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", color: "#7B6D5F", marginBottom: 8 }}>EXPLORE MORE</div>
                  <div style={{ fontSize: 24, fontFamily: "Georgia, serif", color: "#1F1A14" }}>Go deeper when you need more context</div>
                </div>
                <button onClick={() => setExploreOpen((open) => !open)} style={{ border: "1px solid #D8CABA", background: "#FAF8F4", borderRadius: 8, padding: "10px 14px", fontWeight: 700, color: "#5F5549" }}>
                  {exploreOpen ? "Hide" : "Open"}
                </button>
              </div>
              {exploreOpen && (
                <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
                  {selectedArea.exploreMore.map((item) => (
                    <div key={item} style={{ fontSize: 15, color: "#4F4334", lineHeight: 1.7 }}>• {item}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function GujaratElectionLanding() {
  const [summaries, setSummaries] = useState({});

  useEffect(() => {
    let cancelled = false;

    Promise.all(
      GUJARAT_ELECTION_CITY_OBJECTS
        .filter((city) => CURRENT_GUJARAT_MUNICIPAL_ELECTION_CITIES_2026.has(city.city))
        .map(async (city) => {
        try {
          const election = await loadElectionData(city.city);
          return [city.city, buildElectionCoverageSummary(election)];
        } catch {
          return [city.city, null];
        }
      }),
    ).then((entries) => {
      if (!cancelled) {
        setSummaries(Object.fromEntries(entries));
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const loadedSummaries = Object.values(summaries).filter(Boolean);
  const aggregate = loadedSummaries.reduce(
    (totals, summary) => ({
      totalWards: totals.totalWards + summary.totalWards,
      listedWards: totals.listedWards + summary.listedWards,
      trackedWards: totals.trackedWards + summary.trackedWards,
      namedWards: totals.namedWards + summary.namedWards,
      namedCandidates: totals.namedCandidates + summary.namedCandidates,
    }),
    { totalWards: 0, listedWards: 0, trackedWards: 0, namedWards: 0, namedCandidates: 0 },
  );

  return (
    <section
      id="elections"
      className="gujarat-election-section"
      style={{
        background: "#f5efe6",
        borderBottom: "1px solid #e8ddd0",
        padding: "36px 24px 28px",
      }}
    >
      <div className="gujarat-election-shell" style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gap: 24 }}>
        <div
          className="gujarat-election-hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.15fr) minmax(280px, 0.85fr)",
            gap: 18,
            alignItems: "stretch",
          }}
        >
          <div className="gujarat-election-copy-card" style={{ background: "#fff", border: "1px solid #eadfce", borderRadius: 8, padding: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#c76122", letterSpacing: "0.12em", marginBottom: 12 }}>
              GUJARAT MUNICIPAL ELECTIONS 2026
            </div>
            <h1 className="gujarat-election-title" style={{ fontSize: 40, lineHeight: 1.05, margin: "0 0 12px", color: "#1a1a1a", fontFamily: "Georgia, serif" }}>
              Find your city. Open your ward. See the candidate list.
            </h1>
            <p className="gujarat-election-body" style={{ margin: "0 0 18px", fontSize: 15, color: "#60584d", lineHeight: 1.7, maxWidth: 700 }}>
              Built for citizens across the 15 Gujarat municipal corporations going to polls on April 26, 2026. Party-announced names stay marked as probable until MyCityPulse can independently verify the final ward-wise candidate list.
            </p>
            <div className="gujarat-election-metrics" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginBottom: 18 }}>
              <div style={{ background: "#fff8ef", border: "1px solid #f1d5b6", borderRadius: 8, padding: 14 }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#c76122", fontFamily: "Georgia, serif" }}>
                  {GUJARAT_ELECTION_CITY_OBJECTS.length}
                </div>
                <div style={{ fontSize: 12, color: "#675e53", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Gujarat city desks
                </div>
              </div>
              <div style={{ background: "#fff8ef", border: "1px solid #f1d5b6", borderRadius: 8, padding: 14 }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#c76122", fontFamily: "Georgia, serif" }}>
                  {formatElectionMetricValue(aggregate.namedCandidates, "Pending")}
                </div>
                <div style={{ fontSize: 12, color: "#675e53", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  verified names shown
                </div>
              </div>
              <div style={{ background: "#fff8ef", border: "1px solid #f1d5b6", borderRadius: 8, padding: 14 }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#c76122", fontFamily: "Georgia, serif" }}>
                  {LIVE_GUJARAT_WARD_EXPECTATIONS_2026
                    ? Object.keys(LIVE_GUJARAT_WARD_EXPECTATIONS_2026).reduce(
                        (sum, city) => sum + LIVE_GUJARAT_WARD_EXPECTATIONS_2026[city].seats,
                        0,
                      )
                    : 0}
                </div>
                <div style={{ fontSize: 12, color: "#675e53", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Total Seats
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>
    );
  }

// ─── Home composition & root App ────────────────────────────────────────────
// NOTE: This App() was reconstructed after a prior session truncated App.jsx
// mid-file. It wires URL routing (parseUrl / updateUrlForCity / popstate) so
// shareable links like /ahmedabad/elections/ward/12 work for citizens on
// WhatsApp.
function HomeAccordionSection({ eyebrow, title, description, defaultOpen = false, children }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className={`home-accordion${isOpen ? " open" : ""}`}>
      <button
        type="button"
        className="home-accordion-toggle"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
      >
        <div className="home-accordion-copy">
          <span>{eyebrow}</span>
          <strong>{title}</strong>
          <small>{description}</small>
        </div>
        <span className="home-accordion-icon">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && <div className="home-accordion-body">{children}</div>}
    </section>
  );
}

function HomePage({ onCitySelect, onCompareToggle, compareList }) {
  return (
    <>
      <Hero onCitySelect={onCitySelect} />
      <StatsBanner />
      <ElectionsHub onCitySelect={onCitySelect} />
      <CityGrid
        onCitySelect={onCitySelect}
        onCompare={onCompareToggle}
        compareList={compareList}
      />
      <div className="home-accordion-shell">
        <HomeAccordionSection
          eyebrow="How It Works"
          title="See how to use MyCityPulse in under a minute"
          description="Open this when you want the quick orientation instead of keeping it permanently on the page."
        >
          <HowItWorks />
        </HomeAccordionSection>
        <HomeAccordionSection
          eyebrow="National Pulse"
          title="Browse patterns across cities"
          description="Open this when you want context beyond one city."
        >
          <NationalPulse onCitySelect={onCitySelect} />
        </HomeAccordionSection>
        <HomeAccordionSection
          eyebrow="Trust"
          title="See what kind of source this is"
          description="Open this when you want to understand coverage limits and how the data is framed."
        >
          <TrustSection />
        </HomeAccordionSection>
        <HomeAccordionSection
          eyebrow="Your Area"
          title="Open neighborhood and area-level civic threads"
          description="Open this when you want local signals without stretching the whole homepage."
        >
          <CitizenHotspots onCitySelect={onCitySelect} />
        </HomeAccordionSection>
      </div>
      <JoinCTA />
      <Footer />
    </>
  );
}

export default function App() {
  const initialRoute = typeof window !== "undefined" ? parseUrl() : { citySlug: null, panel: null, wardNumber: null, compareMode: false, storySlug: null, storyPage: 0 };
  const initialCity = initialRoute.citySlug
    ? findCityByUrlSlug(initialRoute.citySlug, cities)
    : null;

  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [requestedPanel, setRequestedPanel] = useState(initialRoute.panel);
  const [requestedWard, setRequestedWard] = useState(initialRoute.wardNumber);
  const [compareMode, setCompareMode] = useState(initialRoute.compareMode);
  const [storySlug, setStorySlug] = useState(initialRoute.storySlug || null);
  const [compareList, setCompareList] = useState([]);

  useLayoutEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const { history } = window;
    const previousScrollRestoration = history.scrollRestoration;

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);

    return () => {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = previousScrollRestoration || "auto";
      }
    };
  }, []);

  // Browser back/forward support — re-parse the URL and sync state.
  useEffect(() => {
    const handlePopState = () => {
      const route = parseUrl();
      if (route.storySlug) {
        setStorySlug(route.storySlug);
        setSelectedCity(null);
        setCompareMode(false);
        return;
      }
      setStorySlug(null);
      if (route.compareMode) {
        setCompareMode(true);
        setSelectedCity(null);
        setRequestedPanel(null);
        setRequestedWard(null);
        return;
      }
      setCompareMode(false);
      if (route.citySlug) {
        const city = findCityByUrlSlug(route.citySlug, cities);
        setSelectedCity(city || null);
        setRequestedPanel(route.panel);
        setRequestedWard(route.wardNumber);
      } else {
        setSelectedCity(null);
        setRequestedPanel(null);
        setRequestedWard(null);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleCitySelect = (city) => {
    if (!city) return;
    setCompareMode(false);
    setSelectedCity(city);
    setRequestedPanel(null);
    setRequestedWard(null);
    updateUrlForCity(city);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleBack = () => {
    setSelectedCity(null);
    setRequestedPanel(null);
    setRequestedWard(null);
    setCompareMode(false);
    updateUrlToHome();
  };

  const handlePanelChange = (panel) => {
    setRequestedPanel(panel);
    if (selectedCity) updateUrlForCity(selectedCity, panel);
  };

  const handlePanelHandled = () => {
    // Panel/ward intent has been consumed by CityPage — clear it so repeat
    // clicks do not keep retriggering the same effect.
    setRequestedPanel(null);
    setRequestedWard(null);
  };

  const handleCompareOpen = () => {
    setCompareMode(true);
    setSelectedCity(null);
    updateUrlForCompare();
  };

  const handleCompareToggle = (city) => {
    setCompareList((prev) => {
      const exists = prev.some((c) => c.city === city.city);
      if (exists) return prev.filter((c) => c.city !== city.city);
      if (prev.length >= 3) return prev; // cap at 3
      return [...prev, city];
    });
  };

  const handleCompareRemove = (city) => {
    setCompareList((prev) => prev.filter((c) => c.city !== city.city));
  };

  const handleCompareClear = () => setCompareList([]);

  const handleOpenElections = () => {
    if (typeof document === "undefined") return;
    const target = document.getElementById("elections");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleOpenAllCities = () => {
    if (typeof document === "undefined") return;
    const target = document.getElementById("all-cities") || document.querySelector(".city-grid-section");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleOpenIssues = () => {
    if (typeof document === "undefined") return;
    const target = document.getElementById("your-area") || document.querySelector(".citizen-hotspots");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const showCompare = compareMode && !selectedCity;
  const showCity = !!selectedCity && !compareMode;

  if (storySlug) {
    return (
      <Suspense fallback={<div style={{ background: "#0d0d0d", height: "100vh" }} />}>
        <StoryViewer
          slug={storySlug}
          onHome={() => { setStorySlug(null); updateUrlToHome(); }}
        />
      </Suspense>
    );
  }

  return (
    <>
      <GlobalStyles />
      <Nav
        onLogoClick={handleBack}
        onSearch={handleCitySelect}
        onOpenElections={handleOpenElections}
        onOpenAllCities={handleOpenAllCities}
        onOpenIssues={handleOpenIssues}
      />
      <div style={{ paddingTop: 58 }}>
        <Suspense
          fallback={
            <div style={{ padding: "80px 24px", textAlign: "center", color: "#666" }}>
              Loading...
            </div>
          }
        >
          {showCity && (
            <CityPage
              city={selectedCity}
              onBack={handleBack}
              requestedPanel={requestedPanel}
              requestedWard={requestedWard}
              onPanelHandled={handlePanelHandled}
              onPanelChange={handlePanelChange}
            />
          )}
          {showCompare && (
            <CompareView
              allCities={cities}
              cities={compareList}
              onBack={handleBack}
              onCitySelect={handleCitySelect}
              onRemove={handleCompareRemove}
              onAdd={handleCompareToggle}
            />
          )}
          {!showCity && !showCompare && (
            <HomePage
              onCitySelect={handleCitySelect}
              onCompareToggle={handleCompareToggle}
              compareList={compareList}
            />
          )}
        </Suspense>
      </div>
      {!showCompare && compareList.length > 0 && (
        <CompareTray
          cities={compareList}
          onCompare={handleCompareOpen}
          onRemove={handleCompareRemove}
          onClear={handleCompareClear}
        />
      )}
    </>
  );
}
