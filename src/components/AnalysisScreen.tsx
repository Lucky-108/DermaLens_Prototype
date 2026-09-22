import React, { useState, useEffect } from 'react';
import { Check, Cpu, Loader2, Sparkles, Zap } from 'lucide-react';
import { PatientContext, RiskLevel, ScreeningResult } from '../types';
import { AIService } from '../services/aiService';

interface AnalysisScreenProps {
  imageUri: string;
  patientContext: PatientContext;
  targetRisk?: RiskLevel;
  onAnalysisComplete: (result: ScreeningResult) => void;
}

export const AnalysisScreen: React.FC<AnalysisScreenProps> = ({
  imageUri,
  patientContext,
  targetRisk,
  onAnalysisComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const steps = [
    { label: 'IMAGE PREPROCESSING', detail: 'Normalizing illumination & contrast' },
    { label: 'SKIN REGION DETECTION', detail: 'Isolating dermal boundaries' },
    { label: 'LESION SEGMENTATION', detail: 'Mapping active area of interest' },
    { label: 'VISUAL FEATURE ANALYSIS', detail: 'Evaluating ABCDE visual pattern parameters' },
    { label: 'SCREENING ASSESSMENT', detail: 'Synthesizing decision support data' },
  ];

  useEffect(() => {
    // Step progression animation timer
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 400);

    // Perform actual AI analysis
    AIService.analyzeImage(imageUri, patientContext, targetRisk).then((result) => {
      setTimeout(() => {
        onAnalysisComplete(result);
      }, 2200);
    });

    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.min(100, Math.round(((currentStepIndex + 1) / steps.length) * 100));

  return (
    <div
      style={{
        padding: '24px 18px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        gap: '20px',
        backgroundColor: 'var(--bg-main)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 10px',
            borderRadius: 'var(--radius-xs)',
            backgroundColor: 'var(--bg-surface-elevated)',
            color: 'var(--primary)',
            fontSize: '0.70rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            marginBottom: '8px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <Zap size={13} /> ON-DEVICE NPU INFERENCE
        </div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em', margin: 0 }}>
          AI ANALYSIS
        </h2>
      </div>

      {/* Restrained Lesion Image Preview with Single Subtle Scan Line */}
      <div
        style={{
          position: 'relative',
          width: '140px',
          height: '140px',
          borderRadius: 'var(--radius-card)',
          overflow: 'hidden',
          border: '1px solid var(--border-light)',
          backgroundColor: '#000000',
        }}
      >
        <img
          src={imageUri}
          alt="Analyzing skin lesion"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Single Subtle Yellow Scanning Line */}
        <div className="animate-scan-line" />
      </div>

      {/* Clean Solid Progress Bar */}
      <div style={{ width: '100%', backgroundColor: 'var(--bg-surface-elevated)', height: '3px', borderRadius: '1.5px', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            backgroundColor: 'var(--primary)',
            transition: 'width 0.25s ease',
          }}
        />
      </div>

      {/* Restrained Step-by-Step Pipeline with Dividers */}
      <div style={{ width: '100%', padding: '6px 2px' }}>
        {steps.map((step, index) => {
          const isDone = currentStepIndex > index;
          const isCurrent = currentStepIndex === index;

          return (
            <React.Fragment key={index}>
              {index > 0 && <div className="matte-divider" />}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 2px',
                  opacity: isDone || isCurrent ? 1 : 0.35,
                  transition: 'opacity 0.2s ease',
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: '0.80rem',
                      fontWeight: 800,
                      color: isCurrent ? 'var(--primary)' : 'white',
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {step.label}
                  </span>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', margin: 0 }}>
                    {step.detail}
                  </p>
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.90rem',
                    fontWeight: 900,
                    color: isDone ? 'var(--primary)' : isCurrent ? 'var(--primary)' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                  }}
                >
                  {isDone ? '✓' : isCurrent ? '●' : '○'}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Technical Footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto' }}>
        <Cpu size={14} color="#FFD600" />
        <span className="tech-label" style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>
          ON-DEVICE NPU // LOW LATENCY INFERENCE
        </span>
      </div>
    </div>
  );
};
