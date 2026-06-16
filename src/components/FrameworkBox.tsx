import React, { useState } from 'react';
import { Copy, Check, FileText } from 'lucide-react';

interface FrameworkBoxProps {
  framework: string;
}

export const FrameworkBox: React.FC<FrameworkBoxProps> = ({ framework }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(framework).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="glass-card gradient-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-glow/10 border border-cyan-glow/20">
            <FileText className="w-5 h-5 text-cyan-glow" />
          </div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-glow">
            Steal The Framework
          </h3>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy Template'}
        </button>
      </div>
      <div className="bg-dark/50 rounded-lg p-4 border border-white/5 whitespace-pre-wrap text-sm leading-relaxed text-slate-200 font-mono">
        {framework}
      </div>
    </div>
  );
};
