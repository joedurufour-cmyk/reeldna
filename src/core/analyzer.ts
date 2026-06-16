import { AnalysisResult } from '../types';

const CURIOSITY_WORDS = [
  'nobody tells', 'secret', 'hidden', 'truth', 'what they don\'t', 'what no one',
  'behind the', 'inside', 'reveal', 'exposed', 'the real reason', 'you won\'t believe',
  'here\'s why', 'this is why', 'the reason', 'most people', 'everyone is',
  'never told', 'they don\'t want', 'stop doing', 'stop scrolling', 'wait until',
  'before you', 'don\'t make this', 'i wish i knew', 'if i had known',
];

const CONTRARIAN_WORDS = [
  'myth', 'lie', 'wrong', 'don\'t', 'stop', 'avoid', 'never', 'waste',
  'you\'re doing it wrong', 'everything you know', 'unpopular opinion',
  'controversial', 'the problem with', 'the truth about', 'actually',
];

const PAIN_WORDS = [
  'wasted', 'struggling', 'pain', 'frustrated', 'stuck', 'overwhelmed',
  'burned out', 'exhausted', 'failing', 'losing', 'hate', 'can\'t stand',
  'worst', 'nightmare', 'disaster', 'regret', 'mistake', 'failed',
];

const TRANSFORMATION_WORDS = [
  'changed', 'transformed', 'before and after', 'went from', 'now i',
  'everything changed', 'turned around', 'shifted', 'finally', 'breakthrough',
  'overnight', 'in just', 'within', 'after years', 'used to', 'but now',
];

const AUTHORITY_WORDS = [
  'study', 'research', 'science', 'data', 'proven', 'evidence', 'experts',
  'psychologists', 'scientists', 'years of', 'i spent', 'after analyzing',
  'based on', 'here\'s what', 'the facts', 'statistics', 'survey',
];

const STORY_WORDS = [
  'i was', 'i remember', 'when i', 'my first', 'last year', 'two years ago',
  'in 202', 'the day i', 'i woke up', 'i realized', 'i decided', 'journey',
];

const LISTICLE_WORDS = [
  '3 ways', '5 things', '7 steps', 'top', 'list', 'number', 'reasons why',
  'ways to', 'things i', 'rules', 'habits', 'mistakes', 'secrets',
  'tricks', 'tips', 'hacks', 'frameworks', 'methods',
];

const WARNING_WORDS = [
  'warning', 'danger', 'toxic', 'red flag', 'be careful', 'watch out',
  'before it\'s too late', 'scary', 'terrifying', 'disturbing', 'serious',
  'urgent', 'important', 'pay attention', 'don\'t ignore',
];

const CTA_WORDS = [
  'follow', 'comment', 'save', 'share', 'dm', 'link', 'try', 'download',
  'subscribe', 'learn more', 'swipe up', 'check out', 'grab', 'get',
  'start', 'join', 'watch', 'read', 'click', 'tap', 'bookmark',
  'double tap', 'like this', 'send this', 'tag', 'share this',
];

const EMOTION_WORDS: Record<string, string[]> = {
  curiosity: ['nobody', 'secret', 'hidden', 'what if', 'imagine', 'ever wondered', 'here\'s why', 'the reason', 'discover', 'find out'],
  fear: ['wasted', 'lose', 'missing out', 'regret', 'mistake', 'wrong', 'toxic', 'danger', 'warning', 'never', 'don\'t', 'avoid', 'fomo', 'scared', 'afraid'],
  aspiration: ['dream', 'goal', 'success', 'millionaire', 'freedom', 'rich', 'wealth', 'abundance', 'achieve', 'become', 'level up', 'upgrade', 'better', 'best version'],
  frustration: ['wasted', 'tired of', 'sick of', 'fed up', 'annoying', 'hate', 'can\'t stand', 'overwhelmed', 'burned out', 'exhausted', 'struggling', 'stuck'],
  surprise: ['wait', 'what', 'actually', ' Turns out', 'plot twist', 'nobody expected', 'shocking', 'unbelievable', 'insane', 'crazy', 'wild', 'didn\'t see'],
  trust: ['proof', 'results', 'guarantee', 'tested', 'verified', 'honest', 'transparent', 'real', 'authentic', 'experience', 'i did', 'worked for me'],
  urgency: ['now', 'today', 'before', 'limited', 'last chance', 'don\'t wait', 'urgent', 'hurry', 'quick', 'fast', 'immediately', 'right now', 'expires'],
};

