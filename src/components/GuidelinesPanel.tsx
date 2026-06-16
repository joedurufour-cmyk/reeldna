import React from 'react';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

export const GuidelinesPanel: React.FC = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pb-4">
      <div className="max-w-3xl mx-auto glass-card gradient-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-4 h-4 text-cyan-glow" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-glow">How it works</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div>
            <p className="text-white font-semibold mb-1.5 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              Works best with
            </p>
            <ul className="space-y-1 text-slate-400">
              <li className="flex items-start gap-1.5"><span className="mt-1 w-1 h-1 rounded-full bg-emerald-400/60 shrink-0" />Public Reels, TikToks, or Shorts</li>
              <li className="flex items-start gap-1.5"><span className="mt-1 w-1 h-1 rounded-full bg-emerald-400/60 shrink-0" />Clear speech (dialogue-heavy content)</li>
              <li className="flex items-start gap-1.5"><span className="mt-1 w-1 h-1 rounded-full bg-emerald-400/60 shrink-0" />15–90 second videos</li>
              <li className="flex items-start gap-1.5"><span className="mt-1 w-1 h-1 rounded-full bg-emerald-400/60 shrink-0" />Educational, storytelling, or business content</li>
            </ul>
          </div>
          <div>
            <p className="text-white font-semibold mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
              May fail with
            </p>
            <ul className="space-y-1 text-slate-400">
              <li className="flex items-start gap-1.5"><span className="mt-1 w-1 h-1 rounded-full bg-yellow-400/60 shrink-0" />Private accounts or restricted Reels</li>
              <li className="flex items-start gap-1.5"><span className="mt-1 w-1 h-1 rounded-full bg-yellow-400/60 shrink-0" />Removed or deleted content</li>
              <li className="flex items-start gap-1.5"><span className="mt-1 w-1 h-1 rounded-full bg-yellow-400/60 shrink-0" />Muted videos or no speech</li>
              <li className="flex items-start gap-1.5"><span className="mt-1 w-1 h-1 rounded-full bg-yellow-400/60 shrink-0" />Blocked / geo-restricted URLs</li>
            </ul>
          </div>
        </div>
        <p className="text-[10px] text-slate-600 mt-4 border-t border-white/5 pt-3">
          If extraction fails, you can always paste the transcript or caption manually. No login required.
        </p>
      </div>
    </div>
  );
};
