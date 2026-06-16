import React from 'react';
import { VisualReport } from '../types';
import { Eye, Camera, Palette, Type, Sparkles, ArrowUp, Heart, Star, TrendingUp } from 'lucide-react';

const VisualScoreRing: React.FC<{ score: number; label: string; color: string }> = ({ score, label, color }) => {
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (score / 10) * circumference;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
          <circle cx="22" cy="22" r="18" stroke="rgba(255,255,255,0.08)" strokeWidth="4" fill="none" />
          <circle
            cx="22" cy="22" r="18" stroke={color} strokeWidth="4" fill="none"
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
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

const VisualField: React.FC<{ label: string; value: string; icon: React.ReactNode; accent: string }> = ({ label, value, icon, accent }) => {
  return (
    <div className="space-y-1">
      <div className={`flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-${accent}`}>
        {icon}
        {label}
      </div>
      <p className="text-sm text-slate-200 leading-relaxed">{value}</p>
    </div>
  );
};

export const VisualReportCard: React.FC<{ report: VisualReport }> = ({ report }) => {
  const avgVisual = Math.round(
    ((report.visualDNA.scrollStop + report.visualDNA.clarity + report.visualDNA.emotionalImpact +
      report.visualDNA.professionalism + report.visualDNA.authenticity + report.visualDNA.shareability) / 6) * 10
  ) / 10;

  return (
    <div className="glass-card gradient-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-glow/10 border border-cyan-glow/20">
            <Eye className="w-5 h-5 text-cyan-glow" />
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-glow">Visual DNA</h3>
            <p className="text-xs text-slate-500">GPT-4o mini analysis · Overall: <span className="text-white font-bold">{avgVisual}/10</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <VisualScoreRing score={report.visualDNA.scrollStop} label="Scroll-Stop" color="#ec4899" />
        <VisualScoreRing score={report.visualDNA.clarity} label="Clarity" color="#06b6d4" />
        <VisualScoreRing score={report.visualDNA.emotionalImpact} label="Emotion" color="#f59e0b" />
        <VisualScoreRing score={report.visualDNA.professionalism} label="Pro" color="#a855f7" />
        <VisualScoreRing score={report.visualDNA.authenticity} label="Authentic" color="#10b981" />
        <VisualScoreRing score={report.visualDNA.shareability} label="Shareable" color="#6366f1" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <VisualField label="Visual Hook" value={report.visualHook} icon={<ArrowUp className="w-3 h-3" />} accent="hotpink-glow" />
        <VisualField label="Visual CTA" value={report.visualCTA} icon={<Sparkles className="w-3 h-3" />} accent="yellow-400" />
        <VisualField label="Format" value={report.format} icon={<Camera className="w-3 h-3" />} accent="cyan-glow" />
        <VisualField label="Composition" value={report.composition} icon={<Eye className="w-3 h-3" />} accent="violet-glow" />
        <VisualField label="Color Mood" value={report.colorMood} icon={<Palette className="w-3 h-3" />} accent="emerald-400" />
        <VisualField label="Text Overlay" value={report.textOverlay} icon={<Type className="w-3 h-3" />} accent="blue-400" />
        <VisualField label="Facial Expression" value={report.facialExpression} icon={<Heart className="w-3 h-3" />} accent="hotpink-glow" />
        <VisualField label="Editing Pace" value={report.editingPace} icon={<TrendingUp className="w-3 h-3" />} accent="cyan-glow" />
        <VisualField label="Brand Consistency" value={report.brandConsistency} icon={<Star className="w-3 h-3" />} accent="yellow-400" />
      </div>
    </div>
  );
};