const STRUCTURE_MARKERS: Record<string, string[]> = {
  HOOK: ['nobody', 'secret', 'what they', 'stop', 'wait', 'this is', 'i wasted', 'i wish', 'if you', 'the truth', 'myth', 'lie', 'wrong'],
  PROBLEM: ['wasted', 'struggling', 'problem', 'pain', 'frustrated', 'stuck', 'difficult', 'hard', 'impossible', 'can\'t', 'never could', 'failed'],
  CONTEXT: ['two years', 'last year', 'when i', 'i was', 'in 202', 'before', 'used to', 'back then', 'at first', 'initially'],
  STORY: ['i remember', 'the day', 'one day', 'then one', 'suddenly', 'out of nowhere', 'unexpectedly', 'i woke up', 'i realized'],
  LESSON: ['what i learned', 'realized', 'understood', 'lesson', 'here\'s what', 'the key', 'turns out', 'actually', 'what really', 'essential', 'important', 'everything changed', 'once i', 'focused', 'the real', 'key is', 'secret is', 'what matters', 'the only', 'all you need', 'changed', 'shifted', 'turned'],
  PROOF: ['results', 'data', 'study', 'research', 'show', 'proved', 'increased', 'decreased', 'grew', 'numbers', 'percent', '%', 'screenshot', 'after'],
  CTA: ['follow', 'save', 'share', 'comment', 'try', 'download', 'link', 'dm', 'subscribe', 'learn more', 'check out'],
};

function countMatches(text: string, words: string[]): number {
  const lower = text.toLowerCase();
  return words.reduce((sum, w) => sum + (lower.includes(w.toLowerCase()) ? 1 : 0), 0);
}

function hasAny(text: string, words: string[]): boolean {
  return countMatches(text, words) > 0;
}

function detectHookType(hook: string, fullText: string): string {
  const text = (hook + ' ' + fullText).toLowerCase();
  if (hasAny(text, CURIOSITY_WORDS)) return 'curiosity_gap';
  if (hasAny(text, CONTRARIAN_WORDS)) return 'contrarian';
  if (hasAny(text, PAIN_WORDS)) return 'pain_point';
  if (hasAny(text, TRANSFORMATION_WORDS)) return 'transformation';
  if (hasAny(text, AUTHORITY_WORDS)) return 'authority';
  if (hasAny(text, STORY_WORDS)) return 'story';
  if (hasAny(text, LISTICLE_WORDS)) return 'listicle';
  if (hasAny(text, WARNING_WORDS)) return 'warning';
  return 'unknown';
}

function scoreHook(hook: string, fullText: string): number {
  let score = 5;
  const lower = hook.toLowerCase();
  const fullLower = fullText.toLowerCase();

  if (hasAny(lower, CURIOSITY_WORDS)) score += 2;
  if (hasAny(lower, CONTRARIAN_WORDS)) score += 2;
  if (hasAny(lower, PAIN_WORDS)) score += 1.5;
  if (hasAny(lower, TRANSFORMATION_WORDS)) score += 1.5;
  if (hasAny(lower, AUTHORITY_WORDS)) score += 1;
  if (hasAny(lower, STORY_WORDS)) score += 1;
  if (hasAny(lower, LISTICLE_WORDS)) score += 1;
  if (hasAny(lower, WARNING_WORDS)) score += 2;

  if (/\d/.test(hook)) score += 1;
  if (hook.length < 80) score += 1;
  if (hook.length > 160) score -= 1;
  if (lower.includes('?')) score += 0.5;
  if (lower.includes('!')) score += 0.5;

  if (lower.startsWith('hey') || lower.startsWith('so') || lower.startsWith('ok')) score -= 1.5;
  if (lower.includes('check out my') || lower.includes('link in bio')) score -= 1;

  if (hasAny(fullLower, [...CURIOSITY_WORDS, ...PAIN_WORDS, ...TRANSFORMATION_WORDS])) score += 0.5;

  return Math.min(10, Math.max(1, Math.round(score * 10) / 10));
}

