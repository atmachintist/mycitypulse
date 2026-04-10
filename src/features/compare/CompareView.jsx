import { useEffect, useState } from "react";
import { CITY_IMAGES, STRESS, TYPO_LABEL, fmt } from "../../domain/cities/presentation.js";
import useCitySearch from "../../shared/hooks/useCitySearch.js";

function CityCompareCard({ city, onRemove, onCitySelect }) {
  const imageUrl = CITY_IMAGES[city.city];
  const [imgErr, setImgErr] = useState(false);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ height: 90, position: "relative", background: "#0D1117" }}>
        {imageUrl && !imgErr && (
          <img
            src={imageUrl}
            alt={city.city}
            loading="lazy"
            decoding="async"
            onError={() => setImgErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.75))",
          }}
        />
        <div style={{ position: "absolute", bottom: 8, left: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>{city.city}</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)" }}>{city.state}</div>
        </div>
        <button
          onClick={() => onRemove(city.city)}
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            background: "rgba(0,0,0,0.55)",
            border: "none",
            color: "#fff",
            width: 20,
            height: 20,
            borderRadius: "50%",
            cursor: "pointer",
            fontSize: 12,
            lineHeight: "20px",
            textAlign: "center",
          }}
        >
          &times;
        </button>
      </div>
      <div style={{ padding: "10px 12px" }}>
        <button
          onClick={() => onCitySelect(city)}
          style={{
            background: "none",
            border: "1.5px solid #E8660D",
            color: "#E8660D",
            fontSize: 11,
            fontWeight: 700,
            padding: "4px 0",
            borderRadius: 14,
            cursor: "pointer",
            width: "100%",
          }}
        >
          Full profile &rarr;
        </button>
      </div>
    </div>
  );
}

const metrics = [
  { label: "National Rank", val: (city) => `#${city.rank}`, cval: (city) => city.rank, best: "lower" },
  { label: "Population", val: (city) => fmt(city.population), cval: (city) => city.population, best: "neutral" },
  { label: "Area", val: (city) => `${city.area.toLocaleString()} sq km`, cval: (city) => city.area, best: "neutral" },
  {
    label: "Density / sq km",
    val: (city) => city.density.toLocaleString(),
    cval: (city) => city.density,
    best: "neutral",
  },
  {
    label: "Civic Stress",
    val: (city) => city.stress,
    cval: (city) => STRESS[city.stress].bar,
    best: "lower",
    isStress: true,
  },
  { label: "City Category", val: (city) => TYPO_LABEL[city.urban_typology], best: "neutral" },
  { label: "City Tier", val: (city) => city.tier, best: "neutral" },
  { label: "State", val: (city) => city.state, best: "neutral" },
  { label: "Former Name", val: (city) => city.formerName || "Not listed", best: "neutral" },
];

