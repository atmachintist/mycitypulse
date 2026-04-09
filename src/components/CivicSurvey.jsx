import React, { useState, useEffect } from 'react';
import './CivicSurvey.css';

const CivicSurvey = ({ city = 'Ahmedabad', onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [showWelcome, setShowWelcome] = useState(true);
  const [showThankYou, setShowThankYou] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

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
      handleComplete(newResponses);
    }
  };

  const handleComplete = (finalResponses) => {
    const surveyData = {
      city,
      timestamp: new Date().toISOString(),
      email: email || 'anonymous',
      responses: finalResponses,
    };

    // Save to localStorage
    const key = `survey_${city}_${Date.now()}`;
    localStorage.setItem(key, JSON.stringify(surveyData));

    setShowThankYou(true);
    if (onComplete) {
      onComplete(surveyData);
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
      handleComplete(responses);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      return;
    }
    setEmailError('');
    handleStart();
  };

  if (showWelcome) {
    return (
      <div className="survey-container">
        <div className="survey-welcome">
          <div className="welcome-icon">📋</div>
          <h2>Help Shape {city}'s Future</h2>
          <p>
            Your voice matters! This quick survey takes about 5-7 minutes and helps us understand what matters most to you
            in your community.
          </p>
          <div className="survey-benefits">
            <div className="benefit-item">✓ Completely anonymous</div>
            <div className="benefit-item">✓ 21 questions</div>
            <div className="benefit-item">✓ Your feedback drives change</div>
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
          <p className="privacy-note">Your email won't be shared publicly. We respect your privacy.</p>
        </div>
      </div>
    );
  }

  if (showThankYou) {
    return (
      <div className="survey-container">
        <div className="survey-thank-you">
          <div className="thank-you-icon">🙏</div>
          <h2>Thank You!</h2>
          <p>Your feedback has been recorded and will help improve civic services in {city}.</p>
          <p className="follow-up">
            {email && email !== '' ? `We'll keep you updated at ${email}.` : 'Stay tuned for updates!'}
          </p>
          <div className="next-steps">
            <h3>What happens next?</h3>
            <ul>
              <li>Your responses are securely stored</li>
              <li>We analyze feedback from all respondents</li>
              <li>Insights are shared with local authorities</li>
              <li>Actionable improvements are implemented</li>
            </ul>
          </div>
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
                  {(responses[currentQ.id] || []).includes(option) && <span className="checkmark">✓</span>}
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
            ← Previous
          </button>

          <button className="skip-btn" onClick={handleSkip}>
            Skip
          </button>

          <button
            className={`nav-btn next-btn ${!responses[currentQ.id] ? 'disabled' : ''}`}
            onClick={() => handleAnswer(responses[currentQ.id])}
            disabled={!responses[currentQ.id]}
          >
            {currentQuestion === visibleQuestions.length - 1 ? 'Submit' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CivicSurvey;