/**
 * Routing utilities for URL-based navigation
 * Handles: cities, elections, issues, and compare views
 */

/**
 * Parse the current URL and return routing state
 * @returns {Object} {city, panel, compareMode}
 */
export function parseUrl() {
  const pathname = window.location.pathname;
  const parts = pathname.split('/').filter(p => p);

  // No parts = home page
  if (parts.length === 0) {
    return { city: null, panel: null, compareMode: false };
  }

  // Special case: /compare
  if (parts[0] === 'compare') {
    return { city: null, panel: null, compareMode: true };
  }

  // First part is city
  const citySlug = parts[0];
  const panel = parts[1] || null; // 'elections' or 'issues'

  return { citySlug, panel, compareMode: false };
}

/**
 * Find city by URL slug
 * @param {string} slug - URL slug (e.g., "new-delhi")
 * @param {Array} cities - All available cities
 * @returns {Object|null} City object matching the slug
 */
export function findCityByUrlSlug(slug, cities) {
  if (!slug) return null;

  const normalizedSlug = slug.toLowerCase().replace(/\s+/g, '-');

  return cities.find(city =>
    city.city.toLowerCase().replace(/\s+/g, '-') === normalizedSlug
  ) || null;
}

/**
 * Update URL for city view
 * @param {Object} city - City object with .city property
 * @param {string|null} panel - Panel type: 'elections', 'issues', or null
 */
export function updateUrlForCity(city, panel = null) {
  if (!city) {
    window.history.pushState(null, '', '/');
  } else {
    const urlSlug = city.city.toLowerCase().replace(/\s+/g, '-');
    const url = panel ? `/${urlSlug}/${panel}` : `/${urlSlug}`;
    window.history.pushState({ city: city.city, panel }, '', url);
  }
}

/**
 * Update URL for compare view
 */
export function updateUrlForCompare() {
  window.history.pushState({ compareMode: true }, '', '/compare');
}

/**
 * Update URL to home page
 */
export function updateUrlToHome() {
  window.history.pushState(null, '', '/');
}
