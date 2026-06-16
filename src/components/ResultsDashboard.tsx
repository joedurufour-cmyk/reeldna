import React from 'react';
import { AnalysisResult } from '../types';
import { ViralDNACard } from './ViralDNACard';
import { FrameworkBox } from './FrameworkBox';
import {
  Anchor,
  Heart,
  Layers,
  Megaphone,
  Skull,
  TrendingUp,
  Zap,
  Copy,
  Download,
  Check,
  Eye,
  Timer,
  Lightbulb,
} from 'lucide-react';
import { exportTxt } from '../utils/exportTxt';

interface ResultsDashboardProps {
  result: AnalysisResult;
  originalText: string;
}

const SectionCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  accent: string;
  children: React.ReactNode;
}> = ({ title, icon, accent, children }) => {
  return (
    <div className="glass-card gradient-border p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <div className={`p-1.5 rounded-md bg-${accent}/10`}>{icon}</div>
        <h3 className={`text-sm font-semibold uppercase tracking-wider text-${accent}`}>{title}</h3>
      </div>
      <div className="text-slate-200 text-sm leading-relaxed">{children}</div>
    </div>
  );
};

const ScoreRing: React.FC<{ score: number; label: string; color: string }> = ({ score, label, color }) => {
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (score / 10) * circumference;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
          <circle cx="22" cy="22" r="18" stroke="rgba(255,255,255,0.08)" strokeWidth="4" fill="none" />
          <circle
            cx="22"
            cy="22"
            r="18"
            stroke={color}
            strokeWidth="4"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white">{score}</span>
        </div>
      </div>
      <span className="text-[10px] uppercase tracking-wider text-slate-400">{label}</span>
    </div>
  );
};

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, originalText }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const report = exportTxt(result, originalText);
    navigator.clipboard.writeText(report).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const report = exportTxt(result, originalText);
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reeldna-analysis-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const hookTypeLabel = result.hookType.replace(/_/g, ' ').toUpperCase();
  const avgDNA = Math.round(
    ((result.viralDNA.curiosity +
      result.viralDNA.authority +
      result.viralDNA.novelty +
      result.viralDNA.urgency +
      result.viralDNA.proof +
      result.viralDNA.clarity) /
      6) *
      10
  ) / 10;

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-8 animate-[fadeIn_0.5s_ease-out]">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card gradient-border p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Hook Score</span>
            </div>
            <div className="text-3xl font-bold text-white font-display">{result.hookScore}<span className="text-sm text-slate-500">/10</span></div>
          </div>
          <div className="glass-card gradient-border p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Anchor className="w-4 h-4 text-violet-glow" />
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Hook Type</span>
            </div>
            <div className="text-lg font-bold text-white font-display leading-tight">{hookTypeLabel}</div>
          </div>
          <div className="glass-card gradient-border p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-cyan-glow" />
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Viral DNA</span>
            </div>
            <div className="text-3xl font-bold text-white font-display">{avgDNA}<span className="text-sm text-slate-500">/10</span></div>
          </div>
          <div className="glass-card gradient-border p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Layers className="w-4 h-4 text-hotpink-glow" />
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Segments</span>
            </div>
            <div className="text-lg font-bold text-white font-display leading-tight">{result.narrative.length}</div>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SectionCard title="Hook Detected" icon={<Anchor className="w-4 h-4 text-violet-glow" />} accent="violet-glow">
            <p className="text-white font-medium">{result.hook}</p>
            <p className="text-slate-500 text-xs mt-1">First sentence or first 160 characters</p>
          </SectionCard>

          <SectionCard title="Dominant Emotion" icon={<Heart className="w-4 h-4 text-hotpink-glow" />} accent="hotpink-glow">
            <span className="px-2.5 py-1 rounded-md bg-hotpink-glow/10 border border-hotpink-glow/20 text-hotpink-glow text-xs capitalize font-semibold">
              {result.dominantEmotion}
            </span>
          </SectionCard>

          <SectionCard title="Narrative" icon={<Layers className="w-4 h-4 text-cyan-glow" />} accent="cyan-glow">
            <div className="flex flex-wrap items-center gap-2">
              {result.narrative.map((s, i) => (
                <React.Fragment key={s}>
                  <span className="px-2.5 py-1 rounded-md bg-cyan-glow/10 border border-cyan-glow/20 text-cyan-glow text-xs font-semibold uppercase">
                    {s}
                  </span>
                  {i < result.narrative.length - 1 && (
                    <span className="text-slate-600">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="CTA" icon={<Megaphone className="w-4 h-4 text-yellow-400" />} accent="yellow-400">
            <p className="text-white font-medium">{result.cta}</p>
          </SectionCard>

          <SectionCard title="Visual Pattern" icon={<Eye className="w-4 h-4 text-emerald-400" />} accent="emerald-400">
            <p className="text-white font-medium">{result.visualPattern}</p>
          </SectionCard>

          <SectionCard title="Retention Probability" icon={<Timer className="w-4 h-4 text-blue-400" />} accent="blue-400">
            <div className="flex items-center gap-3">
              <div className="h-2 flex-1 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-400 rounded-full transition-all duration-1000"
                  style={{ width: `${result.retentionProbability}%` }}
                />
              </div>
              <span className="text-white font-bold text-sm">{result.retentionProbability}%</span>
            </div>
          </SectionCard>

          <SectionCard title="Attention Killers" icon={<Skull className="w-4 h-4 text-red-400" />} accent="red-400">
            {result.attentionKillers[0] === 'none detected' ? (
              <p className="text-emerald-400 text-sm">No major attention killers detected. Clean execution.</p>
            ) : (
              <ul className="space-y-1">
                {result.attentionKillers.map((k) => (
                  <li key={k} className="flex items-center gap-2 text-red-300 text-xs">
                    <span className="w-1 h-1 rounded-full bg-red-400" />
                    {k}
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard title="Viral DNA Breakdown" icon={<TrendingUp className="w-4 h-4 text-violet-glow" />} accent="violet-glow">
            <div className="grid grid-cols-3 gap-3">
              <ScoreRing score={result.viralDNA.curiosity} label="Curiosity" color="#a855f7" />
              <ScoreRing score={result.viralDNA.authority} label="Authority" color="#06b6d4" />
              <ScoreRing score={result.viralDNA.novelty} label="Novelty" color="#ec4899" />
              <ScoreRing score={result.viralDNA.urgency} label="Urgency" color="#f59e0b" />
              <ScoreRing score={result.viralDNA.proof} label="Proof" color="#10b981" />
              <ScoreRing score={result.viralDNA.clarity} label="Clarity" color="#6366f1" />
            </div>
          </SectionCard>
        </div>

        {/* Why It Works */}
        <div className="glass-card gradient-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-yellow-400/10 border border-yellow-400/20">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
            </div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-yellow-400">Why It Works</h3>
          </div>
          <ul className="space-y-3">
            {result.whyItWorks.map((b, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-200 leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-yellow-400/60 shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <ViralDNACard result={result} />
        <FrameworkBox framework={result.stealFramework} />

        {/* Export actions */}
        <div className="flex flex-wrap gap-3 justify-center pt-4">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Report'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-violet-glow/20 to-cyan-glow/20 border border-violet-glow/30 text-white text-sm hover:opacity-90 transition-opacity"
          >
            <Download className="w-4 h-4" />
            Download .txt
          </button>
        </div>
      </div>
    </section>
  );
};