export default function CompareView({
  allCities,
  cities,
  onBack,
  onCitySelect,
  onRemove,
  onAdd,
}) {
  const [addQuery, setAddQuery] = useState("");
  const excludedCityNames = cities.map((city) => city.city);
  const {
    activeIndex,
    handleKeyDown,
    resetSearch,
    results: addResults,
    setActiveIndex,
  } = useCitySearch({
    cities: allCities,
    query: addQuery,
    excludeCityNames: excludedCityNames,
    limit: 5,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const selectAddCity = (city) => {
    onAdd(city);
    setAddQuery("");
    resetSearch();
  };

  const cols = cities.length;

  return (
    <div style={{ background: "#FAF8F4", minHeight: "100vh", padding: "40px 32px 80px" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 32,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#E8660D",
                letterSpacing: "0.12em",
                marginBottom: 8,
              }}
            >
              COMPARE CITIES
            </div>
            <h1
              style={{
                fontSize: 32,
                fontFamily: "Georgia, serif",
                fontWeight: 700,
                color: "#1a1a1a",
                marginBottom: 6,
              }}
            >
              Side by side.
            </h1>
            <p style={{ fontSize: 14, color: "#999", lineHeight: 1.5 }}>
              Select up to 3 cities. Highlighted values indicate the stronger result where comparable.
            </p>
          </div>
          <button
            onClick={onBack}
            style={{
              background: "#fff",
              border: "1.5px solid #e0ddd8",
              color: "#555",
              padding: "9px 22px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            &larr; Back to cities
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)${cols < 3 ? " 180px" : ""}`,
            gap: 14,
            marginBottom: 24,
          }}
        >
          {cities.map((city) => (
            <CityCompareCard
              key={city.city}
              city={city}
              onRemove={onRemove}
              onCitySelect={onCitySelect}
            />
          ))}

          {cols < 3 && (
            <div style={{ position: "relative" }}>
              <div
                style={{
                  border: "2px dashed #ddd",
                  borderRadius: 14,
                  minHeight: 130,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  padding: 16,
                }}
              >
                <div style={{ fontSize: 22, color: "#ccc" }}>+</div>
                <input
                  value={addQuery}
                  onChange={(event) => setAddQuery(event.target.value)}
                  onKeyDown={(event) => handleKeyDown(event, selectAddCity)}
                  placeholder="Add city..."
                  style={{
                    width: "100%",
                    padding: "7px 12px",
                    border: "1.5px solid #e0ddd8",
                    borderRadius: 20,
                    fontSize: 12,
                    outline: "none",
                    background: "#fff",
                    textAlign: "center",
                  }}
                />
              </div>
              {addResults.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    marginTop: 4,
                    background: "#fff",
                    borderRadius: 10,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    border: "1px solid #e8e5e0",
                    overflow: "hidden",
                  }}
                >
                  {addResults.map((city, index) => (
                    <button
                      key={city.city}
                      onClick={() => selectAddCity(city)}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "9px 14px",
                        background: activeIndex === index ? "#faf8f4" : "none",
                        border: "none",
                        textAlign: "left",
                        fontSize: 13,
                        cursor: "pointer",
                        borderBottom: "1px solid #f0ede8",
                      }}
                      onMouseEnter={() => setActiveIndex(index)}
                    >
                      <span style={{ fontWeight: 600, color: "#1a1a1a" }}>{city.city}</span>
                      <span style={{ color: "#aaa", marginLeft: 8, fontSize: 11 }}>{city.state}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            overflow: "hidden",
            boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <colgroup>
              <col style={{ width: "22%" }} />
              {cities.map((city) => (
                <col key={city.city} style={{ width: `${78 / cols}%` }} />
              ))}
            </colgroup>
            <thead>
              <tr style={{ background: "#FAF8F4", borderBottom: "2px solid #f0ede8" }}>
                <th
                  style={{
                    padding: "12px 20px",
                    textAlign: "left",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#bbb",
                    letterSpacing: "0.08em",
                  }}
                >
                  METRIC
                </th>
                {cities.map((city) => (
                  <th
                    key={city.city}
                    style={{
                      padding: "12px 20px",
                      textAlign: "left",
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#1a1a1a",
                      borderLeft: "1px solid #f0ede8",
                    }}
                  >
                    {city.city}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric) => {
                let bestCity = null;

                if (metric.cval && metric.best !== "neutral" && cities.length > 1) {
                  const values = cities.map((city) => ({ city: city.city, value: metric.cval(city) }));
                  bestCity =
                    metric.best === "lower"
                      ? values.reduce((left, right) => (left.value <= right.value ? left : right)).city
                      : values.reduce((left, right) => (left.value >= right.value ? left : right)).city;
                }

                return (
                  <tr key={metric.label} style={{ borderBottom: "1px solid #f5f3ef" }}>
                    <td
                      style={{
                        padding: "13px 20px",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#bbb",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        background: "#FAFAF8",
                      }}
                    >
                      {metric.label}
                    </td>
                    {cities.map((city) => {
                      const stress = STRESS[city.stress];
                      const isBest = bestCity === city.city;

                      return (
                        <td
                          key={city.city}
                          style={{
                            padding: "13px 20px",
                            fontSize: 14,
                            background: isBest ? "#fff9f6" : "#fff",
                            borderLeft: "1px solid #f5f3ef",
                          }}
                        >
                          {metric.isStress ? (
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 800,
                                color: stress.color,
                                background: stress.bg,
                                padding: "3px 10px",
                                borderRadius: 8,
                                display: "inline-block",
                              }}
                            >
                              {city.stress}
                            </span>
                          ) : (
                            <span
                              style={{
                                fontWeight: isBest ? 800 : 400,
                                color: isBest ? "#E8660D" : "#444",
                              }}
                            >
                              {metric.val(city)}
                            </span>
                          )}
                          {isBest && !metric.isStress && (
                            <span
                              style={{
                                fontSize: 9,
                                color: "#E8660D",
                                marginLeft: 6,
                                fontWeight: 700,
                                verticalAlign: "middle",
                              }}
                            >
                              &#9650;
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p style={{ fontSize: 11, color: "#ccc", marginTop: 14, lineHeight: 1.6 }}>
          &#9650; marks the stronger value where comparison is meaningful (lower rank number = higher
          rank; lower stress = healthier city). Population, area, and density are shown without
          judgment.
        </p>
      </div>
    </div>
  );
}
