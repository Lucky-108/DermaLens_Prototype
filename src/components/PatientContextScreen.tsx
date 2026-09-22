import React, { useState } from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import { PatientContext } from '../types';

interface PatientContextScreenProps {
  onSubmit: (context: PatientContext) => void;
}

export const PatientContextScreen: React.FC<PatientContextScreenProps> = ({ onSubmit }) => {
  const [bodyArea, setBodyArea] = useState<string>('Arm');
  const [duration, setDuration] = useState<string>('1–4 weeks');
  const [symptoms, setSymptoms] = useState<string[]>(['Itching']);
  const [changedRecently, setChangedRecently] = useState<'Yes' | 'No' | 'Not sure'>('No');

  const bodyAreas = ['FACE', 'NECK', 'ARM', 'HAND', 'LEG', 'TORSO', 'OTHER'];
  const durations = ['< 1 WEEK', '1–4 WEEKS', '1–6 MONTHS', '6+ MONTHS'];
  const symptomOptions = ['ITCHING', 'REDNESS', 'PAIN', 'BLEEDING', 'SCALING', 'NONE'];

  const toggleSymptom = (sym: string) => {
    if (sym === 'NONE') {
      setSymptoms(['NONE']);
      return;
    }
    const filtered = symptoms.filter((s) => s !== 'NONE');
    if (filtered.includes(sym)) {
      const next = filtered.filter((s) => s !== sym);
      setSymptoms(next.length === 0 ? ['NONE'] : next);
    } else {
      setSymptoms([...filtered, sym]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      bodyArea,
      duration,
      symptoms,
      changedRecently,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <Zap size={14} color="#FFD600" />
          <span className="tech-label" style={{ color: '#FFD600' }}>
            PATIENT CONTEXT
          </span>
        </div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em', margin: 0 }}>
          LESION DETAILS
        </h2>
      </div>

      {/* Field 1: Affected Body Area */}
      <div style={{ padding: '6px 2px' }}>
        <span className="tech-label" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
          BODY LOCATION
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {bodyAreas.map((area) => {
            const isSelected = bodyArea.toUpperCase() === area;
            return (
              <button
                type="button"
                key={area}
                onClick={() => setBodyArea(area)}
                style={{
                  padding: '7px 12px',
                  borderRadius: 'var(--radius-control)',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--primary)' : 'var(--border-subtle)',
                  backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                  color: isSelected ? '#000000' : 'white',
                  fontWeight: isSelected ? 900 : 700,
                  fontSize: '0.76rem',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  transition: 'background-color 0.12s ease',
                }}
              >
                {area}
              </button>
            );
          })}
        </div>
      </div>

      <div className="matte-divider" />

      {/* Field 2: Duration */}
      <div style={{ padding: '6px 2px' }}>
        <span className="tech-label" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
          DURATION VISIBLE
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          {durations.map((dur) => {
            const isSelected = duration.toUpperCase() === dur || (dur === '< 1 WEEK' && duration === 'Less than a week') || (dur === '1–4 WEEKS' && duration === '1–4 weeks') || (dur === '1–6 MONTHS' && duration === '1–6 months') || (dur === '6+ MONTHS' && duration === 'More than 6 months');
            return (
              <button
                type="button"
                key={dur}
                onClick={() => setDuration(dur)}
                style={{
                  padding: '9px 10px',
                  borderRadius: 'var(--radius-control)',
                  backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--primary)' : 'var(--border-subtle)',
                  color: isSelected ? '#000000' : 'white',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'background-color 0.12s ease',
                }}
              >
                {dur}
              </button>
            );
          })}
        </div>
      </div>

      <div className="matte-divider" />

      {/* Field 3: Symptoms */}
      <div style={{ padding: '6px 2px' }}>
        <span className="tech-label" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
          ASSOCIATED SYMPTOMS
        </span>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Select all that apply</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {symptomOptions.map((sym) => {
            const selected = symptoms.map(s => s.toUpperCase()).includes(sym);
            return (
              <button
                type="button"
                key={sym}
                onClick={() => toggleSymptom(sym)}
                style={{
                  padding: '7px 12px',
                  borderRadius: 'var(--radius-control)',
                  border: '1px solid',
                  borderColor: selected ? 'var(--primary)' : 'var(--border-subtle)',
                  backgroundColor: selected ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                  color: selected ? '#000000' : 'white',
                  fontWeight: selected ? 900 : 700,
                  fontSize: '0.76rem',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  transition: 'background-color 0.12s ease',
                }}
              >
                {selected ? '✓ ' : ''}{sym}
              </button>
            );
          })}
        </div>
      </div>

      <div className="matte-divider" />

      {/* Field 4: Changed Recently? */}
      <div style={{ padding: '6px 2px' }}>
        <span className="tech-label" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
          RECENT CHANGES IN SIZE, COLOR, OR SHAPE
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
          {(['Yes', 'No', 'Not sure'] as const).map((opt) => {
            const isSelected = changedRecently === opt;
            return (
              <button
                type="button"
                key={opt}
                onClick={() => setChangedRecently(opt)}
                style={{
                  padding: '9px',
                  borderRadius: 'var(--radius-control)',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--primary)' : 'var(--border-subtle)',
                  backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                  color: isSelected ? '#000000' : 'white',
                  fontWeight: isSelected ? 900 : 700,
                  fontSize: '0.76rem',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  transition: 'background-color 0.12s ease',
                }}
              >
                {opt.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      <button type="submit" className="btn-primary" style={{ marginTop: 'auto' }}>
        ANALYZE LESION <ArrowRight size={18} />
      </button>
    </form>
  );
};
