export type ScreenName = 
  | 'home' 
  | 'camera' 
  | 'quality' 
  | 'context' 
  | 'analysis' 
  | 'results' 
  | 'chat' 
  | 'history';

export type RiskLevel = 'lower_concern' | 'review_recommended' | 'prompt_review';

export interface PatientContext {
  bodyArea: string;
  duration: string;
  symptoms: string[];
  changedRecently: 'Yes' | 'No' | 'Not sure' | '';
}

export interface ScreeningFactor {
  name: string;
  status: 'normal' | 'borderline' | 'atypical';
  detail: string;
}

export interface ScreeningResult {
  id: string;
  timestamp: string;
  imageUri: string;
  patientContext: PatientContext;
  riskLevel: RiskLevel;
  categoryTitle: string;
  confidence: number;
  explanation: string;
  imageQuality: 'good' | 'fair' | 'poor';
  factorsConsidered: ScreeningFactor[];
  recommendation: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface TimelineGroup {
  bodyArea: string;
  scans: ScreeningResult[];
}
