import React, { useState, useEffect, useRef } from 'react';
import { ScanLine, Trash2, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { CaptionHelper } from './CaptionHelper';

interface InputPanelProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
  fallbackMessage?: string;
}

const EXAMPLE_TEXT = `Nobody tells you this about building a business. I wasted two years trying to look professional instead of solving one painful problem. Once I focused on one tiny workflow, everything changed. Save this if you're building something.`;

export const InputPanel: React.FC<InputPanelProps> = ({ onAnalyze, isAnalyzing, fallbackMessage }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (fallbackMessage && textareaRef.current) {
      textareaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      textareaRef.current.focus();
    }
  }, [fallbackMessage]);

  const handleAnalyze = () => {
    if (!text.trim()) {
      setError('Paste a transcript or caption to analyze.');
      return;
    }
    setError('');
    onAnalyze(text.trim());
  };

  const handleExample = () => {
    setText(EXAMPLE_TEXT);
    setError('');
  };

  const handleClear = () => {
    setText('');
    setError('');
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-display mb-3">
            Paste text <span className="neon-text-cyan">manually</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            If URL extraction failed, paste the transcript or caption directly. The analyzer works the same way.
          </p>
        </div>

        <div className="glass-card gradient-border p-1">
          <div className="bg-dark/60 rounded-xl p-4 sm:p-6 relative overflow-hidden">
            {isAnalyzing && (
              <div className="scan-line top-0 z-10" />
            )}

            {fallbackMessage && (
              <div className="mb-4 p-3 rounded-lg bg-yellow-400/10 border border-yellow-400/20 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-200/80 leading-relaxed">{fallbackMessage}</p>
              </div>
            )}

            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Paste transcript or caption here ↓
            </label>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => { setText(e.target.value); setError(''); }}
              placeholder="Select the text below the video on Instagram, copy it (Ctrl+C), and paste it here..."
              className="w-full h-48 sm:h-56 bg-transparent text-slate-200 placeholder-slate-600 text-sm leading-relaxed resize-none focus:outline-none scrollbar-thin"
            />
            {error && (
              <p className="text-red-400 text-xs mt-2 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-red-400 inline-block" />
                {error}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-white/5">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-glow to-cyan-dim text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <ScanLine className="w-4 h-4 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Analyze
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <button
                onClick={handleClear}
                disabled={!text}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 text-slate-400 text-sm hover:text-white hover:border-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
              <button
                onClick={handleExample}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-cyan-glow/20 text-cyan-glow/80 text-sm hover:text-cyan-glow hover:border-cyan-glow/40 transition-colors ml-auto"
              >
                <Sparkles className="w-4 h-4" />
                Example
              </button>
            </div>
          </div>
        </div>
      </div>
      {fallbackMessage && <CaptionHelper />}
    </section>
  );
};
