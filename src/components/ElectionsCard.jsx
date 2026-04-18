import React, { Suspense, lazy, useEffect, useState } from "react";
import { formatDigipin, getDigiPin, getLatLngFromDigiPin } from "../domain/location/digipin.js";
import { getDigipinCityMismatch } from "../domain/location/cityProximity.js";
import { detectWardFromCoordinates } from "../domain/location/wardDetection.js";
import { buildMailtoHref, openMailtoDraft } from "../lib/contact.js";
import "./ElectionsCard.css";

const CivicSurvey = lazy(() => import("./CivicSurvey"));

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
  return parseElectionDate(date).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  });
}

function parseElectionDate(value) {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day, 12, 0, 0, 0);
  }

  return new Date(value);
}

function getStartOfDay(value) {
  const date = parseElectionDate(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getCandidateTone(status) {
  if (status === "official_final") return "verified";
  if (status === "party_announced") return "partial";
  return "pending";
}

function getCandidateLabel(status) {
  if (status === "official_final") return "Official final candidate list";
  if (status === "party_announced") return "Party-announced candidate";
  return "Candidate names not verified yet";
}

function getDigipinErrorMessage(error) {
  const message = error?.message || "";

  if (/invalid|format|digipin/i.test(message)) {
    return "This DIGIPIN does not look valid yet. Check the letters, numbers, and separators, then try again.";
  }

  return "We could not save this DIGIPIN right now. Please re-check the code or use latitude and longitude instead.";
}

function getCandidateCounts(wards = []) {
  return wards.reduce(
    (totals, ward) => {
      if (ward.candidateStatus === "official_final") {
        totals.officialFinalWards += 1;
      }

      if (ward.candidateStatus === "party_announced") {
        totals.partyAnnouncedWards += 1;
      }

      totals.namedEntries += Array.isArray(ward.candidates) ? ward.candidates.length : 0;
      return totals;
    },
    { officialFinalWards: 0, partyAnnouncedWards: 0, namedEntries: 0 },
  );
}

export default function ElectionsCard({ election, cityName }) {
  const wards = election.wards || [];
  const cityLabel = cityName || "this city";
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
  const [coordinateInput, setCoordinateInput] = useState(() => {
    const storedProfile = readStoredProfile(locationProfileKey);
    return {
      latitude: storedProfile?.latitude ? String(storedProfile.latitude) : "",
      longitude: storedProfile?.longitude ? String(storedProfile.longitude) : "",
    };
  });
  const [selectedWardNumber, setSelectedWardNumber] = useState(() => {
    const storedProfile = readStoredProfile(locationProfileKey);
    return storedProfile?.wardNumber ? String(storedProfile.wardNumber) : "";
  });
  const [locationStatus, setLocationStatus] = useState("");
  const [locationError, setLocationError] = useState("");
  const [locationWarning, setLocationWarning] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [detectedWardVerification, setDetectedWardVerification] = useState(null);
  const [wardCorrectionNumber, setWardCorrectionNumber] = useState("");

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
  const wardMatches = searchWard.trim()
    ? wards.filter((ward) => {
      const query = searchWard.toLowerCase().trim();

      return (
        ward.number.toString() === searchWard.trim() ||
        ward.name.toLowerCase().includes(query) ||
        ward.zone.toLowerCase().includes(query)
      );
    }).slice(0, 8)
    : [];
  const savedWard = wards.find((ward) => ward.number === locationProfile?.wardNumber) || null;
  const wardCount = wards.length || election.wards_total || 0;
  const derivedCandidateCounts = getCandidateCounts(wards);
  const candidateTracker = election.candidateTracker
    ? {
      ...election.candidateTracker,
      officialFinalWards: election.candidateTracker.officialFinalWards ?? derivedCandidateCounts.officialFinalWards,
      partyAnnouncedWards: election.candidateTracker.partyAnnouncedWards ?? derivedCandidateCounts.partyAnnouncedWards,
      namedEntries: election.candidateTracker.namedEntries ?? derivedCandidateCounts.namedEntries,
    }
    : null;
  const dataUpdatedAt = election.lastUpdated || candidateTracker?.lastReviewed || null;
  const trackedWardCount = candidateTracker
    ? candidateTracker.officialFinalWards + candidateTracker.partyAnnouncedWards
    : 0;
  const coveragePercent = wardCount > 0 ? Math.round((trackedWardCount / wardCount) * 100) : 0;
  const today = getStartOfDay(new Date());
  const timeline = Array.isArray(election.timeline) ? election.timeline : [];
  const activeTimelineIndex = timeline.findIndex((event) => getStartOfDay(event.date) >= today);
  const nextDeadline = activeTimelineIndex >= 0 ? timeline[activeTimelineIndex] : null;
  const digipinHelpText = `Use your current location or enter latitude and longitude. MyCityPulse saves the civic profile only on this device. DIGIPIN is kept as a derived reference, not the primary location framework.`;
  const electionFeedbackHref = buildMailtoHref({
    subject: `${cityName} election update or correction`,
    lines: [
      "Hi MyCityPulse,",
      "",
      `I want to share an election update or correction for ${cityName}.`,
      "Ward number:",
      "Candidate or issue:",
      "Source link:",
      "What should be updated:",
    ],
  });

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

  const updateLocationWarning = (latitude, longitude) => {
    const mismatch = getDigipinCityMismatch(cityName, latitude, longitude);

    if (mismatch) {
      setLocationWarning(
        `These coordinates look closer to ${mismatch.detectedCity} than ${mismatch.expectedCity}. Double-check that you are using the right city section before saving your ward.`,
      );
      return mismatch;
    }

    setLocationWarning("");
    return null;
  };

  const clearLocationProfile = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(locationProfileKey);
    }

    setLocationProfile(null);
    setDigipinInput("");
    setCoordinateInput({ latitude: "", longitude: "" });
    setSelectedWardNumber("");
    setLocationStatus("Saved civic profile cleared from this device.");
    setLocationError("");
    setLocationWarning("");
    setWardCorrectionNumber("");
  };

  const parseCoordinates = () => {
    const latitude = Number.parseFloat(coordinateInput.latitude);
    const longitude = Number.parseFloat(coordinateInput.longitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      throw new Error("Please enter valid latitude and longitude.");
    }

    if (latitude < -90 || latitude > 90) {
      throw new Error("Latitude must be between -90 and 90.");
    }

    if (longitude < -180 || longitude > 180) {
      throw new Error("Longitude must be between -180 and 180.");
    }

    return {
      latitude: Number(latitude.toFixed(6)),
      longitude: Number(longitude.toFixed(6)),
    };
  };

  const runWardDetection = (latitude, longitude, digipin = "") => {
    const detection = detectWardFromCoordinates(cityName, latitude, longitude, wards);

    if (detection) {
      setWardCorrectionNumber(String(detection.ward.number));
      setDetectedWardVerification({
        ...detection,
        latitude,
        longitude,
        digipin,
      });
      setLocationStatus(`Location saved. Please verify the suggested ward for ${cityLabel}.`);
      return;
    }

    setWardCorrectionNumber("");
    setDetectedWardVerification({
      ward: null,
      latitude,
      longitude,
      digipin,
      confidence: null,
      warning: "We could not suggest a ward from these coordinates. Please choose it manually below.",
    });
    setLocationStatus(`Coordinates saved. Choose your ${cityLabel} ward manually below.`);
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
      setLocationError("Your browser cannot share location here. Enter coordinates manually if you want to verify a ward.");
      setLocationStatus("");
      return;
    }

    setIsLocating(true);
    setLocationError("");
    setLocationStatus("");
    setLocationWarning("");
    setDetectedWardVerification(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        try {
          const latitude = Number(position.coords.latitude.toFixed(6));
          const longitude = Number(position.coords.longitude.toFixed(6));
          const digipin = getDigiPin(latitude, longitude);

          setDigipinInput(digipin);
          setCoordinateInput({
            latitude: String(latitude),
            longitude: String(longitude),
          });
          saveLocationProfile({ digipin, latitude, longitude });
          updateLocationWarning(latitude, longitude);
          runWardDetection(latitude, longitude, digipin);
        } catch {
          setLocationError("We found your location, but could not save it right now. Try again or enter coordinates manually.");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        const message =
          error.code === 1
            ? "Location permission is blocked. Allow location access in your browser settings, or enter coordinates manually."
            : "We could not read your location right now. Check browser permissions, then try again.";
        setLocationError(message);
        setLocationStatus("");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
    );
  };

  const handleCoordinateSubmit = (event) => {
    event.preventDefault();

    try {
      const { latitude, longitude } = parseCoordinates();
      const digipin = getDigiPin(latitude, longitude);

      setDigipinInput(digipin);
      saveLocationProfile({ digipin, latitude, longitude });
      updateLocationWarning(latitude, longitude);
      setLocationError("");
      runWardDetection(latitude, longitude, digipin);
    } catch (error) {
      setLocationError(error.message || "We could not use those coordinates right now.");
      setLocationStatus("");
    }
  };

  const handleDigipinSubmit = (event) => {
    event.preventDefault();

    try {
      const formatted = formatDigipin(digipinInput);
      const decoded = getLatLngFromDigiPin(formatted);

      setDigipinInput(formatted);
      setCoordinateInput({
        latitude: String(decoded.latitude),
        longitude: String(decoded.longitude),
      });
      saveLocationProfile({
        digipin: formatted,
        latitude: decoded.latitude,
        longitude: decoded.longitude,
      });
      updateLocationWarning(decoded.latitude, decoded.longitude);
      setLocationError("");
      runWardDetection(decoded.latitude, decoded.longitude, formatted);
    } catch (error) {
      setLocationError(getDigipinErrorMessage(error));
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

  const handleConfirmDetectedWard = () => {
    const nextWardNumber = wardCorrectionNumber || detectedWardVerification?.ward?.number;

    if (nextWardNumber) {
      handleWardSelection(
        nextWardNumber,
        `Ward ${nextWardNumber} confirmed and saved to your civic profile.`
      );
      setDetectedWardVerification(null);
      setWardCorrectionNumber("");
    }
  };

  const handleReportDetectionError = () => {
    if (detectedWardVerification) {
      const correctedWard = wards.find((ward) => ward.number === Number.parseInt(wardCorrectionNumber, 10)) || null;
      void openMailtoDraft({
        subject: `Ward Detection Error - ${cityName}`,
        lines: [
          'Hi MyCityPulse,',
          '',
          `I found an issue with ward detection in ${cityName}.`,
          `My coordinates: ${detectedWardVerification.latitude}, ${detectedWardVerification.longitude}`,
          `DigiPin: ${detectedWardVerification.digipin}`,
          `Detected ward: ${detectedWardVerification.ward ? `Ward ${detectedWardVerification.ward.number} - ${detectedWardVerification.ward.name}` : "No ward suggested"}`,
          `Actual ward: ${correctedWard ? `Ward ${correctedWard.number} - ${correctedWard.name}` : "[Please enter the correct ward number and name]"}`,
          '',
          'Additional details about why this detection was incorrect:',
        ],
      });
      if (correctedWard) {
        handleWardSelection(correctedWard.number, `Ward ${correctedWard.number} saved. Thanks for flagging the mismatch.`);
      }
      setDetectedWardVerification(null);
      setWardCorrectionNumber("");
    }
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

        {dataUpdatedAt && (
          <p className="coverage-note">
            Last updated {formatDate(dataUpdatedAt, { hour: "numeric", minute: "2-digit" })}.
            {" "}This timestamp reflects the latest MyCityPulse review of this election section.
          </p>
        )}

        {election.scopeNote && <p className="coverage-note">{election.scopeNote}</p>}

        <div className="elections-priority-strip">
          <div className="priority-card">
            <span>Next deadline</span>
            <strong>{nextDeadline ? nextDeadline.label : "Polling window underway"}</strong>
            <p>{nextDeadline ? formatDate(nextDeadline.date) : `Voting was on ${formatDate(election.election_date)}`}</p>
          </div>
          <div className="priority-card">
            <span>Candidate coverage</span>
            <strong>{coveragePercent}% of wards tagged</strong>
            <p>
              {trackedWardCount} of {wardCount} wards currently show either verified names or party-announced status.
            </p>
          </div>
          <div className="priority-card">
            <span>Your saved ward</span>
            <strong>{savedWard ? `Ward ${savedWard.number}` : "Not saved yet"}</strong>
            <p>{savedWard ? savedWard.name : `Save your coordinates, then confirm your ${cityLabel} ward.`}</p>
          </div>
        </div>

        <div className="election-quick-links" aria-label="Election shortcuts">
          <button className="quick-link" type="button" onClick={() => document.getElementById("saved-ward-select")?.focus()}>
            Save my ward
          </button>
          <button className="quick-link" type="button" onClick={() => document.getElementById("ward-search")?.focus()}>
            Search ward directory
          </button>
          {candidateTracker && (
            <button className="quick-link" type="button" onClick={() => document.getElementById("candidate-tracker")?.scrollIntoView({ behavior: "smooth", block: "start" })}>
              See candidate coverage
            </button>
          )}
          {Array.isArray(election.sources) && election.sources.length > 0 && (
            <button className="quick-link" type="button" onClick={() => document.getElementById("election-sources")?.scrollIntoView({ behavior: "smooth", block: "start" })}>
              Open sources
            </button>
          )}
        </div>

        <div className="pledge-section">
          {!hasVoted ? (
            <>
              <button className="pledge-btn" onClick={handlePledgeVote} aria-label="Pledge to vote">
                {"\u270B I Will Vote"}
              </button>
              <p className="pledge-count">{pledgeCount.toLocaleString()} pledge(s) saved in this browser</p>
            </>
          ) : (
            <div className="pledge-confirmed">
              <p>{"\u2705 Your vote pledge is saved on this device."}</p>
              <p className="pledge-count">{pledgeCount.toLocaleString()} pledge(s) saved in this browser</p>
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
            {"\uD83D\uDD0E Find My Ward"}
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
              <p>Save latitude and longitude, then confirm your ward on this device.</p>
            </div>
            {locationProfile && (
              <button className="text-action" onClick={clearLocationProfile}>
                Clear saved profile
              </button>
            )}
          </div>

          {election.locationNote && (
            <p className="location-note">
              {election.locationNote
                .replaceAll("DIGIPIN", "coordinates")
                .replace("Save your coordinates, then confirm your", "Save your coordinates, then confirm your")
                .replace("ward yourself.", "ward yourself or verify the suggestion here.")}
            </p>
          )}
          <p className="digipin-help">{digipinHelpText}</p>

          <div className="location-actions">
            <button
              className="location-btn"
              onClick={handleUseMyLocation}
              disabled={isLocating}
              type="button"
            >
              {isLocating ? "Finding location..." : "Use my location"}
            </button>
            <span className="location-actions-copy">or verify any point with latitude and longitude</span>
          </div>

          <form className="coordinate-form" onSubmit={handleCoordinateSubmit}>
            <input
              type="text"
              inputMode="decimal"
              value={coordinateInput.latitude}
              onChange={(event) => {
                setCoordinateInput((current) => ({ ...current, latitude: event.target.value }));
                setLocationError("");
                setLocationStatus("");
              }}
              placeholder="Latitude"
              className="digipin-input coordinate-input"
              aria-label="Latitude"
            />
            <input
              type="text"
              inputMode="decimal"
              value={coordinateInput.longitude}
              onChange={(event) => {
                setCoordinateInput((current) => ({ ...current, longitude: event.target.value }));
                setLocationError("");
                setLocationStatus("");
              }}
              placeholder="Longitude"
              className="digipin-input coordinate-input"
              aria-label="Longitude"
            />
            <button type="submit" className="digipin-submit">
              Verify coordinates
            </button>
          </form>
          <p className="digipin-field-help">Example: 23.0225 and 72.5714. Use this when you want to check a specific location instead of your live position.</p>

          <form className="digipin-form" onSubmit={handleDigipinSubmit}>
            <input
              type="text"
              value={digipinInput}
              onChange={(event) => {
                setDigipinInput(event.target.value.toUpperCase());
                setLocationError("");
                setLocationStatus("");
                setLocationWarning("");
              }}
              placeholder="Enter your DIGIPIN"
              className="digipin-input"
              aria-label="Enter your DIGIPIN"
            />
            <button type="submit" className="digipin-submit">
              Derive from DIGIPIN
            </button>
          </form>
          <p className="digipin-field-help">Already have a DIGIPIN? Paste it here and MyCityPulse will convert it into coordinates before matching a ward.</p>

          {locationError && <p className="location-feedback error">{locationError}</p>}
          {locationWarning && <p className="location-feedback warning">{locationWarning}</p>}
          {locationStatus && <p className="location-feedback success">{locationStatus}</p>}

          {detectedWardVerification && (
            <div className="ward-verification-box">
              <div className="verification-header">
                <span className="verification-icon">&#10003;</span>
                <h5>Verify ward for this location</h5>
              </div>
              {detectedWardVerification.ward ? (
                <>
                  <p className="detected-ward-info">
                    Suggested ward: Ward {detectedWardVerification.ward.number}: {detectedWardVerification.ward.name}
                  </p>
                  <p className="confidence-info">
                    {detectedWardVerification.confidence ? `Detection confidence: ${detectedWardVerification.confidence}%` : "Confidence is limited for this location, so please verify manually."}
                  </p>
                </>
              ) : (
                <p className="confidence-info">{detectedWardVerification.warning}</p>
              )}
              <label className="ward-select-label" htmlFor="detected-ward-correction">
                Correct ward for this location
              </label>
              <select
                id="detected-ward-correction"
                className="ward-select"
                value={wardCorrectionNumber}
                onChange={(event) => setWardCorrectionNumber(event.target.value)}
              >
                <option value="">Select a ward</option>
                {wards.map((ward) => (
                  <option key={`verify-${ward.number}`} value={ward.number}>
                    Ward {ward.number}: {ward.name}
                  </option>
                ))}
              </select>
              <div className="verification-button-group">
                <button
                  type="button"
                  className="verify-confirm-btn"
                  onClick={handleConfirmDetectedWard}
                  disabled={!wardCorrectionNumber}
                >
                  Confirm and save
                </button>
                <button
                  type="button"
                  className="verify-error-btn"
                  onClick={handleReportDetectionError}
                  disabled={!wardCorrectionNumber}
                >
                  Save and report mismatch
                </button>
              </div>
            </div>
          )}

          <label className="ward-select-label" htmlFor="saved-ward-select">
            Confirm your {cityLabel} ward
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
                  Saved coordinates: {locationProfile.latitude}, {locationProfile.longitude}
                </p>
              )}
              {savedWard && (
                <div className="profile-ward-card">
                  <strong>
                    Ward {savedWard.number}: {savedWard.name}
                  </strong>
                  <p>{savedWard.officeAddress}</p>
                  <div className="candidate-chip-row">
                    <span className={`candidate-chip ${getCandidateTone(savedWard.candidateStatus)}`}>
                      {getCandidateLabel(savedWard.candidateStatus)}
                    </span>
                  </div>
                  <p className="candidate-summary">{savedWard.candidateSummary}</p>
                  {savedWard.candidates.length > 0 && (
                    <div className="candidate-list compact">
                      {savedWard.candidates.map((candidate) => (
                        <div key={`${savedWard.number}-${candidate.name}`} className="candidate-card">
                          <strong>{candidate.name}</strong>
                          <span>{candidate.party}</span>
                          {candidate.note && <p>{candidate.note}</p>}
                        </div>
                      ))}
                    </div>
                  )}
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
              <h4>Official {cityLabel} ward directory</h4>
              <p>Search by ward number, ward name, or zone to find the right ward first. Candidate labels below tell you whether MyCityPulse has verified names, only seen party announcements, or is still checking.</p>
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
            {wardMatches.length > 0 ? (
              <>
                <p className="ward-results-meta">
                  {wardMatches.length === 1 ? "1 ward match" : `${wardMatches.length} ward matches`}
                </p>
                <div className="ward-match-list">
                  {wardMatches.map((ward) => (
                    <div key={ward.number} className="ward-found">
                      <p className="ward-result-title">
                        <strong>
                          Ward {ward.number}: {ward.name}
                        </strong>
                      </p>
                      <p className="ward-result-meta">{ward.zone} Zone</p>
                      <p className="ward-result-address">{ward.officeAddress}</p>
                      <div className="candidate-chip-row">
                        <span className={`candidate-chip ${getCandidateTone(ward.candidateStatus)}`}>
                          {getCandidateLabel(ward.candidateStatus)}
                        </span>
                      </div>
                      <p className="candidate-summary">{ward.candidateSummary}</p>
                      {ward.candidates.length > 0 && (
                        <div className="candidate-list">
                          {ward.candidates.map((candidate) => (
                            <div key={`${ward.number}-${candidate.name}`} className="candidate-card">
                              <strong>{candidate.name}</strong>
                              <span>{candidate.party}</span>
                              {candidate.note && <p>{candidate.note}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                      <button
                        className="inline-save-btn"
                        type="button"
                        onClick={() => handleWardSelection(ward.number, `Ward ${ward.number} added to your civic profile.`)}
                      >
                        Use this ward in my profile
                      </button>
                    </div>
                  ))}
                </div>
              </>
              ) : (
                <p className="no-result">
                No ward match yet. Try a ward number, part of the ward name, or the zone shown in this city's official ward directory.
                </p>
              )}
            </div>
          )}
      </div>

      {candidateTracker && (
        <div className="candidate-tracker" id="candidate-tracker">
          <div className="section-heading compact">
            <div>
              <h4>Candidate tracker</h4>
              <p>
                Last reviewed {formatDate(candidateTracker.lastReviewed)}. This section only shows names and ward coverage that MyCityPulse can label honestly.
              </p>
            </div>
          </div>
          <p className="candidate-tracker-help">
            "Official final" means MyCityPulse has seen a formal finalized list. "Party-announced" means a party has named someone, but final scrutiny or withdrawal status may still change. "Not verified yet" means we are not naming a candidate on the site yet.
          </p>
          <p className="candidate-tracker-note">{candidateTracker.statusNote}</p>
          <div className="coverage-progress" aria-label="Candidate coverage progress">
            <div className="coverage-progress-bar" style={{ width: `${coveragePercent}%` }} />
          </div>
          <p className="coverage-progress-copy">
            {coveragePercent}% of listed wards currently carry an explicit candidate-status label.
          </p>
          <button
            className="text-action"
            type="button"
            onClick={() =>
              openMailtoDraft({
                subject: `${cityName} election update or correction`,
                lines: [
                  "Hi MyCityPulse,",
                  "",
                  `I want to share an election update or correction for ${cityName}.`,
                  "Ward number:",
                  "Candidate or issue:",
                  "Source link:",
                  "What should be updated:",
                ],
              })
            }
          >
            Send an election correction -&gt;
          </button>
          <div className="candidate-metrics">
            <div className="candidate-metric">
              <strong>{candidateTracker.namedEntries}</strong>
              <span>named candidates shown</span>
            </div>
            <div className="candidate-metric">
              <strong>{candidateTracker.partyAnnouncedWards}</strong>
              <span>wards with party-announced names</span>
            </div>
            <div className="candidate-metric">
              <strong>{candidateTracker.officialFinalWards}</strong>
              <span>wards with final verified lists</span>
            </div>
          </div>
          <div className="candidate-legend">
            {candidateTracker.legend.map((item) => (
              <span key={item.key} className={`candidate-chip ${item.tone}`}>
                {item.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {Array.isArray(election.sources) && election.sources.length > 0 && (
        <div className="elections-sources" id="election-sources">
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
            <Suspense fallback={<div style={{ padding: 24, color: "#666" }}>Loading survey...</div>}>
              <CivicSurvey city={cityName} onComplete={() => setShowSurvey(false)} />
            </Suspense>
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
              {timeline.map((event, index) => {
                const eventDay = getStartOfDay(event.date);
                const isActive = ac