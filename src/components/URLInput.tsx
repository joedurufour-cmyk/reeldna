import React, { useState } from 'react';
import { Link, ScanLine, FileText, ArrowRight, Trash2, Sparkles } from 'lucide-react';
import { analyzeUrl, PipelineStatus } from '../utils/api';
import { AnalysisResult } from '../types';
import { analyze } from '../core/analyzer';

interface URLInputProps {
  onPipelineStatus: (status: PipelineStatus, message?: string) => void;
  onResult: (result: AnalysisResult, originalText: string) => void;
  onNeedsManual: (message: string) => void;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
  onManualMode: () => void;
}

export const URLInput: React.FC<URLInputProps> = ({
  onPipelineStatus,
  onResult,
  onNeedsManual,
  isProcessing,
  setIsProcessing,
  onManualMode,
}) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError('Paste a Reel, TikTok, or Shorts URL to analyze.');
      return;
    }
    setError('');
    setIsProcessing(true);

    try {
      onPipelineStatus('VALIDATING_URL');
      await new Promise((r) => setTimeout(r, 400));

      onPipelineStatus('EXTRACTING_MEDIA');
      await new Promise((r) => setTimeout(r, 400));

      onPipelineStatus('TRANSCRIBING');
      const res = await analyzeUrl(url.trim());

      await new Promise((r) => setTimeout(r, 400));
      onPipelineStatus('ANALYZING');
      await new Promise((r) => setTimeout(r, 300));

      if (res.status === 'DONE' && res.transcript) {
        const analysis = analyze(res.transcript);
        onResult(analysis, res.transcript);
        onPipelineStatus('DONE');
      } else if (res.status === 'NEEDS_MANUAL_TEXT') {
        onNeedsManual(res.message || 'Could not extract this Reel. Paste the transcript or caption manually.');
        onPipelineStatus('NEEDS_MANUAL_TEXT', res.message);
      } else {
        throw new Error('Unexpected response from backend');
      }
    } catch (e: any) {
      onPipelineStatus('ERROR', e.message || 'Something went wrong. Try again or paste text manually.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setUrl('');
    setError('');
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-display mb-3">
            Decode the <span className="neon-text-violet">DNA</span> of viral content.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Paste a Reel, TikTok, or Shorts URL. We extract the transcript and reverse-engineer the hook, emotion, and repeatable framework behind it.
          </p>
        </div>

        <div className="glass-card gradient-border p-1">
          <div className="bg-dark/60 rounded-xl p-4 sm:p-6 relative overflow-hidden">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Paste Reel, TikTok, or Shorts URL
            </label>
            <div className="flex items-center gap-2 bg-dark/40 rounded-lg border border-white/5 px-3 py-2.5 mb-2">
              <Link className="w-4 h-4 text-slate-500 shrink-0" />
              <input
                type="text"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setError(''); }}
                placeholder="https://www.instagram.com/reel/..."
                className="bg-transparent text-slate-200 text-sm placeholder-slate-600 focus:outline-none w-full"
              />
            </div>
            {error && (
              <p className="text-red-400 text-xs mb-2 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-red-400 inline-block" />
                {error}
              </p>
            )}
            <p className="text-slate-600 text-[10px] mb-4">
              URL extraction works for public reels with clear speech. Geo-blocked or private content may fail.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/5">
              <button
                onClick={handleAnalyze}
                disabled={isProcessing}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-violet-glow to-violet-dim text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <ScanLine className="w-4 h-4 animate-pulse" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Analyze URL
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <button
                onClick={handleClear}
                disabled={!url}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 text-slate-400 text-sm hover:text-white hover:border-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
              <button
                onClick={onManualMode}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-cyan-glow/20 text-cyan-glow/80 text-sm hover:text-cyan-glow hover:border-cyan-glow/40 transition-colors ml-auto"
              >
                <FileText className="w-4 h-4" />
                Paste text instead
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
