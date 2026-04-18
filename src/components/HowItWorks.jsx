import { useState } from 'react';

/**
 * HowItWorks Component - A user-friendly guide to MyCityPulse
 *
 * UX Principles Applied:
 * - Progressive disclosure: Shows information step by step
 * - Visual hierarchy: Clear distinction between sections
 * - Consistency: Follows existing design language
 * - Accessibility: Semantic HTML, ARIA labels, keyboard navigation
 * - Mobile-first: Responsive design for all devices
 * - Clear CTAs: Action-oriented buttons and links
 */

export default function HowItWorks() {
  const [expandedStep, setExpandedStep] = useState(0);

  const steps = [
    {
      icon: '🔍',
      number: '1',
      title: 'Search Your City',
      description: 'Start by searching for your city in the search bar. MyCityPulse covers 62+ Indian cities with detailed civic context.',
      details: [
        'Type your city name in the top search bar',
        'Select from the dropdown suggestions',
        'Instant access to city-specific information'
      ],
      color: '#E8660D'
    },
    {
      icon: '📍',
      number: '2',
      title: 'Explore City Data',
      description: 'Once you select a city, you\'ll see comprehensive information about civic stress, demographics, and local context.',
      details: [
        'View population, density, and area statistics',
        'Understand civic stress levels and challenges',
        'Read about the city\'s urban typology and characteristics',
        'See local civic organizations and resources'
      ],
      color: '#1f6f5f'
    },
    {
      icon: '🏘️',
      number: '3',
      title: 'Find Your Ward',
      description: 'Locate your specific ward to access local governance information, corporators, and area-specific civic data.',
      details: [
        'Enter your location or address',
        'Identify your ward boundaries and number',
        'Find your local corporator and contact details',
        'Access ward-specific civic issues and resources'
      ],
      color: '#8b6f4e'
    },
    {
      icon: '📋',
      number: '4',
      title: 'Report Issues',
      description: 'Help improve your city by reporting litter, garbage, and public space issues to the right authorities.',
      details: [
        'Click "Report Issues" in the city page',
        'Fill in issue details (type, location, description)',
        'Share a photo if possible (optional but helpful)',
        'Submit - your report goes to the right civic body'
      ],
      color: '#E8660D'
    },
    {
      icon: '🗳️',
      number: '5',
      title: 'Stay Updated on Elections',
      description: 'For participating cities, access detailed municipal election information and civic updates.',
      details: [
        'View election dates and voting information',
        'Learn about candidates and electoral wards',
        'Understand municipal corporation structure',
        'Get civic news and policy updates'
      ],
      color: '#1f6f5f'
    },
    {
      icon: '⚖️',
      number: '6',
      title: 'Compare Cities',
      description: 'Compare multiple cities side-by-side to understand different urban contexts and challenges.',
      details: [
        'Add cities to your comparison list',
        'View side-by-side statistics and metrics',
        'Understand relative strengths and challenges',
        'Export or share comparison data'
      ],
      color: '#8b6f4e'
    }
  ];

  const features = [
    {
      title: 'Real-time Data',
      description: 'Access up-to-date information about 62+ Indian cities',
      icon: '⚡'
    },
    {
      title: 'User-Friendly',
      description: 'Designed for everyone - no technical knowledge needed',
      icon: '💡'
    },
    {
      title: 'Action-Ready',
      description: 'Report issues and connect with civic authorities',
      icon: '✅'
    },
    {
      title: 'Accessible',
      description: 'Available on desktop, tablet, and mobile devices',
      icon: '📱'
    },
    {
      title: 'Transparent',
      description: 'Clear about data sources and coverage areas',
      icon: '🔓'
    },
    {
      title: 'Community-Driven',
      description: 'Your input helps us improve cities',
      icon: '👥'
    }
  ];

  const toggleExpand = (index) => {
    setExpandedStep(expandedStep === index ? -1 : index);
  };

  return (
    <section
      className="how-it-works-section"
      style={{
        background: 'linear-gradient(135deg, #fffaf6 0%, #faf8f4 100%)',
        borderTop: '1px solid #eee2d3',
        borderBottom: '1px solid #eee2d3',
        padding: '0'
      }}
      aria-label="How MyCityPulse Works"
    >
      {/* Hero Section */}
      <div style={{
        padding: '60px 24px',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{
            fontSize: 12,
            fontWeight: 700,
            color: '#E8660D',
            letterSpacing: '0.1em',
            marginBottom: 16,
            textTransform: 'uppercase'
          }}>
            Getting Started
          </div>
          <h2 style={{
            fontSize: 'clamp(28px, 5vw, 42px)',
            fontFamily: 'Georgia, serif',
            fontWeight: 700,
            color: '#1a1a1a',
            marginBottom: 16,
            margin: '0 0 16px 0'
          }}>
            How MyCityPulse Works
          </h2>
          <p style={{
            fontSize: 18,
            color: '#666',
            lineHeight: 1.7,
            margin: 0,
            maxWidth: 700,
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Navigate your city with confidence. Here's everything you need to know to get started.
          </p>
        </div>
      </div>

      {/* Steps Section */}
      <div style={{
        padding: '40px 24px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h3 style={{
          fontSize: 20,
          fontWeight: 700,
          color: '#1a1a1a',
          marginBottom: 32,
          textAlign: 'center'
        }}>
          Six Simple Steps
        </h3>

        <div className="steps-container" style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          marginBottom: 40
        }}>
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => toggleExpand(index)}
              className="step-card"
              style={{
                background: '#fff',
                border: expandedStep === index ? `2px solid ${step.color}` : '1px solid #eadfce',
                borderRadius: 12,
                padding: 24,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'left',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              aria-expanded={expandedStep === index}
              aria-label={`Step ${step.number}: ${step.title}`}
            >
              {/* Step Number Badge */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: 4,
                background: step.color,
                opacity: 0.6
              }} />

              {/* Icon and Title */}
              <div style={{ marginBottom: 12 }}>
                <div style={{
                  fontSize: 36,
                  marginBottom: 12
                }}>
                  {step.icon}
                </div>
                <h4 style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#1a1a1a',
                  margin: 0,
                  paddingRight: 24,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  <span style={{
                    display: 'inline-flex',
                    width: 28,
                    height: 28,
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: step.color,
                    color: '#fff',
                    borderRadius: '50%',
                    fontSize: 14,
                    fontWeight: 700,
                    flexShrink: 0
                  }}>
                    {step.number}
                  </span>
                  {step.title}
                </h4>
              </div>

              {/* Description */}
              <p style={{
                fontSize: 14,
                color: '#666',
                lineHeight: 1.6,
                margin: 0,
                marginBottom: 12
              }}>
                {step.description}
              </p>

              {/* Expand/Collapse Indicator */}
              <div style={{
                fontSize: 18,
                color: step.color,
                opacity: 0.6,
                marginTop: 12,
                transition: 'transform 0.3s ease',
                transform: expandedStep === index ? 'rotate(180deg)' : 'rotate(0)'
              }}>
                ▼
              </div>

              {/* Expandable Details */}
              {expandedStep === index && (
                <div style={{
                  marginTop: 20,
                  paddingTop: 20,
                  borderTop: `1px solid ${step.color}33`,
                  animation: 'slideDown 0.3s ease'
                }}>
                  <p style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: step.color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: 12,
                    margin: '0 0 12px 0'
                  }}>
                    Details
                  </p>
                  <ul style={{
                    margin: 0,
                    padding: '0 0 0 20px',
                    listStyle: 'none'
                  }}>
                    {step.details.map((detail, idx) => (
                      <li
                        key={idx}
                        style={{
                          fontSize: 13,
                          color: '#666',
                          lineHeight: 1.7,
                          marginBottom: idx < step.details.length - 1 ? 8 : 0,
                          position: 'relative',
                          paddingLeft: 12
                        }}
                      >
                        <span style={{
                          position: 'absolute',
                          left: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: step.color,
                          opacity: 0.6
                        }} />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div style={{
        padding: '40px 24px',
        background: '#fff',
        borderTop: '1px solid #eee2d3'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h3 style={{
            fontSize: 20,
            fontWeight: 700,
            color: '#1a1a1a',
            marginBottom: 32,
            textAlign: 'center'
          }}>
            Why Choose MyCityPulse?
          </h3>

          <div className="features-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24
          }}>
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  background: '#fffaf6',
                  border: '1px solid #eadfce',
                  borderRadius: 12,
                  padding: 24,
                  textAlign: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#faf8f4';
                  e.currentTarget.style.borderColor = '#E8660D';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fffaf6';
                  e.currentTarget.style.borderColor = '#eadfce';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  fontSize: 40,
                  marginBottom: 12
                }}>
                  {feature.icon}
                </div>
                <h4 style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#1a1a1a',
                  marginBottom: 8,
                  margin: '0 0 8px 0'
                }}>
                  {feature.title}
                </h4>
                <p style={{
                  fontSize: 14,
                  color: '#666',
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        padding: '40px 24px',
        background: 'linear-gradient(135deg, #fffaf6 0%, #faf8f4 100%)',
        borderTop: '1px solid #eee2d3'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: 24,
            fontWeight: 700,
            color: '#1a1a1a',
            marginBottom: 16,
            margin: '0 0 16px 0'
          }}>
            Ready to Get Started?
          </h3>
          <p style={{
            fontSize: 16,
            color: '#666',
            lineHeight: 1.7,
            marginBottom: 24,
            margin: '0 0 24px 0',
            maxWidth: 600,
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Search for your city above or explore one of our featured cities to begin discovering civic insights.
          </p>
          <button
            style={{
              background: '#E8660D',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '14px 32px',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(232, 102, 13, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#cc5a0b';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(232, 102, 13, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#E8660D';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(232, 102, 13, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onClick={() => {
              // Scroll to search or trigger search
              const searchInput = document.querySelector('input[type="text"]');
              if (searchInput) {
                searchInput.focus();
                searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            aria-label="Search for your city"
          >
            Search Your City
          </button>
        </div>
      </div>

      {/* Mobile-friendly Styles */}
      <style>{`
        @media (max-width: 768px) {
          .steps-container {
            grid-template-columns: 1fr;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .step-card {
            padding: 20px !important;
          }

          .how-it-works-section h2 {
            font-size: 28px;
          }

          .how-it-works-section h3 {
            font-size: 18px;
          }
        }

        @media (max-width: 480px) {
          .how-it-works-section {
            padding: 30px 12px;
          }

          .step-card {
            padding: 16px !important;
          }

          .step-card h4 {
            font-size: 16px;
          }

          .how-it-works-section p {
            font-size: 14px;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .step-card {
          box-shadow: none;
          transform: translateY(0);
        }

        .step-card:focus-visible {
          outline: 2px solid #E8660D;
          outline-offset: 2px;
        }

        button {
          font-family: inherit;
        }
      `}</style>
    </section>
  );
}
