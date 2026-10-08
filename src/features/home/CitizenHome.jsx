import { useEffect, useRef, useState } from "react";
import "./CitizenHome.css";

const OFFICIAL = "https://www.amccrs.com/AMCPortal";
const TRACK = "https://www.amccrs.com/AMCPortal/Complaint/TrackProgress?activeTab=token";
const STORAGE_KEY = "mcp:citizen:cases:v1";

const ISSUES = [
  { id: "collection", icon: "↻", title: "Garbage not collected", department: "Sanitation / solid waste services", question: "Was the waste meant to be collected from a home, a society, or a public bin?", steps: "Record the missed collection dates. If it is a society service, check whether the society contractor or the municipal service is responsible." },
  { id: "dumping", icon: "▦", title: "Waste dumped nearby", department: "Sanitation / solid waste services", question: "Is it on public land, a road, or inside a privately managed property?", steps: "Add a landmark and describe the type of waste. The authority may differ for public and private property." },
  { id: "light", icon: "✳", title: "Streetlight not working", department: "Streetlighting / electrical services", question: "Is this a public streetlight or lighting inside a private society?", steps: "Look for a pole number or nearby landmark. Private lighting usually requires a different route." },
  { id: "road", icon: "〰", title: "Pothole or broken road", department: "Roads / engineering services", question: "Is this a municipal road, state road, highway, or private internal road?", steps: "Note the precise stretch and a recognizable landmark. Road ownership needs verification before routing." },
  { id: "water", icon: "◉", title: "Water or drainage issue", department: "Water supply / drainage services", question: "Is the problem with a municipal line or a society's internal system?", steps: "Record when it started and whether neighbouring properties are affected. Urgent flooding requires immediate local help." },
  { id: "other", icon: "+", title: "Something else", department: "Service desk to be determined", question: "Which service is affected, and who maintains the location?", steps: "Describe the problem in plain words. Do not assume a particular department without verifying responsibility." }
];

const PILOT_AREAS = ["South Bopal", "Bopal", "Ghuma", "Shela", "Shilaj", "Another Ahmedabad locality", "Outside Ahmedabad"];
const EMPTY = { issue: "collection", area: "", landmark: "", detail: "" };

function safeLoad() {
  try { const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); return Array.isArray(value) ? value.slice(0, 25) : []; }
  catch { return []; }
}
function draftFor(form, issue) {
  const where = [form.landmark.trim(), form.area].filter(Boolean).join(", ");
  return `Subject: Request for assistance: ${issue.title}

Hello,

I would like to report the following issue at ${where || "[location]"}.

Issue: ${issue.title}
Description: ${form.detail.trim() || "[Please describe what happened, since when, and how it affects people.]"}

Please advise which department or service provider is responsible, register the complaint if this falls under your jurisdiction, and share a reference number for follow-up.

Thank you.`;
}

