export interface VisualReport {
  visualHook: string;
  visualCTA: string;
  format: string;
  composition: string;
  colorMood: string;
  facialExpression: string;
  editingPace: string;
  textOverlay: string;
  brandConsistency: string;
  visualDNA: {
    scrollStop: number;
    clarity: number;
    emotionalImpact: number;
    professionalism: number;
    authenticity: number;
    shareability: number;
  };
}

export interface AnalysisResult {
  hook: string;
  hookScore: number;
  hookType: string;
  narrative: string[];
  cta: string;
  dominantEmotion: string;
  visualPattern: string;
  retentionProbability: number;
  whyItWorks: string[];
  attentionKillers: string[];
  viralDNA: {
    curiosity: number;
    authority: number;
    novelty: number;
    urgency: number;
    proof: number;
    clarity: number;
  };
  stealFramework: string;
  visualReport?: VisualReport;
  summary: string;
}
