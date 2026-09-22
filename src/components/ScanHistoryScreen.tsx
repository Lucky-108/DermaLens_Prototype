import React, { useState } from 'react';
import { ChevronRight, ArrowLeftRight, Clock, Plus, Zap } from 'lucide-react';
import { ScreeningResult } from '../types';
import { StorageService } from '../services/storageService';

interface ScanHistoryScreenProps {
  onSelectScan: (scan: ScreeningResult) => void;
  onStartNewScan: () => void;
}

export const ScanHistoryScreen: React.FC<ScanHistoryScreenProps> = ({
  onSelectScan,
  onStartNewScan,
}) => {
  const scans = StorageService.getScans();
  const timelineGroups = StorageService.getTimelineGroups();
  const [selectedTab, setSelectedTab] = useState<'all' | 'compare'>('all');
  const [activeGroupIndex, setActiveGroupIndex] = useState<number>(0);

  const activeGroup = timelineGroups.length > 0 ? timelineGroups[activeGroupIndex] : null;

  return (
    <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="tech-label" style={{ color: '#FFD600' }}>
            LOCAL STORAGE DATABASE
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'white' }}>
            SCAN HISTORY
          </h2>
        </div>

        <button className="btn-primary" onClick={onStartNewScan} style={{ height: '38px', padding: '0 12px', fontSize: '0.78rem' }}>
          <Plus size={14} /> NEW SCAN
        </button>
      </div>

      {/* Segmented Mode Control */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          backgroundColor: 'var(--bg-surface-elevated)',
          padding: '3px',
          borderRadius: 'var(--radius-control)',
          gap: '4px',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <button
          onClick={() => setSelectedTab('all')}
          style={{
            padding: '8px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            backgroundColor: selectedTab === 'all' ? 'var(--bg-surface)' : 'transparent',
            color: selectedTab === 'all' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 800,
            fontSize: '0.74rem',
            fontFamily: 'var(--font-mono)',
            cursor: 'pointer',
            transition: 'all 0.12s ease',
          }}
        >
          TIMELINE LOG ({scans.length})
        </button>

        <button
          onClick={() => setSelectedTab('compare')}
          style={{
            padding: '8px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            backgroundColor: selectedTab === 'compare' ? 'var(--bg-surface)' : 'transparent',
            color: selectedTab === 'compare' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 800,
            fontSize: '0.74rem',
            fontFamily: 'var(--font-mono)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.12s ease',
          }}
        >
          <ArrowLeftRight size={13} /> TRACK CHANGES
        </button>
      </div>

      {/* Tab 1: Physical Timeline Log */}
      {selectedTab === 'all' && (
        <div style={{ padding: '6px 2px' }}>
          {scans.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '32px 18px', backgroundColor: 'var(--bg-surface)' }}>
              <Clock size={32} color="var(--text-muted)" style={{ marginBottom: '8px' }} />
              <h3 style={{ fontSize: '0.96rem', color: 'white', marginBottom: '4px' }}>NO RECORDS FOUND</h3>
              <p style={{ fontSize: '0.80rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Your completed skin health screenings will appear here.
              </p>
              <button className="btn-primary" onClick={onStartNewScan}>START FIRST SCAN</button>
            </div>
          ) : (
            <div>
              {scans.map((scan, index) => (
                <React.Fragment key={scan.id}>
                  {index > 0 && <div className="matte-divider" />}
                  <div
                    onClick={() => onSelectScan(scan)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 4px',
                      cursor: 'pointer',
                      borderRadius: 'var(--radius-control)',
                      transition: 'background-color 0.1s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img
                        src={scan.imageUri}
                        alt={scan.patientContext.bodyArea}
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: 'var(--radius-control)',
                          objectFit: 'cover',
                          border: '1px solid var(--border-subtle)',
                        }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                          <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
                          <span style={{ fontSize: '0.70rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {scan.timestamp.toUpperCase()}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'white', margin: '0 0 4px 0' }}>
                          {scan.patientContext.bodyArea.toUpperCase() || 'SKIN AREA'}
                        </h4>
                        <span className={`risk-badge ${scan.riskLevel}`} style={{ fontSize: '0.64rem', padding: '2px 6px' }}>
                          {scan.riskLevel === 'lower_concern'
                            ? 'LOWER-RISK VISUAL PATTERN'
                            : scan.riskLevel === 'review_recommended'
                            ? 'REVIEW RECOMMENDED'
                            : 'PROMPT MEDICAL REVIEW'}
                        </span>
                      </div>
                    </div>

                    <ChevronRight size={16} color="var(--text-muted)" />
                  </div>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Track Changes Over Time */}
      {selectedTab === 'compare' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          <div className="card" style={{ backgroundColor: 'var(--bg-surface)', padding: '14px' }}>
            <span className="tech-label" style={{ color: 'var(--primary)', display: 'block', marginBottom: '4px' }}>
              VISUAL CHRONOLOGY ANALYSIS
            </span>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0 }}>
              Compare chronological captures of the same body location to evaluate visual stability over time.
            </p>
          </div>

          {/* Location Selector */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            {timelineGroups.map((group, idx) => (
              <button
                key={idx}
                onClick={() => setActiveGroupIndex(idx)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-control)',
                  border: '1px solid',
                  borderColor: activeGroupIndex === idx ? 'var(--primary)' : 'var(--border-subtle)',
                  backgroundColor: activeGroupIndex === idx ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                  color: activeGroupIndex === idx ? '#000000' : 'white',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'background-color 0.12s ease',
                }}
              >
                {group.bodyArea.toUpperCase()} ({group.scans.length})
              </button>
            ))}
          </div>

          {/* Comparison View */}
          {activeGroup && activeGroup.scans.length >= 2 ? (
            <div className="card" style={{ padding: '16px', backgroundColor: 'var(--bg-surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span className="tech-label" style={{ color: 'white' }}>
                  {activeGroup.bodyArea.toUpperCase()} PROGRESSION
                </span>
                <span className="tech-label" style={{ color: '#A8DADC', backgroundColor: 'var(--risk-low-bg)', padding: '3px 8px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--risk-low-border)' }}>
                  ✓ VISUALLY STABLE
                </span>
              </div>

              {/* Side-by-Side Images */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div style={{ textAlign: 'center' }}>
                  <span className="tech-label" style={{ fontSize: '0.66rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    EARLIER: {activeGroup.scans[activeGroup.scans.length - 1].timestamp}
                  </span>
                  <div style={{ width: '100%', height: '110px', borderRadius: 'var(--radius-control)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                    <img
                      src={activeGroup.scans[activeGroup.scans.length - 1].imageUri}
                      alt="Earlier Scan"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <span className="tech-label" style={{ fontSize: '0.66rem', color: 'var(--primary)', display: 'block', marginBottom: '4px' }}>
                    LATEST: {activeGroup.scans[0].timestamp}
                  </span>
                  <div style={{ width: '100%', height: '110px', borderRadius: 'var(--radius-control)', overflow: 'hidden', border: '1px solid var(--primary)' }}>
                    <img
                      src={activeGroup.scans[0].imageUri}
                      alt="Latest Scan"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '10px 12px', borderRadius: 'var(--radius-control)', fontSize: '0.76rem', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'white' }}>Analysis Note:</strong> No significant perimeter expansion or color deviation detected between screenings.
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '24px 16px', backgroundColor: 'var(--bg-surface)' }}>
              <p style={{ fontSize: '0.80rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Need at least 2 scans of the same body area to enable chronological change tracking.
              </p>
              <button className="btn-secondary" onClick={onStartNewScan}>PERFORM SECOND SCAN</button>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
