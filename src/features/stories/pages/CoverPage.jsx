import './CoverPage.css';

export default function CoverPage({ title, subtitle, image }) {
  return (
    <div className="story-cover">
      {image && (
        <div
          className="story-cover__bg"
          style={{ backgroundImage: `url(${image})` }}
          aria-hidden="true"
        />
      )}
      <div className="story-cover__overlay" aria-hidden="true" />
      <div className="story-cover__content">
        <p className="story-cover__eyebrow">MyCityPulse</p>
        <h1 className="story-cover__title">{title}</h1>
        {subtitle && <p className="story-cover__subtitle">{subtitle}</p>}
        <p className="story-cover__hint">Swipe or tap → to continue</p>
      </div>
    </div>
  );
}
