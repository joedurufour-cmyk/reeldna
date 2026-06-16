import React, { useState } from 'react';
import { Header } from './components/Header';
import { URLInput } from './components/URLInput';
import { InputPanel } from './components/InputPanel';
import { PostPanel } from './components/PostPanel';
import { ResultsDashboard } from './components/ResultsDashboard';
import { StatusStepper } from './components/StatusStepper';
import { GuidelinesPanel } from './components/GuidelinesPanel';
import { AnalysisResult, VisualReport } from './types';
import { analyze } from './core/analyzer';
import { PipelineStatus, analyzeVisual } from './utils/api';

const App: React.FC = () => {
  const [mode, setMode] = useState<'video' | 'post'>('video');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [originalText, setOriginalText] = useState('');
  const [pipelineStatus, setPipelineStatus] = useState<PipelineStatus>('IDLE');
  const [pipelineMessage, setPipelineMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [needsManualMessage, setNeedsManualMessage] = useState('');

  const handlePipelineStatus = (status: PipelineStatus, message?: string) => {
    setPipelineStatus(status);
    setPipelineMessage(message || '');
  };

  const handleResult = (analysis: AnalysisResult, text: string) => {
    setResult(analysis);
    setOriginalText(text);
  };

  const handleNeedsManual = (message: string) => {
    setNeedsManualMessage(message);
    setManualMode(true);
  };

  const handleManualAnalyze = (text: string) => {
    setIsProcessing(true);
    setPipelineStatus('ANALYZING');
    setTimeout(() => {
      const analysis = analyze(text);
      setResult(analysis);
      setOriginalText(text);
      setPipelineStatus('DONE');
      setIsProcessing(false);
    }, 600);
  };

  const handlePostAnalyze = async (caption: string, images: File[]) => {
    setIsProcessing(true);
    setPipelineStatus('ANALYZING');
    try {
      const textAnalysis = analyze(caption);
      let visualReport: VisualReport | undefined;

      if (images.length > 0) {
        const res = await analyzeVisual(caption, images);
        visualReport = res.visual_report;
      }

      const combined: AnalysisResult = {
        ...textAnalysis,
        visualReport,
        summary: textAnalysis.summary + (visualReport
          ? ` Visual DNA: scroll-stop ${visualReport.visualDNA.scrollStop}/10, emotional impact ${visualReport.visualDNA.emotionalImpact}/10.`
          : ''),
      };

      setResult(combined);
      setOriginalText(caption);
      setPipelineStatus('DONE');
    } catch (e: any) {
      setPipelineStatus('ERROR');
      setPipelineMessage(e.message || 'Vision analysis failed. Text-only analysis shown below.');
      const textAnalysis = analyze(caption);
      setResult(textAnalysis);
      setOriginalText(caption);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setOriginalText('');
    setPipelineStatus('IDLE');
    setPipelineMessage('');
    setManualMode(false);
    setNeedsManualMessage('');
  };

  return (
    <div className="min-h-screen bg-dark text-slate-200 selection:bg-violet-glow/30 selection:text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-glow/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-glow/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <Header />

        {!result && (
          <div className="w-full px-4 sm:px-6 lg:px-8 pt-4">
            <div className="max-w-3xl mx-auto flex items-center justify-center gap-2">
              <button
                onClick={() => { setMode('video'); setManualMode(false); }}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                  mode === 'video'
                    ? 'bg-violet-glow/20 text-violet-glow border border-violet-glow/30'
                    : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
                }`}
              >
                Video / Reel
              </button>
              <button
                onClick={() => { setMode('post'); setManualMode(false); }}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                  mode === 'post'
                    ? 'bg-cyan-glow/20 text-cyan-glow border border-cyan-glow/30'
                    : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
                }`}
              >
                Post / Carousel
              </button>
            </div>
          </div>
        )}

        {!result && mode === 'video' && !manualMode && (
          <URLInput
            onPipelineStatus={handlePipelineStatus}
            onResult={handleResult}
            onNeedsManual={handleNeedsManual}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
            onManualMode={() => setManualMode(true)}
          />
        )}

        {pipelineStatus !== 'IDLE' && (
          <StatusStepper status={pipelineStatus} message={pipelineMessage} />
        )}

        {manualMode && !result && mode === 'video' && (
          <InputPanel
            onAnalyze={handleManualAnalyze}
            isAnalyzing={isProcessing}
            fallbackMessage={needsManualMessage}
          />
        )}

        {!result && mode === 'post' && (
          <PostPanel
            onAnalyze={handlePostAnalyze}
            isAnalyzing={isProcessing}
          />
        )}

        {result && (
          <ResultsDashboard result={result} originalText={originalText} />
        )}

        {result && (
          <div className="w-full px-4 sm:px-6 lg:px-8 pb-8 text-center">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-lg border border-white/10 text-slate-400 text-sm hover:text-white hover:border-white/20 transition-colors"
            >
              Analyze another
            </button>
          </div>
        )}

        <GuidelinesPanel />

        <footer className="py-8 text-center text-xs text-slate-600">
          ReelDNA V2 — Video URL + Post/Carousel visual analysis. No login.
        </footer>
      </div>
    </div>
  );
};

export default App;
