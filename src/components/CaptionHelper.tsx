import React from 'react';
import { Instagram, Music, Youtube, Copy, CheckCircle, ChevronRight, Type } from 'lucide-react';

const platforms = [
  {
    name: 'Instagram',
    icon: <Instagram className="w-5 h-5 text-pink-400" />,
    steps: [
      'Open the reel in the Instagram app or website.',
      'Look below the video for the caption text.',
      'If it says "... more" — tap it to expand the full caption.',
      'Select all the text, copy it, and paste it here.',
    ],
    tip: 'If the caption is very short, you can also tap the 3 dots (⋯) → Share → Copy Link, but that only gives the URL. For analysis, you need the actual caption text.',
  },
  {
    name: 'TikTok',
    icon: <Music className="w-5 h-5 text-white" />,
    steps: [
      'Open the video in the TikTok app.',
      'Tap the caption text below the video.',
      'If it expands, select all and copy.',
      'Paste the text here.',
    ],
    tip: 'On desktop, the caption is visible on the right side of the video. You can select and copy it directly.',
  },
  {
    name: 'YouTube Shorts',
    icon: <Youtube className="w-5 h-5 text-red-500" />,
    steps: [
      'Open the Short on YouTube (app or desktop).',
      'Tap "Show transcript" or look at the description below.',
      'Copy the description or transcript text.',
      'Paste it here.',
    ],
    tip: 'YouTube often has auto-generated transcripts — those are perfect for analysis.',
  },
];

export const CaptionHelper: React.FC = () => {
  const [copiedTip, setCopiedTip] = React.useState<string | null>(null);

  const copyTip = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedTip(text);
      setTimeout(() => setCopiedTip(null), 2000);
    });
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pb-4">
      <div className="max-w-3xl mx-auto glass-card gradient-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <Type className="w-4 h-4 text-cyan-glow" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-glow">
            How to copy the caption / transcript
          </h3>
        </div>

        <div className="space-y-5">
          {platforms.map((p) => (
            <div key={p.name} className="space-y-2">
              <div className="flex items-center gap-2">
                {p.icon}
                <span className="text-sm font-semibold text-white">{p.name}</span>
              </div>
              <ol className="space-y-1.5 ml-6">
                {p.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                    <span className="mt-0.5 w-4 h-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-slate-400 shrink-0">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              {p.tip && (
                <div className="ml-6 flex items-start gap-2 bg-white/5 rounded-lg p-2.5 border border-white/5">
                  <span className="mt-0.5 text-yellow-400 text-[10px] font-bold uppercase tracking-wider shrink-0">
                    Pro tip
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{p.tip}</p>
                  <button
                    onClick={() => copyTip(p.tip)}
                    className="ml-auto shrink-0 text-slate-500 hover:text-white transition-colors"
                    title="Copy tip"
                  >
                    {copiedTip === p.tip ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-[11px] text-slate-500 leading-relaxed">
            <ChevronRight className="w-3 h-3 inline -mt-0.5 mr-1 text-slate-600" />
            If you can only get the URL, paste it above and we will try to extract it automatically. If that fails, come back here and paste the text manually.
          </p>
        </div>
      </div>
    </div>
  );
};
