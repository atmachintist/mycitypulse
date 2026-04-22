import './QuotePage.css';

export default function QuotePage({ text, attribution }) {
  return (
    <div className="story-quote">
      <div className="story-quote__inner">
        <span className="story-quote__mark" aria-hidden="true">"</span>
        <blockquote className="story-quote__text">{text}</blockquote>
        {attribution && (
          <p className="story-quote__attribution">— {attribution}</p>
        )}
      </div>
    </div>
  );
}
