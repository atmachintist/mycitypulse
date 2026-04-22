import { useState, useEffect, useRef } from 'react';
import { updateUrlForStory } from '../../../lib/routing.js';

export function useStoryNavigation(slug, totalPages, initialPage = 0) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const pointerStartX = useRef(null);

  const goTo = (page) => {
    const clamped = Math.max(0, Math.min(totalPages - 1, page));
    setCurrentPage(clamped);
    updateUrlForStory(slug, clamped);
  };

  const goNext = () => goTo(currentPage + 1);
  const goPrev = () => goTo(currentPage - 1);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goNext(); }
      if (e.key === 'ArrowLeft' || e.key === 'Backspace') { e.preventDefault(); goPrev(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  // Popstate (browser back/forward within story pages)
  useEffect(() => {
    const handlePop = () => {
      const parts = window.location.pathname.split('/').filter(Boolean);
      if (parts[0] === 'stories' && parts[1] === slug) {
        const page = parts[2] ? Math.max(0, parseInt(parts[2], 10) || 0) : 0;
        setCurrentPage(page);
      }
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, [slug]);

  const handlePointerDown = (e) => {
    pointerStartX.current = e.clientX;
  };

  const handlePointerUp = (e) => {
    if (pointerStartX.current === null) return;
    const delta = e.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (Math.abs(delta) < 40) return; // too small — treat as tap
    if (delta < 0) goNext();
    else goPrev();
  };

  // Tap-zone handler: left 40% = prev, right 40% = next, middle 20% = no-op
  const handleTap = (e) => {
    // Only fire for actual taps (pointer moved < 10px)
    if (pointerStartX.current !== null) return; // already handled by pointer swipe
    const x = e.clientX;
    const w = window.innerWidth;
    if (x < w * 0.4) goPrev();
    else if (x > w * 0.6) goNext();
  };

  return {
    currentPage,
    canGoNext: currentPage < totalPages - 1,
    canGoPrev: currentPage > 0,
    goNext,
    goPrev,
    handlePointerDown,
    handlePointerUp,
    handleTap,
  };
}
