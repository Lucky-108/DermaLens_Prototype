import React from 'react';
import { Camera, History, ShieldCheck, ChevronRight, Sparkles, ArrowRight, Activity, Zap } from 'lucide-react';
import { ScreeningResult } from '../types';

interface HomeScreenProps {
  onStartScan: () => void;
  onViewHistory: () => void;
  onSelectScan: (scan: ScreeningResult) => void;
  recentScans: ScreeningResult[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartScan,
  onViewHistory,
  onSelectScan,
  recentScans,
}) => {
  const latestScan = recentScans.length > 0 ? recentScans[0] : null;

  return (
    <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      
      {/* Matte Hero Panel */}
      <div
        className="card"
        style={{
          backgroundColor: 'var(--bg-surface)',
          padding: '22px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Zap size={14} color="#FFD600" />
          <span className="tech-label" style={{ color: '#FFD600' }}>
            NPU ACCELERATED VISUAL AI
          </span>
        </div>

        <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'white', lineHeight: 1.15, letterSpacing: '-0.03em', margin: 0 }}>
          DERMALENS<br />
          <span style={{ color: 'var(--primary)' }}>AI-POWERED</span> SKIN SCREENING
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: '1.45', margin: 0 }}>
          Fast on-device visual screening for skin concerns. Built for low latency and total image privacy.
        </p>

        {/* Primary Action Button */}
        <button
          onClick={onStartScan}
          className="btn-primary"
          style={{ marginTop: '6px' }}
        >
          START SKIN SCAN <ArrowRight size={18} />
        </button>
      </div>

      {/* Secondary Action */}
      <button className="btn-secondary" onClick={onViewHistory}>
        <History size={16} color="var(--primary)" /> VIEW SCAN HISTORY
      </button>

      {/* Recent Scan Panel */}
      {latestScan && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span className="tech-label" style={{ color: 'var(--text-muted)' }}>
              RECENT SCREENING
            </span>
            <button className="btn-ghost" onClick={onViewHistory} style={{ fontSize: '0.74rem', padding: '2px 4px' }}>
              SEE ALL <ChevronRight size={14} />
            </button>
          </div>

          <div
            className="card"
            onClick={() => onSelectScan(latestScan)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              padding: '12px 14px',
              backgroundColor: 'var(--bg-surface-elevated)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src={latestScan.imageUri}
                alt="Scan Thumbnail"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-control)',
                  objectFit: 'cover',
                  border: '1px solid var(--border-subtle)',
                }}
              />
              <div>
                <h4 style={{ fontSize: '0.90rem', color: 'white', marginBottom: '2px' }}>
                  {latestScan.patientContext.bodyArea.toUpperCase() || 'SKIN AREA'}
                </h4>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {latestScan.timestamp}
                </p>
              </div>
            </div>

            <span className={`risk-badge ${latestScan.riskLevel}`}>
              {latestScan.riskLevel === 'lower_concern'
                ? 'LOWER RISK'
                : latestScan.riskLevel === 'review_recommended'
                ? 'REVIEW'
                : 'PROMPT REVIEW'}
            </span>
          </div>
        </div>
      )}

      {/* Structured Pipeline Section with Dividers */}
      <div style={{ padding: '4px 2px' }}>
        <span className="tech-label" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '14px' }}>
          SCREENING PIPELINE
        </span>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', paddingBottom: '12px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '900',
                fontSize: '0.80rem',
                fontFamily: 'var(--font-mono)',
                flexShrink: 0,
              }}
            >
              01
            </div>
            <div>
              <h4 style={{ fontSize: '0.86rem', color: 'white', marginBottom: '2px' }}>CAPTURE</h4>
              <p style={{ fontSize: '0.80rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                Position lesion inside camera frame under clear lighting.
              </p>
            </div>
          </div>

          <div className="matte-divider" />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 0' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '900',
                fontSize: '0.80rem',
                fontFamily: 'var(--font-mono)',
                flexShrink: 0,
              }}
            >
              02
            </div>
            <div>
              <h4 style={{ fontSize: '0.86rem', color: 'white', marginBottom: '2px' }}>ANALYZE</h4>
              <p style={{ fontSize: '0.80rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                On-device computer vision extracts shape, border, and color features.
              </p>
            </div>
          </div>

          <div className="matte-divider" />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', paddingTop: '12px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '900',
                fontSize: '0.80rem',
                fontFamily: 'var(--font-mono)',
                flexShrink: 0,
              }}
            >
              03
            </div>
            <div>
              <h4 style={{ fontSize: '0.86rem', color: 'white', marginBottom: '2px' }}>UNDERSTAND</h4>
              <p style={{ fontSize: '0.80rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                Receive screening guidance and consult AI Assistant for next steps.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Safety Notice Footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 4px', marginTop: 'auto' }}>
        <ShieldCheck size={16} color="var(--text-muted)" />
        <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>
          DermaLens is a screening decision-support tool, not a medical diagnostic system.
        </p>
      </div>

    </div>
  );
};
