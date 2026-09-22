import React, { useState, useEffect } from 'react';
import { MessageSquare, BookOpen, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Zap, ArrowRight } from 'lucide-react';
import { ScreeningResult } from '../types';

interface ResultsScreenProps {
  result: ScreeningResult;
  onAskAI: () => void;
  onViewGuidance: () => void;
  onDone: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  result,
  onAskAI,
  onViewGuidance,
  onDone,
}) => {
  const [showFactors, setShowFactors] = useState<boolean>(true);
  const [displayConfidence, setDisplayConfidence] = useState<number>(0);

  // Count up confidence score from 0 to result.confidence
  useEffect(() => {
    const target = result.confidence;
    const duration = 1000;
    const intervalTime = 25;
    const steps = duration / intervalTime;
    const increment = target / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplayConfidence(target);
        clearInterval(timer);
      } else {
        setDisplayConfidence(Math.floor(current));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [result.confidence]);

  const riskTheme = {
    lower_concern: {
      bg: '#0A1D24',
      border: '#14B8A6',
      text: '#A8DADC',
      badge: 'LOWER-RISK VISUAL PATTERN',
      badgeClass: 'lower_concern',
    },
    review_recommended: {
      bg: '#221A00',
      border: '#F59E0B',
      text: '#FFD166',
      badge: 'REVIEW RECOMMENDED',
      badgeClass: 'review_recommended',
    },
    prompt_review: {
      bg: '#2A0B0E',
      border: '#F43F5E',
      text: '#FF6B5F',
      badge: 'PROMPT MEDICAL REVIEW',
      badgeClass: 'prompt_review',
    },
  }[result.riskLevel];

  const strokeDashoffset = 283 - (283 * displayConfidence) / 100;

  return (
    <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span className="tech-label" style={{ color: '#FFD600' }}>
            ON-DEVICE SCREENING COMPLETE
          </span>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em', margin: 0 }}>
            AI SCREENING RESULT
          </h2>
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {result.timestamp}
        </span>
      </div>

      {/* Primary Matte Panel */}
      <div
        className="card"
        style={{
          backgroundColor: 'var(--bg-surface)',
          padding: '20px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Risk Category Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className={`risk-badge ${riskTheme.badgeClass}`}>
            {result.categoryTitle.toUpperCase()}
          </span>

          <img
            src={result.imageUri}
            alt="Scanned Lesion"
            style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-control)',
              objectFit: 'cover',
              border: '1px solid var(--border-subtle)',
            }}
          />
        </div>

        {/* Large Typography: Confidence Score */}
        <div style={{ padding: '4px 0' }}>
          <div
            style={{
              fontSize: '3.2rem',
              fontWeight: 900,
              fontFamily: 'var(--font-mono)',
              color: riskTheme.text,
              lineHeight: '1',
              letterSpacing: '-0.03em',
            }}
          >
            {displayConfidence}%
          </div>
          <div className="tech-label" style={{ color: 'white', fontSize: '0.74rem', marginTop: '6px' }}>
            MODEL CONFIDENCE
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: '2px 0 0 0' }}>
            Model confidence — not medical certainty.
          </p>
        </div>

        <p style={{ fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: '1.45', margin: 0 }}>
          {result.explanation}
        </p>

        <div className="matte-divider" />

        {/* Visual Features List with Dividers */}
        <div>
          <span className="tech-label" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>
            VISUAL FEATURES
          </span>

          <div>
            {result.factorsConsidered.map((factor, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <div className="matte-divider" />}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 0',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'white' }}>
                      {factor.name}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>
                      {factor.detail}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: '0.70rem',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-xs)',
                      backgroundColor:
                        factor.status === 'normal'
                          ? 'var(--bg-surface-elevated)'
                          : factor.status === 'borderline'
                          ? 'var(--risk-medium-bg)'
                          : 'var(--risk-high-bg)',
                      color:
                        factor.status === 'normal'
                          ? 'var(--primary)'
                          : factor.status === 'borderline'
                          ? '#FFD166'
                          : '#FF7B72',
                      border: '1px solid',
                      borderColor:
                        factor.status === 'normal'
                          ? 'var(--border-subtle)'
                          : factor.status === 'borderline'
                          ? 'rgba(245, 158, 11, 0.3)'
                          : 'rgba(244, 63, 94, 0.3)',
                    }}
                  >
                    {factor.status === 'normal' ? '✓ ' : ''}{factor.status.toUpperCase()}
                  </span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="matte-divider" />

        {/* Recommended Next Step Section */}
        <div>
          <span className="tech-label" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
            RECOMMENDED NEXT STEP
          </span>
          <p style={{ fontSize: '0.86rem', color: 'white', lineHeight: '1.45', margin: 0 }}>
            {result.recommendation}
          </p>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="disclaimer-box">
        <AlertTriangle size={16} color="#FFD166" style={{ flexShrink: 0, marginTop: '2px' }} />
        <p>
          <strong>SAFETY NOTICE:</strong> Visual screening decision-support only. This tool does not diagnose skin cancer or replace a certified medical doctor.
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '2px' }}>
        <button className="btn-primary" onClick={onAskAI}>
          ASK AI ASSISTANT <ArrowRight size={18} />
        </button>

        <button className="btn-secondary" onClick={onViewGuidance}>
          <BookOpen size={16} color="var(--primary)" /> VIEW GUIDANCE
        </button>

        <button className="btn-ghost" onClick={onDone} style={{ justifyContent: 'center' }}>
          DONE & BACK TO HOME
        </button>
      </div>
    </div>
  );
};
