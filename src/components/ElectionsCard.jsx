import React, { useState } from 'react';
import './ElectionsCard.css';

export default function ElectionsCard({ election, cityName }) {
  const [showTimeline, setShowTimeline] = useState(false);
  const [searchWard, setSearchWard] = useState('');

  // Calculate days until election
  const daysUntil = Math.ceil(
    (new Date(election.election_date) - new Date()) / (1000 * 60 * 60 * 24)
  );

  // Handle ward search
  const foundWard = election.wards.find(w =>
    w.number.toString() === searchWard ||
    w.name.toLowerCase().includes(searchWard.toLowerCase())
  );

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
      {/* SNAPSHOT VIEW */}
      <div className="elections-snapshot">
        <div className="elections-header">
          <span className="elections-icon">🏛️</span>
          <h3>ELECTIONS 2026</h3>
        </div>

        <div className="elections-status">
          <p className="countdown">
            {daysUntil > 0 ? (
              <>
                <strong>{daysUntil} days</strong> until election
              </>
            ) : daysUntil === 0 ? (
              <>🗳️ <strong>Voting today!</strong></>
            ) : (
              <>Results announced</>
            )}
          </p>
          <p className="date-info">
            📅 {new Date(election.election_date).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })} | {election.wards_verified}/{election.wards_total} wards
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="elections-actions">
          <button
            className="action-btn"
            onClick={() => setShowTimeline(true)}
            aria-label="View election timeline"
          >
            📋 Timeline
          </button>
          <button
            className="action-btn"
            onClick={() => document.getElementById('ward-search')?.focus()}
            aria-label="Search for your ward"
          >
            🔍 Your Ward
          </button>
          <button
            className="action-btn"
            onClick={handleShare}
            aria-label="Share election information"
          >
            ↗️ Share
          </button>
        </div>
      </div>

      {/* WARD SEARCH */}
      <div className="ward-search">
        <input
          id="ward-search"
          type="text"
          placeholder="Search ward by name or number (1-48)..."
          value={searchWard}
          onChange={(e) => setSearchWard(e.target.value)}
          className="ward-input"
          aria-label="Ward search"
        />

        {searchWard && (
          <div className="ward-results">
            {foundWard ? (
              <div className="ward-found">
                <p><strong>Ward {foundWard.number}:</strong> {foundWard.name}</p>
                <p style={{ fontSize: '0.9em', color: '#666' }}>
                  {election.wards_verified >= foundWard.number ?
                    '✓ Verified' :
                    '⏳ Data coming soon'
                  }
                </p>
              </div>
            ) : searchWard.length > 0 ? (
              <p className="no-result">Ward not found. Try searching by number (e.g., "9" for Naranpura)</p>
            ) : null}
          </div>
        )}
      </div>

      {/* TIMELINE MODAL */}
      {showTimeline && (
        <div
          className="modal-overlay"
          onClick={() => setShowTimeline(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Election timeline"
        >
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setShowTimeline(false)}
              aria-label="Close timeline"
            >
              ✕
            </button>

            <h2>📋 Election Timeline</h2>

            <div className="timeline">
              {election.timeline.map((event, i) => (
                <div
                  key={i}
                  className={`timeline-item ${event.urgent ? 'urgent' : ''}`}
                >
                  <span className="timeline-icon" aria-hidden="true">{event.icon}</span>
                  <div className="timeline-content">
                    <strong>{event.label}</strong>
                    <p>{new Date(event.date).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}</p>
                  </div>
                  {event.urgent && <span className="urgent-badge">TODAY</span>}
                </div>
              ))}
            </div>

            <button
              className="close-btn"
              onClick={() => setShowTimeline(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
