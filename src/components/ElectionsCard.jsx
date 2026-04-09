import React, { useState, useEffect } from 'react';
import CivicSurvey from './CivicSurvey';
import './ElectionsCard.css';

export default function ElectionsCard({ election, cityName }) {
  const [showTimeline, setShowTimeline] = useState(false);
  const [searchWard, setSearchWard] = useState('');
  const [pledgeCount, setPledgeCount] = useState(localStorage.getItem(`${cityName}_pledge_count`) ? parseInt(localStorage.getItem(`${cityName}_pledge_count`)) : 0);
  const [hasVoted, setHasVoted] = useState(localStorage.getItem(`${cityName}_voted`) === 'true');
  const [countdown, setCountdown] = useState('');
  const [showPledgeShare, setShowPledgeShare] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const election_time = new Date(election.election_date);
      const diff = election_time - now;
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setCountdown(`${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setCountdown('00:00:00:00');
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [election.election_date]);

  const daysUntil = Math.ceil((new Date(election.election_date) - new Date()) / (1000 * 60 * 60 * 24));

  const foundWard = election.wards.find(w =>
    w.number.toString() === searchWard || w.name.toLowerCase().includes(searchWard.toLowerCase())
  );

  const handlePledgeVote = () => {
    const newCount = pledgeCount + 1;
    localStorage.setItem(`${cityName}_pledge_count`, newCount);
    localStorage.setItem(`${cityName}_voted`, 'true');
    setPledgeCount(newCount);
    setHasVoted(true);
    setShowPledgeShare(true);
  };

  const sharePledgeOnSocial = (platform) => {
    const pledgeText = `🗳️ I pledge to vote in the ${cityName} Municipal Elections on ${new Date(election.election_date).toLocaleDateString('en-IN')}! Will you join me? #VoteForChange #${cityName}Elections`;
    const encodedText = encodeURIComponent(pledgeText);
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=mycitypulse.in&quote=${encodedText}`,
      whatsapp: `https://wa.me/?text=${encodedText}`,
      instagram: `https://www.instagram.com/`
    };
    if (platform === 'instagram') {
      navigator.clipboard.writeText(pledgeText);
      alert('Pledge copied! Paste it in your Instagram caption or story.');
    } else if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  const handleShare = () => {
    const text = `🗳️ ${cityName} Municipal Elections 2026\n\nElection Day: ${new Date(election.election_date).toLocaleDateString('en-IN')}\n${election.wards_total} wards | Results: ${new Date(election.result_date).toLocaleDateString('en-IN')}\n\nFind your ward on MyCityPulse 🇮🇳\nmycitypulse.in`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Election info copied to clipboard!');
    }
  };

  return (
    <div className="elections-card">
      <div className="elections-snapshot">
        <div className="elections-header">
          <span className="elections-icon">🏛️</span>
          <h3>ELECTIONS 2026</h3>
        </div>

        <div className="elections-status">
          <p className="countdown">
            {daysUntil > 0 ? (<><strong>{daysUntil} days</strong> until election</>) : daysUntil === 0 ? (<>🗳️ <strong>Voting today!</strong></>) : (<>Results announced</>)}
          </p>
          <p className="timer-display">⏱️ <strong>{countdown}</strong> minutes to elections</p>
          <p className="date-info">
            📅 {new Date(election.election_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })} | {election.wards_verified}/{election.wards_total} wards
          </p>
        </div>

        <div className="pledge-section">
          {!hasVoted ? (
            <>
              <button className="pledge-btn" onClick={handlePledgeVote} aria-label="Pledge to vote">✋ I Will Vote</button>
              <p className="pledge-count">{pledgeCount.toLocaleString()} people have pledged</p>
            </>
          ) : (
            <div className="pledge-confirmed">
              <p>✅ Thank you for pledging to vote!</p>
              <p className="pledge-count">{pledgeCount.toLocaleString()} people have pledged</p>
            </div>
          )}
        </div>

        {showPledgeShare && (
          <div className="pledge-share-modal">
            <h4>Share Your Pledge 📢</h4>
            <p>Inspire others to vote!</p>
            <div className="social-share-buttons">
              <button className="social-btn twitter" onClick={() => sharePledgeOnSocial('twitter')} title="Share on Twitter/X">𝕏</button>
              <button className="social-btn facebook" onClick={() => sharePledgeOnSocial('facebook')} title="Share on Facebook">f</button>
              <button className="social-btn whatsapp" onClick={() => sharePledgeOnSocial('whatsapp')} title="Share on WhatsApp">💬</button>
              <button className="social-btn instagram" onClick={() => sharePledgeOnSocial('instagram')} title="Share on Instagram">📷</button>
            </div>
            <button className="close-pledge-modal" onClick={() => setShowPledgeShare(false)}>Done</button>
          </div>
        )}

        <div className="elections-actions">
          <button className="action-btn" onClick={() => setShowTimeline(true)} aria-label="View election timeline">📋 Timeline</button>
          <button className="action-btn" onClick={() => document.getElementById('ward-search')?.focus()} aria-label="Search for your ward">🔍 Your Ward</button>
          <button className="action-btn" onClick={handleShare} aria-label="Share election information">↗️ Share</button>
        </div>
      </div>

      <div className="ward-search">
        <input id="ward-search" type="text" placeholder="Search ward by name or number (1-48)..." value={searchWard} onChange={(e) => setSearchWard(e.target.value)} className="ward-input" aria-label="Ward search" />
        {searchWard && (
          <div className="ward-results">
            {foundWard ? (
              <div className="ward-found">
                <p><strong>Ward {foundWard.number}:</strong> {foundWard.name}</p>
                <p style={{ fontSize: '0.9em', color: '#666' }}>{election.wards_verified >= foundWard.number ? '✓ Verified' : '⏳ Data coming soon'}</p>
              </div>
            ) : searchWard.length > 0 ? (
              <p className="no-result">Ward not found. Try searching by number (e.g., "9" for Naranpura)</p>
            ) : null}
          </div>
        )}
      </div>

      <div className="cocreator-section">
        <p>Help us understand your city. Take our 3-minute civic survey.</p>
        <button className="cocreator-btn" onClick={() => setShowSurvey(true)}>Take Survey →</button>
      </div>

      {showSurvey && (
        <div className="survey-modal-overlay" onClick={() => setShowSurvey(false)}>
          <div className="survey-modal-wrapper" onClick={e => e.stopPropagation()}>
            <button className="survey-modal-close" onClick={() => setShowSurvey(false)}>✕</button>
            <CivicSurvey onComplete={() => setShowSurvey(false)} />
          </div>
        </div>
      )}

      {showTimeline && (
        <div className="modal-overlay" onClick={() => setShowTimeline(false)} role="dialog" aria-modal="true" aria-label="Election timeline">
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowTimeline(false)} aria-label="Close timeline">✕</button>
            <h2>📋 Election Timeline</h2>
            <div className="timeline">
              {election.timeline.map((event, i) => (
                <div key={i} className={`timeline-item ${event.urgent ? 'urgent' : ''}`}>
                  <span className="timeline-icon" aria-hidden="true">{event.icon}</span>
                  <div className="timeline-content">
                    <strong>{event.label}</strong>
                    <p>{new Date(event.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  {event.urgent && <span className="urgent-badge">TODAY</span>}
                </div>
              ))}
            </div>
            <button className="close-btn" onClick={() => setShowTimeline(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}