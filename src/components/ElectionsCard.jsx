import React, { useEffect, useState } from "react";
import CivicSurvey from "./CivicSurvey";
import { formatDigipin, getDigiPin, getLatLngFromDigiPin } from "../domain/location/digipin.js";
import "./ElectionsCard.css";

function readStoredCount(key) {
  if (typeof window === "undefined") {
    return 0;
  }

  return Number.parseInt(window.localStorage.getItem(key) || "0", 10);
}

function readStoredBoolean(key) {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(key) === "true";
}

function readStoredProfile(key) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function formatDate(date, options = {}) {
  return new Date(date).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  });
}

export default function ElectionsCard({ election, cityName }) {
  const wards = election.wards || [];
  const pledgeCountKey = `${cityName}_pledge_count`;
  const votedKey = `${cityName}_voted`;
  const locationProfileKey = `${cityName}_location_profile`;

  const [showTimeline, setShowTimeline] = useState(false);
  const [searchWard, setSearchWard] = useState("");
  const [pledgeCount, setPledgeCount] = useState(() => readStoredCount(pledgeCountKey));
  const [hasVoted, setHasVoted] = useState(() => readStoredBoolean(votedKey));
  const [countdown, setCountdown] = useState("");
  const [showPledgeShare, setShowPledgeShare] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [locationProfile, setLocationProfile] = useState(() => readStoredProfile(locationProfileKey));
  const [digipinInput, setDigipinInput] = useState(() => readStoredProfile(locationProfileKey)?.digipin || "");
  const [selectedWardNumber, setSelectedWardNumber] = useState(() => {
    const storedProfile = readStoredProfile(locationProfileKey);
    return storedProfile?.wardNumber ? String(storedProfile.wardNumber) : "";
  });
  const [locationStatus, setLocationStatus] = useState("");
  const [locationError, setLocationError] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const electionTime = new Date(election.election_date);
      const diff = electionTime - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        setCountdown(
          `${days.toString().padStart(2, "0")}:${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
        );
      } else {
        setCountdown("00:00:00:00");
      }
    };

    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(interval);
  }, [election.election_date]);

  const daysUntil = Math.ceil(
    (new Date(election.election_date) - new Date()) / (1000 * 60 * 60 * 24),
  );
  const foundWard = wards.find((ward) => {
    const query = searchWard.toLowerCase().trim();

    return (
      ward.number.toString() === searchWard.trim() ||
      ward.name.toLowerCase().includes(query) ||
      ward.zone.toLowerCase().includes(query)
    );
  });
  const savedWard = wards.find((ward) => ward.number === locationProfile?.wardNumber) || null;
  const wardCount = wards.length || election.wards_total || 0;

  const persistLocationProfile = (nextProfile) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(locationProfileKey, JSON.stringify(nextProfile));
    }

    setLocationProfile(nextProfile);
  };

  const saveLocationProfile = (updates) => {
    const nextWardNumber = updates.wardNumber ?? locationProfile?.wardNumber ?? null;
    const ward = wards.find((item) => item.number === nextWardNumber) || null;
    const nextProfile = {
      ...(locationProfile || {}),
      ...updates,
      wardNumber: ward?.number ?? null,
      wardName: ward?.name ?? null,
      zone: ward?.zone ?? null,
      officeAddress: ward?.officeAddress ?? null,
      updatedAt: new Date().toISOString(),
    };

    persistLocationProfile(nextProfile);
  };

  const clearLocationProfile = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(locationProfileKey);
    }

    setLocationProfile(null);
    setDigipinInput("");
    setSelectedWardNumber("");
    setLocationStatus("Saved civic profile cleared from this device.");
    setLocationError("");
  };

  const handlePledgeVote = () => {
    const newCount = pledgeCount + 1;

    if (typeof window !== "undefined") {
      window.localStorage.setItem(pledgeCountKey, String(newCount));
      window.localStorage.setItem(votedKey, "true");
    }

    setPledgeCount(newCount);
    setHasVoted(true);
    setShowPledgeShare(true);
  };

  const sharePledgeOnSocial = (platform) => {
    const pledgeText = `\uD83D\uDDF3\uFE0F I pledge to vote in the ${cityName} Municipal Elections on ${formatDate(
      election.election_date,
    )}! Will you join me? #VoteForChange #${cityName}Elections`;
    const encodedText = encodeURIComponent(pledgeText);
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=mycitypulse.in&quote=${encodedText}`,
      whatsapp: `https://wa.me/?text=${encodedText}`,
      instagram: "https://www.instagram.com/",
    };

    if (platform === "instagram") {
      navigator.clipboard.writeText(pledgeText);
      window.alert("Pledge copied. Paste it into your Instagram caption or story.");
    } else if (urls[platform]) {
      window.open(urls[platform], "_blank", "width=600,height=400");
    }
  };

  const handleShare = () => {
    const text = `\uD83D\uDDF3\uFE0F ${cityName} Municipal Elections ${election.year}\n\nElection Day: ${formatDate(
      election.election_date,
    )}\n${wardCount} wards listed | Results: ${formatDate(
      election.result_date,
    )}\n\nFind your ward on MyCityPulse\nmycitypulse.in`;

    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      window.alert("Election info copied to clipboard.");
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Your browser does not support location access.");
      setLocationStatus("");
      return;
    }

    setIsLocating(true);
    setLocationError("");
    setLocationStatus("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        try {
          const latitude = Number(position.coords.latitude.toFixed(6));
          const longitude = Number(position.coords.longitude.toFixed(6));
          const digipin = getDigiPin(latitude, longitude);

          setDigipinInput(digipin);
          saveLocationProfile({ digipin, latitude, longitude });
          setLocationStatus("Location converted to DIGIPIN. Now confirm your Ahmedabad ward below.");
        } catch (error) {
          setLocationError(error.message || "We could not convert this location into a DIGIPIN.");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        const message =
          error.code === 1
            ? "Location permission was denied."
            : "We could not access your location right now.";
        setLocationError(message);
        setLocationStatus("");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
    );
  };

  const handleDigipinSubmit = (event) => {
    event.preventDefault();

    try {
      const formatted = formatDigipin(digipinInput);
      const decoded = getLatLngFromDigiPin(formatted);

      setDigipinInput(formatted);
      saveLocationProfile({
        digipin: formatted,
        latitude: decoded.latitude,
        longitude: decoded.longitude,
      });
      setLocationError("");
      setLocationStatus("DIGIPIN saved. Confirm your Ahmedabad ward to finish your civic profile.");
    } catch (error) {
      setLocationError(error.message || "Enter a valid DIGIPIN.");
      setLocationStatus("");
    }
  };

  const handleWardSelection = (wardNumber, message) => {
    const parsedWardNumber = Number.parseInt(wardNumber, 10);
    const ward = wards.find((item) => item.number === parsedWardNumber);

    if (!ward) {
      return;
    }

    setSelectedWardNumber(String(ward.number));
    setSearchWard(ward.name);
    saveLocationProfile({ wardNumber: ward.number });
    setLocationError("");
    setLocationStatus(message || `Ward ${ward.number} saved to your civic profile.`);
  };

  const handleWardSelectChange = (event) => {
    const value = event.target.value;

    setSelectedWardNumber(value);

    if (!value) {
      saveLocationProfile({
        wardNumber: null,
        wardName: null,
        zone: null,
        officeAddress: null,
      });
      setLocationStatus("Ward removed from your civic profile.");
      return;
    }

    handleWardSelection(value);
  };

  return (
    <div className="elections-card">
      <div className="elections-snapshot">
        <div className="elections-header">
          <span className="elections-icon">{"\uD83C\uDFDB\uFE0F"}</span>
          <h3>ELECTIONS {election.year}</h3>
        </div>

        <div className="elections-status">
          <p className="countdown">
            {daysUntil > 0 ? (
              <>
                <strong>{daysUntil} days</strong> until voting
              </>
            ) : daysUntil === 0 ? (
              <>
                {"\uD83D\uDDF3\uFE0F "}
                <strong>Voting today</strong>
              </>
            ) : (
              <>Counting and result window has started</>
            )}
          </p>
          <p className="timer-display">
            {"\u23F1\uFE0F "}
            <strong>{countdown}</strong> until polls open
          </p>
          <p className="date-info">
            {"\uD83D\uDCC5 "}
            {formatDate(election.election_date)} | {wardCount} official wards listed
            {election.polling_hours ? ` | Polling ${election.polling_hours}` : ""}
          </p>
        </div>

        {election.scopeNote && <p className="coverage-note">{election.scopeNote}</p>}

        <div className="pledge-section">
          {!hasVoted ? (
            <>
              <button className="pledge-btn" onClick={handlePledgeVote} aria-label="Pledge to vote">
                {"\u270B I Will Vote"}
              </button>
              <p className="pledge-count">{pledgeCount.toLocaleString()} people have pledged</p>
            </>
          ) : (
            <div className="pledge-confirmed">
              <p>{"\u2705 Thank you for pledging to vote."}</p>
              <p className="pledge-count">{pledgeCount.toLocaleString()} people have pledged</p>
            </div>
          )}
        </div>

        {showPledgeShare && (
          <div className="pledge-share-modal">
            <h4>{"Share Your Pledge"}</h4>
            <p>Inspire someone else to show up on voting day.</p>
            <div className="social-share-buttons">
              <button
                className="social-btn twitter"
                onClick={() => sharePledgeOnSocial("twitter")}
                title="Share on Twitter/X"
              >
                X
              </button>
              <button
                className="social-btn facebook"
                onClick={() => sharePledgeOnSocial("facebook")}
                title="Share on Facebook"
              >
                f
              </button>
              <button
                className="social-btn whatsapp"
                onClick={() => sharePledgeOnSocial("whatsapp")}
                title="Share on WhatsApp"
              >
                WA
              </button>
              <button
                className="social-btn instagram"
                onClick={() => sharePledgeOnSocial("instagram")}
                title="Share on Instagram"
              >
                IG
              </button>
            </div>
            <button className="close-pledge-modal" onClick={() => setShowPledgeShare(false)}>
              Done
            </button>
          </div>
        )}

        <div className="elections-actions">
          <button
            className="action-btn"
            onClick={() => setShowTimeline(true)}
            aria-label="View election timeline"
          >
            {"\uD83D\uDCCB Timeline"}
          </button>
          <button
            className="action-btn"
            onClick={() => document.getElementById("ward-search")?.focus()}
            aria-label="Search the ward directory"
          >
            {"\uD83D\uDD0E Ward Directory"}
          </button>
          <button className="action-btn" onClick={handleShare} aria-label="Share election information">
            {"\u2197 Share"}
          </button>
        </div>
      </div>

      {wardCount > 0 && (
        <section className="location-profile">
          <div className="section-heading">
            <div>
              <h4>My civic profile</h4>
              <p>Save your DIGIPIN and your confirmed ward on this device.</p>
            </div>
            {locationProfile && (
              <button className="text-action" onClick={clearLocationProfile}>
                Clear saved profile
              </button>
            )}
          </div>

          {election.locationNote && <p className="location-note">{election.locationNote}</p>}

          <div className="location-actions">
            <button
              className="location-btn"
              onClick={handleUseMyLocation}
              disabled={isLocating}
              type="button"
            >
              {isLocating ? "Finding location..." : "Use my location"}
            </button>
            <span className="location-actions-copy">or save a DIGIPIN you already know</span>
          </div>

          <form className="digipin-form" onSubmit={handleDigipinSubmit}>
            <input
              type="text"
              value={digipinInput}
              onChange={(event) => {
                setDigipinInput(event.target.value.toUpperCase());
                setLocationError("");
                setLocationStatus("");
              }}
              placeholder="Enter DIGIPIN (example: ABC-123-4DEF)"
              className="digipin-input"
              aria-label="Enter your DIGIPIN"
            />
            <button type="submit" className="digipin-submit">
              Save DIGIPIN
            </button>
          </form>

          {locationError && <p className="location-feedback error">{locationError}</p>}
          {locationStatus && <p className="location-feedback success">{locationStatus}</p>}

          <label className="ward-select-label" htmlFor="saved-ward-select">
            Confirm your Ahmedabad ward
          </label>
          <select
            id="saved-ward-select"
            className="ward-select"
            value={selectedWardNumber}
            onChange={handleWardSelectChange}
          >
            <option value="">Select a ward</option>
            {wards.map((ward) => (
              <option key={ward.number} value={ward.number}>
                Ward {ward.number}: {ward.name}
              </option>
            ))}
          </select>

          {locationProfile && (
            <div className="profile-summary">
              <div className="profile-badges">
                {locationProfile.digipin && <span className="profile-badge">DIGIPIN {locationProfile.digipin}</span>}
                {savedWard && <span className="profile-badge">Ward {savedWard.number}</span>}
                {savedWard?.zone && <span className="profile-badge">{savedWard.zone} Zone</span>}
              </div>
              {locationProfile.latitude && locationProfile.longitude && (
                <p className="profile-coordinates">
                  Approximate coordinates from DIGIPIN: {locationProfile.latitude}, {locationProfile.longitude}
                </p>
              )}
              {savedWard && (
                <div className="profile-ward-card">
                  <strong>
                    Ward {savedWard.number}: {savedWard.name}
                  </strong>
                  <p>{savedWard.officeAddress}</p>
                </div>
              )}
              <p className="profile-updated">
                Saved locally on this device
                {locationProfile.updatedAt ? ` · ${formatDate(locationProfile.updatedAt, { hour: "numeric", minute: "2-digit" })}` : ""}
              </p>
            </div>
          )}
        </section>
      )}

      <div className="ward-search">
        <div className="section-heading compact">
          <div>
            <h4>Official Ahmedabad ward directory</h4>
            <p>Search by ward number, ward name, or zone.</p>
          </div>
        </div>

        <input
          id="ward-search"
          type="text"
          placeholder="Search ward by name, zone, or number..."
          value={searchWard}
          onChange={(event) => setSearchWard(event.target.value)}
          className="ward-input"
          aria-label="Ward search"
        />

        {searchWard && (
          <div className="ward-results">
            {foundWard ? (
              <div className="ward-found">
                <p className="ward-result-title">
                  <strong>
                    Ward {foundWard.number}: {foundWard.name}
                  </strong>
                </p>
                <p className="ward-result-meta">{foundWard.zone} Zone</p>
                <p className="ward-result-address">{foundWard.officeAddress}</p>
                <button
                  className="inline-save-btn"
                  type="button"
                  onClick={() => handleWardSelection(foundWard.number, `Ward ${foundWard.number} added to your civic profile.`)}
                >
                  Use this ward in my profile
                </button>
              </div>
            ) : (
              <p className="no-result">
                Ward not found. Try a number like "43" for Naranpura or a zone like "South West".
              </p>
            )}
          </div>
        )}
      </div>

      {Array.isArray(election.sources) && election.sources.length > 0 && (
        <div className="elections-sources">
          <div className="section-heading compact">
            <div>
              <h4>Sources behind this section</h4>
              <p>So citizens can see what is official, what is reported, and what is product logic.</p>
            </div>
          </div>
          <div className="source-list">
            {election.sources.map((source) => (
              <a
                key={source.url}
                className="source-item"
                href={source.url}
                target="_blank"
                rel="noreferrer"
              >
                <strong>{source.label}</strong>
                <span>{source.note}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="cocreator-section">
        <p>Help us understand your city better. Take our 5-minute civic survey.</p>
        <button className="cocreator-btn" onClick={() => setShowSurvey(true)}>
          {"Take Survey \u2192"}
        </button>
      </div>

      {showSurvey && (
        <div className="survey-modal-overlay" onClick={() => setShowSurvey(false)}>
          <div className="survey-modal-wrapper" onClick={(event) => event.stopPropagation()}>
            <button className="survey-modal-close" onClick={() => setShowSurvey(false)}>
              {"\u2715"}
            </button>
            <CivicSurvey city={cityName} onComplete={() => setShowSurvey(false)} />
          </div>
        </div>
      )}

      {showTimeline && (
        <div
          className="modal-overlay"
          onClick={() => setShowTimeline(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Election timeline"
        >
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowTimeline(false)}
              aria-label="Close timeline"
            >
              {"\u2715"}
            </button>
            <h2>{"\uD83D\uDCCB Election Timeline"}</h2>
            <div className="timeline">
              {election.timeline.map((event, index) => (
                <div key={index} className={`timeline-item ${event.urgent ? "urgent" : ""}`}>
                  <span className="timeline-icon" aria-hidden="true">
                    {event.icon}
                  </span>
                  <div className="timeline-content">
                    <strong>{event.label}</strong>
                    <p>{formatDate(event.date)}</p>
                  </div>
                  {event.urgent && <span className="urgent-badge">ACTIVE</span>}
                </div>
              ))}
            </div>
            <button className="close-btn" onClick={() => setShowTimeline(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
