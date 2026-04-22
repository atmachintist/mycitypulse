import './PhotoPage.css';

export default function PhotoPage({ image, caption, credit }) {
  return (
    <div className="story-photo">
      {image && (
        <div
          className="story-photo__bg"
          style={{ backgroundImage: `url(${image})` }}
          aria-hidden="true"
        />
      )}
      <div className="story-photo__overlay" aria-hidden="true" />
      {(caption || credit) && (
        <div className="story-photo__caption">
          {caption && <p className="story-photo__caption-text">{caption}</p>}
          {credit && <p className="story-photo__credit">{credit}</p>}
        </div>
      )}
    </div>
  );
}
