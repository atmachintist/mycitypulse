import { useEffect, useRef, useState } from "react";
import { submitContactMessage } from "../lib/submissions.js";
import "./ContactDialog.css";

/**
 * Reusable contact / feedback modal. Replaces the site's mailto: buttons so
 * users on mobile (or without a configured mail client) can actually reach us.
 *
 * Props:
 *   open            - whether the dialog is visible.
 *   onClose         - close handler.
 *   title           - heading shown at the top (e.g. "Share an election correction").
 *   subject         - backend subject line (not shown to user).
 *   source          - free-form string tagged onto the submission for analytics
 *                     (e.g. "elections-feedback:Ahmedabad").
 *   prefillMessage  - optional starter text for the message textarea.
 *   contextLines    - optional array of strings prepended to the message as
 *                     "context:" — useful for machine-supplied details like
 *                     coordinates or DigiPin that the user shouldn't edit.
 */
export default function ContactDialog(props) {
  // Mounting the body only while open gives us fresh state every time the
  // dialog opens — no reset-in-effect needed.
  if (!props.open) return null;
  return <ContactDialogBody {...props} />;
}

function ContactDialogBody({
  onClose,
  title = "Get in touch",
  subject = "Hello from MyCityPulse",
  source = "contact",
  prefillMessage = "",
  contextLines = [],
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(prefillMessage);
  const [submitState, setSubmitState] = useState("idle"); // idle | submitting | done | error
  const [error, setError] = useState("");
  const [deliveryMode, setDeliveryMode] = useState(null);
  const firstFieldRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => firstFieldRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!message.trim()) {
      setError("Please write a short message.");
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("That email address doesn't look right.");
      return;
    }
    setError("");
    setSubmitState("submitting");

    const combinedMessage = contextLines.length > 0
      ? `${contextLines.join("\n")}\n\n${message.trim()}`
      : message.trim();

    const payload = {
      name: name.trim(),
      email: email.trim(),
      subject,
      source,
      message: combinedMessage,
      submittedAt: new Date().toISOString(),
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    };

    try {
      const result = await submitContactMessage(payload);
      setDeliveryMode(result.delivery);
      setSubmitState("done");
    } catch {
      setSubmitState("error");
      setError("Something went wrong. Please try again in a moment.");
    }
  };

  return (
    <div
      className="mcp-contact-dialog-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mcp-contact-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div className="mcp-contact-dialog">
        <button
          type="button"
          className="mcp-contact-close"
          onClick={onClose}
          aria-label="Close"
        >
          {"\u00D7"}
        </button>

        {submitState === "done" ? (
          <div className="mcp-contact-done">
            <div className="mcp-contact-done-icon">{"\u2713"}</div>
            <h3 id="mcp-contact-title">Thank you</h3>
            <p>
              {deliveryMode === "remote"
                ? "Your message reached the MyCityPulse team. We read everything and reply when we can."
                : "We saved your message on this device and will retry when you have connection."}
            </p>
            <button type="button" className="mcp-contact-primary" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mcp-contact-form">
            <h3 id="mcp-contact-title">{title}</h3>
            <p className="mcp-contact-subtitle">
              Goes straight to the MyCityPulse inbox. Email is optional — leave it blank for anonymous.
            </p>

            {contextLines.length > 0 && (
              <div className="mcp-contact-context" aria-label="Context being shared with your message">
                {contextLines.map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </div>
            )}

            <label className="mcp-contact-field">
              <span>Your name (optional)</span>
              <input
                ref={firstFieldRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                autoComplete="name"
              />
            </label>

            <label className="mcp-contact-field">
              <span>Email (optional)</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
                inputMode="email"
              />
            </label>

            <label className="mcp-contact-field">
              <span>Message</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What would you like to tell us?"
                rows={5}
                maxLength={2000}
                required
              />
            </label>

            {error && <p className="mcp-contact-error">{error}</p>}

            <div className="mcp-contact-actions">
              <button
                type="button"
                className="mcp-contact-secondary"
                onClick={onClose}
                disabled={submitState === "submitting"}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="mcp-contact-primary"
                disabled={submitState === "submitting"}
              >
                {submitState === "submitting" ? "Sending..." : "Send message"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
