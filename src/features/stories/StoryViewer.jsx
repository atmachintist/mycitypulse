import { useState, useEffect } from 'react';
import { useStory } from './hooks/useStory.js';
import { useStoryNavigation } from './hooks/useStoryNavigation.js';
import PageRenderer from './PageRenderer.jsx';
import './StoryViewer.css';

export default function StoryViewer({ slug, onHome }) {
  const { story, notFound } = useStory(slug);
  const totalPages = story?.pages?.length ?? 0;

  // Derive initial page from the URL at mount time
  const initialPage = (() => {
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (parts[0] === 'stories' && parts[1] === slug && parts[2]) {
      return Math.max(0, parseInt(parts[2], 10) || 0);
    }
    return 0;
  })();

  const {
    currentPage,
    canGoNext,
    canGoPrev,
    goNext,
    goPrev,
    handlePointerDown,
    handlePointerUp,
    handleTap,
  } = useStoryNavigation(slug, totalPages, initialPage);

  const [visible, setVisible] = useState(false);
  useEffect(() => {
    // Fade in on mount
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  if (notFound) {
    return (
      <div className="story-viewer story-viewer--not-found">
        <p>Story not found.</p>
        <button onClick={onHome}>← Back to MyCityPulse</button>
      </div>
    );
  }

  if (!story) return null;

  const page = story.pages[currentPage];

  return (
    <div
      className={`story-viewer${visible ? ' story-viewer--visible' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onClick={handleTap}
    >
      {/* Progress dots */}
      <div className="story-viewer__dots" aria-hidden="true">
        {story.pages.map((_, i) => (
          <span
            key={i}
            className={`story-viewer__dot${i === currentPage ? ' story-viewer__dot--active' : ''}`}
          />
        ))}
      </div>

      {/* Back to home */}
      <button
        className="story-viewer__home-btn"
        onClick={(e) => { e.stopPropagation(); onHome(); }}
        aria-label="Back to MyCityPulse"
      >
        ← MyCityPulse
      </button>

      {/* Page content */}
      <div className="story-viewer__page" key={currentPage}>
        <PageRenderer page={page} />
      </div>

      {/* Nav arrows (desktop only) */}
      {canGoPrev && (
        <button
          className="story-viewer__nav story-viewer__nav--prev"
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          aria-label="Previous page"
        >
          ‹
        </button>
      )}
      {canGoNext && (
        <button
          className="story-viewer__nav story-viewer__nav--next"
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          aria-label="Next page"
        >
          ›
        </button>
      )}

      {/* Page counter */}
      <p className="story-viewer__counter" aria-live="polite">
        {currentPage + 1} / {totalPages}
      </p>
    </div>
  );
}
