import { ScreeningResult, TimelineGroup } from '../types';

const STORAGE_KEY = 'dermalens_scan_history';

// High-quality sample SVG data URIs for pre-populated demo history scans
export const SAMPLE_LESION_IMAGES = {
  nevus_arm: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23E8D3C4"/><circle cx="150" cy="150" r="115" fill="%23DFBCA6"/><ellipse cx="145" cy="148" rx="38" ry="32" fill="%237C4F35"/><ellipse cx="140" cy="145" rx="28" ry="22" fill="%23563420"/><circle cx="155" cy="152" r="12" fill="%233D2213"/></svg>',
  nevus_arm_older: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23E8D3C4"/><circle cx="150" cy="150" r="115" fill="%23DFBCA6"/><ellipse cx="146" cy="147" rx="34" ry="28" fill="%237C4F35"/><ellipse cx="142" cy="145" rx="24" ry="20" fill="%23563420"/></svg>',
  atypical_torso: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23F3DFD1"/><circle cx="150" cy="150" r="110" fill="%23E4C8B5"/><path d="M120 120 Q 140 100 170 125 Q 190 150 160 175 Q 130 190 115 160 Z" fill="%23683B2B"/><path d="M130 130 Q 145 115 165 130 Q 175 150 155 165 Q 135 175 125 155 Z" fill="%23432319"/></svg>',
  prompt_face: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23FCE8D8"/><circle cx="150" cy="150" r="110" fill="%23EED0BC"/><path d="M110 115 Q 150 90 185 110 Q 200 145 170 180 Q 120 200 105 155 Z" fill="%234A281E"/><path d="M125 125 Q 145 105 170 120 Q 185 140 160 165 Q 130 175 120 150 Z" fill="%232D1610"/><circle cx="140" cy="135" r="12" fill="%239E2A2B"/></svg>'
};

const DEFAULT_SCANS: ScreeningResult[] = [
  {
    id: 'scan_demo_1',
    timestamp: '18 Sep 2026',
    imageUri: SAMPLE_LESION_IMAGES.nevus_arm,
    patientContext: {
      bodyArea: 'Forearm',
      duration: '1–6 months',
      symptoms: ['Itching'],
      changedRecently: 'No',
    },
    riskLevel: 'lower_concern',
    categoryTitle: 'Lower-Risk Visual Pattern',
    confidence: 87,
    explanation: 'The model did not identify visual patterns commonly associated with higher-risk lesions in this image.',
    imageQuality: 'good',
    factorsConsidered: [
      { name: 'Shape Symmetry', status: 'normal', detail: 'Symmetrical oval outline' },
      { name: 'Border Clarity', status: 'normal', detail: 'Clean demarcation' },
      { name: 'Color Uniformity', status: 'normal', detail: 'Even brown pigment' },
      { name: 'Surface Texture', status: 'normal', detail: 'Uniform skin markings' },
    ],
    recommendation: 'Continue monitoring the area. If it changes, persists, or concerns you, consult a qualified healthcare professional.',
  },
  {
    id: 'scan_demo_2',
    timestamp: '03 Aug 2026',
    imageUri: SAMPLE_LESION_IMAGES.nevus_arm_older,
    patientContext: {
      bodyArea: 'Forearm',
      duration: '1–4 weeks',
      symptoms: ['None'],
      changedRecently: 'No',
    },
    riskLevel: 'lower_concern',
    categoryTitle: 'Lower-Risk Visual Pattern',
    confidence: 89,
    explanation: 'Symmetrical benign lesion structure detected during baseline monitoring scan.',
    imageQuality: 'good',
    factorsConsidered: [
      { name: 'Shape Symmetry', status: 'normal', detail: 'Symmetrical baseline shape' },
      { name: 'Border Clarity', status: 'normal', detail: 'Clear border' },
      { name: 'Color Uniformity', status: 'normal', detail: 'Uniform brown' },
      { name: 'Surface Texture', status: 'normal', detail: 'Smooth' },
    ],
    recommendation: 'Baseline scan saved. Re-screen in 3-6 months to track visual stability.',
  },
  {
    id: 'scan_demo_3',
    timestamp: '12 Jul 2026',
    imageUri: SAMPLE_LESION_IMAGES.atypical_torso,
    patientContext: {
      bodyArea: 'Torso',
      duration: '1–6 months',
      symptoms: ['Redness'],
      changedRecently: 'Yes',
    },
    riskLevel: 'review_recommended',
    categoryTitle: 'Atypical Features — Review Recommended',
    confidence: 76,
    explanation: 'Slight visual asymmetry and non-uniform pigment distribution detected.',
    imageQuality: 'good',
    factorsConsidered: [
      { name: 'Shape Symmetry', status: 'borderline', detail: 'Minor contour irregularity' },
      { name: 'Border Clarity', status: 'normal', detail: 'Distinct margins' },
      { name: 'Color Uniformity', status: 'borderline', detail: 'Dual-tone coloration' },
      { name: 'Surface Texture', status: 'normal', detail: 'Flat surface' },
    ],
    recommendation: 'Schedule a non-urgent routine consultation with a dermatologist to evaluate this lesion.',
  },
];

export class StorageService {
  static getScans(): ScreeningResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.saveScans(DEFAULT_SCANS);
        return DEFAULT_SCANS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_SCANS;
    }
  }

  static saveScan(scan: ScreeningResult): void {
    const scans = this.getScans();
    const updated = [scan, ...scans];
    this.saveScans(updated);
  }

  static saveScans(scans: ScreeningResult[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scans));
    } catch (e) {
      console.error('Failed to save scan history to localStorage', e);
    }
  }

  static getTimelineGroups(): TimelineGroup[] {
    const scans = this.getScans();
    const groupsMap = new Map<string, ScreeningResult[]>();

    scans.forEach((scan) => {
      const location = scan.patientContext.bodyArea || 'Other';
      if (!groupsMap.has(location)) {
        groupsMap.set(location, []);
      }
      groupsMap.get(location)!.push(scan);
    });

    const result: TimelineGroup[] = [];
    groupsMap.forEach((locationScans, bodyArea) => {
      result.push({
        bodyArea,
        scans: locationScans,
      });
    });

    return result;
  }
}
