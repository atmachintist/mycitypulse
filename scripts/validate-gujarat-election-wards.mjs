import { loadElectionData } from "../src/domain/elections/loadElectionData.js";
import {
  CURRENT_GUJARAT_MUNICIPAL_ELECTION_CITIES_2026,
  LIVE_GUJARAT_WARD_EXPECTATIONS_2026,
} from "../src/domain/elections/gujaratElectionConfig.js";

const cityNames = [...CURRENT_GUJARAT_MUNICIPAL_ELECTION_CITIES_2026].sort((left, right) =>
  left.localeCompare(right),
);

const failures = [];

for (const cityName of cityNames) {
  const election = await loadElectionData(cityName);
  const wards = Array.isArray(election?.wards) ? election.wards : [];
  const expected = LIVE_GUJARAT_WARD_EXPECTATIONS_2026[cityName];

  if (!election) {
    failures.push(`${cityName}: election module did not load.`);
    continue;
  }

  if (!expected) {
    failures.push(`${cityName}: missing expected ward metadata.`);
    continue;
  }

  if (wards.length !== expected.wards) {
    failures.push(`${cityName}: expected ${expected.wards} wards, found ${wards.length}.`);
  }

  if (election.seats_total !== expected.seats) {
    failures.push(`${cityName}: expected ${expected.seats} seats, found ${election.seats_total}.`);
  }

  if (!wards.every((ward, index) => ward.number === index + 1)) {
    failures.push(`${cityName}: ward numbers are not contiguous starting from 1.`);
  }

  for (const ward of wards) {
    if (!ward.name?.trim()) {
      failures.push(`${cityName}: Ward ${ward.number} is missing a name.`);
    }

    if (!ward.officeAddress?.trim()) {
      failures.push(`${cityName}: Ward ${ward.number} is missing an office address.`);
    }
  }
}

if (failures.length > 0) {
  console.error("Gujarat live election ward validation failed:\n");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  `Validated ${cityNames.length} live Gujarat municipal election datasets: ward counts, seat counts, numbering, names, and office addresses all match expectations.`,
);