function detectEmotions(text: string): string[] {
  const emotions: string[] = [];
  const lower = text.toLowerCase();
  for (const [emotion, words] of Object.entries(EMOTION_WORDS)) {
    if (words.some(w => lower.includes(w))) {
      emotions.push(emotion);
    }
  }
  return emotions.length ? emotions : ['curiosity'];
}

function detectDominantEmotion(emotions: string[], text: string): string {
  if (emotions.length === 0) return 'curiosity';
  // Weight by word count
  const lower = text.toLowerCase();
  let best = emotions[0];
  let bestScore = 0;
  for (const e of emotions) {
    const words = EMOTION_WORDS[e] || [];
    const score = countMatches(lower, words);
    if (score > bestScore) {
      bestScore = score;
      best = e;
    }
  }
  return best;
}

function detectNarrative(text: string): string[] {
  const segments: string[] = [];
  const lower = text.toLowerCase();
  for (const [segment, words] of Object.entries(STRUCTURE_MARKERS)) {
    if (words.some(w => lower.includes(w))) {
      segments.push(segment);
    }
  }
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const s of segments) {
    if (!seen.has(s)) {
      seen.add(s);
      ordered.push(s);
    }
  }
  return ordered.length ? ordered : ['HOOK', 'STORY'];
}

function detectCTA(text: string): string {
  const lower = text.toLowerCase();
  for (const word of CTA_WORDS) {
    if (lower.includes(word)) {
      const sentences = text.split(/[.!?\n]+/).map(s => s.trim()).filter(Boolean);
      const ctaSentence = sentences.find(s => s.toLowerCase().includes(word));
      if (ctaSentence) return ctaSentence;
    }
  }
  return 'No clear CTA detected';
}

function detectAttentionKillers(text: string, hook: string, cta: string, narrative: string[], emotions: string[]): string[] {
  const killers: string[] = [];
  if (hook.length > 160) killers.push('hook too long');
  if (cta === 'No clear CTA detected') killers.push('weak CTA');
  if (!narrative.includes('PROOF') && !narrative.includes('LESSON')) killers.push('no proof');
  if (!/\d|specific|exact|step|rule|framework|method/.test(text.toLowerCase()) && text.length > 200) {
    killers.push('vague promise');
  }
  if (emotions.length === 0) killers.push('no emotional trigger');
  if (emotions.length > 0 && !emotions.some(e => ['curiosity', 'fear', 'frustration', 'surprise'].includes(e))) {
    killers.push('weak emotional trigger');
  }
  const abstractWords = ['thing', 'stuff', 'something', 'everything', 'anything', 'good', 'bad', 'better', 'great', 'amazing'];
  const abstractCount = abstractWords.reduce((sum, w) => sum + (text.toLowerCase().split(w).length - 1), 0);
  if (abstractCount > 5 && !narrative.includes('PROOF')) killers.push('too much abstraction');
  return killers.length ? killers : ['none detected'];
}

function detectVisualPattern(text: string): string {
  const lower = text.toLowerCase();
  if (hasAny(lower, ['look', 'watch', 'see', 'before/after', 'screen', 'demo', 'show', 'visual', 'image', 'clip', 'footage', 'camera', 'point', 'zoom', 'reveal', 'unwrap', 'unbox'])) {
    return 'Demonstration / visual proof';
  }
  if (hasAny(lower, ['story', 'i learned', 'mistake', 'journey', 'remember', 'the day', 'when i', 'my life', 'experience'])) {
    return 'Talking-head story';
  }
  if (hasAny(lower, ['steps', 'framework', 'list', 'number', 'first', 'second', 'third', 'step', 'tip', 'hack', 'trick', 'rule', 'method', 'way to'])) {
    return 'Educational breakdown';
  }
  return 'Narrative-driven reel';
}

function calculateRetentionProbability(hookScore: number, hookType: string, cta: string, narrative: string[]): number {
  let score = 50;
  if (hookScore >= 7) score += 10;
  if (hookType === 'curiosity_gap') score += 10;
  if (hookType === 'pain_point') score += 10;
  if (cta !== 'No clear CTA detected') score += 10;
  if (narrative.includes('PROOF') || narrative.includes('STORY') || narrative.includes('LESSON')) score += 10;
  return Math.min(95, score);
}

