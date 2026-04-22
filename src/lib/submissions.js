const COCREATOR_STORAGE_KEY = "mycitypulse_cocreator_interest";
const SURVEY_STORAGE_KEY = "mycitypulse_survey_responses";
const ISSUE_REPORT_STORAGE_KEY = "mycitypulse_issue_reports";
const CONTACT_STORAGE_KEY = "mycitypulse_contact_messages";
const STORAGE_INDEX_KEY = "mycitypulse_submission_storage_keys";
const DEFAULT_FORMS_ENDPOINT = "/api/forms";
const TYPE_PATTERN = /^[a-z][a-z0-9_]{1,63}$/;

const TYPE_TO_KEY = {
  cocreator: COCREATOR_STORAGE_KEY,
  survey: SURVEY_STORAGE_KEY,
  issue_report: ISSUE_REPORT_STORAGE_KEY,
  contact: CONTACT_STORAGE_KEY,
};

function getStorageKey(type) {
  return TYPE_TO_KEY[type] || `mycitypulse_${type}_submissions`;
}

function readStoredList(key) {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(key);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStoredList(key, list) {
  if (typeof window === "undefined") {
    return;
  }
  if (!list || list.length === 0) {
    window.localStorage.removeItem(key);
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(list));
}

function appendStoredList(key, payload) {
  const current = readStoredList(key);
  const next = [payload, ...current].slice(0, 100);
  writeStoredList(key, next);
}

function rememberStorageType(type) {
  if (TYPE_TO_KEY[type]) return;
  const current = readStoredList(STORAGE_INDEX_KEY);
  if (current.includes(type)) return;
  writeStoredList(STORAGE_INDEX_KEY, [...current, type].sort());
}

async function postJson(endpoint, payload) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Submission failed with status ${response.status}`);
  }

  return response.json();
}

function resolveEndpoint(overrideEnvVar) {
  const override = overrideEnvVar?.trim();
  return override || DEFAULT_FORMS_ENDPOINT;
}

export async function submitFormSubmission(type, payload, { endpoint } = {}) {
  if (!TYPE_PATTERN.test(type || "") || !payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Invalid submission payload");
  }

  const target = resolveEndpoint(endpoint);

  try {
    await postJson(target, { type, payload });
    return { delivery: "remote" };
  } catch {
    rememberStorageType(type);
    appendStoredList(getStorageKey(type), payload);
    return { delivery: "local" };
  }
}

export async function submitCocreatorInterest(payload) {
  return submitFormSubmission("cocreator", payload, {
    endpoint: import.meta.env.VITE_COCREATOR_ENDPOINT,
  });
}

export async function submitSurveyResponse(payload) {
  return submitFormSubmission("survey", payload, {
    endpoint: import.meta.env.VITE_SURVEY_ENDPOINT,
  });
}

export async function submitIssueReport(payload) {
  return submitFormSubmission("issue_report", payload, {
    endpoint: import.meta.env.VITE_ISSUE_REPORT_ENDPOINT,
  });
}

export async function submitContactMessage(payload) {
  return submitFormSubmission("contact", payload, {
    endpoint: import.meta.env.VITE_CONTACT_ENDPOINT,
  });
}

/**
 * Try to resend anything that was stashed in localStorage because an earlier
 * submission failed (e.g. before the backend was configured). Runs quietly —
 * never surfaces errors to the user — and only removes rows that the server
 * acknowledges.
 *
 * Safe to call on every app mount. Wrapped in a module-level flag so repeated
 * calls within the same session are no-ops.
 */
let flushInFlight = false;
let flushDone = false;

export async function flushStoredSubmissions({ endpoint } = {}) {
  if (typeof window === "undefined") return { attempted: 0, resent: 0 };
  if (flushInFlight || flushDone) return { attempted: 0, resent: 0 };
  flushInFlight = true;

  const target = resolveEndpoint(endpoint);
  let attempted = 0;
  let resent = 0;

  try {
    const knownEntries = Object.entries(TYPE_TO_KEY);
    const futureEntries = readStoredList(STORAGE_INDEX_KEY).map((type) => [type, getStorageKey(type)]);
    const entries = [...knownEntries, ...futureEntries];

    for (const [type, key] of entries) {
      const items = readStoredList(key);
      if (items.length === 0) continue;

      const remaining = [];
      for (const payload of items) {
        attempted += 1;
        try {
          await postJson(target, { type, payload });
          resent += 1;
        } catch {
          // Keep the item so we can retry on the next session.
          remaining.push(payload);
        }
      }
      writeStoredList(key, remaining);
    }
  } finally {
    flushInFlight = false;
    flushDone = resent > 0 || attempted === 0 ? true : flushDone;
  }

  return { attempted, resent };
}