export default function CitizenHome() {
  const [mode, setMode] = useState("landing");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY);
  const [draft, setDraft] = useState("");
  const [reference, setReference] = useState("");
  const [cases, setCases] = useState(safeLoad);
  const [notification, setNotification] = useState("");
  const [error, setError] = useState("");
  const flowRef = useRef(null);
  const issue = ISSUES.find(item => item.id === form.issue) || ISSUES[0];
  const inAhmedabad = !!form.area && form.area !== "Outside Ahmedabad";
  const pilot = ["South Bopal", "Bopal", "Ghuma", "Shela", "Shilaj"].includes(form.area);
  const progress = step === 1 ? "01 / 03" : step === 2 ? "02 / 03" : "03 / 03";

  useEffect(() => {
    document.title = "MyCityPulse | Know where to start";
  }, []);

  useEffect(() => {
    if (mode !== "flow" && mode !== "saved") return;
    window.requestAnimationFrame(() => flowRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }, [mode]);

  function startFlow(selectedIssue = null) {
    setMode("flow");
    setStep(1);
    setError("");
    setNotification("");
    if (selectedIssue) setForm(previous => ({ ...previous, issue: selectedIssue }));
    else setForm(EMPTY);
    window.requestAnimationFrame(() => flowRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
  function next() {
    setError("");
    if (step === 1 && !form.area) { setError("Choose a locality so we can give location-appropriate guidance."); return; }
    if (step === 1) { setStep(2); return; }
    if (step === 2) { setDraft(draftFor(form, issue)); setStep(3); }
  }
  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(draft);
      setNotification("Complaint draft copied. You can paste and edit it in the official channel.");
    } catch {
      setNotification("Clipboard access was blocked. Select the draft above and copy it manually.");
    }
  }
  function saveCase() {
    const entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      added: new Date().toISOString(),
      issue: issue.title, area: form.area, landmark: form.landmark.trim(),
      reference: reference.trim(), note: form.detail.trim().slice(0, 400)
    };
    const updated = [entry, ...cases].slice(0, 25);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setCases(updated);
      setNotification(reference.trim() ? "Saved on this device. This is not linked to the government portal." : "Saved as a draft on this device. No complaint has been submitted.");
      setReference("");
    } catch { setNotification("Local storage is unavailable. Copy the draft to keep it."); }
  }
  function removeCase(id) {
    const updated = cases.filter(item => item.id !== id);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); setCases(updated); }
    catch { setNotification("Couldn't update this browser's storage."); }
  }

  return (
    <div className="mcp-citizen" id="top">
      <div className="mcp-notice"><span className="mcp-signal" /> EARLY PILOT · AHMEDABAD FIRST <span className="mcp-sep">/</span> INDEPENDENT CIVIC GUIDE</div>
      <header className="mcp-header mcp-wrap">
        <a href="/" className="mcp-wordmark" aria-label="MyCityPulse home"><span className="mcp-logomark"><i /><i /><i /><i /></span><span>mycity<b>pulse</b><small>.in</small></span></a>
        <nav aria-label="Website" className="mcp-nav">
          <a href="/explore">Explore cities</a>
          <a href="/ahmedabad">Ahmedabad</a>
          <a href="/compare">Compare</a>
          <button type="button" onClick={() => { setMode("saved"); setNotification(""); }}>Saved cases <span className="mcp-count">{cases.length}</span></button>
        </nav>
        <button type="button" className="mcp-btn mcp-btn-dark mcp-nav-cta" onClick={() => startFlow()}>Find my next step <span aria-hidden="true">↗</span></button>
      </header>

      <main>
        <section className="mcp-hero mcp-wrap" aria-labelledby="mcp-hero-title">
          <div className="mcp-hero-content">
            <div className="mcp-eyebrow"><span /> MAKING PUBLIC SYSTEMS USABLE</div>
            <h1 id="mcp-hero-title">Your city has a problem.<br /><em>Where do you begin?</em></h1>
            <p className="mcp-hero-lead">The garbage wasn't collected. A streetlight went dark. There's a pothole outside your gate. Who's supposed to handle it?</p>
            <p className="mcp-hero-sub">Describe what happened. Understand the likely responsibility. Leave with a clear next step.</p>
            <div className="mcp-hero-buttons">
              <button type="button" className="mcp-btn mcp-btn-orange" onClick={() => startFlow()}>Find who handles it <span>↗</span></button>
              <a href="#how" className="mcp-btn mcp-btn-outline">How it works <span>↓</span></a>
            </div>
            <div className="mcp-trust"><span>✓ No login</span><span>✓ No automatic submission</span><span>✓ Free pilot</span></div>
          </div>
          <div className="mcp-scene" aria-label="Illustration of a neighbourhood problem">
            <div className="mcp-scene-top"><span><span className="mcp-signal" /> AN EVERYDAY CITY MOMENT</span><span>23° N / 72° E</span></div>
            <div className="mcp-art">
              <div className="mcp-sun" /><div className="mcp-cloud" />
              <div className="mcp-house house-one"><div /><div /><div /></div>
              <div className="mcp-house house-two"><div /><div /><div /></div>
              <div className="mcp-house house-three"><div /><div /></div>
              <div className="mcp-tree"><span /><i /></div>
              <div className="mcp-road"><span /><span /></div>
              <div className="mcp-pin">!</div>
            </div>
            <div className="mcp-scene-caption"><div><small>AN ORDINARY QUESTION</small><strong>“Kachra kyare uthse?”</strong><p>Garbage waiting outside the society gate.</p></div><span>↗</span></div>
            <div className="mcp-scene-bottom"><span>START WITH WHAT YOU SEE</span><span>AHMEDABAD EDGE</span></div>
          </div>
        </section>

        <section className="mcp-issues" aria-label="Common local problems">
          <div className="mcp-wrap"><div className="mcp-issues-head"><span>DOES THIS SOUND FAMILIAR?</span><span>CHOOSE A STARTING POINT ↘</span></div>
            <div className="mcp-issue-grid">{ISSUES.slice(0, 4).map(option => (
              <button type="button" key={option.id} onClick={() => startFlow(option.id)} className="mcp-issue"><span className="mcp-issue-icon">{option.icon}</span><span>{option.title}</span><span className="mcp-issue-arrow">↗</span></button>
            ))}</div>
          </div>
        </section>

        <section className="mcp-flow-wrap mcp-wrap" ref={flowRef} id="field-desk" aria-label="Citizen guidance">
          {mode === "flow" && (
            <div className="mcp-flow">
              <div className="mcp-flow-heading"><div><span className="mcp-eyebrow"><span /> YOUR NEIGHBOURHOOD FIELD DESK</span><h2>{step === 1 ? "Tell us what happened." : step === 2 ? "Let's find the right starting point." : "Take the next step."}</h2></div><div className="mcp-step-count">STEP {progress}</div></div>
              <div className="mcp-track"><span style={{ width: `${step * 100 / 3}%` }} /></div>
              {step === 1 && (
                <div className="mcp-form">
                  <label className="mcp-label">What is the issue?</label>
                  <div className="mcp-chooser">{ISSUES.map(option => <button type="button" key={option.id} className={form.issue === option.id ? "mcp-choice selected" : "mcp-choice"} aria-pressed={form.issue === option.id} onClick={() => setForm({ ...form, issue: option.id })}><span>{option.icon}</span>{option.title}</button>)}</div>
                  <div className="mcp-form-cols"><div><label className="mcp-label" htmlFor="mcp-area">Where is it happening? *</label><select id="mcp-area" value={form.area} onChange={event => setForm({ ...form, area: event.target.value })}><option value="">Choose a locality</option>{PILOT_AREAS.map(area => <option key={area}>{area}</option>)}</select></div><div><label className="mcp-label" htmlFor="mcp-landmark">Landmark or society (optional)</label><input id="mcp-landmark" value={form.landmark} onChange={event => setForm({ ...form, landmark: event.target.value })} maxLength={140} placeholder="Near the society gate" /></div></div>
                  <label className="mcp-label" htmlFor="mcp-detail">What exactly happened? (optional)</label><textarea id="mcp-detail" rows={4} maxLength={1200} value={form.detail} onChange={event => setForm({ ...form, detail: event.target.value })} placeholder="Collection has not happened for the past three days..." />
                  <p className="mcp-help">No GPS, name or phone number required. Don't include personal information in your description.</p>
                  {error && <p role="alert" className="mcp-error">{error}</p>}
                  <div className="mcp-form-actions"><button type="button" className="mcp-btn mcp-btn-orange" onClick={next}>Understand the next step <span>→</span></button><button type="button" className="mcp-quiet" onClick={() => setMode("landing")}>Close</button></div>
                </div>
              )}
              {step === 2 && (
                <div className="mcp-result">
                  <div className="mcp-result-card"><span className="mcp-result-tag">PROVISIONAL GUIDANCE, NOT VERIFIED ROUTING</span><div className="mcp-result-grid"><div><small>THE ISSUE</small><strong>{issue.title}</strong></div><div><small>LOCATION</small><strong>{form.area}</strong></div><div><small>LIKELY SERVICE AREA</small><strong>{issue.department}</strong></div></div><h3>First, ask the right question.</h3><p>{issue.question}</p><p>{issue.steps}</p><div className="mcp-caution"><strong>What we have not verified:</strong> The exact municipal jurisdiction, service provider, ward and desk for your specific address. {pilot ? "The pilot area spans places with different service arrangements." : "Outside the pilot area, the guidance is especially general."}</div></div>
                  <div className="mcp-form-actions"><button type="button" className="mcp-btn mcp-btn-orange" onClick={next}>Prepare a complaint draft <span>→</span></button><button type="button" className="mcp-quiet" onClick={() => setStep(1)}>← Edit details</button></div>
                </div>
              )}
              {step === 3 && (
                <div className="mcp-result">
                  <label className="mcp-label" htmlFor="mcp-draft">Your editable message</label><textarea id="mcp-draft" className="mcp-draft" rows={11} value={draft} onChange={event => setDraft(event.target.value)} />
                  <div className="mcp-form-actions"><button type="button" className="mcp-btn mcp-btn-dark" onClick={copyDraft}>Copy complaint draft <span>⧉</span></button><button type="button" className="mcp-quiet" onClick={() => setStep(2)}>← Back to guidance</button></div>
                  <div className="mcp-official">
                    <span>OFFICIAL FILING IS A SEPARATE STEP</span>
                    <p>MyCityPulse has not sent this complaint. Open an official service channel and confirm the correct jurisdiction before submitting.</p>
                    {inAhmedabad ? <div className="mcp-link-row"><a href={OFFICIAL} target="_blank" rel="noopener noreferrer">AMC CCRS portal ↗</a><a href={TRACK} target="_blank" rel="noopener noreferrer">Track on AMC CCRS ↗</a><a href="tel:155303">AMC helpline: 155303 ↗</a></div> : <p className="mcp-caution">Outside Ahmedabad: identify your local authority's official service channel. This pilot cannot verify it for you.</p>}
                    {inAhmedabad && <p className="mcp-help">AMC links are useful only for addresses and services within AMC jurisdiction. These are official external websites, not MyCityPulse integrations.</p>}
                  </div>
                  <div className="mcp-save"><label className="mcp-label" htmlFor="mcp-reference">Received an official reference number? (optional)</label><div className="mcp-save-row"><input id="mcp-reference" value={reference} onChange={event => setReference(event.target.value)} maxLength={80} placeholder="Paste official acknowledgement here" /><button type="button" className="mcp-btn mcp-btn-outline" onClick={saveCase}>Save privately ✓</button></div><p className="mcp-help">Cases stay only in this browser, not synced to the government or MyCityPulse servers.</p></div>
                  {notification && <p className="mcp-success" role="status">{notification}</p>}
                </div>
              )}
            </div>
          )}
          {mode === "saved" && (
            <div className="mcp-flow"><div className="mcp-flow-heading"><div><span className="mcp-eyebrow"><span /> YOUR DEVICE ONLY</span><h2>Saved cases.</h2></div><button type="button" className="mcp-quiet" onClick={() => setMode("landing")}>Close ✕</button></div>
              {!cases.length ? <p className="mcp-empty">Nothing saved here yet. Start with a neighbourhood issue.</p> : <div className="mcp-saved-grid">{cases.map(item => <article key={item.id} className="mcp-saved-card"><small>{new Date(item.added).toLocaleDateString("en-IN")}</small><h3>{item.issue}</h3><p>{[item.landmark,item.area].filter(Boolean).join(", ")}</p><p>Official reference: <strong>{item.reference || "Not yet filed"}</strong></p><button type="button" onClick={() => removeCase(item.id)}>Delete this local record</button></article>)}</div>}
              <p className="mcp-help">These records cannot be seen on another device. Clearing browser data can remove them.</p>
              <button type="button" className="mcp-btn mcp-btn-orange" onClick={() => startFlow()}>Start a new issue ↗</button>{notification && <p className="mcp-success">{notification}</p>}
            </div>
          )}
        </section>

        <section id="how" className="mcp-how mcp-wrap"><div className="mcp-section-heading"><div><span className="mcp-eyebrow"><span /> FROM QUESTION TO ACTION</span><h2>Less confusion.<br /><em>One practical next step.</em></h2></div><p>We help with the part before the complaint reaches a government system. We don't pretend to replace that system.</p></div><div className="mcp-how-grid">
          <article><div className="mcp-number">01 <span>↘</span></div><span className="mcp-how-icon">◎</span><h3>Tell us what you see</h3><p>A broken light, missed collection or damaged road. Begin with the problem, not the department.</p></article>
          <article><div className="mcp-number">02 <span>↘</span></div><span className="mcp-how-icon">⌁</span><h3>Understand responsibility</h3><p>See the likely service area and the questions that need answering before routing is certain.</p></article>
          <article><div className="mcp-number">03 <span>✓</span></div><span className="mcp-how-icon">▤</span><h3>Act through the real channel</h3><p>Prepare your message, use the official portal, then privately save the acknowledgement for follow-up.</p></article>
        </div></section>

        <section className="mcp-pilot"><div className="mcp-wrap mcp-pilot-grid"><div><span className="mcp-eyebrow"><span /> SMALL PILOT, REAL QUESTIONS</span><h2>Starting at the<br /><em>Ahmedabad edge.</em></h2><p>On the city's western edge, a resident may live in a society, use a public road and depend on multiple service arrangements. Finding the responsible institution should be easier.</p><div className="mcp-tags">{["South Bopal","Bopal","Ghuma","Shela","Shilaj"].map(x=><span key={x}>{x}</span>)}</div><p className="mcp-caveat">Listed as study localities, not a claim of verified municipal coverage or uniform jurisdiction.</p></div><div className="mcp-pilot-panel"><div>YOUR NEIGHBOURHOOD ISN'T A DEPARTMENT</div><div className="mcp-concentric"><i/><i/><i/><span/></div><strong>One place.<br/>Many overlapping systems.</strong><small>MAKING THE NEXT STEP VISIBLE</small></div></div></section>

        <section className="mcp-more mcp-wrap"><div className="mcp-section-heading"><div><span className="mcp-eyebrow"><span /> THERE'S MORE TO A CITY</span><h2>Explore the city<br /><em>beyond the complaint.</em></h2></div><p>The city atlas, ward information, comparison tools and civic stories from the existing MyCityPulse website are still here.</p></div><div className="mcp-more-grid">
          <a href="/explore"><span>01 / EXPLORE</span><h3>Discover Indian cities</h3><p>Find city profiles and understand the places around you.</p><strong>Explore the city atlas ↗</strong></a>
          <a href="/ahmedabad"><span>02 / LOCAL</span><h3>Get to know Ahmedabad</h3><p>Explore local civic context and ward-level information.</p><strong>Open Ahmedabad ↗</strong></a>
          <a href="/compare"><span>03 / PERSPECTIVE</span><h3>Compare cities</h3><p>Understand how different cities grow and function.</p><strong>Compare cities ↗</strong></a>
        </div></section>
        <section className="mcp-last"><div className="mcp-wrap mcp-last-inner"><div><span>INDEPENDENT. EARLY. LEARNING.</span><h2>Not another complaint box.</h2><p>Government systems already accept complaints. We want to help people understand where to begin. No promise of official routing or resolution.</p></div><button type="button" className="mcp-btn mcp-btn-orange" onClick={() => startFlow()}>Try the citizen journey ↗</button></div></section>
      </main>
      <footer className="mcp-footer"><div className="mcp-wrap mcp-footer-grid"><div><a href="/" className="mcp-wordmark"><span className="mcp-logomark"><i/><i/><i/><i/></span><span>mycity<b>pulse</b><small>.in</small></span></a><p>Making complicated public systems usable by ordinary people.</p></div><div><b>BEFORE YOU FILE</b><p>This is an independent pilot. No government affiliation. Guidance is provisional; no official complaint is submitted here.</p></div><div><b>KEEP EXPLORING</b><a href="/explore">Explore cities ↗</a><a href="/ahmedabad/elections">Ahmedabad civic information ↗</a><a href={OFFICIAL} target="_blank" rel="noopener noreferrer">Official AMC CCRS ↗</a></div></div><div className="mcp-wrap mcp-footer-bottom"><span>© 2026 MyCityPulse · Pilot concept</span><span>See the issue. Find the way.</span></div></footer>
      <div className="mcp-mobile-bar"><a href="/explore">⌕ <span>Explore</span></a><button type="button" onClick={() => startFlow()}>+ <span>New issue</span></button><button type="button" onClick={() => { setMode("saved"); setNotification(""); }}>▤ <span>Saved</span></button></div>
    </div>
  );
}
