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
  summary: string;
}
