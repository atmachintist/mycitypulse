export function buildMailtoHref({ to = "hello@mycitypulse.in", subject, lines = [] }) {
  const body = lines.filter(Boolean).join("\n");
  const params = new URLSearchParams();

  if (subject) {
    params.set("subject", subject);
  }

  if (body) {
    params.set("body", body);
  }

  return `mailto:${to}?${params.toString()}`;
}

export function openMailtoDraft(config) {
  if (typeof window === "undefined") {
    return;
  }

  window.location.href = buildMailtoHref(config);
}
