import React from 'react';
import { Instagram, Music, Youtube, Copy, CheckCircle, ChevronDown, Type, MousePointerClick } from 'lucide-react';

const platforms = [
  {
    name: 'Instagram',
    icon: <Instagram className="w-5 h-5 text-pink-400" />,
    steps: [
      'The text you need is already on the page — look below the video, left side.',
      'If you see "... more" — click it to expand the full caption.',
      'Select all the text with your mouse, press Ctrl+C (or Cmd+C).',
      'Come back to ReelDNA and paste it in the text box below.',
    ],
    tip: 'The 3-dots menu (⋯) only gives you the URL (Copy Link). That does NOT help. You need the actual text below the video.',
  },
  {
    name: 'TikTok',
    icon: <Music className="w-5 h-5 text-white" />,
    steps: [
      'The caption is below the video on the right side (desktop) or below the video (mobile).',
      'Click the caption to expand if it says "..."',
      'Select all, copy, and paste here.',
    ],
    tip: 'On desktop, the caption is visible on the right side of the video. You can select and copy it directly.',
  },
  {
    name: 'YouTube Shorts',
    icon: <Youtube className="w-5 h-5 text-red-500" />,
    steps: [
      'Open the Short on YouTube.',
      'Look below the video for the description or tap "Show transcript".',
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
            Where to find the text
          </h3>
        </div>

        <div className="mb-4 p-3 rounded-lg bg-emerald-400/10 border border-emerald-400/20 flex items-start gap-2.5">
          <MousePointerClick className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-200/80 leading-relaxed">
            <strong>You do not need any menu.</strong> The caption text is already visible on the page, below the video. Just select it with your mouse and copy it.
          </p>
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

        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ChevronDown className="w-3 h-3 text-cyan-glow animate-bounce" />
          Scroll down to paste the text
          <ChevronDown className="w-3 h-3 text-cyan-glow animate-bounce" />
        </div>
      </div>
    </div>
  );
};