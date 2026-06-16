import React, { useState } from 'react';
import { Header } from './components/Header';
import { URLInput } from './components/URLInput';
import { InputPanel } from './components/InputPanel';
import { ResultsDashboard } from './components/ResultsDashboard';
import { StatusStepper } from './components/StatusStepper';
import { GuidelinesPanel } from './components/GuidelinesPanel';
import { AnalysisResult } from './types';
import { analyze } from './core/analyzer';
import { PipelineStatus } from './utils/api';

const App: React.FC = () => {
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

        {!result && !manualMode && (
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

        {manualMode && !result && (
          <InputPanel
            onAnalyze={handleManualAnalyze}
            isAnalyzing={isProcessing}
            fallbackMessage={needsManualMessage}
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
          ReelDNA V2 — URL extraction with manual fallback. No login. No Instagram API.
        </footer>
      </div>
    </div>
  );
};

export default App;
