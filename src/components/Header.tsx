import React from 'react';
import { Dna } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-violet-glow/20 to-cyan-glow/20 border border-white/10">
            <Dna className="w-6 h-6 text-violet-glow" />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-glow/10 to-cyan-glow/10 animate-pulse-slow" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white font-display">
              Reel<span className="text-violet-glow">DNA</span>
            </h1>
            <p className="text-xs text-slate-400 -mt-0.5">Decode why content gets attention</p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full border border-violet-glow/30 bg-violet-glow/10 text-violet-glow text-xs font-semibold tracking-wide uppercase">
          Beta
        </div>
      </div>
    </header>
  );
};
