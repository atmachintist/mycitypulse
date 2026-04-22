import './CTAPage.css';

export default function CTAPage({ headline, body, action }) {
  const handleClick = () => {
    if (!action?.href) return;
    // Internal navigation — push to history and reload routing
    window.history.pushState(null, '', action.href);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="story-cta">
      <div className="story-cta__inner">
        <p className="story-cta__eyebrow">Next step</p>
        <h2 className="story-cta__headline">{headline}</h2>
        {body && <p className="story-cta__body">{body}</p>}
        {action && (
          <button className="story-cta__btn" onClick={handleClick}>
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
