import { lazy, Suspense, useEffect, useState } from "react";
import { CITY_ISSUES, CIVIC_ORGS, CITIES_WITH_DATA, WARD_CORPORATORS } from "../../cityData.js";
import { CITY_IMAGES, STRESS, TYPO_C, TYPO_LABEL, TYPO_PUBLIC_DESC, fmt } from "../../domain/cities/presentation.js";
import { loadElectionData } from "../../domain/elections/loadElectionData.js";
import { buildMailtoHref } from "../../lib/contact.js";
import WardsPanel from "./WardsPanel.jsx";

const ElectionsCard = lazy(() => import("../../components/ElectionsCard"));

export default function CityPage({ city, onBack, requestedPanel = null, onPanelHandled, onPanelChange }) {
  const sc = STRESS[city.stress];
  const typoColor = TYPO_C[city.urban_typology];
  const imgUrl = CITY_IMAGES[city.city];
  const [imgErr, setImgErr] = useState(false);
  const hasData = CITIES_WITH_DATA.has(city.city);
  const issues = CITY_ISSUES[city.city] || [];
  const orgs = CIVIC_ORGS[city.city] || [];
  const wardData = WARD_CORPORATORS[city.city] || null;
  const [electionData, setElectionData] = useState(null);
  const [isElectionLoading, setIsElectionLoading] = useState(false);

  const [activePanel, setActivePanel] = useState("health");
  const issueContributionHref = buildMailtoHref({
    subject: `${city.city} issue profile contribution`,
    lines: [
      "Hi MyCityPulse,",
      "",
      `I want to help build the civic issue profile for ${city.city}.`,
      "Here are the issues, sources, or local observations I’d like to contribute:",
      "",
    ],
  });
  const orgContributionHref = buildMailtoHref({
    subject: `${city.city} organization nomination`,
    lines: [
      "Hi MyCityPulse,",
      "",
      `I want to nominate an organization or civic group in ${city.city}.`,
      "Organization name:",
      "What they work on:",
      "Link or contact:",
      "Why they matter:",
    ],
  });
  const cocreatorHref = buildMailtoHref({
    subject: `${city.city} cocreator interest`,
    lines: [
      "Hi MyCityPulse,",
      "",
      `I want to help with ${city.city}.`,
      "My name:",
      "My email:",
      "How I’d like to contribute:",
    ],
  });

  const panels = [
    { id: "health", label: "City Health" },
    { id: "issues", label: "Civic Issues" },
    { id: "ecosystem", label: "Civic Ecosystem" },
    ...(city.hasElections ? [{ id: "elections", label: "Elections" }] : []),
    ...(wardData ? [{ id: "wards", label: "Wards & Corporators" }] : []),
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!requestedPanel) {
      return;
    }

    const panelExists = panels.some((panel) => panel.id === requestedPanel);

    if (!panelExists) {
      onPanelHandled?.();
      return;
    }

    if (requestedPanel === "elections" && city.hasElections && !electionData) {
      setIsElectionLoading(true);
    }

    setActivePanel(requestedPanel);
    window.scrollTo({ top: 0, behavior: "smooth" });
    onPanelHandled?.();
  }, [requestedPanel, panels, city.hasElections, electionData, onPanelHandled]);

  useEffect(() => {
    let isMounted = true;

    if (!city.hasElections || activePanel !== "elections" || electionData || !isElectionLoading) {
      return undefined;
    }

    loadElectionData(city.city)
      .then((data) => {
        if (isMounted) {
          setElectionData(data);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsElectionLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activePanel, city, electionData, isElectionLoading]);

  const stats = [
    { label: "Population", value: fmt(city.population) },
    { label: "Area", value: `${city.area.toLocaleString()} km²` },
    { label: "Density", value: `${city.density.toLocaleString()}/km²` },
    { label: "Rank in India", value: `#${city.rank}` },
  ];

  return (
    <div style={{ background: "#FAF8F4", minHeight: "100vh" }}>
      <div className="city-page-hero" style={{ height: 380, position: "relative", overflow: "hidden", background: "#0D1117" }}>
        {imgUrl && !imgErr ? (
          <img
            src={imgUrl}
            alt={city.city}
            decoding="async"
            onError={() => setImgErr(true)}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 }}
          />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${sc.color}44, ${typoColor}33)` }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(13,17,23,0.2) 0%, rgba(13,17,23,0.85) 100%)" }} />
        <button
          onClick={onBack}
          className="city-page-back-btn"
          style={{
            position: "absolute",
            top: 76,
            left: 32,
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
            padding: "8px 18px",
            borderRadius: 20,
            fontSize: 13,
            cursor: "pointer",
            backdropFilter: "blur(8px)",
          }}
        >
          ← All Cities
        </button>
        <div className="city-page-hero-copy" style={{ position: "absolute", bottom: 32, left: 32, right: 32 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            <span
              title={`${city.stress} Stress - ${STRESS[city.stress]?.tagline}`}
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: sc.color,
                background: "rgba(0,0,0,0.55)",
                padding: "4px 12px",
                borderRadius: 12,
                backdropFilter: "blur(4px)",
                cursor: "help",
              }}
            >
              {city.stress} Stress
            </span>
            <span
              title={TYPO_PUBLIC_DESC[city.urban_typology]}
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: typoColor,
                background: "rgba(0,0,0,0.55)",
                padding: "4px 12px",
                borderRadius: 12,
                backdropFilter: "blur(4px)",
                cursor: "help",
              }}
            >
              {TYPO_LABEL[city.urban_typology]}
            </span>
            <span
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.7)",
                background: "rgba(0,0,0,0.55)",
                padding: "4px 12px",
                borderRadius: 12,
                backdropFilter: "blur(4px)",
              }}
            >
              {city.tier}
            </span>
          </div>
          <h1
            className="city-page-title"
            style={{
              fontSize: 48,
              fontFamily: "Georgia, serif",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: 8,
            }}
          >
            {city.city}
          </h1>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 15 }}>
            {city.state}
            {city.formerName ? ` - formerly ${city.formerName}` : ""}
          </div>
        </div>
      </div>

      <nav className="panel-nav" aria-label="City page sections">
        <div className="panel-nav-inner">
          {panels.map((panel) => (
            <button
              key={panel.id}
              className={`panel-tab${activePanel === panel.id ? " active" : ""}`}
              onClick={() => {
                if (panel.id === "elections" && city.hasElections && !electionData) {
                  setIsElectionLoading(true);
                }
                setActivePanel(panel.id);
                if (onPanelChange) {
                  onPanelChange(panel.id);
                }
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              aria-current={activePanel === panel.id ? "page" : undefined}
            >
              {panel.label}
            </button>
          ))}
        </div>
      </nav>

      {activePanel === "health" && (
        <div className="page-section-tight" style={{ background: "#FAF8F4", paddingTop: 52, paddingBottom: 0 }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#E8660D", letterSpacing: "0.12em", marginBottom: 20 }}>
              PANEL 1 - CITY HEALTH
            </div>

            <blockquote
              style={{
                fontSize: 22,
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                color: "#2a2a2a",
                lineHeight: 1.6,
                borderLeft: `4px solid ${sc.color}`,
                paddingLeft: 24,
                marginBottom: 40,
              }}
            >
              "{city.one_liner}"
            </blockquote>

            <div className="city-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  style={{ background: "#fff", borderRadius: 12, padding: "20px 16px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
                >
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#1a1a1a", fontFamily: "Georgia, serif" }}>{stat.value}</div>
                  <div style={{ fontSize: 10, color: "#aaa", marginTop: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 11, color: "#bbb", marginBottom: 24, lineHeight: 1.6 }}>
              Population and area come from public datasets. Stress, city category, and city narratives are MyCityPulse editorial judgments. Issue,
              organisation, ward, and election coverage varies by city and should be read as a guided starting point, not an official civic record.
            </p>

            <div style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", marginBottom: 32, boxShadow: "0 1px 4px rgba(0,0,0,0.05)", borderLeft: "3px solid #E8660D" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#E8660D", letterSpacing: "0.1em", marginBottom: 10 }}>HOW TO READ THIS PAGE</div>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, margin: "0 0 14px" }}>
                This page mixes public facts with editorial analysis. Use it to orient yourself quickly, understand what pressure points matter, and decide where to dig deeper next.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Public data where available", "Editorial analysis", "Coverage varies by city"].map((label) => (
                  <span
                    key={label}
                    style={{ fontSize: 11, fontWeight: 700, color: "#666", background: "#f5f3ee", padding: "5px 10px", borderRadius: 999 }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="city-dual-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 64 }}>
              <div style={{ background: "#fff", borderRadius: 14, padding: 28, borderTop: `3px solid ${sc.color}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: sc.color, letterSpacing: "0.12em", marginBottom: 10 }}>CIVIC STRESS</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: sc.color, fontFamily: "Georgia, serif", marginBottom: 6 }}>{city.stress}</div>
                <div style={{ height: 6, background: "#f0ede8", borderRadius: 4, overflow: "hidden", marginBottom: 14 }}>
                  <div style={{ width: `${(sc.bar / 5) * 100}%`, height: "100%", background: sc.color, borderRadius: 4 }} />
                </div>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7 }}>{city.stress_reason}</p>
              </div>
              <div style={{ background: "#fff", borderRadius: 14, padding: 28, borderTop: `3px solid ${typoColor}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: typoColor, letterSpacing: "0.12em", marginBottom: 10 }}>CITY CATEGORY</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: typoColor, fontFamily: "Georgia, serif", marginBottom: 12 }}>
                  {TYPO_LABEL[city.urban_typology]}
                </div>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7 }}>{TYPO_PUBLIC_DESC[city.urban_typology]}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activePanel === "issues" && (
        <div className="page-section-tight" style={{ background: "#fff", paddingTop: 52, paddingBottom: 52 }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#E8660D", letterSpacing: "0.12em", marginBottom: 12 }}>PANEL 2 - CIVIC ISSUES</div>
            <h2 className="city-panel-title" style={{ fontSize: 32, fontFamily: "Georgia, serif", fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
              What's happening in {city.city}.
            </h2>
            <p style={{ fontSize: 15, color: "#888", marginBottom: 40, lineHeight: 1.6 }}>
              The issues that shape daily life in this city, explained plainly and editorially. This is not a live complaints feed or official incident dashboard.
            </p>

            {!hasData ? (
              <div style={{ background: "#FAF8F4", borderRadius: 14, padding: "40px 32px", textAlign: "center", border: "2px dashed #e0ddd8" }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>We're building</div>
                <div style={{ fontSize: 16, fontFamily: "Georgia, serif", fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
                  We're building {city.city}'s issue profile.
                </div>
                <p style={{ fontSize: 14, color: "#888", maxWidth: 400, margin: "0 auto 20px", lineHeight: 1.6 }}>
                  Know the civic issues shaping {city.city}? Know organizations working on them? Help us build this.
                </p>
                <a href={issueContributionHref} style={{ background: "#E8660D", color: "#fff", padding: "10px 24px", borderRadius: 24, fontSize: 13, fontWeight: 700, display: "inline-block" }}>
                  Send Issue Notes -&gt;
                </a>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {issues.map((issue, index) => (
                  <div
                    key={index}
                    className="city-issue-card"
                    style={{
                      background: "#FAF8F4",
                      borderRadius: 14,
                      padding: "28px 28px 28px 0",
                      display: "flex",
                      gap: 0,
                      overflow: "hidden",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div style={{ width: 5, flexShrink: 0, background: issue.categoryColor, borderRadius: "14px 0 0 14px", marginRight: 28 }} />
                    <div style={{ flex: 1 }}>
                      <div className="city-issue-header" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: issue.categoryColor, background: `${issue.categoryColor}18`, padding: "3px 10px", borderRadius: 8 }}>
                          {issue.tag}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            color: STRESS[issue.severity]?.color || "#888",
                            background: `${STRESS[issue.severity]?.color || "#888"}15`,
                            padding: "3px 8px",
                            borderRadius: 6,
                          }}
                        >
                          {issue.severity}
                        </span>
                      </div>
                      <h3 style={{ fontSize: 18, fontFamily: "Georgia, serif", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.4, marginBottom: 12 }}>
                        {issue.title}
                      </h3>
                      <p style={{ fontSize: 14, color: "#555", lineHeight: 1.75, marginBottom: 16 }}>{issue.body}</p>
                      <div style={{ background: "#fff", borderRadius: 8, padding: "12px 16px", borderLeft: "3px solid #e0ddd8" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#aaa", letterSpacing: "0.08em", display: "block", marginBottom: 4 }}>
                          WHAT'S BEING DONE
                        </span>
                        <p style={{ fontSize: 13, color: "#777", lineHeight: 1.6, margin: 0 }}>{issue.whatsBeing}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activePanel === "ecosystem" && (
        <div className="page-section-tight" style={{ background: "#FAF8F4", paddingTop: 52, paddingBottom: 52 }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#E8660D", letterSpacing: "0.12em", marginBottom: 12 }}>PANEL 3 - CIVIC ECOSYSTEM</div>
            <h2 className="city-panel-title" style={{ fontSize: 32, fontFamily: "Georgia, serif", fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
              Who's fighting for {city.city}.
            </h2>
            <p style={{ fontSize: 15, color: "#888", marginBottom: 40, lineHeight: 1.6 }}>
              Selected organizations, collectives, and initiatives doing real civic work in this city. This is a curated directory, not a complete registry.
            </p>

            {orgs.length === 0 ? (
              <div style={{ background: "#fff", borderRadius: 14, padding: "40px 32px", textAlign: "center", border: "2px dashed #e0ddd8" }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>Connect</div>
                <div style={{ fontSize: 16, fontFamily: "Georgia, serif", fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
                  Know who's working on {city.city}?
                </div>
                <p style={{ fontSize: 14, color: "#888", maxWidth: 400, margin: "0 auto 20px", lineHeight: 1.6 }}>
                  Help us map the civic ecosystem - NGOs, RWAs, collectives, journalists doing good work here.
                </p>
                <a href={orgContributionHref} style={{ background: "#E8660D", color: "#fff", padding: "10px 24px", borderRadius: 24, fontSize: 13, fontWeight: 700, display: "inline-block" }}>
                  Nominate an Organization -&gt;
                </a>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {orgs.map((org, index) => (
                  <div
                    key={index}
                    style={{ background: "#fff", borderRadius: 14, padding: 28, boxShadow: "0 1px 4px rgba(0,0,0,0.05)", borderTop: `3px solid ${org.focusColor}` }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 17, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>{org.name}</div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: org.focusColor, background: `${org.focusColor}18`, padding: "3px 10px", borderRadius: 8 }}>
                          {org.focus}
                        </span>
                      </div>
                      <a
                        href={org.link}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#E8660D",
                          border: "1.5px solid #E8660D",
                          padding: "6px 16px",
                          borderRadius: 20,
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                          Visit -&gt;
                      </a>
                    </div>
                    <p style={{ fontSize: 14, color: "#555", lineHeight: 1.75, marginBottom: 14 }}>{org.what}</p>
                    <div style={{ background: "#FAF8F4", borderRadius: 8, padding: "12px 16px", borderLeft: `3px solid ${org.focusColor}` }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#aaa", letterSpacing: "0.08em", display: "block", marginBottom: 4 }}>
                        HOW TO GET INVOLVED
                      </span>
                      <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, margin: 0 }}>{org.how}</p>
                    </div>
                  </div>
                ))}

                <div style={{ borderRadius: 14, padding: "24px 28px", border: "2px dashed #e0ddd8", textAlign: "center" }}>
                  <p style={{ fontSize: 14, color: "#aaa", margin: "0 0 12px" }}>Know an organization doing good work in {city.city} that should be here?</p>
                  <a href={orgContributionHref} style={{ fontSize: 13, fontWeight: 700, color: "#E8660D" }}>
                      Nominate them -&gt;
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activePanel === "elections" && city.hasElections && (
        <div className="page-section-tight" style={{ background: "#fff", paddingTop: 52, paddingBottom: 52 }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#667eea", letterSpacing: "0.12em", marginBottom: 12 }}>PANEL 4 - ELECTIONS</div>
            <h2 className="city-panel-title" style={{ fontSize: 32, fontFamily: "Georgia, serif", fontWeight: 700, color: "#1a1a1a", marginBottom: 40 }}>
              Municipal Elections
            </h2>
            {isElectionLoading && (
              <div style={{ background: "#faf8f4", borderRadius: 14, padding: "18px 20px", color: "#666" }}>
                Loading election data for {city.city}...
              </div>
            )}
            {!isElectionLoading && electionData && (
              <Suspense
                fallback={
                  <div style={{ background: "#faf8f4", borderRadius: 14, padding: "18px 20px", color: "#666" }}>
                    Loading election tools...
                  </div>
                }
              >
                <ElectionsCard election={electionData} cityName={city.city} />
              </Suspense>
            )}
          </div>
        </div>
      )}

      {activePanel === "wards" && <WardsPanel city={city} />}

      <div className="page-section" style={{ background: "#0D1117", paddingTop: 60, paddingBottom: 60 }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 26, fontFamily: "Georgia, serif", fontWeight: 700, color: "#fff", marginBottom: 12 }}>
            {city.city} is your city too.
          </div>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: 440, margin: "0 auto 28px", fontFamily: "Georgia, serif" }}>
            MyCityPulse exists to make the civic layer of your city legible - and to connect you with the people already working to fix it. Join the conversation.
          </p>
          <a
            href={cocreatorHref}
            style={{
              background: "#E8660D",
              color: "#fff",
              padding: "13px 32px",
              borderRadius: 30,
              fontSize: 14,
              fontWeight: 700,
              display: "inline-block",
              letterSpacing: "0.02em",
            }}
          >
              Become a Cocreator -&gt;
          </a>
        </div>
      </div>
    </div>
  );
}
