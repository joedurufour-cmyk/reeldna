import React from 'react';
import { PipelineStatus } from '../utils/api';
import { Check, Link2, Film, Mic, Brain, AlertCircle } from 'lucide-react';

interface StatusStepperProps {
  status: PipelineStatus;
  message?: string;
}

const steps: { key: PipelineStatus; label: string; icon: React.ReactNode }[] = [
  { key: 'VALIDATING_URL', label: 'Validating URL', icon: <Link2 className="w-4 h-4" /> },
  { key: 'EXTRACTING_MEDIA', label: 'Extracting media', icon: <Film className="w-4 h-4" /> },
  { key: 'TRANSCRIBING', label: 'Transcribing', icon: <Mic className="w-4 h-4" /> },
  { key: 'ANALYZING', label: 'Analyzing', icon: <Brain className="w-4 h-4" /> },
  { key: 'DONE', label: 'Done', icon: <Check className="w-4 h-4" /> },
];

export const StatusStepper: React.FC<StatusStepperProps> = ({ status, message }) => {
  if (status === 'IDLE' || status === 'NEEDS_MANUAL_TEXT' || status === 'ERROR') {
    if (status === 'NEEDS_MANUAL_TEXT' && message) {
      return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-3xl mx-auto glass-card gradient-border p-4 flex items-center gap-3 text-yellow-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div className="text-sm">
              <p className="font-semibold">Extraction failed</p>
              <p className="text-slate-400 text-xs mt-0.5">{message}</p>
            </div>
          </div>
        </div>
      );
    }
    if (status === 'ERROR' && message) {
      return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-3xl mx-auto glass-card gradient-border p-4 flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div className="text-sm">
              <p className="font-semibold">Error</p>
              <p className="text-slate-400 text-xs mt-0.5">{message}</p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  const activeIndex = steps.findIndex(s => s.key === status);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          {steps.map((step, i) => {
            const isActive = i === activeIndex;
            const isDone = i < activeIndex;
            const isLast = i === steps.length - 1;

            return (
              <React.Fragment key={step.key}>
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
                      isDone
                        ? 'bg-emerald-400/20 border-emerald-400 text-emerald-400'
                        : isActive
                        ? 'bg-violet-glow/20 border-violet-glow text-violet-glow animate-pulse'
                        : 'bg-white/5 border-white/10 text-slate-600'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4" /> : step.icon}
                  </div>
                  <span
                    className={`text-[10px] uppercase tracking-wider hidden sm:block ${
                      isActive ? 'text-violet-glow font-semibold' : isDone ? 'text-emerald-400' : 'text-slate-600'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {!isLast && (
                  <div className="flex-1 h-px bg-white/10 mx-2">
                    <div
                      className="h-full bg-violet-glow/50 transition-all duration-500"
                      style={{ width: isDone ? '100%' : isActive ? '60%' : '0%' }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        {message && (
          <p className="text-center text-xs text-slate-500 mt-3">{message}</p>
        )}
      </div>
    </div>
  );
};
