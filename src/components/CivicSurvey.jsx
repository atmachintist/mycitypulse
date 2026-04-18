import React, { useState } from 'react';
import './CivicSurvey.css';
import { openMailtoDraft } from '../lib/contact.js';
import { submitSurveyResponse } from '../lib/submissions.js';
import { detectWardFromCoordinates, getDetectionConfidence } from '../domain/location/wardDetection.js';
import { getDigiPin } from '../domain/location/digipin.js';

const CivicSurvey = ({ city = 'Ahmedabad', onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [showWelcome, setShowWelcome] = useState(true);
  const [showThankYou, setShowThankYou] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitState, setSubmitState] = useState('idle');
  const [deliveryMode, setDeliveryMode] = useState(null);
  const [submittedResponses, setSubmittedResponses] = useState(null);
  const [wardDetection, setWardDetection] = useState({ detected: null, isLocating: false, error: null });
  const [wardVerification, setWardVerification] = useState(null);

  const questions = [
    // Section 1: Demographics
    {
      id: 'q1',
      section: 'About You',
      question: 'What is your age group?',
      type: 'choice',
      options: ['18-25', '26-35', '36-45', '46-55', '56+'],
    },
    {
      id: 'q2',
      section: 'About You',
      question: 'How long have you lived in ' + city + '?',
      type: 'choice',
      options: ['Less than 1 year', '1-3 years', '3-5 years', '5-10 years', '10+ years'],
    },
    {
      id: 'q3',
      section: 'About You',
      question: 'Which ward do you primarily live in?',
      type: 'text',
      placeholder: 'Enter ward number or name',
    },
    // Section 2: Civic Engagement
    {
      id: 'q4',
      section: 'Civic Participation',
      question: 'How often do you participate in local community activities?',
      type: 'choice',
      options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'],
    },
    {
      id: 'q5',
      section: 'Civic Participation',
      question: 'Did you vote in the last election?',
      type: 'choice',
      options: ['Yes', 'No', 'Not eligible'],
    },
    {
      id: 'q6',
      section: 'Civic Participation',
      question: 'What factors influence your voting decision the most?',
      type: 'multiselect',
      options: ['Candidate credentials', 'Party ideology', 'Local issues', 'Development promises', 'Personal connections'],
      maxSelect: 3,
      showIf: { q5: 'Yes' },
    },
    {
      id: 'q7',
      section: 'Civic Participation',
      question: 'What prevented you from voting in the last election?',
      type: 'multiselect',
      options: ['Lack of awareness', 'Work commitments', 'Health issues', 'Distance to polling booth', 'Disinterest in politics'],
      maxSelect: 2,
      showIf: { q5: 'No' },
    },
    // Section 3: Civic Issues
    {
      id: 'q8',
      section: 'Local Issues',
      question: 'What is the most pressing civic issue in your area?',
      type: 'choice',
      options: ['Pothole/Road quality', 'Water supply', 'Garbage management', 'Streetlights', 'Traffic congestion', 'Other'],
    },
    {
      id: 'q9',
      section: 'Local Issues',
      question: 'Rate the quality of civic services in your ward:',
      type: 'opinion',
      scale: 5,
    },
    {
      id: 'q10',
      section: 'Local Issues',
      question: 'How satisfied are you with the ward councillor\'s performance?',
      type: 'opinion',
      scale: 5,
    },
    {
      id: 'q11',
      section: 'Local Issues',
      question: 'Have you reported a civic issue to the local authorities?',
      type: 'choice',
      options: ['Yes', 'No', 'Don\'t know how'],
    },
    {
      id: 'q12',
      section: 'Local Issues',
      question: 'How long did it take to resolve the issue?',
      type: 'choice',
      options: ['Within 1 week', '1-2 weeks', '2-4 weeks', '1-3 months', '3+ months', 'Not resolved'],
      showIf: { q11: 'Yes' },
    },
    // Section 4: Development & Growth
    {
      id: 'q13',
      section: 'Development & Growth',
      question: 'What type of development would benefit your area the most?',
      type: 'choice',
      options: ['Better roads', 'More parks', 'Public transport', 'Shopping centers', 'Schools/hospitals'],
    },
    {
      id: 'q14',
      section: 'Development & Growth',
      question: 'Are you concerned about environmental issues in your ward?',
      type: 'opinion',
      scale: 5,
    },
    {
      id: 'q15',
      section: 'Development & Growth',
      question: 'Should the city prioritize sustainability over commercial development?',
      type: 'choice',
      options: ['Strongly agree', 'Agree', 'Neutral', 'Disagree', 'Strongly disagree'],
    },
    // Section 5: Safety & Infrastructure
    {
      id: 'q16',
      section: 'Safety & Infrastructure',
      question: 'How safe do you feel in your ward?',
      type: 'opinion',
      scale: 5,
    },
    {
      id: 'q17',
      section: 'Safety & Infrastructure',
      question: 'What safety measures need improvement?',
      type: 'multiselect',
      options: ['Street lighting', 'Police presence', 'CCTV cameras', 'Emergency services', 'Traffic safety'],
      maxSelect: 3,
    },
    // Section 6: Digital & Services
    {
      id: 'q18',
      section: 'Digital Services',
      question: 'Have you used online government services (e.g., tax payment, licenses)?',
      type: 'choice',
      options: ['Yes, frequently', 'Yes, occasionally', 'No, not aware', 'No, prefer offline'],
    },
    {
      id: 'q19',
      section: 'Digital Services',
      question: 'How could digital services be improved?',
      type: 'text',
      placeholder: 'Share your suggestions...',
      maxLength: 200,
    },
    // Section 7: Feedback & Future
    {
      id: 'q20',
      section: 'Future Engagement',
      question: 'Would you be interested in early access to civic initiatives and feedback opportunities?',
      type: 'choice',
      options: ['Yes', 'No', 'Maybe'],
    },
    {
      id: 'q21',
      section: 'Future Engagement',
      question: 'What is your preferred way to stay updated about local governance?',
      type: 'multiselect',
      options: ['WhatsApp alerts', 'Email newsletters', 'Social media', 'SMS updates', 'Community meetings'],
      maxSelect: 3,
      showIf: { q20: 'Yes' },
    },
  ];

  // Filter questions based on conditional logic
  const visibleQuestions = questions.filter((q) => {
    if (!q.showIf) return true;
    const condition = q.showIf;
    for (let qId in condition) {
      if (responses[qId] !== condition[qId]) return false;
    }
    return true;
  });
  const questionMap = Object.fromEntries(questions.map((question) => [question.id, question]));

  const handleStart = () => {
    setShowWelcome(false);
    setCurrentQuestion(0);
  };

  const handleAnswer = (answer) => {
    const newResponses = { ...responses, [visibleQuestions[currentQuestion].id]: answer };
    setResponses(newResponses);

    if (currentQuestion < visibleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      void handleComplete(newResponses);
    }
  };

  const handleComplete = async (finalResponses) => {
    const surveyData = {
      city,
      timestamp: new Date().toISOString(),
      email: email || 'anonymous',
      responses: finalResponses,
    };

    try {
      setSubmitState('submitting');
      setSubmitError('');
      const result = await submitSurveyResponse(surveyData);
      setDeliveryMode(result.delivery);
      setSubmittedResponses(finalResponses);
      setShowThankYou(true);
    } catch {
      setSubmitError('We could not submit your survey right now. You can try again or email hello@mycitypulse.in.');
    } finally {
      setSubmitState('idle');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSkip = () => {
    if (currentQuestion < visibleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      void handleComplete(responses);
    }
  };

  const handleUseLocationForWard = () => {
    if (!navigator.geolocation) {
      setWardDetection({
        detected: null,
        isLocating: false,
        error: 'Geolocation is not available in your browser. Please enter your ward manually.',
      });
      return;
    }

    setWardDetection({ detected: null, isLocating: true, error: null });
    setWardVerification(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        try {
          const lat = Number(position.coords.latitude.toFixed(6));
          const lon = Number(position.coords.longitude.toFixed(6));
          const digipin = getDigiPin(lat, lon);

          // For now, we can't detect ward without loading city-specific ward data
          // This would require importing all ward data. In a real app, you'd fetch this from the parent.
          // For demo purposes, show the coordinates and let user know we're ready
          setWardVerification({
            latitude: lat,
            longitude: lon,
            digipin,
            wardDetected: null,
            confidence: 0,
            message: 'Location acquired. Enter your ward number below to verify it matches your location.',
          });

          setWardDetection({
            detected: { lat, lon, digipin },
            isLocating: false,
            error: null,
          });
        } catch (error) {
          setWardDetection({
            detected: null,
            isLocating: false,
            error: 'Could not convert your location. Please enter your ward manually.',
          });
        }
      },
      (error) => {
        const message =
          error.code === 1
            ? 'Location permission was denied. Please enable location access and try again.'
            : 'Could not get your location. Please check your browser settings or enter your ward manually.';
        setWardDetection({
          detected: null,
          isLocating: false,
          error: message,
        });
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  const handleWardVerificationConfirm = (ward) => {
    // Auto-fill the ward field
    handleAnswer(ward);
    // Record that location was verified
    setWardVerification(null);
  };

  const handleReportWardError = () => {
    if (wardVerification?.latitude && wardVerification?.longitude) {
      void openMailtoDraft({
        subject: `Ward Detection Error Report - ${city}`,
        lines: [
          'Hi MyCityPulse,',
          '',
          `I found an issue with ward detection in ${city}.`,
          `My coordinates: ${wardVerification.latitude}, ${wardVerification.longitude}`,
          `DigiPin: ${wardVerification.digipin}`,
          `Detected ward: ${wardVerification.wardDetected ? `${wardVerification.wardDetected.number} - ${wardVerification.wardDetected.name}` : 'None'}`,
          `Actual ward: [Please enter the correct ward]`,
          '',
          'Additional details:',
        ],
      });
      setWardVerification(null);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email && !validateEmail(email)) {
      setEmailError('Please enter a valid email');
      return;
    }
    setEmailError('');
    handleStart();
  };

  const getResponseLabel = (value) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }

    return String(value);
  };

  if (showWelcome) {
    return (
      <div className="survey-container">
        <div className="survey-welcome">
          <div className="welcome-icon">{"\uD83D\uDCCB"}</div>
          <h2>Help Shape {city}'s Future</h2>
          <p>
            Your voice matters! This quick survey takes about 5 minutes and helps us understand what matters most to you
            in your community.
          </p>
          <div className="survey-benefits">
            <div className="benefit-item">{"\u2713 Completely anonymous"}</div>
            <div className="benefit-item">{"\u2713 21 questions"}</div>
            <div className="benefit-item">{"\u2713 Your feedback drives change"}</div>
          </div>

          <form onSubmit={handleEmailSubmit} className="email-form">
            <input
              type="email"
              placeholder="Enter your email (optional)"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError('');
              }}
              className="email-input"
            />
            {emailError && <p className="error-text">{emailError}</p>}
            <button type="submit" className="start-btn">
              Start Survey
            </button>
          </form>
          <p className="privacy-note">
            Your email won't be shared publicly. If `VITE_SURVEY_ENDPOINT` is not configured, responses stay on this device.
          </p>
        </div>
      </div>
    );
  }

  if (showThankYou) {
    return (
      <div className="survey-container">
        <div className="survey-thank-you">
          <div className="thank-you-icon">{"\uD83D\uDE4F"}</div>
          <h2>Thank You!</h2>
          <p>
            {deliveryMode === 'remote'
              ? `Your feedback has been submitted and will help improve civic services in ${city}.`
              : `Your feedback has been saved on this device for ${city}.`}
          </p>
          <p className="follow-up">
            {email && email !== '' ? `We'll keep you updated at ${email}.` : 'Stay tuned for updates!'}
          </p>
          <div className="next-steps">
            <h3>What happens next?</h3>
            <ul>
              <li>{deliveryMode === 'remote' ? 'Your responses reached the MyCityPulse team for review' : 'Your responses are stored locally in this browser until a live survey inbox is wired up'}</li>
              <li>We look for patterns across local priorities and service gaps</li>
              <li>Those insights help shape future civic coverage and outreach</li>
            </ul>
          </div>
          {deliveryMode !== 'remote' && (
            <>
              <p className="privacy-note">For a guaranteed human follow-up today, email your saved response to the team.</p>
              <button
                type="button"
                className="start-btn survey-close-btn"
                onClick={() => openMailtoDraft({
                  subject: `${city} civic survey response`,
                  lines: [
                    'Hi MyCityPulse,',
                    '',
                    `I’m sharing my civic survey responses for ${city}.`,
                    `Email: ${email || 'anonymous'}`,
                    '',
                    ...Object.entries(submittedResponses || {}).map(([questionId, value]) => {
                      const question = questionMap[questionId];
                      return `${question?.question || questionId}: ${getResponseLabel(value)}`;
                    }),
                  ],
                })}
              >
                Email My Responses
              </button>
            </>
          )}
          {onComplete && (
            <button type="button" className="start-btn survey-close-btn" onClick={onComplete}>
              Close Survey
            </button>
          )}
        </div>
      </div>
    );
  }

  const currentQ = visibleQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / visibleQuestions.length) * 100;

  return (
    <div className="survey-container">
      <div className="progress-bar" style={{ width: `${progress}%` }}></div>

      <div className="survey-content">
        <div className="survey-header">
          <span className="progress-text">
            Question {currentQuestion + 1} of {visibleQuestions.length}
          </span>
          <span className="section-tag">{currentQ.section}</span>
        </div>

        <h3 className="survey-question">{currentQ.question}</h3>

        <div className="survey-options">
          {currentQ.type === 'choice' && (
            <div className="choice-grid">
              {currentQ.options.map((option, idx) => (
                <button
                  key={idx}
                  className={`option-btn ${responses[currentQ.id] === option ? 'selected' : ''}`}
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {currentQ.type === 'multiselect' && (
            <div className="multiselect-grid">
              {currentQ.options.map((option, idx) => (
                <button
                  key={idx}
                  className={`option-btn multiselect ${
                    (responses[currentQ.id] || []).includes(option) ? 'selected' : ''
                  }`}
                  onClick={() => {
                    const current = responses[currentQ.id] || [];
                    let updated;
                    if (current.includes(option)) {
                      updated = current.filter((o) => o !== option);
                    } else {
                      if (current.length < currentQ.maxSelect) {
                        updated = [...current, option];
                      } else {
                        return;
                      }
                    }
                    setResponses({ ...responses, [currentQ.id]: updated });
                  }}
                >
                  {option}
                  {(responses[currentQ.id] || []).includes(option) && <span className="checkmark">{"\u2713"}</span>}
                </button>
              ))}
              <p className="multiselect-hint">
                Select up to {currentQ.maxSelect} ({(responses[currentQ.id] || []).length} selected)
              </p>
            </div>
          )}

          {currentQ.type === 'opinion' && (
            <div className="opinion-scale">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="opinion-col">
                  <button
                    className={`opinion-btn ${responses[currentQ.id] === num ? 'selected' : ''}`}
                    onClick={() => handleAnswer(num)}
                  >
                    {num}
                  </button>
                  <span className="opinion-label">
                    {num === 1 && 'Very Poor'}
                    {num === 2 && 'Poor'}
                    {num === 3 && 'Neutral'}
                    {num === 4 && 'Good'}
                    {num === 5 && 'Excellent'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {currentQ.type === 'text' && (
            <div className="text-input-group">
              {currentQ.id === 'q3' && (
                <div className="ward-detection-section">
                  <button
                    type="button"
                    className="location-btn"
                    onClick={handleUseLocationForWard}
                    disabled={wardDetection.isLocating}
                  >
                    {wardDetection.isLocating ? '📍 Finding location...' : '📍 Use my location'}
                  </button>
                  <p className="location-help-text">Allow location access to auto-detect your ward</p>

                  {wardDetection.error && (
                    <p className="location-error">{wardDetection.error}</p>
                  )}

                  {wardVerification && (
                    <div className="ward-verification-card">
                      <p className="verification-title">✓ Location found!</p>
                      <p className="verification-message">{wardVerification.message}</p>
                      {wardVerification.wardDetected && (
                        <div className="detected-ward-box">
                          <p className="detected-label">Detected ward:</p>
                          <p className="detected-ward-name">
                            Ward {wardVerification.wardDetected.number}: {wardVerification.wardDetected.name}
                          </p>
                          <p className="confidence-text">
                            Confidence: {wardVerification.confidence}%
                          </p>
                          <div className="verification-actions">
                            <button
                              type="button"
                              className="verify-yes-btn"
                              onClick={() => handleWardVerificationConfirm(wardVerification.wardDetected.number)}
                            >
                              ✓ This is correct
                            </button>
                            <button
                              type="button"
                              className="verify-no-btn"
                              onClick={handleReportWardError}
                            >
                              ✗ Report error
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <textarea
                className="text-input"
                placeholder={currentQ.placeholder}
                value={responses[currentQ.id] || ''}
                onChange={(e) => {
                  const val = currentQ.maxLength ? e.target.value.slice(0, currentQ.maxLength) : e.target.value;
                  setResponses({ ...responses, [currentQ.id]: val });
                }}
                rows="4"
              />
              {currentQ.maxLength && (
                <p className="char-count">
                  {(responses[currentQ.id] || '').length} / {currentQ.maxLength}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="survey-actions">
          <button
            className="nav-btn prev-btn"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            {"\u2190 Previous"}
          </button>

          <button className="skip-btn" onClick={handleSkip}>
            Skip
          </button>

          <button
            className={`nav-btn next-btn ${!responses[currentQ.id] ? 'disabled' : ''}`}
            onClick={() => handleAnswer(responses[currentQ.id])}
            disabled={!responses[currentQ.id] || submitState === 'submitting'}
          >
            {submitState === 'submitting' ? 'Submitting...' : currentQuestion === visibleQuestions.length - 1 ? 'Submit' : 'Next \u2192'}
          </button>
        </div>
        {submitError && <p className="error-text">{submitError}</p>}
      </div>
    </div>
  );
};

export default CivicSurvey;

