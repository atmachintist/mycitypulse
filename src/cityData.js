// ─── Live Issues ──────────────────────────────────────────────────────────────
// Written citizen-first — like a friend explaining what's really going on.
// 3 issues per city, seeded for major cities. More cities added as network grows.

export const CITY_ISSUES = {

  "Bengaluru": [
    {
      category: "Traffic",
      categoryColor: "#f4a261",
      title: "The traffic isn't getting better. Here's why.",
      body: "Bengaluru crossed 1 crore registered vehicles in 2023 — and adds roughly 1,000 more every single day. Meanwhile, public transit covers less than 15% of daily trips. The metro is expanding, but nowhere near fast enough. Commuters in parts of the city spend 2-3 hours a day just getting to work. This is what happens when a city grows faster than its infrastructure.",
      severity: "Critical",
      tag: "🚦 Traffic",
      whatsBeing: "Metro Phase 3 is underway. A suburban rail network has been proposed for years but remains stuck in planning.",
    },
    {
      category: "Water",
      categoryColor: "#0096c7",
      title: "The lakes are gone. The borewells are running dry. And 15 lakh people get Cauvery water for only a few hours a day.",
      body: "Bengaluru once had over 1,000 lakes. Today, fewer than 200 survive — the rest buried under apartments, roads, and tech parks. The city now depends on Cauvery water piped 100km from a reservoir, but it only reaches most homes for 1-2 hours a day. When that's not enough, people drill borewells — which are also drying up. In 2023, parts of the city genuinely came close to running out of water.",
      severity: "High",
      tag: "💧 Water",
      whatsBeing: "BWSSB is expanding the Cauvery water project. Lake restoration efforts are ongoing but underfunded.",
    },
    {
      category: "Governance",
      categoryColor: "#9b5de5",
      title: "Nobody is clearly in charge of Bengaluru. That's not an accident.",
      body: "BBMP runs the city. But there's also BDA for planning, BWSSB for water, BMRCL for metro, BMTC for buses, and the state government sitting above all of them. When your road floods, who do you call? Nobody agrees. This fragmentation isn't just confusing — it means nobody is fully accountable for anything, and it's been this way for decades.",
      severity: "High",
      tag: "🏛️ Governance",
      whatsBeing: "BBMP restructuring has been discussed for years. Ward committees have been partially revived but remain weak.",
    },
  ],

  "Mumbai": [
    {
      category: "Housing",
      categoryColor: "#e63946",
      title: "Half the city lives in homes that officially don't exist.",
      body: "Around 42% of Mumbai's population lives in informal settlements — slums, chawls, and structures that have no legal status. Dharavi alone houses over 6 lakh people in one square kilometre. These aren't people on the margins. They're the people who cook your food, drive your cabs, and build your buildings. Their homes have no property rights, no guaranteed water supply, no sanitation security.",
      severity: "Critical",
      tag: "🏘️ Housing",
      whatsBeing: "The Dharavi Redevelopment Project is underway, led by Adani Group. Residents and activists are divided on whether it will actually help those who live there.",
    },
    {
      category: "Flooding",
      categoryColor: "#00b4d8",
      title: "Every monsoon, Mumbai drowns. And every year, we're surprised.",
      body: "Mumbai gets 2,400mm of rain a year — most of it in three months. The city was built on reclaimed wetlands and mangroves that used to absorb this water. Those are largely gone. The stormwater drains were designed in colonial times for a fraction of today's population. The result: flooded trains, flooded roads, flooded homes. Every year. Like clockwork.",
      severity: "High",
      tag: "🌊 Flooding",
      whatsBeing: "The BMC has been upgrading drains under the Brihanmumbai Stormwater Disposal System (BRIMSTOWAD) for over 20 years. Progress is slow.",
    },
    {
      category: "Air",
      categoryColor: "#9b5de5",
      title: "Mumbai's air quality problem is real — and getting worse.",
      body: "Mumbai used to be considered cleaner than Delhi. That's changing. Construction dust, vehicle emissions, and industrial activity in the northern suburbs have pushed AQI into unhealthy ranges for weeks at a time each winter. The city's coastal breeze used to save it. Rapid densification on the eastern waterfront is reducing that natural ventilation.",
      severity: "Elevated",
      tag: "🌫️ Air Quality",
      whatsBeing: "BMC has an air quality action plan. Implementation remains patchy.",
    },
  ],

  "Delhi": [
    {
      category: "Air",
      categoryColor: "#9b5de5",
      title: "Delhi's air is a public health emergency that we've normalised.",
      body: "Every winter, Delhi's AQI crosses 400 — a level classified as 'hazardous'. Children are told to stay indoors. Schools shut. People wear masks just to walk outside. This isn't new. Delhi has been among the world's most polluted cities for over a decade. Vehicles, construction dust, stubble burning from neighbouring states, and industrial emissions all contribute. The city is slowly being poisoned — and it's been happening slowly enough that most people have stopped noticing.",
      severity: "Critical",
      tag: "🌫️ Air Quality",
      whatsBeing: "The Graded Response Action Plan (GRAP) kicks in during winter. Odd-even vehicle rationing has been tried. The problem persists.",
    },
    {
      category: "Water",
      categoryColor: "#0096c7",
      title: "The Yamuna runs through Delhi. Almost none of it is drinkable.",
      body: "The Yamuna enters Delhi clean from Haryana. By the time it leaves, it carries the untreated sewage of 2 crore people. Delhi treats less than 60% of the sewage it generates — the rest goes directly into the river. Ironically, Delhi also depends on the Yamuna for its drinking water. The treatment plants work overtime. In summer, when the river runs low and the sewage doesn't, the water crisis becomes acute.",
      severity: "Critical",
      tag: "💧 Water",
      whatsBeing: "The Yamuna Action Plan has been running since 1993. The river is still severely polluted. The Supreme Court has intervened multiple times.",
    },
    {
      category: "Governance",
      categoryColor: "#e63946",
      title: "Delhi has three governments. None of them agrees on who runs the city.",
      body: "The Delhi government handles most services. The Lieutenant Governor — appointed by the Centre — has overriding powers. The MCD (municipal corporation) handles local services. All three have different political parties. The result is a city where blame is infinitely transferable and accountability is essentially zero. Residents often don't know who to approach for basic problems, let alone hold anyone accountable.",
      severity: "High",
      tag: "🏛️ Governance",
      whatsBeing: "The three MCDs were merged into one in 2022. Governance tensions between the Centre and state government continue.",
    },
  ],

  "Chennai": [
    {
      category: "Water",
      categoryColor: "#0096c7",
      title: "Chennai almost ran out of water in 2019. The risk hasn't gone away.",
      body: "In June 2019, Chennai's four major reservoirs were nearly empty. Tankers queued for kilometres. Offices and hotels shut down. It was one of the worst urban water crises in India's history. The city recovered — but the underlying problem hasn't been fixed. Chennai sits in a low-rainfall zone, depends heavily on monsoons that are increasingly erratic, and has not built enough water storage or recycling infrastructure to be resilient.",
      severity: "High",
      tag: "💧 Water",
      whatsBeing: "The Chennai Metro Water Board is expanding desalination capacity. Rainwater harvesting is now mandatory for buildings. Both help, but not enough.",
    },
    {
      category: "Flooding",
      categoryColor: "#00b4d8",
      title: "The same city that ran dry in 2019 flooded in 2021. This is not a paradox.",
      body: "Chennai's water problem isn't just scarcity — it's the inability to capture and store rainfall when it does come. The 2015 floods killed hundreds and caused ₹15,000 crore in damage. The city is built on flood plains and wetlands that have been systematically encroached. When it rains hard, there's nowhere for the water to go. Chennai alternates between drought and deluge because it has destroyed the systems that once managed both.",
      severity: "High",
      tag: "🌊 Flooding",
      whatsBeing: "The Greater Chennai Corporation has a flood mitigation plan. Wetland restoration is underway in some areas.",
    },
    {
      category: "Air",
      categoryColor: "#9b5de5",
      title: "North Chennai breathes different air than South Chennai.",
      body: "The industrial belt in northern Chennai — refineries, thermal plants, chemical factories — has created a stark divide. Residents in Manali and Ennore deal with air quality that regularly crosses safe limits. South Chennai, home to IT parks and residential colonies, has comparatively cleaner air. The people who live in the polluted zones are mostly lower-income families with limited political voice. This isn't just an environmental problem — it's an equity problem.",
      severity: "Elevated",
      tag: "🌫️ Air Quality",
      whatsBeing: "TNPCB monitors industrial emissions. Enforcement is inconsistent.",
    },
  ],

  "Hyderabad": [
    {
      category: "Water",
      categoryColor: "#0096c7",
      title: "Hyderabad had 3,000 lakes. It now has fewer than 500.",
      body: "Lakes were Hyderabad's water security. They recharged groundwater, prevented flooding, and gave the city its character. Over five decades of rapid growth, most were encroached — filled in by builders, roads, and government projects. The lakes that remain are increasingly polluted by sewage and industrial effluent. The city that was once called the 'City of Pearls' is quietly destroying its own water future.",
      severity: "High",
      tag: "💧 Water",
      whatsBeing: "HMDA has a lake protection cell. Some lakes have been restored. The pace of encroachment continues to outstrip restoration.",
    },
    {
      category: "Traffic",
      categoryColor: "#f4a261",
      title: "Hyderabad's tech boom brought 50 lakh new vehicles in a decade.",
      body: "The city's IT corridor — from Hitech City to Gachibowli to Kondapur — has become one of India's most congested stretches. The growth was planned for office space, not for the people who would fill it. Public transit is inadequate, cycling infrastructure barely exists, and the road network was designed for a city half this size. Peak hour commutes that should take 20 minutes routinely take 90.",
      severity: "High",
      tag: "🚦 Traffic",
      whatsBeing: "Hyderabad Metro is expanding. The Outer Ring Road was meant to reduce inner city congestion — it has instead accelerated sprawl.",
    },
    {
      category: "Governance",
      categoryColor: "#d4ac0d",
      title: "Hyderabad is two cities governed as one. Sort of.",
      body: "Hyderabad and Secunderabad were historically separate — Hyderabad under the Nizam, Secunderabad a British cantonment. Today they're merged administratively, but the cantonment areas still operate under a separate authority (Secunderabad Cantonment Board) that is notoriously difficult for residents to access or influence. GHMC handles most of the city, but its ward system is underfunded and councillors have limited actual power.",
      severity: "Elevated",
      tag: "🏛️ Governance",
      whatsBeing: "GHMC has decentralised some functions to ward level. Cantonment reform remains a national-level issue.",
    },
  ],

  "Pune": [
    {
      category: "Traffic",
      categoryColor: "#f4a261",
      title: "Pune is one of India's most two-wheeler-dependent cities. That's a problem.",
      body: "Over 60% of Pune's vehicles are two-wheelers. This sounds efficient — but it means public transit has never been taken seriously, cycling infrastructure barely exists, and pedestrians are an afterthought. The city has been promising a metro for two decades. It now exists, but serves a fraction of the routes people actually use. Congestion on key corridors — Katraj-Hadapsar, Kothrud-Shivajinagar — has become chronic.",
      severity: "High",
      tag: "🚦 Traffic",
      whatsBeing: "Pune Metro Phase 1 is operational. Phase 2 is under construction. PMC is expanding bus services but faces fleet shortages.",
    },
    {
      category: "Water",
      categoryColor: "#0096c7",
      title: "Pune's water comes from dams that were built for a city half its size.",
      body: "Pune's water supply depends on four dams — Khadakwasla, Panshet, Warasgaon, and Temghar. They were designed for a population of around 20 lakh. Pune now has over 70 lakh people in its metro area. In good monsoon years, there's enough. In drought years — like 2018-19 — the city cuts supply sharply. New constructions keep getting approved. The dam capacity hasn't changed.",
      severity: "Elevated",
      tag: "💧 Water",
      whatsBeing: "PMC is working on a river-based water supply expansion. Recycled water use for non-drinking purposes is being promoted.",
    },
    {
      category: "Governance",
      categoryColor: "#9b5de5",
      title: "Pune is surrounded by a dozen satellite towns that nobody governs together.",
      body: "Pimpri-Chinchwad, Pune Cantonment, Khadki Cantonment, Dehu Road Cantonment, and numerous gram panchayats sit adjacent to PCMC and PMC — each with its own authority, its own rules, and its own budget. Developers love this patchwork because different jurisdictions have different building rules. Residents hate it because nobody is responsible for the whole. The metro area is governed in fragments.",
      severity: "Elevated",
      tag: "🏛️ Governance",
      whatsBeing: "A Pune Metropolitan Region Development Authority (PMRDA) exists but has limited enforcement power.",
    },
  ],

  "Indore": [
    {
      category: "Governance",
      categoryColor: "#2dc653",
      title: "Indore has been India's cleanest city 7 years in a row. Here's the actual reason.",
      body: "It isn't magic. Indore's success with Swachh Survekshan comes down to three things: a municipal commissioner who took it seriously, a door-to-door waste collection system that actually runs every day, and sustained community engagement that outlasted the initial political push. The city has 650+ garbage collection vehicles and processes 1,100 tonnes of waste daily. Most other cities of similar size process less than half that. The lesson isn't the ranking — it's the consistency.",
      severity: "Moderate",
      tag: "🏛️ Governance",
      whatsBeing: "IMC continues to refine its waste management. It now runs composting plants, a biogas facility, and material recovery centres.",
    },
    {
      category: "Water",
      categoryColor: "#0096c7",
      title: "Indore's water system works — but it depends on a single source that is under stress.",
      body: "Indore gets most of its water from the Narmada — piped over 70km. The Narmada Water Supply Project was a major infrastructure win, but it has made the city almost entirely dependent on one external source. As the city grows, per-capita availability is declining. Groundwater in the city is increasingly polluted from older areas with inadequate sewage. The next 10 years will test whether Indore's civic competence extends to water.",
      severity: "Elevated",
      tag: "💧 Water",
      whatsBeing: "IMC is expanding the Narmada pipeline capacity. Groundwater quality monitoring has improved.",
    },
    {
      category: "Traffic",
      categoryColor: "#f4a261",
      title: "Indore is clean. It is not walkable or transit-friendly.",
      body: "The city that leads on cleanliness lags on sustainable mobility. Indore's public bus system (AICTSL) is one of the better-run systems in a mid-sized Indian city, but it doesn't serve the growing periphery. The city is rapidly expanding westward into areas with no meaningful public transit. Like most Indian cities, Indore risks locking in car-dependence before it has the density to make transit work.",
      severity: "Moderate",
      tag: "🚦 Traffic",
      whatsBeing: "AICTSL operates iBus, one of India's better city bus systems. Route expansion is ongoing.",
    },
  ],

  "Jaipur": [
    {
      category: "Water",
      categoryColor: "#0096c7",
      title: "Jaipur is a desert city that keeps growing as if it isn't.",
      body: "Jaipur sits in one of India's most water-scarce regions. Annual rainfall is under 650mm. The city's water comes from Bisalpur Dam, 100km away, and from a rapidly depleting groundwater table. As the city expands with new townships and malls, water demand keeps rising. Conservation measures exist on paper. The gap between water availability and water demand is quietly widening every year.",
      severity: "High",
      tag: "💧 Water",
      whatsBeing: "PHED is expanding the Bisalpur pipeline. Wastewater treatment and reuse projects are underway.",
    },
    {
      category: "Governance",
      categoryColor: "#9b5de5",
      title: "Jaipur's heritage and growth are in direct conflict — and nobody is mediating.",
      body: "The old walled city of Jaipur is a UNESCO World Heritage Site. It is also a living city where 5 lakh people work, trade, and move around every day. Conservation guidelines restrict what you can build. Growth pressure pushes in the opposite direction. The result is uncontrolled densification in some areas and neglected heritage in others. The city needs a coherent plan that takes both seriously. It doesn't have one.",
      severity: "Elevated",
      tag: "🏛️ Governance",
      whatsBeing: "Jaipur Heritage Foundation and JDA have conservation plans. Enforcement is inconsistent.",
    },
    {
      category: "Traffic",
      categoryColor: "#f4a261",
      title: "Jaipur's tourism hides its traffic problem. Residents feel it every day.",
      body: "The city's old city core wasn't designed for cars — but cars have taken it over. Narrow lanes, heritage structures, and tourist movement create gridlock around Hawa Mahal and Johari Bazaar daily. Meanwhile, the new city sprawl on the western side (Vaishali Nagar, Mansarovar) has minimal public transit. The metro exists but covers only two corridors. Most people have no choice but to drive.",
      severity: "Elevated",
      tag: "🚦 Traffic",
      whatsBeing: "Jaipur Metro Phase 2 is planned. City bus services are being expanded under JCTSL.",
    },
  ],

};

