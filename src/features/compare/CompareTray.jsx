export default function CompareTray({ cities, onCompare, onRemove, onClear }) {
  if (cities.length === 0) return null;

  return (
    <div className="compare-tray">
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: "rgba(255,255,255,0.35)",
          letterSpacing: "0.1em",
          flexShrink: 0,
        }}
      >
        COMPARING
      </span>
      <div style={{ display: "flex", gap: 8, flex: 1, flexWrap: "wrap", alignItems: "center" }}>
        {cities.map((city) => (
          <div
            key={city.city}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: "5px 12px",
              fontSize: 13,
              color: "#fff",
            }}
          >
            <span style={{ fontWeight: 600 }}>{city.city}</span>
            <button
              onClick={() => onRemove(city.city)}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.4)",
                cursor: "pointer",
                fontSize: 15,
                lineHeight: 1,
                padding: 0,
              }}
            >
              &times;
            </button>
          </div>
        ))}
        {cities.length < 3 && (
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontStyle: "italic" }}>
            + pick up to {3 - cities.length} more
          </span>
        )}
      </div>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button
          onClick={onClear}
          style={{
            background: "none",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.45)",
            padding: "7px 14px",
            borderRadius: 20,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Clear
        </button>
        {cities.length >= 2 && (
          <button
            onClick={onCompare}
            style={{
              background: "#E8660D",
              border: "none",
              color: "#fff",
              padding: "7px 20px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Compare {cities.length} cities &rarr;
          </button>
        )}
      </div>
    </div>
  );
}
