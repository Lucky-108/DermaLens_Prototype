# DermaLens — On-Device AI for Early Skin Risk Screening
> **iQOO Hackathon Project Submission — Healthcare & Mobile AI Track**

[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20Web-FFD600?style=flat-square&logo=android&logoColor=black)](https://github.com)
[![Framework](https://img.shields.io/badge/Framework-React%2019%20%2B%20Vite%208-black?style=flat-square&logo=react)](https://react.dev)
[![Native](https://img.shields.io/badge/Native-Capacitor%208-111111?style=flat-square&logo=capacitor)](https://capacitorjs.com)
[![Theme](https://img.shields.io/badge/Design-iQOO%20Matte%20Dark-FFD600?style=flat-square)](https://iqoo.com)

**DermaLens** is a smartphone-based on-device AI screening and decision-support application. It helps users identify visual risk indicators on skin lesions and provides risk-tiered triage guidance. Engineered with an architecture designed for local execution on modern mobile NPUs, DermaLens delivers fast, private, and offline-capable screening without transmitting sensitive personal imagery to external cloud servers.

---

> [!IMPORTANT]
> **Clinical Safety & Non-Diagnostic Scope**: DermaLens is strictly an initial visual screening and decision-support tool, **NOT a diagnostic medical device**. It does not diagnose cancer, state medical certainty, or replace a certified dermatologist. All outputs use calibrated triage language (*"AI screening result"*, *"model confidence"*, *"higher-risk visual features detected"*, *"professional evaluation recommended"*).

---

## ⚡ Key Highlights

- **NPU-First Architecture**: Designed for INT8 quantized neural network inference via Qualcomm QNN / MediaTek NeuroPilot / NNAPI runtimes for sub-100ms execution.
- **100% Privacy by Default**: Image capture, quality verification, and feature analysis run entirely on-device. No personal imagery leaves the phone.
- **Guided Camera HUD**: Real-time viewfinder with laser sweep line, precision framing reticle, and shutter flash feedback.
- **Automated Image Quality Gate**: Pre-screening quality meter (sharpness, lighting, exposure, framing) to prevent garbage-in-garbage-out results.
- **ABCDE Visual Analysis**: Evaluates clinical heuristics (Asymmetry, Border, Color, Diameter, Evolution) alongside patient context.
- **Risk-Tiered Triage**: Calibrated 3-tier classification (*Lower Risk*, *Review Recommended*, *Prompt Medical Review*).
- **Contextual AI Assistant**: Built-in non-diagnostic Q&A assistant with safety guardrails against diagnostic claims.
- **Longitudinal Tracking**: Local history log with side-by-side chronological comparison to monitor lesion changes over time.
- **iQOO Matte Design Language**: Tactile physical surfaces (`#050505` base, `#111111` matte panels, `#FFD600` electric yellow material accents, restrained geometry, thin dividers).

---

## 📱 User Flow (8 Core Screens)

```text
HOME
  ↓
CAMERA SCAN HUD
  ↓
IMAGE QUALITY CHECK
  ↓
PATIENT CONTEXT
  ↓
AI NPU ANALYSIS
  ↓
SCREENING RESULT
  ↓
AI ASSISTANT
  ↓
SCAN HISTORY & COMPARISON
```

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite 8 | High-performance, type-safe reactive UI |
| **Mobile Runtime** | Capacitor 8 | Native Android bridge and hardware camera access |
| **Styling** | Vanilla CSS3 (Custom Tokens) | Matte physical design system, no bloated UI frameworks |
| **Icons** | Lucide React | Clean, lightweight vector iconography |
| **Native Android** | Java 17, Gradle 8.13, Android SDK 35 | Custom `MainActivity.java` with auto-permission WebChromeClient |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/)
- (Optional for Android APK) [Android Studio](https://developer.android.com/studio) with JDK 17+ and Android SDK

### 1. Web Development (HMR)
```bash
# Clone the repository
git clone https://github.com/<your-username>/<your-repo-name>.git
cd dermalens-app

# Install dependencies
npm install

# Start local dev server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Building for Web
```bash
npm run build
```

### 3. Syncing & Building Android APK
```bash
# Sync web build to Android assets
npx cap sync android

# Build Debug APK via Gradle (from android/ directory)
cd android
./gradlew assembleDebug
```
The compiled APK will be at `android/app/build/outputs/apk/debug/app-debug.apk`.

---

## 📂 Project Structure

```
dermalens-app/
├── src/
│   ├── components/               # 8 Core Screening Flow Screens
│   │   ├── HomeScreen.tsx        # Dashboard, telemetry & quick start
│   │   ├── CameraScanScreen.tsx  # Camera HUD with reticle & flash
│   │   ├── QualityCheckScreen.tsx# Image quality meter & audit
│   │   ├── PatientContextScreen.tsx # Body location, duration & symptoms
│   │   ├── AnalysisScreen.tsx    # Multi-stage NPU pipeline showcase
│   │   ├── ResultsScreen.tsx     # Confidence reveal & risk badges
│   │   ├── AIAssistantScreen.tsx # Non-diagnostic conversational Q&A
│   │   └── ScanHistoryScreen.tsx # Timeline log & side-by-side comparison
│   ├── services/
│   │   ├── aiService.ts          # AI inference abstraction & safety guardrails
│   │   └── storageService.ts     # LocalStorage persistence for scan history
│   ├── types/
│   │   └── index.ts              # TypeScript data models
│   ├── App.tsx                   # App shell router & hackathon demo controls
│   └── index.css                 # iQOO matte design tokens & keyframes
├── android/                      # Native Android Studio project
├── capacitor.config.ts           # Capacitor configuration
└── package.json                  # Dependencies and build scripts
```

---

## ⚖️ Responsible AI Principles

1. **Non-Diagnostic**: The app provides visual decision support, not diagnostic certainty.
2. **Clinical Triage Focus**: Helps users answer *"Should I have a doctor look at this?"* rather than self-diagnosing conditions.
3. **Safety Guardrails**: Explicit refusals when prompted for medical certainty (e.g. *"Do I have cancer?"*).
4. **Known Limitations**: Discloses domain gaps between clinical dermoscopy datasets and everyday smartphone camera photography under ambient lighting.

---

## 📄 License
Prototype built for the iQOO Hackathon. All rights reserved.
