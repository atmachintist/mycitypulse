import { useState } from "react";
import { WARD_CORPORATORS } from "../../cityData.js";

export default function WardsPanel({ city }) {
  const data = WARD_CORPORATORS[city.city];
  const [q, setQ] = useState("");
  const [zoneFilter, setZoneFilter] = useState("All");

  if (!data) return null;

  const filtered = data.wards.filter((ward) => {
    const matchZone = zoneFilter === "All" || ward.zone === zoneFilter;
    const ql = q.toLowerCase().trim();
    const matchQ =
      !ql ||
      ward.name.toLowerCase().includes(ql) ||
      ward.corporator.toLowerCase().includes(ql) ||
      ward.party.toLowerCase().includes(ql);

    return matchZone && matchQ;
  });

  return (
    <div style={{ background: "#FAF8F4", padding: "52px 32px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#E8660D", letterSpacing: "0.12em", marginBottom: 12 }}>
          PANEL 4 - WARD REPRESENTATIVES
        </div>
        <h2 style={{ fontSize: 32, fontFamily: "Georgia, serif", fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
          Who represents your ward.
        </h2>
        <p style={{ fontSize: 15, color: "#888", lineHeight: 1.6, marginBottom: 32 }}>
          Elected corporators for {city.city} - {data.body} - {data.lastElection} elections - Term ends {data.termEnds}.
        </p>

        <div style={{ background: "#fff", borderRadius: 14, padding: 24, marginBottom: 28, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#aaa", letterSpacing: "0.1em", marginBottom: 16 }}>
            PARTY COMPOSITION - {data.totalWards} TOTAL WARDS
          </div>
          <div style={{ display: "flex", gap: 0, height: 10, borderRadius: 6, overflow: "hidden", marginBottom: 16 }}>
            {data.partyTally.map((party) => (
              <div key={party.party} style={{ flex: party.seats, background: party.color, opacity: 0.85 }} />
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {data.partyTally.map((party) => (
              <div key={party.party} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: party.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{party.party}</span>
                <span style={{ fontSize: 13, color: "#aaa" }}>{party.seats} seats</span>
              </div>
            ))}
          </div>
          {data.partyTally.length === 1 && data.partyTally[0].party === "BJP" && (
            <p style={{ fontSize: 12, color: "#bbb", marginTop: 14, fontStyle: "italic", borderTop: "1px solid #f0ede8", paddingTop: 12 }}>
              Opposition nominations were withdrawn or rejected in the February 2021 elections. BJP won all {data.totalWards} seats uncontested.
            </p>
          )}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20, alignItems: "center" }}>
          <input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Search ward or corporator..."
            style={{
              padding: "8px 16px",
              border: "1.5px solid #e0ddd8",
              borderRadius: 24,
              fontSize: 13,
              outline: "none",
              background: "#fff",
              minWidth: 200,
              flex: 1,
              maxWidth: 300,
            }}
          />
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["All", ...data.zones].map((zone) => (
              <button
                key={zone}
                onClick={() => setZoneFilter(zone)}
                className={`pill-btn${zoneFilter === zone ? " active" : ""}`}
              >
                {zone}
              </button>
            ))}
          </div>
          <span style={{ fontSize: 12, color: "#aaa", marginLeft: "auto" }}>{filtered.length} wards</span>
        </div>

        <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ overflowX: "auto" }}>
            <table className="ward-table">
              <thead>
                <tr>
                  <th style={{ width: 50 }}>#</th>
                  <th>Ward</th>
                  <th>Zone</th>
                  <th>Corporator</th>
                  <th>Party</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "32px 16px", color: "#bbb", fontSize: 14 }}>
                      No wards match your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((ward) => (
                    <tr key={ward.ward}>
                      <td>
                        <span className="ward-num">{ward.ward}</span>
                      </td>
                      <td>
                        <span className="ward-name">{ward.name}</span>
                      </td>
                      <td style={{ color: "#888", fontSize: 12 }}>{ward.zone}</td>
                      <td>
                        <span className="ward-corp">{ward.corporator}</span>
                      </td>
                      <td>
                        <span className="party-badge" style={{ background: ward.partyColor }}>
                          {ward.party}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p style={{ fontSize: 12, color: "#bbb", marginTop: 16, lineHeight: 1.6 }}>
          {data.wardNote} - Source: {data.electionCommission} - Elections held {data.lastElection}.
        </p>
      </div>
    </div>
  );
}