function generateWhyItWorks(hookType: string, dominantEmotion: string, narrative: string[], cta: string, _hookScore: number, text: string): string[] {
  const bullets: string[] = [];
  const lower = text.toLowerCase();

  // Hook mechanism
  if (hookType === 'curiosity_gap') {
    bullets.push('The hook opens an information gap: the audience feels compelled to close it by watching.');
  } else if (hookType === 'pain_point') {
    bullets.push('The hook names a specific pain the audience already feels, creating instant relatability.');
  } else if (hookType === 'contrarian') {
    bullets.push('The hook contradicts a common belief, triggering cognitive dissonance that demands resolution.');
  } else if (hookType === 'transformation') {
    bullets.push('The hook promises a clear before/after, making the viewer want to know the path between them.');
  } else if (hookType === 'authority') {
    bullets.push('The hook borrows credibility through data, credentials, or experience, lowering skepticism.');
  } else if (hookType === 'story') {
    bullets.push('The hook drops into a narrative moment, activating the brain\'s natural story-seeking mechanism.');
  } else if (hookType === 'listicle') {
    bullets.push('The hook promises a bounded, scannable list of value, reducing perceived effort to watch.');
  } else if (hookType === 'warning') {
    bullets.push('The hook triggers loss aversion by framing inaction as dangerous or costly.');
  } else {
    bullets.push('The hook makes a direct promise or asks a question that creates immediate curiosity.');
  }

  // Emotional trigger
  const emotionMap: Record<string, string> = {
    curiosity: 'Curiosity drives the loop: each segment teases the answer without fully delivering it.',
    fear: 'Fear narrows attention. The viewer watches to avoid the negative outcome described.',
    aspiration: 'Aspiration paints a desirable future state, making the viewer want the same outcome.',
    frustration: 'Frustration validates the viewer\'s own struggle, building trust before offering the fix.',
    surprise: 'Surprise breaks prediction patterns, forcing the brain to pay attention to resolve the unexpected.',
    trust: 'Trust signals safety and credibility, reducing the mental cost of accepting the content\'s claim.',
    urgency: 'Urgency compresses the decision timeline, pushing the viewer to act before the window closes.',
  };
  bullets.push(emotionMap[dominantEmotion] || `The dominant emotion (${dominantEmotion}) creates a specific psychological pull toward the content.`);

  // Structure
  if (narrative.includes('PROBLEM') && narrative.includes('LESSON')) {
    bullets.push('The narrative follows a problem-lesson arc: agitate the pain, then deliver the insight. This is a proven retention pattern.');
  } else if (narrative.includes('STORY') && narrative.includes('LESSON')) {
    bullets.push('Story-first structure wraps the lesson in narrative, making it more memorable than pure instruction.');
  } else if (narrative.includes('PROOF') && narrative.includes('CTA')) {
    bullets.push('Proof before CTA is a high-conversion structure: evidence first, then the ask.');
  } else if (narrative.length >= 3) {
    bullets.push('The multi-segment structure creates natural micro-cliffhangers between each section, keeping the viewer engaged.');
  } else {
    bullets.push('The narrative structure is simple but effective; adding a proof or lesson segment would likely improve retention.');
  }

  // CTA
  if (cta !== 'No clear CTA detected') {
    const ctaLower = cta.toLowerCase();
    if (hasAny(ctaLower, ['save', 'bookmark', 'follow'])) {
      bullets.push('The CTA is low-friction (save/follow), making it easy to act without commitment. This increases conversion.');
    } else if (hasAny(ctaLower, ['comment', 'share', 'tag'])) {
      bullets.push('The CTA asks for engagement, which signals the algorithm to boost reach. Smart distribution play.');
    } else if (hasAny(ctaLower, ['link', 'download', 'try', 'buy'])) {
      bullets.push('The CTA is high-intent (link/download). It works best when paired with strong proof in the body.');
    } else {
      bullets.push('The CTA is clear and present. Even a weak CTA is better than none at all.');
    }
  } else {
    bullets.push('No CTA was detected. Without a clear next step, the viewer scrolls away with no action taken.');
  }

  // Clarity / proof
  if (hasAny(lower, ['step', 'first', 'then', 'next', 'finally', 'number', 'percent', 'data', 'result'])) {
    bullets.push('Concrete specifics (steps, numbers, results) increase perceived value and make the content feel actionable.');
  } else {
    bullets.push('Adding concrete specifics (numbers, steps, timeframes) would increase perceived value and shareability.');
  }

  return bullets;
}

