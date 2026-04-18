const CITY_CENTERS = {
  Ahmedabad: { latitude: 23.0225, longitude: 72.5714 },
  Surat: { latitude: 21.1702, longitude: 72.8311 },
  Vadodara: { latitude: 22.3072, longitude: 73.1812 },
  Rajkot: { latitude: 22.3039, longitude: 70.8022 },
};

function toRadians(value) {
  return (value * Math.PI) / 180;
}

export function getDistanceInKm(from, to) {
  const earthRadiusKm = 6371;
  const latDelta = toRadians(to.latitude - from.latitude);
  const lonDelta = toRadians(to.longitude - from.longitude);
  const fromLat = toRadians(from.latitude);
  const toLat = toRadians(to.latitude);

  const a =
    Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(lonDelta / 2) * Math.sin(lonDelta / 2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getLikelyCityFromCoordinates(latitude, longitude) {
  const point = { latitude, longitude };
  const ranked = Object.entries(CITY_CENTERS)
    .map(([city, coords]) => ({
      city,
      distanceKm: getDistanceInKm(point, coords),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);

  return {
    nearestCity: ranked[0] || null,
    rankedCities: ranked,
  };
}

export function getDigipinCityMismatch(cityName, latitude, longitude) {
  if (!CITY_CENTERS[cityName]) {
    return null;
  }

  const { nearestCity } = getLikelyCityFromCoordinates(latitude, longitude);
  const currentCityDistanceKm = getDistanceInKm({ latitude, longitude }, CITY_CENTERS[cityName]);

  if (!nearestCity) {
    return null;
  }

  if (nearestCity.city !== cityName && nearestCity.distanceKm + 20 < currentCityDistanceKm) {
    return {
      expectedCity: cityName,
      detectedCity: nearestCity.city,
      detectedDistanceKm: Math.round(nearestCity.distanceKm),
      currentCityDistanceKm: Math.round(currentCityDistanceKm),
    };
  }

  return null;
}
