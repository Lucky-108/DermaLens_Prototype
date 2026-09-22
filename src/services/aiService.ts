import { PatientContext, RiskLevel, ScreeningResult, ChatMessage } from '../types';

export class AIService {
  /**
   * Simulates deep neural network inference on skin lesion images.
   * Modular architecture allows replacing this with an actual TensorFlow Lite, ONNX, or REST API endpoint.
   */
  static async analyzeImage(
    imageUri: string,
    patientContext: PatientContext,
    targetRisk?: RiskLevel
  ): Promise<ScreeningResult> {
    // Artificial latency simulation (1.5s - 2.5s) to mimic real-time model inference
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Determine risk level based on demo override or context
    const selectedRisk: RiskLevel = targetRisk || this.inferRiskFromContext(patientContext);

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const id = `scan_${Date.now()}`;

    if (selectedRisk === 'lower_concern') {
      return {
        id,
        timestamp: formattedDate,
        imageUri,
        patientContext,
        riskLevel: 'lower_concern',
        categoryTitle: 'Lower-Risk Visual Pattern',
        confidence: 87,
        explanation:
          'The model did not identify visual patterns commonly associated with higher-risk lesions in this image.',
        imageQuality: 'good',
        factorsConsidered: [
          { name: 'Shape Symmetry', status: 'normal', detail: 'Symmetrical structure observed' },
          { name: 'Border Clarity', status: 'normal', detail: 'Well-defined regular margins' },
          { name: 'Color Uniformity', status: 'normal', detail: 'Consistent single-tone pigmentation' },
          { name: 'Surface Texture', status: 'normal', detail: 'Smooth visual texture without scaling' },
        ],
        recommendation:
          'Continue monitoring the area. If it changes, persists, or concerns you, consult a qualified healthcare professional.',
      };
    } else if (selectedRisk === 'review_recommended') {
      return {
        id,
        timestamp: formattedDate,
        imageUri,
        patientContext,
        riskLevel: 'review_recommended',
        categoryTitle: 'Atypical Features — Review Recommended',
        confidence: 78,
        explanation:
          'Moderate visual asymmetry and non-uniform color distribution detected. Non-urgent professional evaluation is suggested.',
        imageQuality: 'good',
        factorsConsidered: [
          { name: 'Shape Symmetry', status: 'borderline', detail: 'Slight visual asymmetry along minor axis' },
          { name: 'Border Clarity', status: 'normal', detail: 'Mostly regular border contour' },
          { name: 'Color Uniformity', status: 'borderline', detail: 'Dual-tone brown & tan variation' },
          { name: 'Surface Texture', status: 'normal', detail: 'Minor localized elevation' },
        ],
        recommendation:
          'Schedule a non-urgent routine consultation with a dermatologist or general practitioner to evaluate this lesion.',
      };
    } else {
      return {
        id,
        timestamp: formattedDate,
        imageUri,
        patientContext,
        riskLevel: 'prompt_review',
        categoryTitle: 'Higher-Risk Visual Features Detected',
        confidence: 84,
        explanation:
          'Distinct irregular borders, multiple color variations, and reported symptoms detected across the visual region.',
        imageQuality: 'good',
        factorsConsidered: [
          { name: 'Shape Symmetry', status: 'atypical', detail: 'Significant structural asymmetry' },
          { name: 'Border Clarity', status: 'atypical', detail: 'Irregular, notched outer boundary' },
          { name: 'Color Uniformity', status: 'atypical', detail: 'Multiple shades (dark brown, black, red)' },
          { name: 'Surface Texture', status: 'borderline', detail: 'Textural changes reported' },
        ],
        recommendation:
          'Prompt medical evaluation recommended. Please share this AI screening summary with a certified doctor.',
      };
    }
  }

  /**
   * Helper logic to select default risk based on symptoms if not explicitly overridden by Demo Mode.
   */
  private static inferRiskFromContext(context: PatientContext): RiskLevel {
    if (context.symptoms.includes('Bleeding') || (context.symptoms.includes('Pain') && context.changedRecently === 'Yes')) {
      return 'prompt_review';
    }
    if (context.changedRecently === 'Yes' || context.symptoms.length >= 2) {
      return 'review_recommended';
    }
    return 'lower_concern';
  }

  /**
   * Generates AI Assistant responses based on current scan result context and safety guardrails.
   */
  static async generateAssistantResponse(
    scanResult: ScreeningResult | null,
    userQuestion: string,
    _history: ChatMessage[]
  ): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const q = userQuestion.toLowerCase();

    // Guardrail against diagnostic certainty questions
    if (q.includes('do i have cancer') || q.includes('is it cancer') || q.includes('is this cancer') || q.includes('am i safe')) {
      return (
        "DermaLens cannot diagnose skin cancer or guarantee safety. This screening tool highlights visual patterns for decision support. " +
        (scanResult ? `Your scan indicated a **${scanResult.categoryTitle.toLowerCase()}** with ${scanResult.confidence}% model confidence. ` : '') +
        "Only a dermatologist or physician performing a dermoscopy or biopsy can provide a definitive medical diagnosis. If you have concerns, please schedule a clinical visit."
      );
    }

    if (q.includes('what does my result mean') || q.includes('explain')) {
      if (!scanResult) {
        return "I can explain screening categories! A 'Lower-Risk' result means no urgent suspicious visual patterns were detected. 'Review Recommended' suggests checking with a doctor for mild atypical features. 'Prompt Review' indicates features that warrant timely clinical evaluation.";
      }
      return (
        `Your screening resulted in **${scanResult.categoryTitle}** with ${scanResult.confidence}% confidence.\n\n` +
        `• **Explanation**: ${scanResult.explanation}\n` +
        `• **Factors Analyzed**: ${scanResult.factorsConsidered.map((f) => f.name).join(', ')}.\n\n` +
        "Note: High confidence means the algorithm is consistent in its visual pattern matching, not that it replaces a doctor's examination."
      );
    }

    if (q.includes('what should i monitor') || q.includes('abcde') || q.includes('watch')) {
      return (
        "When monitoring skin lesions at home, doctors recommend the **ABCDE guide**:\n\n" +
        "1. **A - Asymmetry**: One half does not match the other half.\n" +
        "2. **B - Border**: Irregular, scalloped, or poorly defined edges.\n" +
        "3. **C - Color**: Varied shades of tan, brown, black, or red.\n" +
        "4. **D - Diameter**: Larger than 6mm (size of a pencil eraser).\n" +
        "5. **E - Evolving**: Changing in size, shape, color, or causing new symptoms like itching or bleeding."
      );
    }

    if (q.includes('when should i see a doctor') || q.includes('dermatologist')) {
      if (scanResult?.riskLevel === 'prompt_review') {
        return "Because your visual screening detected higher-risk features, we recommend contacting a doctor or dermatologist promptly for an in-person dermoscopy.";
      }
      return (
        "You should consult a physician or dermatologist if:\n" +
        "• A spot changes rapidly in size, color, or shape\n" +
        "• It bleeds, oozes, itches, or becomes painful\n" +
        "• It looks significantly different from all your other spots (the 'ugly duckling' sign)\n" +
        "• You feel uneasy or uncertain about a new spot."
      );
    }

    // Default friendly assistant response
    return (
      `I'm here to help explain your DermaLens screening results. ` +
      (scanResult ? `Your latest scan on your ${scanResult.patientContext.bodyArea || 'skin'} showed a ${scanResult.categoryTitle.toLowerCase()}. ` : '') +
      `Feel free to ask how to track changes, what symptoms to note, or how to prepare questions for your doctor!`
    );
  }
}
