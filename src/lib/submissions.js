const COCREATOR_STORAGE_KEY = "mycitypulse_cocreator_interest";
const SURVEY_STORAGE_KEY = "mycitypulse_survey_responses";
const ISSUE_REPORT_STORAGE_KEY = "mycitypulse_issue_reports";
const DEFAULT_FORMS_ENDPOINT = "/api/forms";

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

function appendStoredList(key, payload) {
  const current = readStoredList(key);
  const next = [payload, ...current].slice(0, 100);
  window.localStorage.setItem(key, JSON.stringify(next));
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

export async function submitCocreatorInterest(payload) {
  const endpoint = import.meta.env.VITE_COCREATOR_ENDPOINT?.trim() || DEFAULT_FORMS_ENDPOINT;

  try {
    await postJson(endpoint, { type: "cocreator", payload });
    return { delivery: "remote" };
  } catch {
    appendStoredList(COCREATOR_STORAGE_KEY, payload);
    return { delivery: "local" };
  }
}

export async function submitSurveyResponse(payload) {
  const endpoint = import.meta.env.VITE_SURVEY_ENDPOINT?.trim() || DEFAULT_FORMS_ENDPOINT;

  try {
    await postJson(endpoint, { type: "survey", payload });
    return { delivery: "remote" };
  } catch {
    appendStoredList(SURVEY_STORAGE_KEY, payload);
    return { delivery: "local" };
  }
}

export async function submitIssueReport(payload) {
  const endpoint = import.meta.env.VITE_ISSUE_REPORT_ENDPOINT?.trim() || DEFAULT_FORMS_ENDPOINT;

  try {
    await postJson(endpoint, { type: "issue_report", payload });
    return { delivery: "remote" };
  } catch {
    appendStoredList(ISSUE_REPORT_STORAGE_KEY, payload);
    return { delivery: "local" };
  }
}
