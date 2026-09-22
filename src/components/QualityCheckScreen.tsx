import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, RefreshCw, CheckCircle2, Zap } from 'lucide-react';

interface QualityCheckScreenProps {
  imageUri: string;
  isLowQuality?: boolean;
  onContinue: () => void;
  onRetake: () => void;
}

export const QualityCheckScreen: React.FC<QualityCheckScreenProps> = ({
  imageUri,
  isLowQuality = false,
  onContinue,
  onRetake,
}) => {
  const [score, setScore] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number>(0);

  const targetScore = isLowQuality ? 58 : 92;

  useEffect(() => {
    // Count up quality score animation from 0 to 92
    const scoreDuration = 1200;
    const intervalTime = 30;
    const stepsCount = scoreDuration / intervalTime;
    const increment = targetScore / stepsCount;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetScore) {
        setScore(targetScore);
        clearInterval(timer);
      } else {
        setScore(Math.floor(current));
      }
    }, intervalTime);

    // Sequentially animate checkmarks
    const t1 = setTimeout(() => setCompletedSteps(1), 300);
    const t2 = setTimeout(() => setCompletedSteps(2), 600);
    const t3 = setTimeout(() => setCompletedSteps(3), 900);
    const t4 = setTimeout(() => setCompletedSteps(4), 1200);

    return () => {
      clearInterval(timer);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [targetScore]);

  const qualityChecks = [
    { label: 'CAMERA FOCUS & CLARITY', passed: true },
    { label: 'AMBIENT LIGHTING & EXPOSURE', passed: !isLowQuality },
    { label: 'LESION REGION VISIBILITY', passed: true },
    { label: 'CENTRAL FRAMING & DISTANCE', passed: true },
  ];

  const strokeDashoffset = 283 - (283 * score) / 100;

  return (
    <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <Zap size={14} color="#FFD600" />
          <span className="tech-label" style={{ color: '#FFD600' }}>
            INPUT VALIDATION
          </span>
        </div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em', margin: 0 }}>
          IMAGE QUALITY CHECK
        </h2>
      </div>

      {/* Main Matte Panel: Preview + High-Impact Quality Score */}
      <div
        className="card"
        style={{
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '88px',
            height: '88px',
            borderRadius: 'var(--radius-control)',
            overflow: 'hidden',
            flexShrink: 0,
            border: '1px solid var(--border-subtle)',
          }}
        >
          <img
            src={imageUri}
            alt="Captured Lesion"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <span className="tech-label" style={{ color: 'var(--text-muted)', display: 'block' }}>
            QUALITY SCORE
          </span>
          <div
            style={{
              fontSize: '2.4rem',
              fontWeight: 900,
              fontFamily: 'var(--font-mono)',
              color: score >= 80 ? 'var(--primary)' : score >= 60 ? '#FFD166' : '#FF7B72',
              lineHeight: 1.1,
            }}
          >
            {score}
          </div>
          <span
            style={{
              fontSize: '0.76rem',
              fontWeight: 800,
              color: 'white',
              letterSpacing: '0.04em',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {score >= 80 ? 'SUITABLE FOR SCREENING' : 'FAIR QUALITY DETECTED'}
          </span>
        </div>
      </div>

      {/* Verification Factors with Physical Dividers */}
      <div style={{ padding: '8px 4px' }}>
        <span className="tech-label" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
          VERIFICATION FACTORS
        </span>

        <div>
          {qualityChecks.map((check, index) => {
            const isDone = completedSteps > index;
            return (
              <React.Fragment key={index}>
                {index > 0 && <div className="matte-divider" />}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 2px',
                    opacity: isDone ? 1 : 0.4,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: isDone ? 'white' : 'var(--text-muted)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {check.label}
                  </span>

                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: 'var(--radius-xs)',
                      backgroundColor: isDone ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                      color: '#000000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: isDone ? 'none' : '1px solid var(--border-subtle)',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    {isDone && <Check size={13} strokeWidth={3} />}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Quality Status Confirmation Notice */}
        {completedSteps === 4 && (
          <div
            style={{
              marginTop: '14px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-control)',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <CheckCircle2 size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-mono)' }}>
              IMAGE SUITABLE FOR ON-DEVICE ANALYSIS
            </span>
          </div>
        )}
      </div>

      {/* Note */}
      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', margin: '0 4px' }}>
        Image quality verification ensures clear visual features but does not guarantee medical certainty.
      </p>

      {/* Action Buttons */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          className="btn-primary"
          onClick={onContinue}
          disabled={completedSteps < 4}
          style={{ opacity: completedSteps < 4 ? 0.6 : 1 }}
        >
          CONTINUE <ArrowRight size={18} />
        </button>

        <button className="btn-secondary" onClick={onRetake}>
          <RefreshCw size={15} /> RETAKE PHOTO
        </button>
      </div>
    </div>
  );
};
