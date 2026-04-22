/**
 * Routing utilities for URL-based navigation.
 *
 * Supported URLs:
 *   /                              → home
 *   /compare                       → compare view
 *   /:citySlug                     → city page (default panel)
 *   /:citySlug/:panel              → city page focused on a panel (elections, issues, wards, ecosystem, health)
 *   /:citySlug/elections/ward/:n   → elections panel pre-selecting a specific ward
 *
 * The ward deep-link lets citizens share a WhatsApp-friendly URL like
 *   https://www.mycitypulse.in/ahmedabad/elections/ward/12
 * that opens the election view with ward 12 already focused.
 */

/**
 * Parse the current URL and return routing state.
 * @returns {{citySlug: string|null, panel: string|null, wardNumber: number|null, compareMode: boolean, storySlug: string|null, storyPage: number}}
 */
export function parseUrl() {
  const pathname = window.location.pathname;
  const parts = pathname.split('/').filter(p => p);

  if (parts.length === 0) {
    return { citySlug: null, panel: null, wardNumber: null, compareMode: false, storySlug: null, storyPage: 0 };
  }

  if (parts[0] === 'compare') {
    return { citySlug: null, panel: null, wardNumber: null, compareMode: true, storySlug: null, storyPage: 0 };
  }

  // /stories/:storySlug  or  /stories/:storySlug/:pageIndex
  if (parts[0] === 'stories') {
    const storySlug = parts[1] || null;
    const storyPage = parts[2] ? Math.max(0, parseInt(parts[2], 10) || 0) : 0;
    return { citySlug: null, panel: null, wardNumber: null, compareMode: false, storySlug, storyPage };
  }

  const citySlug = parts[0];
  const panel = parts[1] || null;

  // /:citySlug/elections/ward/:number
  let wardNumber = null;
  if (panel === 'elections' && parts[2] === 'ward' && parts[3]) {
    const parsed = Number.parseInt(parts[3], 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      wardNumber = parsed;
    }
  }

  return { citySlug, panel, wardNumber, compareMode: false, storySlug: null, storyPage: 0 };
}

/**
 * Find city by URL slug.
 */
export function findCityByUrlSlug(slug, cities) {
  if (!slug) return null;

  const normalizedSlug = slug.toLowerCase().replace(/\s+/g, '-');

  return cities.find(city =>
    city.city.toLowerCase().replace(/\s+/g, '-') === normalizedSlug
  ) || null;
}

function citySlugFor(city) {
  return city.city.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Update URL for city view.
 * @param {Object|null} city  City object with .city property, or null for home.
 * @param {string|null} panel Panel id: 'elections', 'issues', etc.
 * @param {number|null} wardNumber Optional ward number for the elections panel.
 */
export function updateUrlForCity(city, panel = null, wardNumber = null) {
  if (!city) {
    window.history.pushState(null, '', '/');
    return;
  }

  const slug = citySlugFor(city);
  let url = `/${slug}`;

  if (panel) {
    url += `/${panel}`;
    if (panel === 'elections' && Number.isFinite(wardNumber) && wardNumber > 0) {
      url += `/ward/${wardNumber}`;
    }
  }

  window.history.pushState({ city: city.city, panel, wardNumber: wardNumber ?? null }, '', url);
}

/**
 * Replace (not push) the URL for the active city/panel/ward — useful when a
 * user saves a ward inline without wanting a new history entry per selection.
 */
export function replaceUrlForCity(city, panel = null, wardNumber = null) {
  if (!city) {
    window.history.replaceState(null, '', '/');
    return;
  }

  const slug = citySlugFor(city);
  let url = `/${slug}`;

  if (panel) {
    url += `/${panel}`;
    if (panel === 'elections' && Number.isFinite(wardNumber) && wardNumber > 0) {
      url += `/ward/${wardNumber}`;
    }
  }

  window.history.replaceState({ city: city.city, panel, wardNumber: wardNumber ?? null }, '', url);
}

/**
 * Update URL for compare view.
 */
export function updateUrlForCompare() {
  window.history.pushState({ compareMode: true }, '', '/compare');
}

/**
 * Update URL to home page.
 */
export function updateUrlToHome() {
  window.history.pushState(null, '', '/');
}

/**
 * Update URL for a story page.
 * @param {string} slug  Story slug, e.g. 'ahmedabad-portrait'.
 * @param {number} page  0-indexed page number (omitted from URL when 0).
 */
export function updateUrlForStory(slug, page = 0) {
  const url = page > 0 ? `/stories/${slug}/${page}` : `/stories/${slug}`;
  window.history.pushState({ storySlug: slug, storyPage: page }, '', url);
}
