import {
  STRESS,
  TYPO_C,
  TYPO_LABEL,
  TYPO_PUBLIC_DESC,
} from '../../../domain/cities/presentation.js';
import './DataPage.css';

function StressIndexDisplay({ level }) {
  const s = STRESS[level] || STRESS.Moderate;
  const bars = [1, 2, 3, 4, 5];
  return (
    <div className="story-data__chart">
      <div className="story-stress__bars">
        {bars.map((n) => (
          <div
            key={n}
            className="story-stress__bar"
            style={{
              background: n <= s.bar ? s.color : 'rgba(255,255,255,0.12)',
              height: `${20 + n * 10}px`,
            }}
          />
        ))}
      </div>
      <p className="story-stress__level" style={{ color: s.color }}>{level}</p>
      <p className="story-stress__tagline">{s.tagline}</p>
    </div>
  );
}

function TypologyCard({ typology }) {
  const color = TYPO_C[typology] || '#888';
  const label = TYPO_LABEL[typology] || typology;
  const desc = TYPO_PUBLIC_DESC[typology] || '';
  return (
    <div className="story-data__chart">
      <span className="story-typo__pill" style={{ background: color }}>{label}</span>
      <p className="story-typo__desc">{desc}</p>
    </div>
  );
}

function WardStats({ label, value, unit, note }) {
  return (
    <div className="story-data__chart">
      <p className="story-wardstats__label">{label}</p>
      <p className="story-wardstats__value">
        {value}
        {unit && <span className="story-wardstats__unit"> {unit}</span>}
      </p>
      {note && <p className="story-wardstats__note">{note}</p>}
    </div>
  );
}

const CHART_REGISTRY = {
  StressIndexDisplay,
  TypologyCard,
  WardStats,
};

export default function DataPage({ component, props, headline, body }) {
  const Chart = CHART_REGISTRY[component];
  return (
    <div className="story-data">
      <div className="story-data__inner">
        {headline && <h2 className="story-data__headline">{headline}</h2>}
        {Chart ? <Chart {...props} /> : <p style={{ color: '#888' }}>Unknown chart: {component}</p>}
        {body && <p className="story-data__body">{body}</p>}
      </div>
    </div>
  );
}
