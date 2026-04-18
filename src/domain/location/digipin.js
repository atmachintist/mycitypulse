const DIGIPIN_GRID = [
  ["F", "C", "9", "8"],
  ["J", "3", "2", "7"],
  ["K", "4", "5", "6"],
  ["L", "M", "P", "T"],
];

const BOUNDS = {
  minLat: 2.5,
  maxLat: 38.5,
  minLon: 63.5,
  maxLon: 99.5,
};

export function normalizeDigipin(value = "") {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function formatDigipin(value = "") {
  const normalized = normalizeDigipin(value);

  if (normalized.length <= 3) {
    return normalized;
  }

  if (normalized.length <= 6) {
    return `${normalized.slice(0, 3)}-${normalized.slice(3)}`;
  }

  return `${normalized.slice(0, 3)}-${normalized.slice(3, 6)}-${normalized.slice(6, 10)}`;
}

export function getDigiPin(lat, lon) {
  if (lat < BOUNDS.minLat || lat > BOUNDS.maxLat) {
    throw new Error("Latitude out of range");
  }

  if (lon < BOUNDS.minLon || lon > BOUNDS.maxLon) {
    throw new Error("Longitude out of range");
  }

  let minLat = BOUNDS.minLat;
  let maxLat = BOUNDS.maxLat;
  let minLon = BOUNDS.minLon;
  let maxLon = BOUNDS.maxLon;
  let digipin = "";

  for (let level = 1; level <= 10; level += 1) {
    const latDiv = (maxLat - minLat) / 4;
    const lonDiv = (maxLon - minLon) / 4;

    let row = 3 - Math.floor((lat - minLat) / latDiv);
    let col = Math.floor((lon - minLon) / lonDiv);

    row = Math.max(0, Math.min(row, 3));
    col = Math.max(0, Math.min(col, 3));

    digipin += DIGIPIN_GRID[row][col];

    const nextMaxLat = minLat + latDiv * (4 - row);
    const nextMinLat = minLat + latDiv * (3 - row);
    const nextMinLon = minLon + lonDiv * col;
    const nextMaxLon = nextMinLon + lonDiv;

    minLat = nextMinLat;
    maxLat = nextMaxLat;
    minLon = nextMinLon;
    maxLon = nextMaxLon;
  }

  return formatDigipin(digipin);
}

export function getLatLngFromDigiPin(digiPin) {
  const pin = normalizeDigipin(digiPin);

  if (pin.length !== 10) {
    throw new Error("Invalid DIGIPIN");
  }

  let minLat = BOUNDS.minLat;
  let maxLat = BOUNDS.maxLat;
  let minLon = BOUNDS.minLon;
  let maxLon = BOUNDS.maxLon;

  for (let i = 0; i < 10; i += 1) {
    const char = pin[i];
    let rowIndex = -1;
    let colIndex = -1;

    for (let row = 0; row < 4; row += 1) {
      for (let col = 0; col < 4; col += 1) {
        if (DIGIPIN_GRID[row][col] === char) {
          rowIndex = row;
          colIndex = col;
          break;
        }
      }

      if (rowIndex !== -1) {
        break;
      }
    }

    if (rowIndex === -1 || colIndex === -1) {
      throw new Error("Invalid character in DIGIPIN");
    }

    const latDiv = (maxLat - minLat) / 4;
    const lonDiv = (maxLon - minLon) / 4;
    const nextMinLat = maxLat - latDiv * (rowIndex + 1);
    const nextMaxLat = maxLat - latDiv * rowIndex;
    const nextMinLon = minLon + lonDiv * colIndex;
    const nextMaxLon = minLon + lonDiv * (colIndex + 1);

    minLat = nextMinLat;
    maxLat = nextMaxLat;
    minLon = nextMinLon;
    maxLon = nextMaxLon;
  }

  return {
    latitude: Number(((minLat + maxLat) / 2).toFixed(6)),
    longitude: Number(((minLon + maxLon) / 2).toFixed(6)),
  };
}