// ─── Civic Organizations ──────────────────────────────────────────────────────
// Real organizations doing real work. Descriptions written to help citizens
// understand what they do and how to get involved.

export const CIVIC_ORGS = {

  "Bengaluru": [
    {
      name: "Janaagraha Centre for Citizenship and Democracy",
      shortName: "Janaagraha",
      focus: "Urban Governance",
      focusColor: "#0096c7",
      what: "Janaagraha works to strengthen ward-level democracy and improve the quality of urban infrastructure and services across India. They run the Annual Survey of India's City-Systems (ASICS) — the most rigorous annual rating of how well Indian cities are governed.",
      how: "Citizens can participate in ward-level budget consultations and volunteer for local area improvement initiatives.",
      link: "https://janaagraha.org",
      city: "Bengaluru",
    },
    {
      name: "Citizens for Bengaluru",
      shortName: "CfB",
      focus: "Civic Activism",
      focusColor: "#e63946",
      what: "CfB is a citizen-led movement that has successfully campaigned on issues from bus rapid transit to lake protection to pedestrian rights. They mobilise citizens around specific civic causes and translate public pressure into policy change.",
      how: "Follow their campaigns, attend town halls, and add your voice to active petitions on their platform.",
      link: "https://citizensforblr.in",
      city: "Bengaluru",
    },
    {
      name: "Hasiru Dala",
      shortName: "Hasiru Dala",
      focus: "Waste & Livelihoods",
      focusColor: "#2dc653",
      what: "Hasiru Dala (Kannada for 'Green Force') organises Bengaluru's informal waste workers — the pourakarmikas and ragpickers who actually keep the city clean. They work on waste segregation, worker welfare, and integrating the informal economy into formal waste management.",
      how: "Segregate your waste at home. Support their advocacy for waste worker rights. Volunteer for awareness drives in your apartment complex.",
      link: "https://hasirudala.in",
      city: "Bengaluru",
    },
    {
      name: "The Ugly Indians",
      shortName: "The Ugly Indians",
      focus: "Public Spaces",
      focusColor: "#d4ac0d",
      what: "An anonymous collective that fixes broken public spaces through direct action — no permissions, no press releases, no politics. They paint walls, fix footpaths, clean corners. Their 'spot-fixing' model has inspired similar groups across India.",
      how: "Join a spot-fix event in your neighbourhood. Their approach is simple: identify a broken space, gather a group, fix it over a weekend.",
      link: "https://theuglyindians.blogspot.com",
      city: "Bengaluru",
    },
  ],

  "Mumbai": [
    {
      name: "Praja Foundation",
      shortName: "Praja",
      focus: "Government Accountability",
      focusColor: "#0096c7",
      what: "Praja systematically tracks how Mumbai's elected representatives perform — councillors, MLAs, MPs. They analyse municipal budgets, audit government spending, and publish accessible reports that help citizens hold their representatives accountable.",
      how: "Use their data to know your councillor's track record. Attend their public forums. Share their reports with your neighbourhood.",
      link: "https://praja.org",
      city: "Mumbai",
    },
    {
      name: "WalkMumbai",
      shortName: "WalkMumbai",
      focus: "Pedestrian Rights",
      focusColor: "#f4a261",
      what: "Mumbai is one of India's most walkable cities by necessity — and one of its least walkable by design. WalkMumbai advocates for footpaths, pedestrian crossings, and a city that works for people who don't own cars. They document broken footpaths and file RTIs.",
      how: "Document bad footpaths in your area and share with them. Join their walkability audits. Participate in their campaigns for specific corridors.",
      link: "https://walkmumbai.in",
      city: "Mumbai",
    },
    {
      name: "AGNI (Action for Good Governance and Networking in India)",
      shortName: "AGNI",
      focus: "Civic Networking",
      focusColor: "#9b5de5",
      what: "AGNI is one of Mumbai's oldest civic networks, connecting residents' associations, NGOs, and civic groups across the city. They focus on ward-level engagement and have been active in issues from heritage conservation to disaster preparedness.",
      how: "Connect your housing society or residents' association to their network. Attend ward-level meetings they facilitate.",
      link: "https://agni.org.in",
      city: "Mumbai",
    },
  ],

  "Chennai": [
    {
      name: "Arappor Iyakkam",
      shortName: "Arappor Iyakkam",
      focus: "Anti-Corruption",
      focusColor: "#e63946",
      what: "Arappor Iyakkam (Tamil for 'Public Movement') uses RTI filings, public interest litigation, and sustained citizen pressure to expose corruption in Tamil Nadu's government systems. They've successfully challenged corrupt contracts and exposed irregularities in Chennai's civic projects.",
      how: "File RTIs with their guidance. Report corruption you observe. Support their legal campaigns.",
      link: "https://arappor.com",
      city: "Chennai",
    },
    {
      name: "Exnora International",
      shortName: "Exnora",
      focus: "Waste Management",
      focusColor: "#2dc653",
      what: "One of India's pioneering civic organisations, Exnora has been working on solid waste management and civic cleanliness in Chennai since 1989. Their street-level approach to waste collection and community mobilisation predated government programmes by decades.",
      how: "Connect with your local Exnora chapter. Participate in their ward-level clean-up drives and waste awareness programmes.",
      link: "https://exnora.org",
      city: "Chennai",
    },
    {
      name: "Chennai Volunteers",
      shortName: "Chennai Volunteers",
      focus: "Community Action",
      focusColor: "#00b4d8",
      what: "Chennai Volunteers coordinates civic action across the city — from flood relief to tree planting to heritage documentation. They mobilise volunteers quickly around specific needs and have built a robust community of engaged citizens.",
      how: "Sign up as a volunteer. Join their WhatsApp groups for your area. Show up when they need help — they make it easy to pitch in.",
      link: "https://chennaivolunteers.org",
      city: "Chennai",
    },
  ],

  "Hyderabad": [
    {
      name: "Save Our Urban Lakes",
      shortName: "SOUL",
      focus: "Lake Protection",
      focusColor: "#0096c7",
      what: "SOUL works specifically on protecting and restoring Hyderabad's rapidly disappearing lake ecosystem. They monitor encroachments, document lake health, file public interest litigation, and run community programmes to reconnect citizens with their water bodies.",
      how: "Adopt a lake near you. Report encroachments. Join their lake walks and awareness events.",
      link: "https://saveoururbanakes.org",
      city: "Hyderabad",
    },
    {
      name: "Centre for People's Forestry",
      shortName: "CPF",
      focus: "Urban Greening",
      focusColor: "#2dc653",
      what: "CPF works on urban forestry, tree rights, and green cover in Hyderabad and surrounding areas. They've been at the forefront of fighting tree felling for infrastructure projects and advocating for ecological sensitivity in urban planning.",
      how: "Participate in tree planting drives. Report illegal tree felling. Access their resources on urban ecology.",
      link: "https://cpfindia.org",
      city: "Hyderabad",
    },
  ],

  "Pune": [
    {
      name: "Parisar",
      shortName: "Parisar",
      focus: "Sustainable Transport",
      focusColor: "#f4a261",
      what: "Parisar is Pune's most active sustainable transport advocacy group. They've worked on bus rapid transit, cycling infrastructure, and pedestrian rights for over two decades. Their research and advocacy has directly influenced Pune's transport policy.",
      how: "Join their cycling rallies. Use their data when writing to your corporator about road conditions. Volunteer for footpath audits.",
      link: "https://parisar.org",
      city: "Pune",
    },
    {
      name: "Nagrik Chetna Manch",
      shortName: "NCM",
      focus: "Civic Rights",
      focusColor: "#9b5de5",
      what: "NCM focuses on civic education and citizen rights in Pune — helping ordinary residents understand how to use RTI, how to file complaints with the right authorities, and how to engage with municipal processes they didn't know existed.",
      how: "Attend their RTI workshops. Reach out when you have a civic problem and don't know where to take it.",
      link: "https://nagrikchetnamanch.org",
      city: "Pune",
    },
  ],

  "Delhi": [
    {
      name: "Delhi Greens",
      shortName: "Delhi Greens",
      focus: "Environment & Ecology",
      focusColor: "#2dc653",
      what: "Delhi Greens works on environmental issues across Delhi — air quality, urban forests, ridge preservation, and Yamuna restoration. They combine on-ground action with policy advocacy and maintain some of the best documentation of Delhi's urban ecology.",
      how: "Join their tree-planting drives. Participate in Yamuna clean-up events. Use their data for environmental activism in your area.",
      link: "https://delhigreens.com",
      city: "Delhi",
    },
    {
      name: "Jhatkaa.org",
      shortName: "Jhatkaa",
      focus: "Digital Civic Campaigns",
      focusColor: "#e63946",
      what: "Jhatkaa (Hindi for 'jolt') runs digital campaigns that pressure decision-makers on civic and environmental issues across India, with a strong Delhi presence. They make it easy for citizens to send messages to officials, sign petitions, and amplify civic causes.",
      how: "Sign active campaigns on their platform. Share campaigns with your network. Start a campaign for an issue in your area.",
      link: "https://jhatkaa.org",
      city: "Delhi",
    },
  ],

  "Indore": [
    {
      name: "Indore Municipal Corporation Citizen Connect",
      shortName: "IMC Connect",
      focus: "Municipal Services",
      focusColor: "#2dc653",
      what: "IMC has one of India's better-developed citizen engagement programmes, including an app-based complaint system and ward-level citizen committees. This isn't an NGO — it's the municipal body itself, and it's worth knowing about because it actually responds.",
      how: "Download the IMC app to report issues. Attend your ward-level committee meetings. Engage with your area corporator through official channels.",
      link: "https://www.imcindore.mp.gov.in",
      city: "Indore",
    },
  ],

  "Jaipur": [
    {
      name: "Jaipur Heritage Foundation",
      shortName: "JHF",
      focus: "Heritage Conservation",
      focusColor: "#d4ac0d",
      what: "JHF works on the conservation and management of Jaipur's UNESCO World Heritage walled city. They work with craftspeople, residents, and government to balance living heritage with the pressures of a growing urban economy.",
      how: "Volunteer for heritage documentation projects. Participate in their heritage walks. Support craft communities in the old city.",
      link: "https://jaipurheritage.org",
      city: "Jaipur",
    },
  ],

};

// Cities that don't yet have issue/org data show a coming-soon state
export const CITIES_WITH_DATA = new Set([
  "Bengaluru", "Mumbai", "Delhi", "Chennai", "Hyderabad",
  "Pune", "Indore", "Jaipur"
]);