function calculateViralDNA(text: string, hookScore: number, emotions: string[], narrative: string[], hookType: string): AnalysisResult['viralDNA'] {
  const lower = text.toLowerCase();

  const curiosity = Math.min(10, Math.round(
    (hasAny(lower, CURIOSITY_WORDS) ? 7 : 3) +
    (hookType === 'curiosity_gap' ? 2 : 0) +
    (lower.includes('?') ? 1 : 0)
  ));

  const authority = Math.min(10, Math.round(
    (hasAny(lower, AUTHORITY_WORDS) ? 7 : 2) +
    (narrative.includes('PROOF') ? 2 : 0) +
    (/\d/.test(text) ? 1 : 0)
  ));

  const novelty = Math.min(10, Math.round(
    (hasAny(lower, CONTRARIAN_WORDS) ? 6 : 2) +
    (hasAny(lower, TRANSFORMATION_WORDS) ? 2 : 0) +
    (hookType === 'contrarian' ? 2 : 0)
  ));

  const urgency = Math.min(10, Math.round(
    (hasAny(lower, WARNING_WORDS) ? 6 : 2) +
    (emotions.includes('urgency') ? 2 : 0) +
    (hasAny(lower, ['now', 'today', 'before', 'don\'t wait']) ? 2 : 0)
  ));

  const proof = Math.min(10, Math.round(
    (narrative.includes('PROOF') ? 6 : 1) +
    (hasAny(lower, ['result', 'data', 'study', 'proof', 'show', 'increase', 'decrease', '%', 'percent']) ? 3 : 0) +
    (hasAny(lower, AUTHORITY_WORDS) ? 1 : 0)
  ));

  const clarity = Math.min(10, Math.round(
    (text.length < 300 ? 5 : 3) +
    (narrative.length >= 3 ? 2 : 0) +
    (hookScore >= 7 ? 2 : 0) +
    (hasAny(lower, ['step', 'first', 'then', 'next', 'finally']) ? 1 : 0)
  ));

  return { curiosity, authority, novelty, urgency, proof, clarity };
}

function generateStealFramework(hookType: string, narrative: string[], emotions: string[]): string {
  const segments: string[] = [];

  if (hookType === 'curiosity_gap') {
    segments.push('HOOK: Open with something the audience thinks they know — then hint there\'s a hidden layer. ("Nobody talks about...")');
  } else if (hookType === 'pain_point') {
    segments.push('HOOK: Name a specific pain in the first 3 seconds. Make it visceral. ("I wasted 2 years...")');
  } else if (hookType === 'transformation') {
    segments.push('HOOK: Show the before-state immediately. Make it relatable and painful. ("I used to...")');
  } else if (hookType === 'contrarian') {
    segments.push('HOOK: Challenge a common belief directly. Create instant disagreement. ("The myth of...")');
  } else if (hookType === 'authority') {
    segments.push('HOOK: Cite a specific credential, study, or experience. ("After analyzing 1,000...")');
  } else if (hookType === 'story') {
    segments.push('HOOK: Drop into a moment in time. ("The day I realized...")');
  } else if (hookType === 'listicle') {
    segments.push('HOOK: Promise a numbered list of concrete takeaways. ("3 things I wish I knew...")');
  } else if (hookType === 'warning') {
    segments.push('HOOK: Sound an alarm. ("If you\'re doing X, stop now.")');
  } else {
    segments.push('HOOK: Lead with curiosity, pain, or a bold claim in the first sentence.');
  }

  if (narrative.includes('PROBLEM')) {
    segments.push('PROBLEM: Agitate the pain. Use sensory details. Show, don\'t tell.');
  }
  if (narrative.includes('CONTEXT')) {
    segments.push('CONTEXT: Establish credibility through a specific time frame or credential.');
  }
  if (narrative.includes('STORY')) {
    segments.push('STORY: Narrate a micro-story with a turning point. Keep it under 30 seconds of reading.');
  }
  if (narrative.includes('LESSON')) {
    segments.push('LESSON: Extract the insight. One clear sentence. No fluff.');
  }
  if (narrative.includes('PROOF')) {
    segments.push('PROOF: Show data, results, or a screenshot moment. Make it undeniable.');
  } else {
    segments.push('PROOF: Add at least one concrete result, number, or visual evidence. (Missing in original)');
  }

  const emotionTips: Record<string, string> = {
    curiosity: 'Curiosity: Use an open loop — promise the answer but delay it.',
    fear: 'Fear: Make the cost of inaction visible and specific.',
    aspiration: 'Aspiration: Paint the after-state in vivid detail.',
    frustration: 'Frustration: Validate the audience\'s pain before offering the fix.',
    surprise: 'Surprise: Break expectation mid-way. The twist is the reward.',
    trust: 'Trust: Show vulnerability or proof. Transparency beats perfection.',
    urgency: 'Urgency: Use time-bound language or scarcity.',
  };
  for (const e of emotions.slice(0, 2)) {
    if (emotionTips[e]) segments.push(emotionTips[e]);
  }

  segments.push('CTA: One action. Low friction. Tie it to the content\'s payoff. ("Save this if you\'re building.")');

  return segments.join('\n\n');
}

