import React from 'react';
import { AnalysisResult } from '../types';
import { BarChart3, Dna } from 'lucide-react';

export const ViralDNACard: React.FC<{ result: AnalysisResult }> = ({ result }) => {
  const { curiosity, authority, novelty, urgency, proof, clarity } = result.viralDNA;
  const dimensions = [
    { label: 'Curiosity', value: curiosity, color: 'bg-violet-glow', textColor: 'text-violet-glow' },
    { label: 'Authority', value: authority, color: 'bg-cyan-glow', textColor: 'text-cyan-glow' },
    { label: 'Novelty', value: novelty, color: 'bg-hotpink-glow', textColor: 'text-hotpink-glow' },
    { label: 'Urgency', value: urgency, color: 'bg-yellow-400', textColor: 'text-yellow-400' },
    { label: 'Proof', value: proof, color: 'bg-emerald-400', textColor: 'text-emerald-400' },
    { label: 'Clarity', value: clarity, color: 'bg-indigo-400', textColor: 'text-indigo-400' },
  ];

  const avg = Math.round(
    ((curiosity + authority + novelty + urgency + proof + clarity) / 6) * 10
  ) / 10;

  return (
    <div className="glass-card gradient-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-violet-glow/10 border border-violet-glow/20">
          <Dna className="w-5 h-5 text-violet-glow" />
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-violet-glow">Viral DNA</h3>
          <p className="text-xs text-slate-500">Overall score: <span className="text-white font-bold">{avg}/10</span></p>
        </div>
        <div className="ml-auto">
          <BarChart3 className="w-5 h-5 text-slate-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {dimensions.map((d) => (
          <div key={d.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className={`font-medium ${d.textColor}`}>{d.label}</span>
              <span className="text-slate-400">{d.value}/10</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full ${d.color} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${d.value * 10}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
