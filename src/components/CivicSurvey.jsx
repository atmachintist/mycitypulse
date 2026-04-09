import React, { useState, useEffect } from 'react';
import './CivicSurvey.css';

export default function CivicSurvey({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [showForm, setShowForm] = useState(false);

  // All questions with logic
  const questions = [
    // Welcome Screen
    {
      id: 'welcome',
      type: 'welcome',
      title: 'MyCityPulse',
      subtitle: 'Election Awareness & Civic Pulse Survey',
      description: "We're building a citizen-first platform to make cities more understandable, participatory, and accountable. This short survey (3–4 mins) will help shape how citizens, NGOs, and city systems interact in one shared space.\n\nNo right answers — just your honest perspective.",
    },

    // Section 1: Who You Are
    {
      id: 'age_group',
      section: 'Who You Are',
      type: 'multiple_choice',
      question: 'What age group do you fall into?',
      options: ['18–25', '26–35', '36–45', '46–55', '56+', 'Prefer not to say'],
    },
    {
      id: 'city',
      section: 'Who You Are',
      type: 'short_text',
      question: 'Which city do you live in?',
      placeholder: 'e.g., Ahmedabad, Mumbai, Bengaluru',
    },
    {
      id: 'primary_role',
      section: 'Who You Are',
      type: 'multiple_choice',
      question: 'What best describes your primary role?',
      options: ['Citizen', 'NGO / Community Org', 'Researcher / Academic', 'Urban Planner / Government', 'Media / Journalist', 'Other'],
    },
    {
      id: 'civic_engagement',
      section: 'Who You Are',
      type: 'opinion_scale',
      question: 'How would you rate your civic engagement level?',
      scale: ['Not at all engaged', 'Minimally', 'Moderately', 'Actively', 'Very actively'],
    },

    // Section 2: Election Awareness & Behavior
    {
      id: 'voted_last_election',
      section: 'Election Awareness & Behavior',
      type: 'multiple_choice',
      question: 'Did you vote in the last municipal/local election?',
      options: ['Yes', 'No', 'Prefer not to say'],
      logic: true, // This determines the next question
    },
    {
      id: 'voting_influence',
      section: 'Election Awareness & Behavior',
      type: 'multiple_select',
      question: 'What influenced your vote? (Select up to 2)',
      options: ['Party affiliation', 'Candidate reputation', 'Local issues', 'Word of mouth', 'Media coverage', 'Personal experience with candidate'],
      maxSelect: 2,
      showIf: (r) => r.voted_last_election === 'Yes',
    },
    {
      id: 'not_voting_reason',
      section: 'Election Awareness & Behavior',
      type: 'multiple_choice',
      question: 'What was the main reason you didn't vote?',
      options: ['Lack of time', 'Didn't understand candidates', 'Felt my vote wouldn't matter', 'Didn't know polling location', 'Other personal reasons', 'Didn't know election was happening'],
      showIf: (r) => r.voted_last_election === 'No',
    },

    // Section 3: Civic Awareness
    {
      id: 'municipal_understanding',
      section: 'Civic Awareness',
      type: 'opinion_scale',
      question: 'How well do you understand how your municipal body works?',
      scale: ['Not at all', 'Vaguely', 'Moderately', 'Well', 'Very well'],
    },
    {
      id: 'info_sources',
      section: 'Civic Awareness',
      type: 'multiple_select',
      question: 'Where do you get information about your city? (Select all that apply)',
      options: ['Local news', 'Social media', 'Official city website', 'Word of mouth', 'NGOs / Community organizations', 'Citizen forums / Apps', 'Never actively seek it'],
    },
    {
      id: 'missing_information',
      section: 'Civic Awareness',
      type: 'short_text',
      question: 'What information about your city do you wish was easier to find?',
      placeholder: 'e.g., budget info, election details, complaint status...',
    },

    // Section 4: Civic Participation
    {
      id: 'reported_civic_issue',
      section: 'Civic Participation',
      type: 'multiple_choice',
      question: 'Have you ever reported a civic issue (pothole, water leak, garbage, etc.)?',
      options: ['Yes, multiple times', 'Yes, once', 'No', 'Unsure'],
      logic: true,
    },
    {
      id: 'issue_outcome',
      section: 'Civic Participation',
      type: 'multiple_choice',
      question: 'What happened after you reported the issue?',
      options: ['It was fixed quickly', 'It was fixed, but took time', 'Still waiting', 'Nothing happened', 'Lost track of it'],
      showIf: (r) => r.reported_civic_issue !== 'No' && r.reported_civic_issue !== 'Unsure',
    },
    {
      id: 'participation_barriers',
      section: 'Civic Participation',
      type: 'multiple_select',
      question: 'What stops you from participating more in civic issues? (Select up to 2)',
      options: ['Lack of time', 'Don't know how to report', 'No faith in system', 'Lack of awareness', 'Language barriers', 'Fear of retaliation', 'Nothing stops me'],
      maxSelect: 2,
    },

    // Section 5: MyCityPulse Concept
    {
      id: 'platform_usefulness',
      section: 'MyCityPulse Concept',
      type: 'opinion_scale',
      question: 'How useful would a unified civic platform be for you?',
      scale: ['Not useful', 'Slightly useful', 'Moderately useful', 'Very useful', 'Extremely useful'],
    },
    {
      id: 'platform_use_case',
      section: 'MyCityPulse Concept',
      type: 'multiple_select',
      question: 'What would you primarily use such a platform for? (Select up to 2)',
      options: ['Finding election info', 'Reporting civic issues', 'Tracking gov decisions', 'Connecting with neighbors', 'Learning about candidates', 'Finding civic events'],
      maxSelect: 2,
    },
    {
      id: 'preferred_format',
      section: 'MyCityPulse Concept',
      type: 'multiple_choice',
      question: 'How would you prefer to access city information?',
      options: ['Mobile app', 'Web browser', 'SMS updates', 'Social media', 'In-person at a center', 'Multiple formats'],
    },

    // Section 6: Digital Chowk Vision
    {
      id: 'shared_platform_need',
      section: 'Digital Chowk Vision',
      type: 'opinion_scale',
      question: 'How much do we need a shared civic platform where citizens, NGOs, and government interact?',
      scale: ['Absolutely not', 'Not really', 'Unsure', 'Somewhat', 'Absolutely'],
    },
    {
      id: 'most_active',
      section: 'Digital Chowk Vision',
      type: 'multiple_choice',
      question: 'Who should be most active on such a platform?',
      options: ['Citizens', 'NGOs and Community Orgs', 'Government Officials', 'All equally', 'Depends on the issue'],
    },
    {
      id: 'trust_builder',
      section: 'Digital Chowk Vision',
      type: 'short_text',
      question: 'What would make you trust a civic platform?',
      placeholder: 'e.g., transparency, accountability, speed of response...',
    },

    // Section 7: Early Access
    {
      id: 'early_access',
      section: 'Early Access',
      type: 'multiple_choice',
      question: 'Would you be interested in early access to MyCityPulse?',
      options: ['Yes', 'Maybe', 'No'],
      logic: true,
    },
    {
      id: 'email',
      section: 'Early Access',
      type: 'short_text',
      question: 'Great! What's your email? (Optional)',
      placeholder: 'your@email.com',
      optional: true,
      showIf: (r) => r.early_access === 'Yes' || r.early_access === 'Maybe',
    },

    // Thank You Screen
    {
      id: 'thank_you',
      type: 'thank_you',
      title: 'Thank you for sharing.',
      description: "You're helping shape how cities and citizens interact in the future. We'll be in touch soon with updates on MyCityPulse.",
    },
  ];

  // Filter visible questions based on logic
  const getVisibleQuestions = () => {
    return questions.filter(q => {
      if (q.showIf) {
        return q.showIf(responses);
      }
      return true;
    });
  };

  const visibleQuestions = getVisibleQuestions();
  const currentQuestion = visibleQuestions[currentStep];
  const progress = ((currentStep + 1) / visibleQuestions.length) * 100;

  const handleResponse = (value) => {
    setResponses({
      ...responses,
      [currentQuestion.id]: value,
    });

    // Auto-advance for single choice questions (except welcome)
    if (currentQuestion.type === 'multiple_choice' && currentQuestion.type !== 'welcome') {
      setTimeout(() => handleNext(), 300);
    }
  };

  const handleNext = () => {
    if (currentStep < visibleQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    // Save to localStorage
    localStorage.setItem('civic_survey_responses', JSON.stringify({
      responses,
      timestamp: new Date().toISOString(),
      city: responses.city,
      email: responses.email,
    }));

    // Log for debugging
    console.log('Survey submitted:', responses);

    // Callback if provided
    if (onComplete) {
      onComplete(responses);
    }
  };

  // Render different question types
  const renderQuestion = () => {
    const q = currentQuestion;

    if (q.type === 'welcome') {
      return (
        <div className="survey-welcome">
          <div className="welcome-icon">🏛️</div>
          <h1>{q.title}</h1>
          <h2>{q.subtitle}</h2>
          <p>{q.description}</p>
          <button className="btn-primary" onClick={() => handleNext()}>
            Start Survey (3–4 mins)
          </button>
        </div>
      );
    }

    if (q.type === 'thank_you') {
      return (
        <div className="survey-thank-you">
          <div className="thank-you-icon">✨</div>
          <h1>{q.title}</h1>
          <p>{q.description}</p>
          <button className="btn-primary" onClick={() => onComplete && onComplete(responses)}>
            Close
          </button>
        </div>
      );
    }

    return (
      <div className="survey-question">
        {q.section && <div className="question-section">{q.section}</div>}
        <h2>{q.question}</h2>

        {q.type === 'multiple_choice' && (
          <div className="options">
            {q.options.map((option, i) => (
              <button
                key={i}
                className={`option ${responses[q.id] === option ? 'selected' : ''}`}
                onClick={() => handleResponse(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {q.type === 'multiple_select' && (
          <div className="options">
            {q.options.map((option, i) => (
              <button
                key={i}
                className={`option checkbox ${
                  (responses[q.id] || []).includes(option) ? 'selected' : ''
                }`}
                onClick={() => {
                  const current = responses[q.id] || [];
                  let updated;
                  if (current.includes(option)) {
                    updated = current.filter(o => o !== option);
                  } else {
                    if (q.maxSelect && current.length >= q.maxSelect) {
                      return; // Max selections reached
                    }
                    updated = [...current, option];
                  }
                  setResponses({ ...responses, [q.id]: updated });
                }}
              >
                {option}
              </button>
            ))}
            {q.maxSelect && (
              <p className="help-text">
                Select up to {q.maxSelect} ({(responses[q.id] || []).length} selected)
              </p>
            )}
          </div>
        )}

        {q.type === 'opinion_scale' && (
          <div className="scale-options">
            {q.scale.map((label, i) => (
              <button
                key={i}
                className={`scale-btn ${responses[q.id] === label ? 'selected' : ''}`}
                onClick={() => handleResponse(label)}
                title={label}
              >
                <span className="scale-number">{i + 1}</span>
                <span className="scale-label">{label}</span>
              </button>
            ))}
          </div>
        )}

        {q.type === 'short_text' && (
          <div className="text-input">
            <input
              type="text"
              placeholder={q.placeholder}
              value={responses[q.id] || ''}
              onChange={(e) => setResponses({ ...responses, [q.id]: e.target.value })}
              maxLength="150"
            />
            <p className="char-count">
              {(responses[q.id] || '').length}/150
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="civic-survey-container">
      {/* Progress Bar */}
      {currentQuestion?.type !== 'welcome' && currentQuestion?.type !== 'thank_you' && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
          <span className="progress-text">{Math.round(progress)}%</span>
        </div>
      )}

      {/* Question Container */}
      <div className="survey-content">{renderQuestion()}</div>

      {/* Navigation Buttons */}
      {currentQuestion?.type !== 'welcome' && currentQuestion?.type !== 'thank_you' && (
        <div className="survey-footer">
          <button
            className="btn-secondary"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            ← Previous
          </button>

          {currentStep === visibleQuestions.length - 1 ? (
            <button className="btn-primary" onClick={handleSubmit}>
              Submit Survey
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={!responses[currentQuestion?.id] && !currentQuestion?.optional}
            >
              Next →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