function generateSummary(result: AnalysisResult): string {
  const parts: string[] = [];
  parts.push(`This content uses a ${result.hookType.replace('_', ' ')} hook scored ${result.hookScore}/10.`);
  parts.push(`Dominant emotion: ${result.dominantEmotion}.`);
  parts.push(`Narrative: ${result.narrative.join(' → ')}.`);
  if (result.attentionKillers[0] !== 'none detected') {
    parts.push(`Attention killers: ${result.attentionKillers.join(', ')}.`);
  } else {
    parts.push('No major attention killers detected.');
  }
  const avgDNA = Math.round((result.viralDNA.curiosity + result.viralDNA.authority + result.viralDNA.novelty + result.viralDNA.urgency + result.viralDNA.proof + result.viralDNA.clarity) / 6 * 10) / 10;
  parts.push(`Overall viral DNA: ${avgDNA}/10.`);
  return parts.join(' ');
}

export function analyze(text: string): AnalysisResult {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      hook: '',
      hookScore: 0,
      hookType: 'unknown',
      narrative: [],
      cta: 'No clear CTA detected',
      dominantEmotion: 'unknown',
      visualPattern: 'unknown',
      retentionProbability: 0,
      whyItWorks: ['Paste a transcript or caption to analyze.'],
      attentionKillers: ['empty input'],
      viralDNA: { curiosity: 0, authority: 0, novelty: 0, urgency: 0, proof: 0, clarity: 0 },
      stealFramework: '',
      summary: 'No text provided.',
    };
  }

  const firstSentence = trimmed.split(/[.!?\n]+/)[0].trim();
  const hook = firstSentence.length > 160 ? trimmed.slice(0, 160) + '...' : firstSentence;

  const hookType = detectHookType(hook, trimmed);
  const hookScore = scoreHook(hook, trimmed);
  const emotions = detectEmotions(trimmed);
  const dominantEmotion = detectDominantEmotion(emotions, trimmed);
  const narrative = detectNarrative(trimmed);
  const cta = detectCTA(trimmed);
  const attentionKillers = detectAttentionKillers(trimmed, hook, cta, narrative, emotions);
  const visualPattern = detectVisualPattern(trimmed);
  const retentionProbability = calculateRetentionProbability(hookScore, hookType, cta, narrative);
  const whyItWorks = generateWhyItWorks(hookType, dominantEmotion, narrative, cta, hookScore, trimmed);
  const viralDNA = calculateViralDNA(trimmed, hookScore, emotions, narrative, hookType);
  const stealFramework = generateStealFramework(hookType, narrative, emotions);
  const summary = generateSummary({ hook, hookScore, hookType, narrative, cta, dominantEmotion, visualPattern, retentionProbability, whyItWorks, attentionKillers, viralDNA, stealFramework, summary: '' });

  return { hook, hookScore, hookType, narrative, cta, dominantEmotion, visualPattern, retentionProbability, whyItWorks, attentionKillers, viralDNA, stealFramework, summary };
}
