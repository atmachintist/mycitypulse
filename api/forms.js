const allowedTypes = new Set(["cocreator", "survey"]);

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function formatValue(value) {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (value && typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value ?? "");
}

function buildCocreatorEmail(payload) {
  const enabledPermissions = Object.entries(payload.permissions || {})
    .filter(([, enabled]) => Boolean(enabled))
    .map(([key]) => key)
    .join(", ");

  return {
    subject: `New cocreator interest: ${payload.fullName || payload.email || "unknown"}`,
    html: `
      <h2>New Cocreator Interest</h2>
      <p><strong>Name:</strong> ${payload.fullName || "Not provided"}</p>
      <p><strong>Email:</strong> ${payload.email || "Not provided"}</p>
      <p><strong>City:</strong> ${payload.city || "Not provided"}</p>
      <p><strong>Contributions:</strong> ${(payload.contributions || []).join(", ") || "None selected"}</p>
      <p><strong>Permissions:</strong> ${enabledPermissions || "None selected"}</p>
      <p><strong>Captured at:</strong> ${payload.capturedAt || "Unknown"}</p>
      <pre>${escapeHtml(JSON.stringify(payload, null, 2))}</pre>
    `,
  };
}

function buildSurveyEmail(payload) {
  const responseRows = Object.entries(payload.responses || {})
    .map(([key, value]) => `<li><strong>${escapeHtml(key)}:</strong> ${escapeHtml(formatValue(value))}</li>`)
    .join("");

  return {
    subject: `New civic survey response: ${payload.city || "Unknown city"}`,
    html: `
      <h2>New Civic Survey Response</h2>
      <p><strong>City:</strong> ${payload.city || "Not provided"}</p>
      <p><strong>Email:</strong> ${payload.email || "anonymous"}</p>
      <p><strong>Submitted at:</strong> ${payload.timestamp || "Unknown"}</p>
      <h3>Responses</h3>
      <ul>${responseRows || "<li>No responses submitted</li>"}</ul>
      <pre>${escapeHtml(JSON.stringify(payload, null, 2))}</pre>
    `,
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function sendViaResend({ to, from, subject, html, replyTo }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
      reply_to: replyTo || undefined,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Resend error ${response.status}: ${text}`);
  }

  return response.json();
}

export default async function handler(request) {
  if (request.method !== "POST") {
    return json(405, { ok: false, error: "Method not allowed" });
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return json(400, { ok: false, error: "Invalid JSON body" });
  }

  const type = body?.type;
  const payload = body?.payload;

  if (!allowedTypes.has(type) || !payload || typeof payload !== "object") {
    return json(400, { ok: false, error: "Invalid submission payload" });
  }

  const to = process.env.MYCITYPULSE_INBOX_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!to || !from || !resendApiKey) {
    return json(503, {
      ok: false,
      error: "Email delivery is not configured",
      missing: [
        !to ? "MYCITYPULSE_INBOX_EMAIL" : null,
        !from ? "RESEND_FROM_EMAIL" : null,
        !resendApiKey ? "RESEND_API_KEY" : null,
      ].filter(Boolean),
    });
  }

  try {
    const email =
      type === "cocreator"
        ? buildCocreatorEmail(payload)
        : buildSurveyEmail(payload);

    const result = await sendViaResend({
      to,
      from,
      subject: email.subject,
      html: email.html,
      replyTo: payload.email && payload.email !== "anonymous" ? payload.email : undefined,
    });

    console.log("mycitypulse.form_submission", JSON.stringify({
      type,
      city: payload.city || null,
      email: payload.email || null,
      sentAt: new Date().toISOString(),
      resendId: result?.id || null,
    }));

    return json(200, { ok: true, delivery: "remote" });
  } catch (error) {
    console.error("mycitypulse.form_submission_error", error);
    return json(502, { ok: false, error: "Email delivery failed" });
  }
}
