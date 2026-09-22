import React, { useState } from 'react';
import { Home as HomeIcon, Camera, History, Bot, Sparkles, Shield } from 'lucide-react';
import { ScreenName, PatientContext, ScreeningResult, RiskLevel } from './types';
import { StorageService } from './services/storageService';
import { HomeScreen } from './components/HomeScreen';
import { CameraScanScreen } from './components/CameraScanScreen';
import { QualityCheckScreen } from './components/QualityCheckScreen';
import { PatientContextScreen } from './components/PatientContextScreen';
import { AnalysisScreen } from './components/AnalysisScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { AIAssistantScreen } from './components/AIAssistantScreen';
import { ScanHistoryScreen } from './components/ScanHistoryScreen';

export function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('home');
  const [capturedImageUri, setCapturedImageUri] = useState<string>('');
  const [isLowQuality, setIsLowQuality] = useState<boolean>(false);
  const [patientContext, setPatientContext] = useState<PatientContext>({
    bodyArea: 'Arm',
    duration: '1–4 weeks',
    symptoms: ['Itching'],
    changedRecently: 'No',
  });
  const [activeResult, setActiveResult] = useState<ScreeningResult | null>(null);
  
  // Hackathon Demo Mode Override (auto, lower_concern, review_recommended, prompt_review)
  const [demoRiskLevel, setDemoRiskLevel] = useState<RiskLevel | 'auto'>('auto');

  const recentScans = StorageService.getScans();

  // Navigation handlers
  const handleStartScan = () => {
    setCurrentScreen('camera');
  };

  const handleCaptured = (imageUri: string, lowQuality: boolean = false) => {
    setCapturedImageUri(imageUri);
    setIsLowQuality(lowQuality);
    setCurrentScreen('quality');
  };

  const handleQualityConfirmed = () => {
    setCurrentScreen('context');
  };

  const handleContextSubmitted = (context: PatientContext) => {
    setPatientContext(context);
    setCurrentScreen('analysis');
  };

  const handleAnalysisCompleted = (result: ScreeningResult) => {
    StorageService.saveScan(result);
    setActiveResult(result);
    setCurrentScreen('results');
  };

  const handleSelectHistoryScan = (scan: ScreeningResult) => {
    setActiveResult(scan);
    setCurrentScreen('results');
  };

  return (
    <div className="app-container">
      
      {/* iQOO Hackathon Demo Top Bar */}
      <div className="demo-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={12} color="#FFD600" />
          <span style={{ fontWeight: 800, color: 'white', letterSpacing: '0.04em' }}>
            iQOO HACKATHON DEMO
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#A7A7A7' }}>Scenario:</span>
          <select
            className="demo-bar-select"
            value={demoRiskLevel}
            onChange={(e) => setDemoRiskLevel(e.target.value as any)}
          >
            <option value="auto">Auto (Context)</option>
            <option value="lower_concern">1. Lower Concern (Teal)</option>
            <option value="review_recommended">2. Review Rec (Amber)</option>
            <option value="prompt_review">3. Prompt Review (Coral)</option>
          </select>
        </div>
      </div>

      {/* App Header (Hidden during camera feed) */}
      {currentScreen !== 'camera' && (
        <header className="app-header">
          <div
            className="brand-title"
            onClick={() => setCurrentScreen('home')}
            style={{ cursor: 'pointer' }}
          >
            <div className="brand-icon">
              <Shield size={16} />
            </div>
            DERMALENS
            <span className="badge-ai">NPU</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.66rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-surface-elevated)',
                padding: '3px 8px',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#FFD600' }} />
              AI ENGINE READY
            </div>

            <button
              onClick={() => setCurrentScreen('chat')}
              className="btn-ghost"
              style={{ padding: '6px', color: currentScreen === 'chat' ? 'var(--primary)' : 'var(--text-secondary)' }}
              title="AI Assistant"
            >
              <Bot size={18} />
            </button>
          </div>
        </header>
      )}

      {/* Main Screen Content Router with Motion Container */}
      <main className="app-content" key={currentScreen}>
        {currentScreen === 'home' && (
          <HomeScreen
            onStartScan={handleStartScan}
            onViewHistory={() => setCurrentScreen('history')}
            onSelectScan={handleSelectHistoryScan}
            recentScans={recentScans}
          />
        )}

        {currentScreen === 'camera' && (
          <CameraScanScreen
            onCapture={handleCaptured}
            onBack={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'quality' && (
          <QualityCheckScreen
            imageUri={capturedImageUri}
            isLowQuality={isLowQuality}
            onContinue={handleQualityConfirmed}
            onRetake={() => setCurrentScreen('camera')}
          />
        )}

        {currentScreen === 'context' && (
          <PatientContextScreen onSubmit={handleContextSubmitted} />
        )}

        {currentScreen === 'analysis' && (
          <AnalysisScreen
            imageUri={capturedImageUri}
            patientContext={patientContext}
            targetRisk={demoRiskLevel === 'auto' ? undefined : demoRiskLevel}
            onAnalysisComplete={handleAnalysisCompleted}
          />
        )}

        {currentScreen === 'results' && activeResult && (
          <ResultsScreen
            result={activeResult}
            onAskAI={() => setCurrentScreen('chat')}
            onViewGuidance={() => setCurrentScreen('history')}
            onDone={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'chat' && (
          <AIAssistantScreen
            currentResult={activeResult}
            onBack={() => setCurrentScreen(activeResult ? 'results' : 'home')}
          />
        )}

        {currentScreen === 'history' && (
          <ScanHistoryScreen
            onSelectScan={handleSelectHistoryScan}
            onStartNewScan={handleStartScan}
          />
        )}
      </main>

      {/* Bottom Navigation Bar */}
      {currentScreen !== 'camera' && currentScreen !== 'analysis' && (
        <nav className="bottom-nav">
          <button
            className={`nav-item ${currentScreen === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('home')}
          >
            <HomeIcon size={20} className="nav-icon" />
            Home
          </button>

          <button
            className="scan-floating-btn"
            onClick={handleStartScan}
            title="Start Skin Scan"
          >
            <Camera size={24} color="#000000" />
          </button>

          <button
            className={`nav-item ${currentScreen === 'history' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('history')}
          >
            <History size={20} className="nav-icon" />
            History
          </button>

          <button
            className={`nav-item ${currentScreen === 'chat' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('chat')}
          >
            <Bot size={20} className="nav-icon" />
            Assistant
          </button>
        </nav>
      )}

    </div>
  );
}

export default App;
