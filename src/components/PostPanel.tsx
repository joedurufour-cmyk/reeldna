import React, { useState } from 'react';
import { ScanLine, Sparkles, ArrowRight, Trash2, Type, ImagePlus, AlertCircle } from 'lucide-react';
import { ImageUploader } from './ImageUploader';

interface PostPanelProps {
  onAnalyze: (caption: string, images: File[]) => void;
  isAnalyzing: boolean;
}

export const PostPanel: React.FC<PostPanelProps> = ({ onAnalyze, isAnalyzing }) => {
  const [caption, setCaption] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState('');

  const handleAnalyze = () => {
    if (!caption.trim()) {
      setError('Paste a caption or transcript to analyze.');
      return;
    }
    setError('');
    onAnalyze(caption.trim(), images);
  };

  const handleClear = () => {
    setCaption('');
    setImages([]);
    setError('');
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-display mb-3">
            Analyze a <span className="neon-text-cyan">Post</span> or <span className="neon-text-cyan">Carousel</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Paste the caption and upload up to 5 screenshots (first frame, mid, CTA, end). GPT-4o mini analyzes the visual DNA.
          </p>
        </div>

        <div className="glass-card gradient-border p-1">
          <div className="bg-dark/60 rounded-xl p-4 sm:p-6 relative overflow-hidden">
            {isAnalyzing && (
              <div className="scan-line top-0 z-10" />
            )}

            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Type className="w-3.5 h-3.5" />
              Caption / Transcript
            </label>
            <textarea
              value={caption}
              onChange={(e) => { setCaption(e.target.value); setError(''); }}
              placeholder="Paste the caption or transcript from the post..."
              className="w-full h-40 sm:h-48 bg-transparent text-slate-200 placeholder-slate-600 text-sm leading-relaxed resize-none focus:outline-none scrollbar-thin mb-4"
            />

            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <ImagePlus className="w-3.5 h-3.5" />
              Screenshots (optional, up to 5)
            </label>
            <ImageUploader images={images} onImagesChange={setImages} />

            {error && (
              <p className="text-red-400 text-xs mt-3 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
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
                    Analyzing with vision...
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
                disabled={!caption && images.length === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 text-slate-400 text-sm hover:text-white hover:border-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
